// frontend/src/pages/JobsList.jsx
import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Box, Chip, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoBackButton from '../GoBack';

export default function JobsList({ user }) {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/jobs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      const publishedJobs = res.data.filter(j => j.status === 'published');
      setJobs(publishedJobs);
    })
    .catch(err => {
      console.error(err);
      setError('Failed to load jobs. Please login again.');
    });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
        <GoBackButton/>
      <Typography variant="h3" gutterBottom>
        Open Positions
      </Typography>

      <Typography variant="h6" color="primary" gutterBottom>
        Welcome, {user?.name || user?.email} ({user?.role})
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={4} mt={4}>
        {jobs.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            No open positions right now. Check back later!
          </Typography>
        ) : (
          jobs.map(job => (
            <Card key={job._id} variant="outlined">
              <CardContent>
                <Typography variant="h5">{job.title}</Typography>
                <Typography color="text.secondary">
                  {job.department} • {job.location}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {job.skills?.map(skill => (
                    <Chip key={skill} label={skill} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                  <Chip label={job.clearanceLevel} color="primary" sx={{ ml: 1 }} />
                </Box>

                <div 
                  dangerouslySetInnerHTML={{ __html: job.description }} 
                  style={{ margin: '20px 0', opacity: 0.85 }}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(`/apply/${job._id}`)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
}