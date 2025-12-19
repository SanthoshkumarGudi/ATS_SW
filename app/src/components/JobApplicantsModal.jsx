// src/components/JobApplicantsModal.jsx
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
  Paper,
  LinearProgress,
} from "@mui/material";
import { Download, Person, Close, CalendarToday } from "@mui/icons-material";
import { useState } from "react";
import InterviewSchedulerModal from "./InterviewSchedulerModal";

export default function JobApplicantsModal({ open, onClose, applications = [] }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);

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

        <DialogContent dividers sx={{ bgcolor: "#f5f5f5" }}>
          <Stack spacing={3}>
            {applications.map((app) => {
              const jobSkills = app.job?.skills || [];
              const candidateSkills = app.parsedData?.skills || [];

              const matchedSkills = candidateSkills.filter((skill) =>
                jobSkills.some((jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase())
              );
              const missingSkills = jobSkills.filter(
                (jobSkill) => !candidateSkills.some((s) => s.toLowerCase() === jobSkill.toLowerCase())
              );

              return (
                <Paper
                  key={app._id}
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: app.parsedData?.isShortlisted ? "2px solid #4caf50" : "1px solid #e0e0e0",
                    bgcolor: "white",
                  }}
                >
                  {/* Header */}
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {app.parsedData?.name}
                      </Typography>
                      <Typography color="text.secondary">{app.parsedData?.email}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box ml="auto" textAlign="right">
                      <Chip
                        label={`${app.parsedData?.matchPercentage || 0}% Match`}
                        color={app.parsedData?.matchPercentage >= 70 ? "success" : "warning"}
                        size="small"
                      />
                      {app.parsedData?.isShortlisted && (
                        <Chip label="Shortlisted" color="success" size="small" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Cover Letter, Salary, Availability */}
                  {app.coverLetter && (
                    <Box mb={2}>
                      <Typography fontWeight="bold">Cover Letter:</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {app.coverLetter}
                      </Typography>
                    </Box>
                  )}

                  {app.expectedSalary && (
                    <Typography>
                      <strong>Expected Salary:</strong> {app.expectedSalary}
                    </Typography>
                  )}

                  {app.availability && (
                    <Typography>
                      <strong>Availability:</strong> {app.availability}
                    </Typography>
                  )}

                  {/* Skills Section */}
                  <Box mt={2}>
                    <Typography fontWeight="bold" gutterBottom>
                      Skills
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {/* Matched Skills → Solid */}
                      {matchedSkills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="contained"
                          sx={{ fontWeight: 600 }}
                        />
                      ))}

                      {/* Missing Skills → Outlined + Red */}
                      {missingSkills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{
                            border: "2px solid",
                            borderColor: "error.main",
                            color: "error.main",
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  <hr/>
                  {app.interview?.feedback && (
  <Box mt={3}>
    <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
      Interview Feedback
    </Typography>
    <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ minWidth: 120 }}>
      <strong>Interviewer: </strong>{app.interview.interviewer.name}
    </Typography>

    <Stack spacing={1.5}>
      {/* Recommendation - Highlighted Chip */}
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ minWidth: 120 }}>
          Recommendation:
        </Typography>
        <Chip
          label={app.interview.feedback.recommendation || "—"}
          size="small"
          color={
            app.interview.feedback.recommendation?.toLowerCase().includes("hire")
              ? "success"
              : app.interview.feedback.recommendation?.toLowerCase().includes("no")
              ? "error"
              : "default"
          }
          sx={{ fontWeight: "bold" }}
        />
      </Box>

      {/* Negotiated Salary */}
      {app.interview.feedback.negotiatedSalary && (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ minWidth: 120 }}>
            Salary:
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="success.main">
            ₹{app.interview.feedback.negotiatedSalary.toLocaleString("en-IN")}
          </Typography>
        </Box>
      )}

      {/* Notice Period */}
      {app.interview.feedback.noticePeriod && (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ minWidth: 120 }}>
            Notice Period:
          </Typography>
          <Typography variant="body1">
            {app.interview.feedback.noticePeriod}
          </Typography>
        </Box>
      )}

      {/* Notes - Collapsed by default for simplicity */}
      {app.interview.feedback.notes && (
        <Box>
          <Typography variant="body2" fontWeight="600" color="text.secondary" gutterBottom>
            Notes:
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              bgcolor: "#f0f0f0",
              p: 1.5,
              borderRadius: 1,
              fontStyle: "italic",
            }}
          >
            {app.interview.feedback.notes}
          </Typography>
        </Box>
      )}
    </Stack>
  </Box>
)}

                  {/* Schedule Interview Button */}
                  {app.parsedData?.isShortlisted && !app.interviews?.length && (
                    <Box mt={3}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CalendarToday />}
                        onClick={() => {
                          setSelectedApp(app);
                          setShowScheduler(true);
                        }}
                        disabled={app.status==='in-interview' || app.status === 'rejected' || !app.status==='shortlisted'}
                        
                      >
                        {!app.status==='applied' ? 'Interview Already Scheduled' : 'Schedule Interview'}
                      </Button>
                    </Box>
                  )}

                  {/* Download Resume */}
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
                  </Box>

                  {app.parsedData?.matchPercentage < 50 && (
                    <LinearProgress
                      variant="determinate"
                      value={app.parsedData.matchPercentage}
                      sx={{ mt: 2, borderRadius: 1 }}
                      color="warning"
                    />
                  )}
                </Paper>
              );
            })}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Scheduler Modal */}
      {selectedApp && (
        <InterviewSchedulerModal
          open={showScheduler}
          onClose={() => {
            setShowScheduler(false);
            setSelectedApp(null);
                        
          }}
          application={selectedApp}
        />
      )}
    </>
  );
}