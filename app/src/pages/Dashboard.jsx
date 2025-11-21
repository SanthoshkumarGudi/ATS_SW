import { useEffect, useState } from 'react';
import { Button, Container, Typography, Card, CardContent, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoBackButton from '../GoBack';

export default function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setJobs(res.data));
  }, []);

  return (
    <Container>
       <GoBackButton/>
      <Typography variant="h3" gutterBottom>Job Dashboard</Typography>
      <Typography color='black'>Welcome, {user. name} ({user.role})</Typography>

      {['admin', 'hiring_manager'].includes(user.role) && (
        <Button variant="contained" size="large" sx={{ my: 3 }} onClick={() => navigate('/create-job')}>
          + Create New Job
        </Button>
      )}

      <Stack spacing={3}>
        {jobs.map(job => (
          <Card key={job._id}>
            <CardContent>
              <Typography variant="h5">{job.title}</Typography>
              <Typography color="text.secondary">{job.department} • {job.location}</Typography>
              <div dangerouslySetInnerHTML={{ __html: job.description.substring(0, 200) + '...' }} />
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {job.skills?.slice(0, 5).map(skill => <Chip key={skill} label={skill} size="small" />)}
              </Stack>
              <Chip label={job.clearanceLevel} color="primary" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}