import api from './config';
import axios from 'axios';

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/jwt/create/', credentials),
  register: (userData) => api.post('/auth/users/', userData),
  refreshToken: (refresh) => api.post('/auth/jwt/refresh/', { refresh }),
  getMe: (token, type = 'Bearer') => axios.get(
    `${process.env.REACT_APP_API_URL || 'https://seif23.pythonanywhere.com/api'}/auth/users/me/`,
    {
      headers: {
        'Authorization': `${type} ${token}`,
        'Content-Type': 'application/json',
      },
    }
  ),
};

// Task services
export const taskService = {
  getAllTasks: () => api.get('/tasks/'),
  getTaskById: (id) => api.get(`/tasks/${id}/`),
  createTask: (taskData) => api.post('/tasks/', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
  getUserTasks: (userId) => api.get(`/tasks/user/${userId}/`),
};

// Admin services for user management
export const adminService = {
  // Get all users with their task counts
  getAllUsers: () => api.get('/users'),
  
  // Toggle user activation status
  toggleUserActivation: (userId) => api.patch(`/users/${userId}/toggle-activate/`),
  
  // Toggle user admin status
  toggleUserAdmin: (userId) => api.patch(`/users/${userId}/toggle-admin/`),
  
  // Permanently delete a user
  deleteUser: (userId) => api.delete(`/users/${userId}/delete/`),

  // Edit user's username
  editUsername: (userId, username) => api.patch(`/users/${userId}/edit/`, { username }),

  // Get user's tasks
  getUserTasks: (userId) => api.get(`/users/${userId}/tasks/`),
}; 