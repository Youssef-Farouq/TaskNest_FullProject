# TaskNest API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

### Create JWT Token
```http
POST /auth/jwt/create/
```

**Request Body:**
```json
{
    "username": "your_username",
    "password": "your_password"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Refresh JWT Token
```http
POST /auth/jwt/refresh/
```

**Request Body:**
```json
{
    "refresh": "your_refresh_token"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Get Current User Info
```http
GET /auth/users/me/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```json
{
    "id": 1,
    "username": "your_username",
    "email": "your_email@example.com",
    "is_staff": false
}
```

## Tasks

### List Tasks
```http
GET /tasks/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```json
[
    {
        "id": 1,
        "title": "Complete project",
        "description": "Finish the TaskNest project",
        "completed": false,
        "priority": 1,
        "due_date": "2024-04-30",
        "user": 1
    }
]
```

### Create Task
```http
POST /tasks/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Request Body:**
```json
{
    "title": "New Task",
    "description": "Task description",
    "priority": 1,
    "due_date": "2024-04-30"
}
```

**Response:**
```json
{
    "id": 2,
    "title": "New Task",
    "description": "Task description",
    "completed": false,
    "priority": 1,
    "due_date": "2024-04-30",
    "user": 1
}
```

### Get Task Details
```http
GET /tasks/{id}/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```json
{
    "id": 1,
    "title": "Complete project",
    "description": "Finish the TaskNest project",
    "completed": false,
    "priority": 1,
    "due_date": "2024-04-30",
    "user": 1
}
```

### Update Task
```http
PUT /tasks/{id}/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Request Body:**
```json
{
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true,
    "priority": 2,
    "due_date": "2024-05-01"
}
```

**Response:**
```json
{
    "id": 1,
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true,
    "priority": 2,
    "due_date": "2024-05-01",
    "user": 1
}
```

### Delete Task
```http
DELETE /tasks/{id}/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```
204 No Content
```

## Admin Endpoints

### List Users with Task Count
```http
GET /admin/users/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```json
[
    {
        "id": 1,
        "username": "user1",
        "is_active": true,
        "is_staff": false,
        "task_count": 5
    }
]
```

### Delete User
```http
DELETE /admin/users/{id}/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```
204 No Content
```

### Edit User
```http
PATCH /admin/users/{id}/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Request Body:**
```json
{
    "username": "new_username"
}
```

**Response:**
```json
{
    "message": "User updated successfully"
}
```

### Get User Tasks
```http
GET /admin/users/{id}/tasks/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```json
[
    {
        "id": 1,
        "title": "Task 1",
        "description": "Description 1",
        "completed": false,
        "priority": 1,
        "due_date": "2024-04-30",
        "user": 1
    }
]
```

### Toggle User Active Status
```http
PATCH /admin/users/{id}/toggle-active/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```json
{
    "message": "User status toggled successfully"
}
```

### Toggle User Admin Status
```http
PATCH /admin/users/{id}/toggle-admin/
```

**Headers:**
```
Authorization: Bearer your_access_token
```

**Response:**
```json
{
    "message": "User admin status toggled successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
    "error": "Invalid request data"
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
- 100 requests per hour for authenticated users
- 20 requests per hour for unauthenticated users

## CORS
- Allowed Origins: http://localhost:3000
- Allowed Methods: GET, POST, PUT, PATCH, DELETE
- Allowed Headers: Content-Type, Authorization 