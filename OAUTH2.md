# OAuth 2.0 Integration & Authorization Specification

Rezk Fit Hub supports the industry standard OAuth 2.0 protocols for developer and user delegations.

## Flows Supported

### 1. Authorization Code Flow with PKCE
Used for secure desktop, mobile, and Single Page Applications (SPAs) without leaking client secrets.

**Endpoints:**
- **Authorize**: `/api/saas/oauth/authorize`
- **Token Exchange**: `/api/saas/oauth/token`

**PKCE challenge method:**
- `S256` (Recommended): Hash verifier using SHA-256 base64url encoding.
- `plain`: Direct character comparison.

### 2. Client Credentials Flow
Used for Server-to-Server backend integration.

## Introspection & Revocation
- **Introspection**: Validate status and token metadata details.
- **Revocation**: Mark tokens as expired immediately.
