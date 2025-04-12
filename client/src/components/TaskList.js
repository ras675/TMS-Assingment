import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react'; 
import './task.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        setError('Failed to fetch tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="task-list-container">
      <h3 className="task-list-title">Your Tasks</h3>

      {tasks.length === 0 ? (
        <p className="no-task-text">No tasks yet. Add one!</p>
      ) : (
        <ul className="task-list">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="task-item"
              >
                <span>{task.title}</span>
                <button
                  className="delete-task-button"
                  onClick={() => deleteTask(task._id)}
                >
                  <Trash2 size={18} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default TaskList;