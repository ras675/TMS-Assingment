import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import './Dashboard.css'; // Import the CSS file for dashboard styles
import axios from '../services/api';

const Dashboard = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const fetchTasks = async () => {
        try {
          const res = await axios.get('/tasks');
          setTasks(res.data);
        } catch (err) {
          console.error('Failed to fetch tasks:', err);
        }
      };
      fetchTasks();
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out!');
    navigate('/');  // Redirect to the homepage after logging out
  };

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="dashboard-container">
      {isAuthenticated ? (
        <div className="dashboard">
          <div className="header">
            <h1>Welcome to Your Dashboard</h1>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          <div className="task-section">
            <TaskForm onTaskAdded={handleAddTask} />
            <TaskList tasks={tasks} />
          </div>
        </div>
      ) : (
        <div className="auth-prompt">
          <h1>Please Log in or Register</h1>
          <button onClick={() => navigate('/login')} className="auth-btn">Login</button>
          <button onClick={() => navigate('/register')} className="auth-btn">Register</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
