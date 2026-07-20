# Data Encryption Specification

Rezk Fit Hub enforces end-to-end data encryption.

## Algorithms

### 1. Symmetric Encryption (AES-256-GCM)
Used to encrypt databases, local state records, and IndexedDB stores.

### 2. Asymmetric Encryption (RSA-OAEP-2048)
Used to encrypt secrets before pushing to the cloud or sharing payloads.

## Key Rotation
Keys are regularly rotated and deprecated keys are stored in archive records to support decryption of legacy files.
