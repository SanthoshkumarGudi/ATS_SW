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

export default function JobApplicantsModal({
  open,
  onClose,
  applications = [],
}) {
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
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
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
                jobSkills.some(
                  (jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase()
                )
              );
              const missingSkills = jobSkills.filter(
                (jobSkill) =>
                  !candidateSkills.some(
                    (s) => s.toLowerCase() === jobSkill.toLowerCase()
                  )
              );

              return (
                <Paper
                  key={app._id}
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: app.parsedData?.isShortlisted
                      ? "2px solid #4caf50"
                      : "1px solid #e0e0e0",
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
                      <Typography color="text.secondary">
                        {app.parsedData?.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applied on:{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box ml="auto" textAlign="right">
                      <Chip
                        label={`${app.parsedData?.matchPercentage || 0}% Match`}
                        color={
                          app.parsedData?.matchPercentage >= 70
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                      {app.parsedData?.isShortlisted && (
                        <Chip
                          label="Shortlisted"
                          color="success"
                          size="small"
                          sx={{ ml: 1 }}
                        />
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
                  <hr />
               {/* Multiple Interview Feedback Section */}
{app.interview[0]?.feedback && app.interview.length > 0 && (
  <Box mt={4}>
    <Typography
      variant="h6"
      fontWeight="bold"
      color="primary"
      gutterBottom
      sx={{ borderBottom: "2px solid #1976d2", pb: 1 }}
    >
      Interview Feedback ({app.interview.length} Round{app.interview.length > 1 ? "s" : ""})
    </Typography>

    <Stack spacing={3}>
      {app.interview
        .sort((a, b) => a.round - b.round) // Show in order: Round 1 → 2 → 3
        .map((interview, index) => {
          const feedback = interview.feedback;
          if (!feedback) return null;

          const isHire = feedback.recommendation === "hire";
          const isNext = feedback.recommendation === "next-round";
          const isReject = feedback.recommendation === "reject";

          return (
            <Paper
              key={interview._id}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                borderLeft: isHire
                  ? "5px solid #4caf50"
                  : isNext
                  ? "5px solid #4caf50"
                  : isReject
                  ? "5px solid #f44336"
                  : "5px solid #9e9e9e",
              }}
            >
              <Stack spacing={2}>
                {/* Round Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Round {interview.round} - {interview.interviewer?.name || "Interviewer"}
                  </Typography>
                  <Chip
                    label={feedback.recommendation?.replace("-", " ").toUpperCase() || "PENDING"}
                    size="small"
                    color={
                      isHire ? "success" :
                      isNext ? "warning" :
                      isReject ? "error" :
                      "default"
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                {/* Salary & Notice */}
                {(feedback.negotiatedSalary || feedback.noticePeriod) && (
                  <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
                    {feedback.negotiatedSalary && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight="600" color="text.secondary">
                          Negotiated Salary:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ₹{parseInt(feedback.negotiatedSalary).toLocaleString("en-IN")}
                        </Typography>
                      </Box>
                    )}
                    {feedback.noticePeriod && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight="600" color="text.secondary">
                          Notice Period:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {feedback.noticePeriod}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}

                {/* Notes */}
                {feedback.notes && (
                  <Box>
                    <Typography variant="body2" fontWeight="600" color="text.secondary" gutterBottom>
                      Interviewer Notes:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        bgcolor: "#f5f5f5",
                        p: 2,
                        borderRadius: 1,
                        fontStyle: "italic",
                        borderLeft: "4px solid #1976d2",
                      }}
                    >
                      {feedback.notes}
                    </Typography>
                  </Box>
                )}

                {/* Rating (optional) */}
                {feedback.rating && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="600" color="text.secondary">
                      Rating:
                    </Typography>
                    <Box>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < feedback.rating ? "#ffb400" : "#e0e0e0" }}>
                          ★
                        </span>
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>
          );
        })}
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
                        disabled={
                          app.status === "in-interview" ||
                          app.status === "rejected" ||
                          !app.status === "shortlisted"
                        }
                      >
                        {!app.status === "applied"
                          ? "Interview Already Scheduled"
                          : "Schedule Interview"}
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
