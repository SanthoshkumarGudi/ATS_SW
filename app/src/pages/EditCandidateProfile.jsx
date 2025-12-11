// frontend/src/pages/EditCandidateProfile.jsx
import { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, Alert, LinearProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../GoBack';
// import User from '../../../backend/src/models/User';
import { useAuth } from '../context/AuthContext';


export default function EditCandidateProfile({ user }) {
  //  const { user} = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    currentLocation: '',
    targetJobTitle: '',
    skills: '',
    preferredLocation: '',
    noticePeriod: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole]= useState();
  const navigate = useNavigate();

  // Fetch current profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("token is",token);
        
        const res = await axios.get('http://localhost:5000/api/candidate/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profile = res.data;
        setFormData({
          name: profile.name || user.name || '',
          // name: profile.name,
          currentLocation: profile.currentLocation || '',
          targetJobTitle: profile.targetJobTitle || '',
          skills: profile.skills?.join(', ') || '',
          preferredLocation: profile.preferredLocation || '',
          noticePeriod: profile.noticePeriod || '',
          experience: profile.experience || ''
        });
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
        setUserRole(user.role)
      }
    };
    console.log("user email is", user.email);
    console.log("user role is", user.role ,"user role is", userRole);
    

    fetchProfile();
  }, [user.name]);

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/candidate/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => navigate('/jobs', { replace: true }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading your profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      {/* <GoBackButton label="Back to Jobs" fallback="/jobs" /> */}

      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Edit Your Profile
        </Typography>
        <Typography color="text.secondary">
          Keep your information up to date for better job matches
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>Profile updated successfully! Redirecting...</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
          disabled
        />

        <TextField
          fullWidth
          label="Current Location"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleChange}
          margin="normal"
          placeholder="e.g., Bangalore, India"
          required
        />

        <TextField
          fullWidth
          label="Target Job Title"
          name="targetJobTitle"
          value={formData.targetJobTitle}
          onChange={handleChange}
          margin="normal"
          placeholder="e.g., Senior React Developer"
          required
        />

        <TextField
          fullWidth
          label="Skills (comma-separated)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          margin="normal"
          placeholder="React, Node.js, TypeScript, AWS"
          helperText="Separate skills with commas"
          required
        />

        <TextField
          fullWidth
          label="Preferred Location"
          name="preferredLocation"
          value={formData.preferredLocation}
          onChange={handleChange}
          margin="normal"
          placeholder="e.g., Remote, USA, London"
          required
        />

        <TextField
          fullWidth
          label="Notice Period (days)"
          name="noticePeriod"
          type="number"
          value={formData.noticePeriod}
          onChange={handleChange}
          margin="normal"
          InputProps={{ inputProps: { min: 0, max: 180 } }}
          required
        />

        <TextField
          fullWidth
          label="Total Experience (years)"
          name="experience"
          type="number"
          value={formData.experience}
          onChange={handleChange}
          margin="normal"
          InputProps={{ inputProps: { min: 0, max: 50 } }}
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 4, py: 1.8, borderRadius: 3 }}
          disabled={saving || success}
        >
          {saving ? 'Saving Changes...' : 'Update Profile'}
        </Button>
      </Box>
    </Container>
  );
}