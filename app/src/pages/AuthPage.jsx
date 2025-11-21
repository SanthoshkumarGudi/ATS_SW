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
} from '@mui/material';
import axios from 'axios';

export default function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true); // true → login, false → register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isLogin ? '/api/login' : '/api/register';

    try {
      const res = await axios.post(`http://localhost:5000${url}`, formData);

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);

      // Full page reload so App.jsx useEffect runs cleanly
      window.location.href = '/jobs';
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const switchToRegister = (e) => {
    e.preventDefault();
    setIsLogin(false);
    setError('');
    setFormData({ name: '', email: '', password: '', role: 'candidate' });
  };

  const switchToLogin = (e) => {
    e.preventDefault();
    setIsLogin(true);
    setError('');
    setFormData({ name: '', email: '', password: '', role: 'candidate' });
  };

  return (
    <Container maxWidth="xs" margin="15px">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6, mt: 8 }}>
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

      <Box sx={{ mt: 4 }}>
        <Typography 
  variant="h5" 
  align="center" 
  gutterBottom 
  fontWeight={600}
  sx={{ 
    // Example: Changing font to a serif style (Georgia)
    fontFamily: 'Georgia, sans-serif', 
    fontSize: '1.6rem',
    fontWeight: 350, 
  }}
>
  {isLogin ? 'Log into your account' : 'Create your account'}
</Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name – only on register */}
          {!isLogin && (
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {/* Role – only on register */}
          {!isLogin && (
            <TextField
              select
              fullWidth
              label="Role"
              margin="normal"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="candidate">Candidate</option>
              <option value="hiring_manager">Hiring Manager</option>
              <option value="admin">Admin</option>
            </TextField>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, py: 1.5 }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        {/* Toggle Link */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          {isLogin ? (
            <Typography variant="body1">
              Don’t have an account?{' '}
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
      </Box>
    </Container>
  );
}