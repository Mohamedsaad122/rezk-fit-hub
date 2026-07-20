# Rezk Fit Hub — API Specifications & Contracts

This document specifies the exact request and response schemas (DTOs) for all endpoints in the application. These specifications correspond directly to the Zod contracts defined in the codebase.

---

## Authentication Module (`AUTH`)

### POST `/auth/login`
Authenticates a user and returns authentication tokens.
* **HTTP Method**: `POST`
* **Authentication Required**: `No`
* **Request DTO (`LoginRequestSchema`)**:
  ```json
  {
    "email": "string (valid email format, required)",
    "password": "string (min 6 characters, required)"
  }
  ```
* **Response DTO (`LoginResponseSchema`)**:
  ```json
  {
    "user": {
      "id": "string | number",
      "name": "string (min 1)",
      "email": "string (valid email)",
      "role": "coach | admin | client",
      "permissions": "array of strings (optional)",
      "avatar": "string (optional)"
    },
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT)"
  }
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful authentication.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Invalid credentials.

### POST `/auth/refresh`
Silent token refresh execution.
* **HTTP Method**: `POST`
* **Authentication Required**: `No (requires valid refreshToken)`
* **Request DTO**:
  ```json
  {
    "refreshToken": "string (required)"
  }
  ```
* **Response DTO**:
  ```json
  {
    "accessToken": "string (new JWT)",
    "refreshToken": "string (new JWT, optional)"
  }
  ```
* **Expected Status Codes**:
  - `200 OK`: Tokens successfully rotated.
  - `401 Unauthorized`: Expired or invalid refresh token.

### POST `/auth/logout`
Terminates the current session.
* **HTTP Method**: `POST`
* **Authentication Required**: `Yes`
* **Request DTO**: Empty
* **Response DTO**:
  ```json
  {
    "success": "boolean"
  }
  ```
* **Expected Status Codes**:
  - `200 OK`: Session successfully terminated.

---

## Client Trainees Module (`CLIENTS`)

### GET `/trainees`
Lists client trainees with pagination, searching, and filtering.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Pagination Support**: `Yes (page, limit)`
* **Query Parameters (`PaginationQuerySchema`)**:
  - `page`: `number (positive, default: 1)`
  - `limit`: `number (positive, max 100, default: 10)`
  - `search`: `string (optional)`
  - `status`: `string (optional)`
* **Response DTO (`createPaginatedResponseSchema(ClientResponseSchema)`)**:
  ```json
  {
    "data": [
      {
        "id": "string | number",
        "name": "string",
        "progress": "number (0-100)",
        "workouts": "number",
        "streak": "number",
        "goal": "string",
        "avatar": "string",
        "email": "string (valid email)",
        "phone": "string",
        "age": "number",
        "currentWeight": "number",
        "targetWeight": "number",
        "subscriptionStatus": "string",
        "joinDate": "string",
        "assignedCategoryId": "string | null (optional)"
      }
    ],
    "meta": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.

### GET `/trainees/:id`
Retrieves details of a specific trainee.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Response DTO (`ClientResponseSchema`)**: Same object structure as a single item in the `/trainees` data array.
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.
  - `404 Not Found`: Trainee not found.

### POST `/trainees`
Adds a new trainee client.
* **HTTP Method**: `POST`
* **Authentication Required**: `Yes`
* **Request DTO (`ClientRequestSchema`)**:
  ```json
  {
    "name": "string (min 2, required)",
    "progress": "number (0-100, default: 0)",
    "workouts": "number (min 0, default: 0)",
    "streak": "number (min 0, default: 0)",
    "goal": "string (required)",
    "avatar": "string (default: '👩')",
    "email": "string (valid email, required)",
    "phone": "string (required)",
    "age": "number (12-100, default: 25)",
    "currentWeight": "number (min 30, default: 70)",
    "targetWeight": "number (min 30, default: 65)",
    "subscriptionStatus": "نشط | معلق | منتهي (default: 'نشط')",
    "assignedCategoryId": "string | null (optional)"
  }
  ```
* **Response DTO (`ClientResponseSchema`)**: Returns the full created client trainee profile.
* **Expected Status Codes**:
  - `201 Created`: Successfully created.
  - `400 Bad Request`: Validation errors.

### PUT `/trainees/:id`
Updates trainee profile details.
* **HTTP Method**: `PUT`
* **Authentication Required**: `Yes`
* **Request DTO (`ClientRequestSchema`)**: Same fields as POST request.
* **Response DTO (`ClientResponseSchema`)**: Returns the updated trainee profile.
* **Expected Status Codes**:
  - `200 OK`: Successfully updated.
  - `400 Bad Request`: Validation errors.
  - `404 Not Found`: Trainee not found.

### DELETE `/trainees/:id`
Deletes a trainee client profile.
* **HTTP Method**: `DELETE`
* **Authentication Required**: `Yes`
* **Request DTO**: Empty
* **Response DTO**: None (status `204`) or `{ "success": true }`
* **Expected Status Codes**:
  - `204 No Content` / `200 OK`: Successfully deleted.
  - `404 Not Found`: Trainee not found.

### GET `/trainees/:id/stats`
Gets weight and progress logs history for a specific trainee.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Response DTO (`TraineeProgressStatsResponseSchema`)**:
  ```json
  [
    {
      "date": "string",
      "weight": "number",
      "fatPercentage": "number (optional)",
      "muscleMass": "number (optional)",
      "caloriesConsumed": "number (optional)",
      "caloriesBurned": "number (optional)"
    }
  ]
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.

---

## Exercises Module (`EXERCISES`)

### GET `/exercises`
Lists categories and exercises.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Response DTO (`ExerciseCategoriesResponseSchema`)**:
  ```json
  [
    {
      "id": "string | number",
      "name": "string",
      "description": "string",
      "color": "string",
      "exercises": [
        {
          "id": "string | number",
          "name": "string",
          "duration": "string",
          "difficulty": "مبتدئ | متوسط | متقدم",
          "participants": "number",
          "sets": "string",
          "image": "string"
        }
      ]
    }
  ]
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.

### POST `/exercises`
Creates a new exercise under a category.
* **HTTP Method**: `POST`
* **Authentication Required**: `Yes`
* **Request DTO (`ExerciseRequestSchema`)**:
  ```json
  {
    "name": "string (min 2, required)",
    "duration": "string (required)",
    "difficulty": "مبتدئ | متوسط | متقدم (required)",
    "participants": "number (min 0, default: 0)",
    "sets": "string (required)",
    "image": "string (default: '💪')"
  }
  ```
* **Response DTO (`ExerciseResponseSchema`)**: The created exercise object.
* **Expected Status Codes**:
  - `201 Created`: Successfully created.
  - `400 Bad Request`: Validation errors.

---

## Nutrition Plans Module (`NUTRITION`)

### GET `/nutrition-plans`
Lists nutrition plans with pagination, searching, and filtering.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Pagination Support**: `Yes (page, limit)`
* **Query Parameters (`PaginationQuerySchema`)**:
  - `page`: `number (positive, default: 1)`
  - `limit`: `number (positive, max 100, default: 10)`
  - `search`: `string (optional)`
  - `status`: `string (optional)`
* **Response DTO (`createPaginatedResponseSchema(NutritionPlanResponseSchema)`)**:
  ```json
  {
    "data": [
      {
        "id": "string | number",
        "name": "string",
        "description": "string",
        "duration": "string",
        "participants": "number",
        "calories": "number",
        "image": "string",
        "macros": {
          "protein": { "value": "number", "color": "string" },
          "carbs": { "value": "number", "color": "string" },
          "fats": { "value": "number", "color": "string" }
        },
        "meals": [
          {
            "name": "string",
            "time": "string",
            "calories": "number"
          }
        ],
        "assignedClientId": "string | number | null (optional)",
        "status": "string (default: 'نشط')"
      }
    ],
    "meta": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.

---

## Dashboard Statistics Module (`DASHBOARD`)

### GET `/stats/overview`
Aggregates summary statistics widgets for the home screen dashboard.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Response DTO (`DashboardStatsResponseSchema`)**:
  ```json
  [
    {
      "title": "string",
      "value": "string",
      "change": "string",
      "trend": "up | down",
      "iconName": "string (Users | Dumbbell | Apple | Trophy)",
      "color": "string",
      "bgColor": "string"
    }
  ]
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.

### GET `/stats/recent-activities`
Lists recent activity feed logging events.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Response DTO (`RecentActivitiesResponseSchema`)**:
  ```json
  [
    {
      "id": "number",
      "type": "string",
      "description": "string",
      "time": "string",
      "color": "string",
      "iconName": "string"
    }
  ]
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.

### GET `/stats/monthly`
Trainee signup and progress metrics datasets for monthly analytics charts.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Response DTO (`MonthlyProgressResponseSchema`)**:
  ```json
  [
    {
      "name": "string (Arabic Month Name)",
      "trainees": "number",
      "workouts": "number",
      "activePlans": "number"
    }
  ]
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.

### GET `/stats/top-trainees`
Lists top 5 performing client trainees based on compliance scores.
* **HTTP Method**: `GET`
* **Authentication Required**: `Yes`
* **Response DTO (`TopTraineesResponseSchema`)**:
  ```json
  [
    {
      "id": "string | number",
      "name": "string",
      "progress": "number",
      "workouts": "number",
      "streak": "number",
      "goal": "string"
    }
  ]
  ```
* **Expected Status Codes**:
  - `200 OK`: Successful retrieval.
