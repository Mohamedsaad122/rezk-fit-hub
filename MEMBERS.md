# Member Management

This guide documents members' roles, status suspensions, and ownership operations.

## Roster Controls
* **Status**: A member is either `Active` or `Suspended`.
* **Suspension**: Coordinated by `MemberService.suspendMember`. Suspended members cannot perform actions or log in.
* **Reactivation**: Coordinated by `MemberService.reactivateMember`.

## Role Updates & Ownership Transfers
* Administrators can edit roles for any member except the Owner.
* **Owner Transfers**: Only the current Owner can transfer ownership. Transferring ownership swaps the roles of the current Owner (demoted to Administrator) and the target Member (promoted to Owner).
