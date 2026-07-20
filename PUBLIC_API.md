# Enterprise Public REST API Specification

Rezk Fit Hub provides a robust REST Gateway exposing core SaaS collections for customer integrations.

## Base URL
- **Production Gateway**: `https://api.rezkfit.com/api/v1`
- **Sandbox/Mock Gateway**: `https://sandbox.api.rezkfit.com/api/v1`

## Authentication

All REST requests must supply credentials in the HTTP header:

```http
Authorization: ApiKey YOUR_API_KEY
```
or
```http
Authorization: Bearer YOUR_OAUTH_ACCESS_TOKEN
```

## Available Endpoints

### 1. Clients & Members API
- **`GET /clients`**: Retrieve active clients. (Requires `clients:read` scope).
- **`POST /clients`**: Add a new client record. (Requires `clients:write` scope).

### 2. Tasks & Activities API
- **`GET /tasks`**: Retrieve active tracking tasks. (Requires `tasks:read` scope).
- **`POST /tasks`**: Dispatch a new coaching checklist task. (Requires `tasks:write` scope).

### 3. Calendar & Bookings API
- **`GET /calendar`**: Retrieve schedules and classes. (Requires `calendar:read` scope).
