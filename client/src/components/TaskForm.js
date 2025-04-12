import React, { useState } from 'react';
import axios from '../services/api';
import { motion } from 'framer-motion'; 
import './task.css';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addTask = async (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/tasks', { title });
      setTitle('');
      setError('');
      onTaskAdded(response.data);
    } catch (err) {
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="task-form-container"
    >
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task..."
          className="task-input"
        />
        <button type="submit" className="add-task-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </motion.div>
  );
};

export default TaskForm;
