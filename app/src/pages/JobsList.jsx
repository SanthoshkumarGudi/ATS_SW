// frontend/src/pages/JobsList.jsx
import { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Button, Box, Chip, Stack, Alert, Tooltip, IconButton, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoBackButton from '../GoBack';
import MyProfileModal from '../components/MyProfileModal';
import { AccountCircle } from '@mui/icons-material';    

export default function JobsList({ user }) {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set()); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    // ... (rest of the useEffect logic remains the same)
    const token = localStorage.getItem('token');

    const fetchJobsAndApplications = async () => {
      try {
        // 1. Fetch all published jobs
        const jobsRes = await axios.get('http://localhost:5000/api/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const publishedJobs = jobsRes.data.filter(j => j.status === 'published');

        // 2. Fetch user's applications to know which jobs they applied to
        const appsRes = await axios.get('http://localhost:5000/api/applications/my', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Extract job IDs from applications
        const appliedIds = new Set(appsRes.data.map(app => app.job._id));

        setJobs(publishedJobs);
        setAppliedJobIds(appliedIds);

        // Fetch candidate profile
        const profileRes = await axios.get('http://localhost:5000/api/candidate/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);  
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs or applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndApplications();
  }, []);

  const hasApplied = (jobId) => appliedJobIds.has(jobId);

  return (
    <Container sx={{ mt: 4 }}>
      {/* NEW: Header Box using Flexbox to place profile icon at the top right. 
      */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
      >
        {/* Left Side: Go Back Button and Main Title */}
        <Box>
          <GoBackButton />
          <Typography variant="h3" gutterBottom sx={{ mt: 1 }}>
            Open Positions
          </Typography>
        </Box>

        {/* Right Side: Profile Button */}
        <Tooltip title="View Profile">
          <IconButton onClick={() => setOpenProfile(true)} size="large">
            <Avatar sx={{ bgcolor: '#4f46e5', width: 48, height: 48 }}>
              <AccountCircle sx={{ fontSize: 36 }} />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* The rest of the content follows */}
      <MyProfileModal/> 

      <Typography variant="h6" color="textPrimary" gutterBottom>
        Welcome, {user?.name || user?.email} ({user?.role})
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <Typography>Loading jobs...</Typography>}

      <Stack spacing={4} mt={4}>
        {jobs.length === 0 && !loading ? (
          <Typography variant="h6" color="text.secondary">
            No open positions right now. Check back later!
          </Typography>
        ) : (
          jobs.map(job => {
            const applied = hasApplied(job._id);

            return (
              <Card key={job._id} variant="outlined">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    
       
      </Box>  
                <CardContent>
                  <Typography variant="h5">{job.title}</Typography>
                  <Typography color="text.secondary">
                    {job.department} • {job.location}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {job.skills?.map(skill => (
                      <Chip key={skill} label={skill} size="small" sx={{ mr: 1, mb: 1 }} />
                    ))}
                    {/* <Chip label={job.clearanceLevel} color="primary" sx={{ ml: 1 }} /> */}      
                  </Box>

                  <div
                    dangerouslySetInnerHTML={{ __html: job.description }}
                    style={{ margin: '20px 0', opacity: 0.85 }}
                  />

                  {/* Conditional Button */}
                  {applied ? (
                    <Button
                      variant="contained"
                      size="large"
                      disabled
                      sx={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        '&:hover': { backgroundColor: '#059669' },
                        cursor: 'default'
                      }}
                    >
                      Already Applied
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate(`/apply/${job._id}`)}
                      sx={{
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
                      }}
                    >
                      Apply Now 
                    </Button> 
                  )}
                </CardContent>
                <MyProfileModal open={openProfile} onClose={() => setOpenProfile(false)} profile={profile} />
              </Card>
            );
          })
        )}
      </Stack>
    </Container>      
  );
}