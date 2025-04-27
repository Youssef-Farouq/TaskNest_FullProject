import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function AddUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', success: true });
  const navigate = useNavigate();

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('Passwords do not match ❌');
      return;
    }

    if (password.length < 8 || /^\d+$/.test(password)) {
      showError('Password must be at least 8 characters, not only numbers, and not too common ❌');
      return;
    }

    setIsLoading(true);
    try {
      await API.post('auth/users/', {
        username,
        password,
        email: `${username}@example.com`,
      });
      setIsLoading(false);
      showSuccess('User added successfully ✅', '/admin-dashboard');
    } catch (error) {
      setIsLoading(false);
      const response = error.response?.data;
      let errorMessage = 'Failed to add user ❌';

      if (response?.username) {
        errorMessage = 'Username already exists ❌ Choose another one';
      } else if (response?.password) {
        errorMessage = 'Password must meet complexity requirements ❌';
      }

      showError(errorMessage);
    }
  };

  const showSuccess = (message, redirectPath) => {
    setToast({ show: true, message, success: true });
    setTimeout(() => {
      setToast({ show: false, message: '', success: true });
      if (redirectPath) navigate(redirectPath);
    }, 2000);
  };

  const showError = (message) => {
    setToast({ show: true, message, success: false });
    setTimeout(() => {
      setToast({ show: false, message: '', success: true });
    }, 4000);
  };

  return (
    <div className="task-page-container">
      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {toast.show && (
        <div
          className="toast"
          style={{ backgroundColor: toast.success ? '#4BB543' : '#ff4d4d' }}
        >
          {toast.message}
        </div>
      )}

      <div className="task-card fade-slide-in">
        <h2 className="text-center mb-4" style={{ color: '#2900C8' }}>
          ➕ Add New User
        </h2>

        <form onSubmit={handleAddUser}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-gradient btn-lg">
              Add User
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUser;