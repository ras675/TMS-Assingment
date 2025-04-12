import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; 

import Register from './components/Register';
import AuthPage from './components/AuthPage';



function App() {
 
  const isAuthenticated = localStorage.getItem('token') ? true : false;

  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<AuthPage />} />

        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={<Dashboard isAuthenticated={isAuthenticated} />}  
        />
      </Routes>
    </Router>
  );
}

export default App;