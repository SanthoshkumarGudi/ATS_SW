// src/pages/MyApplications.jsx
import { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Chip, Box, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { AccessTime, Person, Schedule, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For the modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, [user]);

  console.log("apps data are ", apps);
  

  // Fetch interview for specific application
  const handleViewInterview = async (applicationId) => {
    setModalLoading(true);
    setOpenModal(true);
    try {
      console.log("inside handleViewInterview app id is ",applicationId);
      
      const res = await axios.get(`http://localhost:5000/api/interviews/application/${applicationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedInterview(res.data);
    } catch (err) {
      console.error('Error fetching interview:', err);
      alert('No interview scheduled yet or error loading details');
      setOpenModal(false);
    } finally {
      setModalLoading(false);
    }
  };

    // console.log("feedback details are ", selectedInterview.feedback.recommendation);

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your applications...</Typography>
      </Container>
    );
  }

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

  return (
    <Container sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        My Applications
      </Typography>

      <Box sx={{ mt: 4 }}>
        {apps.map((app) => (
          <Card key={app._id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800}>
                {app.job?.title || 'Job Title Unavailable'}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={app.status?.toUpperCase() || 'PENDING'}
                  color={app.parsedData?.isShortlisted ? 'success' : 'default'}
                  size="small"
                />
                <Chip
                  label={`${app.parsedData?.matchPercentage || 0}% Match`}
                  variant="outlined"
                  size="small"
                />
              </Box>

              {app.status!=='rejected' && app.parsedData?.isShortlisted && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Congratulations! You have been shortlisted!
                </Alert>
              )}
              {/* {selectedInterview.feedback.recommendation==='reject'&& <p>Thanks for applying after careful examination we are not continuing with your application</p>} */}

              {/* Show button only if interview is scheduled */}
              {app.status && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Schedule />}
                    onClick={() => handleViewInterview(app._id)}
                    sx={{ borderRadius: 2 }}
                  >
                    View Interview Details
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Interview Details Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Interview Details</DialogTitle>
        {modalLoading ? (
          <DialogContent><CircularProgress /></DialogContent>
        ) : selectedInterview ? (
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Job:</strong> {selectedInterview.application?.job?.title}</Typography>
              <Typography><Person /> <strong>Interviewer:</strong> {selectedInterview.interviewer?.name || 'Not assigned'}</Typography>
              <Typography><AccessTime /> <strong>Date & Time:</strong> {new Date(selectedInterview.scheduledAt).toLocaleString()}</Typography>
              <Typography><strong>Round:</strong> {selectedInterview.round || 1}</Typography>
              {selectedInterview.feedback?.recommendation==='reject'&&(
                <Typography>You have been rejected</Typography>
              )}
              <Chip
                icon={<CheckCircle />}
                label={selectedInterview.status === 'completed' ? 'Completed' : 'Scheduled'}
                color={selectedInterview.status === 'completed' ? 'success' : 'primary'}
              />
            </Box>
          </DialogContent>
        ) : (
          <DialogContent>No interview scheduled yet.</DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}