# DTO Mapper Implementation Guide

This document describes how Data Transfer Objects (DTO) are used to isolate the UI model structures from database-level field naming variations (such as `snake_case` properties).

---

## DTO Architecture Layout

Every major entity in Rezk Fit Hub defines a DTO class extending `BaseDto` inside the `src/dtos/` directory:
* `toDomain(payload)`: Translates raw incoming API payloads (often containing database naming schemas) into camelCase domains utilized by screens and components.
* `toRequest(domain)`: Translates local frontend UI states back to server-compatible REST bodies.

---

## Example Usage

### 1. Repository Call
Repositories utilize mappers to transform data transparently:
```javascript
import { ClientDto } from '@/dtos/client.dto';

export const ClientRepository = {
    getById: async (clientId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.clients.getById(clientId));
        } else {
            const response = await api.get(`/trainees/${clientId}`);
            result = response.data;
        }

        // Return a clean Domain Model
        return ClientDto.toDomain(result);
    }
};
```

### 2. Collection Mapping
To deserialize list payloads, utilize the base collection helper method:
```javascript
import { ClientDto } from '@/dtos/client.dto';
import { BaseDto } from '@/dtos/base.dto';

// Maps lists array recursively
const clientDomainList = BaseDto.toDomainList(response.data, ClientDto);
```
