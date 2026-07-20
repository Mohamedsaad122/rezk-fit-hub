# Secrets Vault Management Specification

Rezk Fit Hub provides a secure Key Vault implementation to encrypt, rotate, and manage environment configurations.

## Vault Features

- **Profile Isolation**: Environment variables are partitioned by Profile (Development, Staging, Production).
- **Automated Rotation**: Rotations update the current active value and push the previous state into the version history trace.
- **Role-Based Isolation**: Access requires authorization keys and vault visibility permissions.

## Key Rotation Flow

```mermaid
sequenceDiagram
    participant Admin as Security Admin
    participant Vault as Secrets Vault Service
    Admin->{rotateSecret}(id, newValue)
    Vault->>Vault: Backup current value to version history
    Vault->>Vault: Update version index (v + 1)
    Vault->>Vault: Save new value and update lastRotatedAt
    Vault->>Admin: Return updated secret record
```
