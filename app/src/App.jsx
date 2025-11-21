// frontend/src/App.jsx
import './utils/axiosConfig';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

// Pages
import AuthPage from './pages/AuthPage';
import JobsList from './pages/JobsList';
import ApplyJob from './pages/ApplyJob';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import CandidateProfileForm from './pages/CandidateProfileForm';

export default function App() {
  const [user, setUser] = useState(null);
  const [profileChecked, setProfileChecked] = useState(false); // ← changed name for clarity
  const [hasProfile, setHasProfile] = useState(false);

useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    setProfileChecked(true);
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);
    
    

    if (payload.role !== 'candidate') {
      setProfileChecked(true);
      return;
    }

    // ← DO NOT setProfileChecked(true) here!
    axios
      .get('http://localhost:5000/api/candidate/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setHasProfile(true);
        setProfileChecked(true);   // ← only here
      })
      .catch((err) => {
        setHasProfile(err.response?.status !== 404);
        setProfileChecked(true);   // ← only here
      });

  } catch (e) {
    localStorage.removeItem('token');
    setProfileChecked(true);
  }
}, []);

console.log("user is ", user);


  // Show loading only while checking token + profile
  if (!profileChecked) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        background: '#f8fafc'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <AuthPage setUser={setUser} />}
        />

        {/* Candidate: Profile Form or Jobs */}
        <Route
  path="/jobs"
  element={
    !profileChecked ? (
      // ← This is the missing piece!
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading your profile...</Typography>
      </Box>
    ) : user?.role === 'candidate' ? (
      hasProfile ? (
        <JobsList user={user} />
      ) : (
        <CandidateProfileForm user={user} />
      )
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

        <Route
          path="/apply/:jobId"
          element={user?.role === 'candidate' ? <ApplyJob user={user} /> : <Navigate to="/login" replace />}
        />

        {/* Manager / Admin */}
        <Route
          path="/dashboard"
          element={user && user.role !== 'candidate' ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create-job"
          element={user && user.role !== 'candidate' ? <CreateJob /> : <Navigate to="/login" replace />}
        />

        {/* Root */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'candidate' ? (
                hasProfile ? <Navigate to="/jobs" replace /> : <Navigate to="/jobs" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}