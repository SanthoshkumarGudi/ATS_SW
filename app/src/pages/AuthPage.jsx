import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Tabs, Tab, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isLogin ? '/api/login' : '/api/register';
    try {
      const res = await axios.post(`http://localhost:5000${url}`, formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ATS System
        </Typography>

        <Tabs value={isLogin ? 0 : 1} onChange={(_, v) => setIsLogin(v === 0)} centered sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
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

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }}>
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>

        {/* Quick test accounts */}
        {isLogin && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Test Accounts (after first register):
            </Typography>
            <Typography variant="caption">
              Admin: admin@company.com<br/>
              Hiring Manager: manager@company.com<br/>
              Candidate: candidate@company.com<br/>
              Password: 123456
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}