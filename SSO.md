# Single Sign-On (SSO) Integration Specification

Rezk Fit Hub supports SAML 2.0 and OpenID Connect (OIDC) identity protocols.

## Supported Providers
- **Microsoft Entra ID (Azure AD)**
- **Okta Identity**
- **Google Workspace**
- **Auth0**

## Setup Parameters

To register a provider, configure:
1. **SSO Entry Point**: Login redirection portal URL.
2. **Issuer URL**: Unique entity descriptor.
3. **Certificate**: Public certificate to sign assertions (SAML).
