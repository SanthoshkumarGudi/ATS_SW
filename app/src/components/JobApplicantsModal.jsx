// frontend/src/components/JobApplicantsModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  Paper,
} from "@mui/material";
import { Download, Person, Close } from "@mui/icons-material";
import MyProfileModal from "./MyProfileModal";
import { useState } from "react";

export default function JobApplicantsModal({ open, onClose, applications = [] }) {
  const [selectedProfile, setSelectedProfile] = useState(null);

  if (applications.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>No Applications Yet</DialogTitle>
        <DialogContent>
          <Typography>No candidates have applied for this job.</Typography>
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
        {/* Header */}
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Applicants ({applications.length})
            </Typography>
            <Button onClick={onClose} startIcon={<Close />} color="error">
              Close
            </Button>
          </Box>
        </DialogTitle>

        <Divider />

        {/* Content */}
        <DialogContent dividers sx={{ bgcolor: "#f5f5f5" }}>
          <Stack spacing={3}>
            {applications.map((app) => (
              <Paper
                key={app._id}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  borderLeft: app.parsedData?.isShortlisted
                    ? "6px solid #4caf50"
                    : "6px solid transparent",
                }}
              >
                {/* Top Row */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                      <Person />
                    </Avatar>

                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {app.parsedData?.name || "Unknown"}
                      </Typography>

                      <Typography color="text.secondary" variant="body2">
                        {app.parsedData?.email || "No email"}
                      </Typography>

                      <Typography variant="caption" color="gray">
                        Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Right chips */}
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`${app.parsedData?.matchPercentage || 0}% Match`}
                      color={app.parsedData?.matchPercentage >= 70 ? "success" : "default"}
                      size="small"
                    />

                    {app.parsedData?.isShortlisted && (
                      <Chip label="Shortlisted" color="success" size="small" />
                    )}
                  </Stack>
                </Box>

                {/* Details Section */}
                <Box mt={2} ml={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Cover Letter:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {app.coverLetter || "—"}
                  </Typography>

                  <Typography variant="subtitle2" fontWeight="bold">
                    Expected Salary:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {app.expectedSalary || "—"}
                  </Typography>

                  <Typography variant="subtitle2" fontWeight="bold">
                    Availability:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.availability || "—"}
                  </Typography>
                </Box>

                {/* Skill Section */}
                <Box mt={2}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Skills:
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" spacing={1} gap={1}>
                    {(app.parsedData?.matchedSkills || []).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="primary"
                        size="small"
                        variant="filled"
                      />
                    ))}

                    {(app.parsedData?.missingSkills || []).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        variant="outlined"
                        color="error"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Footer buttons */}
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    href={app.resumeUrl}
                    target="_blank"
                  >
                    Download Resume
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

                {/* Low Match Progress */}
                {app.parsedData?.matchPercentage < 50 && (
                  <LinearProgress
                    variant="determinate"
                    value={app.parsedData.matchPercentage}
                    sx={{ mt: 2, borderRadius: 1 }}
                    color="warning"
                  />
                )}
              </Paper>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <MyProfileModal
        open={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        profile={selectedProfile}
      />
    </>
  );
}
