# Team Management

This guide documents the Team layout, membership management, and scoping rules.

## Scoping & Organization Link
* Teams are scoped directly under a specific organization using the `organizationId` field.
* Changing the active organization switches the list of teams returned by the API.

## Team Membership
* A team contains a list of assigned member IDs (`memberIds`).
* Adding a member updates both the team's `memberIds` array and the member's `teamIds` list in a bidirectional transaction coordinated by `TeamService.addMemberToTeam`.
* Removing a member updates both entities via `TeamService.removeMemberFromTeam`.
