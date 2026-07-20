# Organization Management

This guide documents the Organization structure, data isolation layer, and UI workflow.

## Structure & Architecture
* **Tenant Isolation**: Each organization belongs to a specific tenant through the `tenantId` field. All CRUD queries filter records strictly by the active session's `tenantId`.
* **Switching Context**: Users can switch active organizations. Selecting an organization sets `activeOrganizationId` in `useOrganizationStore`, which dynamically updates downstream listings for teams, members, and invitations.
* **Branding & Settings**: Each organization configures independent timezone options, currency structures, and primary styling color hooks.

## Key APIs & Repositories
* `OrganizationRepository`:
  - `getAll()`: Returns all organizations belonging to the active tenant.
  - `getById(id)`: Returns specific organization details.
  - `create(data)`: Registers a new organization.
  - `update(id, data)`: Modifies settings or branding.
