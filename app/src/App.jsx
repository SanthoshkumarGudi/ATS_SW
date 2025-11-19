// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import JobsList from './pages/JobsList';
import ApplyJob from './pages/ApplyJob';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';

export default function App() {
  const [user, setUser] = useState(null);

  // On every refresh — restore user from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  // If still loading token
  if (user === null && localStorage.getItem('token')) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'candidate' ? '/jobs' : '/dashboard'} replace /> : <AuthPage setUser={setUser} />}
        />

        {/* Candidate */}
        <Route
          path="/jobs"
          element={user?.role === 'candidate' ? <JobsList user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/apply/:jobId"
          element={user?.role === 'candidate' ? <ApplyJob user={user} /> : <Navigate to="/login" replace />}
        />

        {/* Hiring Manager / Admin */}
        <Route
          path="/dashboard"
          element={user && user.role !== 'candidate' ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create-job"
          element={user && user.role !== 'candidate' ? <CreateJob /> : <Navigate to="/login" replace />}
        />

        {/* Root → redirect based on role */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'candidate' ? (
                <Navigate to="/jobs" replace />
              ) : (
                <Navigate to="/dashboard" replace={false} />
              )
            ) : ( 
              <Navigate to="/login" replace={false} />
            ) 
          } 
        />

        {/* Any other route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}