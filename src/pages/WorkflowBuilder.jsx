import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Save, Play, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import WorkflowCanvas from '@/components/workflow/WorkflowCanvas';
import WorkflowSidebar from '@/components/workflow/WorkflowSidebar';
import WorkflowInspector from '@/components/workflow/WorkflowInspector';
import WorkflowToolbar from '@/components/workflow/WorkflowToolbar';
import { WorkflowService } from '@/services/workflow.service';
import { ExecutionEngineService } from '@/services/execution-engine.service';

export const WorkflowBuilder = () => {
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [triggerType, setTriggerType] = useState('ClientCreated');

    const fetchWorkflows = async () => {
        try {
            const list = await WorkflowService.getWorkflows();
            setWorkflows(list);
            if (list.length > 0 && !selectedWorkflow) {
                handleSelectWorkflow(list[0]);
            }
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const handleSelectWorkflow = (wf) => {
        setSelectedWorkflow(wf);
        setNodes(wf.nodes || []);
        setEdges(wf.edges || []);
        setName(wf.name);
        setDesc(wf.description || '');
        setTriggerType(wf.triggerType);
        setSelectedNode(null);
    };

    const handleCreateWorkflow = async (e) => {
        e.preventDefault();
        try {
            const wf = await WorkflowService.createWorkflow(name || 'تدفق جديد', desc, triggerType, [], []);
            toastService.success('تم إنشاء مخطط التدفق الجديد بنجاح');
            fetchWorkflows();
            handleSelectWorkflow(wf);
        } catch {
            toastService.error('فشل إنشاء المخطط');
        }
    };

    const handleAddNode = (type, label) => {
        const id = `node_${Date.now()}`;
        const newNode = {
            id,
            type,
            label,
            position: { x: nodes.length * 40 + 50, y: nodes.length * 40 + 50 },
            parameters: {}
        };
        const updatedNodes = [...nodes, newNode];
        setNodes(updatedNodes);

        // Auto link edge to last node if exists
        if (nodes.length > 0) {
            const prevNode = nodes[nodes.length - 1];
            const newEdge = { source: prevNode.id, target: id };
            setEdges([...edges, newEdge]);
        }
    };

    const handleRemoveNode = (nodeId) => {
        setNodes(nodes.filter(n => n.id !== nodeId));
        setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
        if (selectedNode?.id === nodeId) {
            setSelectedNode(null);
        }
    };

    const handleChangeParams = (nodeId, params) => {
        setNodes(nodes.map(n => n.id === nodeId ? { ...n, ...params, parameters: { ...n.parameters, ...params } } : n));
        if (selectedNode?.id === nodeId) {
            setSelectedNode(prev => ({ ...prev, ...params, parameters: { ...prev.parameters, ...params } }));
        }
    };

    const handleSave = async () => {
        if (!selectedWorkflow) return;
        try {
            selectedWorkflow.nodes = nodes;
            selectedWorkflow.edges = edges;
            selectedWorkflow.name = name;
            selectedWorkflow.description = desc;
            selectedWorkflow.triggerType = triggerType;
            selectedWorkflow.status = 'Active'; // Publish

            await WorkflowService.deleteWorkflow(selectedWorkflow.id);
            await WorkflowService.createWorkflow(name, desc, triggerType, nodes, edges);

            toastService.success('تم حفظ ونشر تعديلات التدفق المرئي بنجاح');
            fetchWorkflows();
        } catch {
            toastService.error('فشل حفظ التعديلات');
        }
    };

    const handleTrigger = async () => {
        if (!selectedWorkflow) return;
        try {
            await ExecutionEngineService.triggerAndRun(selectedWorkflow.id);
            toastService.success('تم إطلاق وتجربة تشغيل التدفق بنجاح');
        } catch {
            toastService.error('فشل إطلاق التدفق');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="محرر مسارات العمل المرئي" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        محرر مسارات العمل والأتمتة المرئي (Workflow Builder)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        قم بتصميم تدفقات الأعمال بشكل مرئي وتوصيل المشغلات البرمجية بالإجراءات التلقائية وطلبات الاعتماد البشري.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-xs text-right">
                {/* Right selector list */}
                <div className="space-y-6">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">إنشاء مسار عمل جديد</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateWorkflow} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="font-semibold block">اسم التدفق:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="مثال: أتمتة ترحيب العملاء"
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold block">الوصف:</label>
                                    <textarea
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="شرح موجز لعمل التدفق"
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded h-20"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold block">نوع مشغل البداية (Trigger):</label>
                                    <select
                                        value={triggerType}
                                        onChange={(e) => setTriggerType(e.target.value)}
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    >
                                        <option value="ClientCreated">Client Created (تسجيل عميل)</option>
                                        <option value="WorkoutAssigned">Workout Assigned (تعيين تمرين)</option>
                                        <option value="InvoiceGenerated">Invoice Generated (فاتورة جديدة)</option>
                                        <option value="CronSchedule">Cron Schedule (جدولة زمنية)</option>
                                    </select>
                                </div>

                                <Button type="submit" className="w-full gap-1">
                                    <Plus className="h-4 w-4" />
                                    بدء التخطيط
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">المخططات المحفوظة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {workflows.map(wf => (
                                <div
                                    key={wf.id}
                                    onClick={() => handleSelectWorkflow(wf)}
                                    className={`p-2.5 border rounded-lg cursor-pointer text-right transition-colors ${selectedWorkflow?.id === wf.id ? 'border-primary bg-primary/5 font-bold' : 'border-border hover:bg-muted/10'}`}
                                >
                                    {wf.name}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Canvas & Editor Area */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedWorkflow ? (
                        <>
                            <WorkflowToolbar
                                onSave={handleSave}
                                onClear={() => {
                                    setNodes([]);
                                    setEdges([]);
                                }}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-3 space-y-4">
                                    <WorkflowCanvas
                                        nodes={nodes}
                                        edges={edges}
                                        onNodeSelect={setSelectedNode}
                                        onRemoveNode={handleRemoveNode}
                                    />
                                    <Button onClick={handleTrigger} variant="outline" className="w-full gap-2">
                                        <Play className="h-4 w-4 text-emerald-500" />
                                        اختبار تشغيل المخطط الآن (Trigger Simulation)
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    <WorkflowSidebar onAddNode={handleAddNode} />
                                    <WorkflowInspector node={selectedNode} onChangeParams={handleChangeParams} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-32 text-muted-foreground border border-dashed rounded-xl">
                            اختر مخططاً أو ابدأ بإنشاء تدفق جديد للبدء بالرسم المرئي.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;
