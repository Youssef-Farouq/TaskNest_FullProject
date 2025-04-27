import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../api/services';
import '../App.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [selectedUserTasks, setSelectedUserTasks] = useState(null);
  const [showTasksModal, setShowTasksModal] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleToggleActivation = async (userId) => {
    try {
      await adminService.toggleUserActivation(userId);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to toggle user activation');
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      await adminService.toggleUserAdmin(userId);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to toggle admin status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const startEditingUsername = (user) => {
    setEditingUser(user);
    setNewUsername(user.username);
  };

  const handleUsernameEdit = async () => {
    try {
      await adminService.editUsername(editingUser.id, newUsername);
      setEditingUser(null);
      setNewUsername('');
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to update username');
    }
  };

  const viewUserTasks = async (userId) => {
    try {
      const response = await adminService.getUserTasks(userId);
      setSelectedUserTasks(response.data);
      setShowTasksModal(true);
    } catch (err) {
      setError('Failed to fetch user tasks');
    }
  };

  if (loading) {
    return (
      <div className="task-page-container">
        <div className="task-card">
          <h3 className="text-center">Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="task-page-container">
      <div className="task-card">
        <h2 className="text-center mb-4" style={{ color: '#2900C8' }}>User Management</h2>
        
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
            <button 
              className="btn-close float-end" 
              onClick={() => setError('')}
            ></button>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Tasks Count</th>
                <th>Status</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    {editingUser?.id === user.id ? (
                      <div className="input-group input-group-sm">
                        <input
                          type="text"
                          className="form-control"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                        />
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={handleUsernameEdit}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span onClick={() => startEditingUsername(user)} style={{ cursor: 'pointer' }}>
                        {user.username} ✏️
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-link btn-sm"
                      onClick={() => viewUserTasks(user.id)}
                    >
                      {user.tasks_count} 📋
                    </button>
                  </td>
                  <td>
                    <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.is_staff ? 'bg-primary' : 'bg-secondary'}`}>
                      {user.is_staff ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className={`btn ${user.is_active ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleActivation(user.id)}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className={`btn ${user.is_staff ? 'btn-info' : 'btn-primary'}`}
                        onClick={() => handleToggleAdmin(user.id)}
                      >
                        {user.is_staff ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center mt-4">
            <p>No users found.</p>
          </div>
        )}

        {/* Tasks Modal */}
        {showTasksModal && selectedUserTasks && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Tasks</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => {
                      setShowTasksModal(false);
                      setSelectedUserTasks(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedUserTasks.length > 0 ? (
                    <div className="list-group">
                      {selectedUserTasks.map(task => (
                        <div key={task.id} className="list-group-item">
                          <h6 className="mb-1">{task.title}</h6>
                          <p className="mb-1">{task.description}</p>
                          <small className="text-muted">
                            Status: {task.completed ? 'Completed ✅' : 'Pending ⏳'}
                          </small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center">No tasks found for this user.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowTasksModal(false);
                      setSelectedUserTasks(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;