import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../App.css';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', success: true });

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const fetchTask = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`tasks/${id}/`);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setPriority(response.data.priority);
      setDueDate(response.data.due_date || '');
    } catch (error) {
      showToast('Failed to load task ❌', false);
    }
    setIsLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.put(`tasks/${id}/`, {
        title,
        description,
        priority,
        due_date: dueDate,
      });
      setIsLoading(false);
      showToast('✅ Task Updated Successfully!', true);
      setTimeout(() => {
        navigate('/tasks');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      showToast('Failed to update task ❌', false);
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
          ✏️ Edit Task
        </h2>

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Priority (0 = Low, 1 = Medium, 2 = High)"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-gradient btn-lg">
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;