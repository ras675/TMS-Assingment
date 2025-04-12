import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, Button, Typography, Paper, CircularProgress } from '@material-ui/core';
import AuthContext from '../../context/authContext';
import AlertContext from '../../context/alertContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      setAlert('Login successful', 'success');
      history.push('/tasks');
    } catch (err) {
      setAlert(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>
    </Paper>
  );
};

export default Login;