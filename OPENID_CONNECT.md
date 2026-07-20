# OpenID Connect (OIDC) Identity Specification

Rezk Fit Hub exposes federated login attributes conforming to the OpenID Connect core profile standard.

## Scope Mappings
- **`openid`**: Requests federated user identifiers.
- **`profile`**: Accesses name, picture, locale, and avatar parameters.
- **`email`**: Returns user email address and verification attributes.

## Token Claims
The ID Token returned during the code flow contains:
```json
{
  "iss": "https://auth.rezkfit.com",
  "sub": "user_2847294",
  "aud": "client_your_app_id",
  "exp": 1793740200,
  "name": "الكوتش أحمد",
  "email": "coach@rezkfit.com"
}
```
