# Organization Roles & Permission Matrix

This guide documents the permissions engine, role resolutions, team assignments, and overrides.

## Organization Roles
* **Owner**: Full access across all settings and operations. Can transfer organization ownership.
* **Administrator**: Full administrative access except ownership transfer.
* **Coach**: Training-centric permissions.
* **Nutritionist**: Diet plan and medical tracking permissions.
* **Reception**: Client scheduling and onboarding permissions.
* **Trainer**: Client guidance permissions.
* **Viewer**: Read-only access to documents and schedules.
* **Custom Role**: Configured individually.

## Permissions Resolution Engine
A member's active privileges are resolved through hierarchical aggregation:
1. **Organization-Level Role Permissions**: Base privileges associated with the member's organization role.
2. **Team-Level Permissions (Inheritance)**: Privileges inherited from all teams the member belongs to.
3. **Custom Overrides**: Granular permission overrides mapped directly to the member's profile.
