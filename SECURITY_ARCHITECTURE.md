# Rezk Fit Hub Security Architecture

Rezk Fit Hub enforces strict security boundaries at every layer.

## Architecture Blueprint

```mermaid
graph TD
    User([Enterprise User]) -->|HTTP Secure / TLS 1.3| Gateway[API Gateway Service]
    Gateway -->|IP & Country Filter| PolicyEngine[Policy Service]
    Gateway -->|TOTP & SSO Check| IdentityManager[SSO / MFA Service]
    Gateway -->|Risk score validation| RiskEngine[Risk Engine Service]
    Gateway -->|JWT Decrypt & AES verification| Encryption[Encryption Service]
```

## Security Controls
1. **API Protection**: Gateways, rate limits, and scopes.
2. **Access Control**: Role-based access validation (RBAC) and IP allowlists.
3. **Data Security**: Secrets management, AES-256 local and DB encryption.
4. **Threat Detection**: Impossible travel alerts, IP velocity checking.
