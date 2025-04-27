import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../App.css';

function EditUser() {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', success: true });
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast('Username is required ❌', false);
      return;
    }
    setIsLoading(true);
    try {
      await API.patch(`users/${id}/edit/`, { username });
      setIsLoading(false);
      showToast('✅ Username updated successfully!', true);
      setTimeout(() => navigate('/admin-dashboard'), 2000);
    } catch (error) {
      setIsLoading(false);
      showToast('Failed to update username ❌', false);
    }
  };

  const showToast = (message, success) => {
    setToast({ show: true, message, success });
    setTimeout(() => setToast({ show: false, message: '', success: true }), 3000);
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
          ✏️ Edit User
        </h2>

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="New Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-gradient btn-lg">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;