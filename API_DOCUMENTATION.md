# TaskNest API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication Endpoints

### 1. Create JWT Token
- **Endpoint:** `/auth/jwt/create/`
- **Method:** POST
- **Description:** Creates a new JWT token for user authentication
- **Request Body:**
  ```json
  {
      "username": "string",
      "password": "string"
  }
  ```
- **Response:** 200 OK
  ```json
  {
      "access": "string (JWT token)",
      "refresh": "string (JWT refresh token)"
  }
  ```

### 2. Refresh JWT Token
- **Endpoint:** `/auth/jwt/refresh/`
- **Method:** POST
- **Description:** Refreshes an expired JWT token
- **Request Body:**
  ```json
  {
      "refresh": "string (refresh token)"
  }
  ```
- **Response:** 200 OK
  ```json
  {
      "access": "string (new JWT token)"
  }
  ```

### 3. Get Current User
- **Endpoint:** `/auth/users/me/`
- **Method:** GET
- **Description:** Retrieves information about the currently authenticated user
- **Headers Required:** `Authorization: Bearer <token>`
- **Response:** 200 OK
  ```json
  {
      "id": "integer",
      "username": "string",
      "email": "string",
      "is_staff": "boolean"
  }
  ```

## Task Endpoints

### 1. List Tasks
- **Endpoint:** `/tasks/`
- **Method:** GET
- **Description:** Retrieves all tasks for the authenticated user
- **Headers Required:** `Authorization: Bearer <token>`
- **Response:** 200 OK
  ```json
  [
      {
          "id": "integer",
          "title": "string",
          "description": "string",
          "completed": "boolean",
          "priority": "integer",
          "due_date": "string (YYYY-MM-DD)",
          "user": "integer (user ID)"
      }
  ]
  ```

### 2. Create Task
- **Endpoint:** `/tasks/`
- **Method:** POST
- **Description:** Creates a new task
- **Headers Required:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
      "title": "string",
      "description": "string",
      "priority": "integer",
      "due_date": "string (YYYY-MM-DD)"
  }
  ```
- **Response:** 201 Created
  ```json
  {
      "id": "integer",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "priority": "integer",
      "due_date": "string (YYYY-MM-DD)",
      "user": "integer (user ID)"
  }
  ```

### 3. Get Task Details
- **Endpoint:** `/tasks/{id}/`
- **Method:** GET
- **Description:** Retrieves details of a specific task
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (task ID)
- **Response:** 200 OK
  ```json
  {
      "id": "integer",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "priority": "integer",
      "due_date": "string (YYYY-MM-DD)",
      "user": "integer (user ID)"
  }
  ```

### 4. Update Task
- **Endpoint:** `/tasks/{id}/`
- **Method:** PUT
- **Description:** Updates an existing task
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (task ID)
- **Request Body:**
  ```json
  {
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "priority": "integer",
      "due_date": "string (YYYY-MM-DD)"
  }
  ```
- **Response:** 200 OK
  ```json
  {
      "id": "integer",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "priority": "integer",
      "due_date": "string (YYYY-MM-DD)",
      "user": "integer (user ID)"
  }
  ```

### 5. Delete Task
- **Endpoint:** `/tasks/{id}/`
- **Method:** DELETE
- **Description:** Deletes a specific task
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (task ID)
- **Response:** 204 No Content

## Admin Endpoints

### 1. List Users
- **Endpoint:** `/admin/users/`
- **Method:** GET
- **Description:** Retrieves list of all users with their task counts
- **Headers Required:** `Authorization: Bearer <token>`
- **Response:** 200 OK
  ```json
  [
      {
          "id": "integer",
          "username": "string",
          "is_active": "boolean",
          "is_staff": "boolean",
          "task_count": "integer"
      }
  ]
  ```

### 2. Delete User
- **Endpoint:** `/admin/users/{id}/`
- **Method:** DELETE
- **Description:** Deletes a specific user
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (user ID)
- **Response:** 204 No Content

### 3. Edit User
- **Endpoint:** `/admin/users/{id}/`
- **Method:** PATCH
- **Description:** Updates user information
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (user ID)
- **Request Body:**
  ```json
  {
      "username": "string"
  }
  ```
- **Response:** 200 OK
  ```json
  {
      "message": "User updated successfully"
  }
  ```

### 4. Get User Tasks
- **Endpoint:** `/admin/users/{id}/tasks/`
- **Method:** GET
- **Description:** Retrieves all tasks for a specific user
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (user ID)
- **Response:** 200 OK
  ```json
  [
      {
          "id": "integer",
          "title": "string",
          "description": "string",
          "completed": "boolean",
          "priority": "integer",
          "due_date": "string (YYYY-MM-DD)",
          "user": "integer (user ID)"
      }
  ]
  ```

### 5. Toggle User Active Status
- **Endpoint:** `/admin/users/{id}/toggle-active/`
- **Method:** PATCH
- **Description:** Toggles the active status of a user
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (user ID)
- **Response:** 200 OK
  ```json
  {
      "message": "User status toggled successfully"
  }
  ```

### 6. Toggle User Admin Status
- **Endpoint:** `/admin/users/{id}/toggle-admin/`
- **Method:** PATCH
- **Description:** Toggles the admin status of a user
- **Headers Required:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (user ID)
- **Response:** 200 OK
  ```json
  {
      "message": "User admin status toggled successfully"
  }
  ```

## Error Responses

### 400 Bad Request
```json
{
    "error": "string (error message)"
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "error": "Resource not found"
}
```

## Rate Limiting
- Authenticated Users: 100 requests per hour
- Unauthenticated Users: 20 requests per hour

## CORS Configuration
- Allowed Origins: http://localhost:3000
- Allowed Methods: GET, POST, PUT, PATCH, DELETE
- Allowed Headers: Content-Type, Authorization 