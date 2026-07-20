# Workflow Execution Engine

Ties together visual design builders, execution history queues, and logs.

## Pipeline Lifecycle

- **Run Trigger**: Initiates run metadata context.
- **Node Traverser**: Loops through node parameters, processes inline functions, and handles condition branches.
- **State Audits**: Logs workflow completion states or failure error flags.
