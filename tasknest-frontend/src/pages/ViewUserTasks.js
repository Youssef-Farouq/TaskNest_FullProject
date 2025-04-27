import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import '../App.css';

function ViewUserTasks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    due_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`users/${id}/tasks/`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  const toggleComplete = async (task) => {
    setIsLoading(true);
    try {
      await API.patch(`tasks/${task.id}/`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error) {
      console.error('Toggle error:', error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (taskId) => {
    setIsLoading(true);
    try {
      await API.delete(`tasks/${taskId}/`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.priority || !newTask.due_date) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      await API.post('tasks/', {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        due_date: newTask.due_date,
      });
      setNewTask({ title: '', description: '', priority: '', due_date: '' });
      fetchTasks();
    } catch (error) {
      console.error('Add Task error:', error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="task-page-container">
      {isLoading && <div className="spinner-container"><div className="spinner"></div></div>}

      <div className="task-card fade-slide-in">
        <h2 className="text-center mb-4" style={{ color: '#2900C8' }}>
          📋 User's Tasks
        </h2>

        <form onSubmit={handleAddTask} className="mb-4">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            ></textarea>
          </div>
          <div className="mb-3">
            <select
              className="form-control"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              ➕ Add Task
            </button>
          </div>
        </form>

        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="task-item fade-slide-in">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input task-checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                  />
                  <div className="ms-3">
                    <h6 className={task.completed ? 'completed-task' : ''}>{task.title}</h6>
                    <small>{task.description}</small><br/>
                    <small>Priority: {task.priority}</small><br/>
                    <small>Due: {task.due_date}</small>
                  </div>
                </div>
                <div>
                  <button className="btn btn-delete btn-sm" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No tasks for this user 🚀</div>
          )}
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-gradient"
            onClick={() => navigate('/admin-dashboard')}
          >
            🔙 Back to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewUserTasks;