// src/pages/AuthPage.jsx
import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Link,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // ← NEW: use context

export default function AuthPage() {
  const { login } = useAuth(); // ← Get login function from context

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/login' : '/api/register';

    try {
      const res = await axios.post(`http://localhost:5000${url}`, {
        ...formData,
        email: formData.email.toLowerCase().trim()
      });

      // Use context login → sets token + user globally
      login(res.data.token, res.data.user);

      // Optional: redirect based on role
      const redirectTo = res.data.user.role === 'candidate' ? '/jobs' : '/dashboard';
      window.location.href = redirectTo;

    } catch (err) {
      setError(
        err.response?.data?.message || 
        (isLogin ? 'Invalid credentials' : 'Registration failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError('');
    setFormData({ name: '', email: '', password: '', role: 'candidate' });
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
    setFormData({ name: '', email: '', password: '', role: 'candidate' });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          fontWeight="800"
          sx={{
            background: 'linear-gradient(120deg, #4f46e5, #14b8a6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1,
          }}
        >
          ATS Pro
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight="500">
          Intelligent Applicant Tracking System
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Name - Only on Register */}
        {!isLogin && (
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
          />
        )}

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
          autoFocus={isLogin}
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

        {/* Role - Only on Register */}
        {!isLogin && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="candidate">Candidate</MenuItem>
              <MenuItem value="hiring_manager">Hiring Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, py: 1.5 }}
          disabled={loading}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </Button>
      </Box>

      {/* Toggle Link */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        {isLogin ? (
          <Typography variant="body1">
            Don't have an account?{' '}
            <Link component="button" variant="body1" onClick={switchToRegister} sx={{ fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>
        ) : (
          <Typography variant="body1">
            Already have an account?{' '}
            <Link component="button" variant="body1" onClick={switchToLogin} sx={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        )}
      </Box>
    </Container>
  );
}