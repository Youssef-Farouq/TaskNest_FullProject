import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../App.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [username, setUsername] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    const storedUsername = localStorage.getItem('username');

    if (!token) {
      navigate('/login');
    } else {
      if (storedUsername) setUsername(storedUsername);
      fetchTasks();
      checkAdmin();
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const checkAdmin = async () => {
    try {
      const response = await API.get('auth/users/me/');
      setIsAdmin(response.data.is_staff);
    } catch (error) {
      console.error('Error checking admin status:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await API.delete(`tasks/${id}/`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  const toggleComplete = async (task) => {
    setIsLoading(true);
    try {
      await API.patch(`tasks/${task.id}/`, {
        completed: !task.completed,
      });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    } catch (error) {
      console.error('Toggle error:', error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="task-page-container">
      {/* Top Fixed Bar */}
      <div className="top-bar d-flex justify-content-end align-items-center p-3">
        {  (
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => navigate('/admin-dashboard')}
          >
            🛠️ Admin Dashboard
          </button>
        )}
        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>

      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {/* Main Card */}
      <div className="task-card fade-slide-in">
        <h4 className="text-center text-primary mb-3">
          👋 Welcome, {username}!
        </h4>

        <h2 className="text-center mb-3" style={{ color: '#2900C8' }}>
          📝 To Do List
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-task')}>
            ➕ Add New Task
          </button>
        </div>

        <div className="mb-4 d-flex justify-content-center gap-2 flex-wrap">
          <button className="btn btn-outline-primary btn-sm filter-btn" onClick={() => setFilter('all')}>All</button>
          <button className="btn btn-outline-success btn-sm filter-btn" onClick={() => setFilter('completed')}>Completed</button>
          <button className="btn btn-outline-warning btn-sm filter-btn" onClick={() => setFilter('incomplete')}>Incomplete</button>
        </div>

        <div className="task-list">
          {tasks.length > 0 ? (
            tasks
              .filter(task =>
                filter === 'all' ? true :
                filter === 'completed' ? task.completed :
                !task.completed
              )
              .map(task => (
                <div key={task.id} className="task-item fade-slide-in">
                  <div className="d-flex align-items-center">
                    <input 
                      type="checkbox"
                      className="form-check-input task-checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                    />
                    <span className={task.completed ? 'completed-task' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <div>
                    <button className="btn btn-delete btn-sm me-2" onClick={() => handleDelete(task.id)}>Delete</button>
                    <button className="btn btn-edit btn-sm" onClick={() => navigate(`/edit-task/${task.id}`)}>Edit</button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-muted mt-4">
              No tasks available 🚀
            </div>
          )}
        </div>

        <div className="task-stats mt-4">
          Completed: {tasks.filter(t => t.completed).length} | Uncompleted: {tasks.filter(t => !t.completed).length}
        </div>
      </div>

      {windowWidth <= 768 && (
        <button className="floating-add-btn" onClick={() => navigate('/add-task')}>
          ➕
        </button>
      )}
    </div>
  );
}

export default Tasks;