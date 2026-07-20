# Visual Workflow Engine Specification

Rezk Fit Hub provides a Visual Workflow Builder powered by Zod-validated node configurations.

## Architecture

```mermaid
graph TD
    Trigger[Trigger Event] -->|Init Run| Runner[Execution Engine]
    Runner -->|Load Nodes| Canvas[Workflow Canvas Layout]
    Canvas -->|Sequence edges| Step1[Execute Delay]
    Step1 -->|Branching Check| Step2[Evaluate Condition]
    Step2 -->|Task run| Step3[Trigger REST API Action]
```

## Features
1. **Drag-and-Drop Editor**: Visual arrangement of Triggers, Actions, Conditions, and Approvals.
2. **Sequential/Parallel Execution**: Processing workflows with complex edge pathways.
3. **Recovery**: Action rollbacks on node run failures.
