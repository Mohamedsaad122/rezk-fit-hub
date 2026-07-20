import { WorkflowRepository } from '@/repositories/workflow.repository';
import { RuleEngineService } from './rule-engine.service';
import { ApprovalService } from './approval.service';

export const WorkflowEngineService = {
    executeRun: async (runId) => {
        const runs = await WorkflowRepository.getWorkflowRuns();
        const run = runs.find(r => String(r.id) === String(runId));
        if (!run) {
            throw new Error(`Workflow run ${runId} not found`);
        }

        const workflows = await WorkflowRepository.getWorkflows();
        const workflow = workflows.find(w => String(w.id) === String(run.workflowId));
        if (!workflow) {
            await WorkflowRepository.updateWorkflowRunStatus(runId, 'Failed', 'Associated workflow not found');
            throw new Error('Workflow not found');
        }

        const nodes = workflow.nodes || [];
        const edges = workflow.edges || [];
        const executed = [];

        const runNode = async (nodeId, context = {}) => {
            if (executed.includes(nodeId)) return;
            executed.push(nodeId);

            const node = nodes.find(n => n.id === nodeId);
            if (!node) return;

            const executeWithRetryAndTimeout = async (fn, node) => {
                const maxRetries = node.parameters?.retryCount ?? 0;
                const timeoutMs = (node.parameters?.timeoutSeconds ?? 30) * 1000;
                
                let attempt = 0;
                while (true) {
                    try {
                        const promise = fn();
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Timeout exceeded')), timeoutMs)
                        );
                        return await Promise.race([promise, timeoutPromise]);
                    } catch (error) {
                        attempt++;
                        if (attempt > maxRetries) {
                            if (node.parameters?.rollbackNodeId) {
                                const rollbackNode = nodes.find(n => n.id === node.parameters.rollbackNodeId);
                                if (rollbackNode) {
                                    executed.push(rollbackNode.id);
                                }
                            }
                            throw error;
                        }
                    }
                }
            };

            const runNodeLogic = async () => {
                if (node.type === 'Delay') {
                    const delayMs = (node.parameters?.seconds || 1) * 10;
                    await new Promise(r => setTimeout(r, delayMs));
                } else if (node.type === 'Condition') {
                    if (node.parameters?.conditions) {
                        return RuleEngineService.evaluateRule({ conditions: node.parameters.conditions, status: 'Active' }, context);
                    }
                    const pass = node.parameters?.value !== false;
                    return pass;
                } else if (node.type === 'Loop') {
                    const loopCount = node.parameters?.loopCount || 1;
                    const loopTargetId = node.parameters?.loopTargetId;
                    if (loopTargetId) {
                        for (let i = 0; i < loopCount; i++) {
                            await runNode(loopTargetId, context);
                        }
                    }
                } else if (node.type === 'Approval') {
                    const autoApprove = node.parameters?.autoApprove === true;
                    if (!autoApprove) {
                        const req = await ApprovalService.createApprovalRequest(
                            `Approval required for workflow: ${workflow.name}`,
                            `Workflow Run ID: ${runId}`,
                            node.parameters?.approvers || ['admin@rezkfit.com'],
                            node.parameters?.maxLevels || 1
                        );
                        throw new Error(`Approval pending: request ID ${req.id}`);
                    }
                } else if (node.type === 'Action') {
                    if (node.parameters?.fail === true) {
                        throw new Error('Simulated action failure');
                    }
                    if (node.parameters?.seconds) {
                        const delayMs = node.parameters.seconds * 10;
                        await new Promise(r => setTimeout(r, delayMs));
                    }
                }
                return true;
            };

            const nodeResult = await executeWithRetryAndTimeout(runNodeLogic, node);

            const outgoingEdges = edges.filter(e => e.source === nodeId);
            if (outgoingEdges.length === 0) return;

            if (node.type === 'Condition') {
                const targetEdge = outgoingEdges.find(e => {
                    const condValue = String(e.condition ?? 'true') === 'true';
                    return condValue === nodeResult;
                });
                if (targetEdge) {
                    await runNode(targetEdge.target, context);
                }
            } else {
                const targetPromises = outgoingEdges.map(edge => runNode(edge.target, context));
                await Promise.all(targetPromises);
            }
        };

        try {
            if (edges.length === 0) {
                for (const node of nodes) {
                    executed.push(node.id);
                    if (node.type === 'Delay') {
                        const delayMs = (node.parameters?.seconds || 1) * 10;
                        await new Promise(r => setTimeout(r, delayMs));
                    } else if (node.type === 'Condition') {
                        const pass = node.parameters?.value !== false;
                        if (!pass) {
                            break;
                        }
                    } else if (node.type === 'Loop') {
                        const loopCount = node.parameters?.loopCount || 1;
                        const loopTargetId = node.parameters?.loopTargetId;
                        if (loopTargetId) {
                            for (let i = 0; i < loopCount; i++) {
                                await runNode(loopTargetId, run.context || {});
                            }
                        }
                    } else if (node.type === 'Approval') {
                        const autoApprove = node.parameters?.autoApprove === true;
                        if (!autoApprove) {
                            const req = await ApprovalService.createApprovalRequest(
                                `Approval required for workflow: ${workflow.name}`,
                                `Workflow Run ID: ${runId}`,
                                node.parameters?.approvers || ['admin@rezkfit.com'],
                                node.parameters?.maxLevels || 1
                            );
                            throw new Error(`Approval pending: request ID ${req.id}`);
                        }
                    }
                }
            } else {
                const triggerNode = nodes.find(n => n.type === 'Trigger') || nodes[0];
                if (triggerNode) {
                    await runNode(triggerNode.id, run.context || {});
                }
            }

            run.executedNodes = executed;
            await WorkflowRepository.updateWorkflowRunStatus(runId, 'Completed');
            return { status: 'Completed', executedNodes: executed };
        } catch (err) {
            await WorkflowRepository.updateWorkflowRunStatus(runId, 'Failed', err.message);
            return { status: 'Failed', error: err.message, executedNodes: executed };
        }
    }
};

export default WorkflowEngineService;
