// frontend/src/pages/MyApplications.jsx
import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Chip, Box } from '@mui/material';
import axios from 'axios';

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/applications/my', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setApps(res.data))
    .catch(() => alert('Error loading your applications'));
  }, []);

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>My Applications</Typography>

      {apps.map(app => (
        <Card key={app._id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">{app.job.title}</Typography>
            <Typography color="text.secondary">
              {app.job.department} • {new Date(app.appliedAt).toLocaleDateString()}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Chip
                label={app.status.toUpperCase()}
                color={app.parsedData?.isShortlisted ? 'success' : 'default'}
              />
              <Chip label={`${app.parsedData?.matchPercentage || 0}% Match`} sx={{ ml: 1 }} />
            </Box>

            {app.parsedData?.isShortlisted && (
              <Typography color="success.main" sx={{ mt: 2, fontWeight: 'bold' }}>
                Congratulations! You have been shortlisted!
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}