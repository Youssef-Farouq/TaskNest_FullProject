# TaskNest - Task Management Application

TaskNest is a full-stack task management application built with Django REST Framework and React.

## Features

- User authentication and authorization
- Task management (CRUD operations)
- Task prioritization
- Due date tracking
- Admin dashboard for user management
- Responsive design

## Tech Stack

### Backend
- Django 5.2
- Django REST Framework
- JWT Authentication
- SQLite Database

### Frontend
- React
- React Router
- Axios for API calls
- Material-UI for styling

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd tasknest_backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd tasknest-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/jwt/create/` - Create JWT token
- `POST /api/auth/jwt/refresh/` - Refresh JWT token
- `GET /api/auth/users/me/` - Get current user info

### Task Endpoints

- `GET /api/tasks/` - List all tasks for current user
- `POST /api/tasks/` - Create a new task
- `GET /api/tasks/{id}/` - Get task details
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

### Admin Endpoints

- `GET /api/admin/users/` - List all users with task count
- `DELETE /api/admin/users/{id}/` - Delete user
- `PATCH /api/admin/users/{id}/` - Edit user
- `GET /api/admin/users/{id}/tasks/` - Get tasks of specific user
- `PATCH /api/admin/users/{id}/toggle-active/` - Toggle user active status
- `PATCH /api/admin/users/{id}/toggle-admin/` - Toggle user admin status

## Task Model

```python
{
    "id": integer,
    "title": string,
    "description": string,
    "completed": boolean,
    "priority": integer,
    "due_date": date (optional),
    "user": integer (user ID)
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 