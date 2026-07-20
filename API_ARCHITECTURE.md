# Backend Migration & API Architecture

This document describes the decoupled integration architecture established to migrate Rezk Fit Hub from in-memory simulated database mocks to real REST APIs.

---

## Centralized Architecture Flow

```
   [ React UI Page / Component ]
                 │
                 ▼
     [ React Query Hooks Layer ]
                 │
                 ▼
    [ Service / Action Layer ]
                 │
                 ▼
       [ Repository Layer ]
                 │
        ┌────────┴────────┐
        ▼                 ▼
   (Mock Mode)       (API Mode)
        │                 │
        ▼                 ▼
  [simulateApi]     [Axios Client]
   (In-Memory)            │
                          ▼
              [Serialization Interceptor]  <-- camelCase to snake_case converter
                          │
                          ▼
               [API Endpoint Router]       <-- Dynamic versioning (/api/v1, /api/v2)
                          │
                          ▼
                [HTTP Request/Response]
                          │
                          ▼
             [Deserialization Interceptor] <-- snake_case to camelCase & Date parsing
                          │
                          ▼
                     [DTO Mapper]          <-- Normalizes payload fields to Domain Model
```

---

## Key Modules

### 1. Config Registry
Configurations are parsed in `src/config/app.config.js`. You can toggle execution modes by updating `VITE_API_MODE` inside environment settings:
* `mock`: Forces mock databases and simulates high-fidelity server execution.
* `staging` & `production`: Hits specific REST API base routes.

### 2. Request pipeline
Located in `src/api/axios.js`. Centralizes outgoing object serialization (converts payload fields to `snake_case`) and incoming deserialization (converts returned JSON back to clean JavaScript `camelCase` objects). Automatically converts ISO date strings into native Javascript `Date` objects.

### 3. API Versioning
Endpoints prefixing is handled in Axios requests interceptors. Specifying a `version` attribute in custom configuration values will route calls to different paths:
```javascript
// Example request with customized version prefix
api.get('/custom-route', { version: 'v2' }); // Resolves to /api/v2/custom-route
```
