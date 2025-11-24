// frontend/src/components/JobApplicantsModal.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Avatar, Stack, Divider, LinearProgress
} from '@mui/material';
import { Download, Person, Close } from '@mui/icons-material';
import MyProfileModal from './MyProfileModal';
import { useState } from 'react';

export default function JobApplicantsModal({ open, onClose, applications = [] }) {
  const [selectedProfile, setSelectedProfile] = useState(null);

  if (applications.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>No Applications Yet</DialogTitle>
        <DialogContent>
          <Typography>No candidates have applied to this job.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              Applicants ({applications.length})
            </Typography>
            <Button onClick={onClose} startIcon={<Close />}>Close</Button>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent dividers sx={{ bgcolor: '#fafafa' }}>
          <Stack spacing={3}>
            {applications.map((app) => (
              <Box
                key={app._id}
                sx={{
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: 1,
                  borderLeft: app.parsedData?.isShortlisted ? '5px solid #4caf50' : '5px solid transparent'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" gap={2}>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {app.parsedData?.name || 'Unknown'}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {app.parsedData?.email || 'No email'}
                      </Typography>
                      <Typography variant="caption" color="gray">
                        Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box textAlign="right">
                    <Chip
                      label={`${app.parsedData?.matchPercentage || 0}% Match`}
                      color={app.parsedData?.matchPercentage >= 70 ? 'success' : 'default'}
                      size="small"
                    />
                    {app.parsedData?.isShortlisted && (
                      <Chip label="Shortlisted" color="success" size="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                  {app.parsedData?.matchedSkills?.map(skill => (
                    <Chip key={skill} label={skill} color="primary" size="small" />
                  ))}
                  {app.parsedData?.missingSkills?.map(skill => (
                    <Chip key={skill} label={skill} variant="outlined" color="error" size="small" />
                  ))}
                </Stack>

                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    href={app.resumeUrl}
                    target="_blank"
                  >
                    Resume
                  </Button>
                  {app.candidateProfile && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setSelectedProfile(app.candidateProfile)}
                    >
                      View Full Profile
                    </Button>
                  )}
                </Box>

                {app.parsedData?.matchPercentage < 50 && (
                  <LinearProgress variant="determinate" value={app.parsedData.matchPercentage} sx={{ mt: 2 }} color="warning" />
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Re-use your beautiful profile modal */}
      <MyProfileModal
        open={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        profile={selectedProfile}
      />
    </>
  );
}