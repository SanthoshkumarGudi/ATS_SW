// src/pages/InterviewerDashboard.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Alert,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Person,
  Email,
  Work,
  CalendarToday,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";
import axios from "axios";
import FeedbackFormModal from "../components/FeedbackFormModal";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewerDashboard() {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/interviews/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setInterviews(res.data));
  }, []);

  const openFeedback = (interview) => {
    setSelectedInterview(interview);
    setFeedbackOpen(true);
  };

  const getRoundChip = (round) => {
    const rounds = { 1: "info", 2: "info", 3: "info" };
    const labels = { 1: "1st Round", 2: "2nd Round", 3: "Final Round" };
    return (
      <Chip
        label={labels[round] || `${round}th Round`}
        color={rounds[round] || "default"}
        size="small"
        sx={{ fontWeight: "bold" }}
      />
    );
  };

  if (interviews.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="info">
          <Typography variant="h6">No interviews assigned yet</Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for scheduled interviews.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        My Interviews
      </Typography>

      <Stack spacing={3} sx={{ mt: 4 }}>
        {interviews.map((interview) => {
          const isCompleted = interview.status === "completed";

          return (
            <Card
              key={interview._id}
              elevation={4}
              sx={{
                borderRadius: 1,
                borderLeft: isCompleted ? "5px solid #4caf50" : "5px solid #1976d2",
              }}
            >
              <CardContent sx={{ py: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flexGrow: 1 }}>
                    {/* Round + Status */}
                    <Box sx={{ mb: 1.5 }}>
                      {getRoundChip(interview.round)}
                      <Chip
                        label={interview.status.toUpperCase()}
                        color={isCompleted ? "success" : "primary"}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>

                    {/* Candidate */}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                        {interview.application.parsedData.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {interview.application.parsedData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <Email sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                          {interview.application.parsedData.email}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Job & Time */}
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <Work sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                      {interview.application.job.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                      {new Date(interview.scheduledAt).toLocaleDateString()} at{" "}
                      {new Date(interview.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>

                  {/* Action */}
                  <Box sx={{ textAlign: "right" }}>
                    {isCompleted ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="Done"
                        color="success"
                        variant="outlined"
                      />
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<CheckCircle />}
                        onClick={() => openFeedback(interview)}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Give Feedback
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <FeedbackFormModal
        open={feedbackOpen}
        onClose={() => {
          setFeedbackOpen(false);
          setSelectedInterview(null);
          window.location.reload();
        }}
        interview={selectedInterview}
      />
    </Container>
  );
}