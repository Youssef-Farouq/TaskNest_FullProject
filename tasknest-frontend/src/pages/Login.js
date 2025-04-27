import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services';
import api from '../api/config';
import '../App.css';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (credentials.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const authResponse = await authService.login({
        username: credentials.username,
        password: credentials.password,
      });
      localStorage.setItem('access', authResponse.data.access);
      localStorage.setItem('refresh', authResponse.data.refresh);

      // Update axios default header to use Bearer
      api.defaults.headers.common['Authorization'] = `Bearer ${authResponse.data.access}`;

      // Always use the latest access token
      const token = authResponse.data.access;
      const userInfo = await authService.getMe(token, 'Bearer');
      localStorage.setItem('userId', userInfo.data.id);
      localStorage.setItem('username', userInfo.data.username);
      localStorage.setItem('isStaff', userInfo.data.is_staff);

      navigate('/tasks');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.detail || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-page-container">
      <div className="task-card fade-slide-in">
        <h2 className="text-center mb-4" style={{ color: '#2900C8' }}>Login to TaskNest</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-login-custom"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button 
              type="button" 
              className="btn btn-register-custom"
              onClick={() => navigate('/register')}
              disabled={isLoading}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;