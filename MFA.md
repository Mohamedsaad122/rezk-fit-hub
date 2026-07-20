# Multi-Factor Authentication (MFA) Integration Guide

Rezk Fit Hub supports TOTP (Time-based One-Time Passwords) for accounts.

## MFA Lifecycle

```mermaid
sequenceDiagram
    participant User as User
    participant App as Web App
    participant Service as MFA Service
    User->>App: Request MFA setup
    Service->>App: Generate secret & QR code URL
    App->>User: Display QR Code
    User->>App: Enter OTP code (123456)
    App->>Service: Verify OTP
    Service->>App: Enable MFA and return recovery codes
```

## Emergency Recovery Flow
If users lose authenticator device access, they can authenticate using one of their 8 recovery codes.
Once a recovery code is used, it is revoked.
