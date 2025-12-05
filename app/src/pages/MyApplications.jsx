// frontend/src/pages/MyApplications.jsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMyApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/applications/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setApps(res.data || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        // Optional: show toast
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();

    // Refresh when user focuses tab (e.g. after applying in another tab)
    window.addEventListener('focus', fetchMyApplications);
    return () => window.removeEventListener('focus', fetchMyApplications);
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your applications...</Typography>
      </Container>
    );
  }

  // No applications yet
  if (apps.length === 0) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No applications yet
        </Typography>
        <Typography color="text.secondary">
          When you apply to jobs, they'll appear here.
        </Typography>
      </Container>
    );
  }

  // Has applications → show them
  return (
    <Container sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        My Applications
      </Typography>

      <Box sx={{ mt: 4 }}>
        {apps.map((app => (
          <Card
            key={app._id}
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 8px 25px rgba(156,175,136,0.12)',
              border: '1px solid rgba(156,175,136,0.2)',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={800}>
                {app.job?.title || 'Job Title Unavailable'}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {app.job?.department || 'Unknown'} •{' '}
                {new Date(app.appliedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={app.status?.toUpperCase() || 'PENDING'}
                  color={app.parsedData?.isShortlisted ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`${app.parsedData?.matchPercentage || 0}% Match`}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>

              {app.parsedData?.isShortlisted && (
                <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                  <Typography fontWeight="bold">
                    Congratulations! You have been shortlisted!
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        )))}
      </Box>
    </Container>
  )};