// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Button, Container, Typography, Card, CardContent, Chip, Stack, Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoBackButton from '../GoBack';
import JobApplicantsModal from '../components/JobApplicantsModal';

export default function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [loadingApps, setLoadingApps] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setJobs(res.data));
  }, []);

  const fetchApplicationsForJob = async (jobId) => {
    setLoadingApps(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedJobApps(res.data);
    } catch (err) {
      alert('Failed to load applicants');
    } finally {
      setLoadingApps(false);
    }
  };

  return (
    <Container>
      {/* <GoBackButton /> */}
      <Typography variant="h3" gutterBottom>Job Dashboard</Typography>
      <Typography>Welcome, {user.email} ({user.role})</Typography>

      {['admin', 'hiring_manager'].includes(user.role) && (
        <Button variant="contained" size="large" sx={{ my: 3 }} onClick={() => navigate('/create-job')}>
          + Create New Job
        </Button>
      )}

      <Stack spacing={3}>
        {jobs.map(job => (
          <Card key={job._id}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h5">{job.title}</Typography>
                  <Typography color="text.secondary">{job.department} • {job.location}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: job.description.substring(0, 200) + '...' }} />
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {job.skills?.slice(0, 5).map(skill => <Chip key={skill} label={skill} size="small" />)}
                  </Stack>
                  <Chip label={job.clearanceLevel} color="primary" size="small" sx={{ mt: 1 }} />
                </Box>

                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => fetchApplicationsForJob(job._id)}
                  sx={{ minWidth: 180 }}
                >
                  View Applicants →
                </Button>

                <Button
    variant="contained"
    color="primary"
    size="small"
    onClick={() => navigate(`/job/edit/${job._id}`)}
  >
    Edit
  </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <JobApplicantsModal
        open={!!selectedJobApps}
        onClose={() => setSelectedJobApps(null)}
        applications={selectedJobApps || []}
      />
    </Container>
  );
}