import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://seif23.pythonanywhere.com/api', // PythonAnywhere URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // This is important for handling cookies if your backend uses them
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // JWT access token
    if (token) {
      config.headers.Authorization = `JWT ${token}`; // Django REST framework JWT format
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token using the refresh endpoint
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const response = await axios.post('https://seif23.pythonanywhere.com/api/auth/jwt/refresh/', {
            refresh: refreshToken
          });
          
          localStorage.setItem('access', response.data.access);
          originalRequest.headers.Authorization = `JWT ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout and redirect
        localStorage.clear(); // Clear all localStorage
        window.location.href = '/login';
      }
    }

    // Handle other common errors
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 
