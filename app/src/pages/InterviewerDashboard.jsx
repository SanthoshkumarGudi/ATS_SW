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
} from "@mui/material";
import { CheckCircle, AccessTime, Person } from "@mui/icons-material";
import axios from "axios";
import FeedbackFormModal from "../components/FeedbackFormModal";

export default function InterviewerDashboard() {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/interviews/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setInterviews(res.data));
  }, []);

  const openFeedback = (interview) => {
    setSelectedInterview(interview);
    setFeedbackOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
        My Interviews
      </Typography>

      {interviews.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No interviews assigned yet. Check back later!
        </Alert>
      ) : (
        interviews.map((interview) => (
          <Card key={interview._id} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">
                    <Person /> {interview.application.candidate.name}
                  </Typography>
                  <Typography color="text.secondary">
                    Job: {interview.application.job.title}
                  </Typography>
                  <Typography>
                    <AccessTime />{" "}
                    {new Date(interview.scheduledAt).toLocaleString()}
                  </Typography>
                  <Chip
                    label={interview.status.toUpperCase()}
                    color={
                      interview.status === "completed" ? "success" : "primary"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box>
                  {interview.status === "completed" ? (
                    <Chip label="Feedback Submitted" color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircle />}
                      onClick={() => openFeedback(interview)}
                    >
                      Give Feedback
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <FeedbackFormModal
        open={feedbackOpen}
        onClose={() => {
          setFeedbackOpen(false);
          setSelectedInterview(null);
          // Refresh list
          window.location.reload();
        }}
        interview={selectedInterview}
      />
    </Container>
  );
}
