import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="task-page-container">
      <div className="task-card fade-slide-in text-center">
        <h1 className="mb-4" style={{ color: '#2900C8' }}>
           Welcome to TaskNest
        </h1>
        <div className="d-grid gap-3">
      
          <button 
            className="btn btn-login-custom btn-lg" 
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          
          <button 
            className="btn btn-register-custom btn-lg" 
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;