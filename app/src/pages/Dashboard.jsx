// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobApplicantsModal from '../components/JobApplicantsModal';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const {user}= useAuth();
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
      console.log("inside fetching applications for selected job");
      
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
        Job Dashboard
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, <strong>{user.name || user.email}</strong> ({user.role})
      </Typography>

      {['admin', 'hiring_manager'].includes(user.role) && (
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/create-job')}
          sx={{
            mb: 5,
            py: 1.8,
            px: 4,
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: 3,
            textTransform: 'none'
          }}
        >
          + Create New Job Posting
        </Button>
      )}

      <Stack spacing={4}>
        {jobs.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc' }}>
            <Typography variant="h6" color="text.secondary">
              No jobs posted yet. 
            </Typography>
          </Card>
        ) : (
          jobs.map(job => (
            <Card
              key={job._id}
              elevation={3}
              sx={{
                borderRadius: 3,
                transition: '0.3s',
                '&:hover': { boxShadow: 8 }
              }}
            >
              <CardContent sx={{ pb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={3}>
                  {/* Left: Job Details */}
                  <Box flex={1}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {job.department} • {job.location || 'Remote'}
                    </Typography>

                    <Box
                      dangerouslySetInnerHTML={{ __html: job.description.substring(0, 250) + '...' }}
                      sx={{ color: 'text.secondary', fontSize: '0.95rem', lineHeight: 1.6, mb: 2 }}
                    />

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2, mb: 1 }}>
                      {job.skills?.slice(0, 7).map(skill => (
                        <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                      ))}
                      {job.skills?.length > 7 && (
                        <Chip label={`+${job.skills.length - 7} more`} size="small" />
                      )}
                    </Stack>

                    {/* <Chip
                      label={job.clearanceLevel}
                      color={job.clearanceLevel === 'Top Secret' ? 'error' : 'warning'}
                      size="small"
                      sx={{ mt: 1, fontWeight: 600 }}
                    /> */}
                  </Box>

                  {/* Right: Action Buttons (Perfectly Aligned) */}
                  <Box display="flex" flexDirection="column" gap={2} alignItems="flex-end">
                    <Button
                      variant="contained"
                      startIcon={<PeopleIcon />}
                      onClick={() => fetchApplicationsForJob(job._id)}
                      sx={{
                        minWidth: 190,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        boxShadow: 2
                      }}
                    >
                      View Applicants
                    </Button>

                    <Tooltip title="Edit Job Posting">
                      <IconButton
                        onClick={() => navigate(`/job/edit/${job._id}`)}
                        color="primary"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                          boxShadow: 2
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      <JobApplicantsModal
        open={!!selectedJobApps}
        onClose={() => setSelectedJobApps(null)}
        applications={selectedJobApps || []}
        loading={loadingApps}
      />
    </Container>
  );
}