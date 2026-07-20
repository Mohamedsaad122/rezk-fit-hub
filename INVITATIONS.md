# Invitation Lifecycle

This guide documents the Invitation state machine, email target invitations, and registration workflows.

## State Machine
* **Pending**: The invitation has been sent via email, generating a token.
* **Accepted**: The target user accepts the invitation. Accepting the invitation creates a new active member record under the target organization.
* **Declined**: The target user rejects the invitation.
* **Expired**: The invitation expires without response.

## Service Coordination
* `InvitationService.sendInvitation(email, organizationId, role)`: Registers new invitations.
* `InvitationService.acceptInvitation(inviteId)`: Marks status as `Accepted` and spawns a member in the database.
* `InvitationService.declineInvitation(inviteId)`: Marks status as `Declined`.
