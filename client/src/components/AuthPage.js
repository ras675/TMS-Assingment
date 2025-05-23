import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css'; 

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="auth-page-container">
      {showLogin ? <Login /> : <Register />}
      
      <div className="toggle-link">
        {showLogin ? (
          <p>Don't have an account? <span onClick={toggleForm} className="link-text">Register here</span></p>
        ) : (
          <p>Already have an account? <span onClick={toggleForm} className="link-text">Login here</span></p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;