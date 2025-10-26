import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Groups from './pages/Groups';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  const handleLogin = (id) => {
    setIsAuthenticated(true);
    setCompanyId(id);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCompanyId(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ?
            <Navigate to="/dashboard" /> :
            <Login onLogin={handleLogin} />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ?
            <Dashboard companyId={companyId} onLogout={handleLogout} /> :
            <Navigate to="/login" />
        }
      />
      <Route
        path="/courses"
        element={
          isAuthenticated ?
            <Courses companyId={companyId} onLogout={handleLogout} /> :
            <Navigate to="/login" />
        }
      />
      <Route
        path="/groups"
        element={
          isAuthenticated ?
            <Groups companyId={companyId} onLogout={handleLogout} /> :
            <Navigate to="/login" />
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
