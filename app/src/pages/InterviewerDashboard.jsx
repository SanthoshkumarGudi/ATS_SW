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
  CircularProgress,
} from "@mui/material";
import { Email, Work, CalendarToday, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import FeedbackFormModal from "../components/FeedbackFormModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewerDashboard() {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch interviews
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/interviews/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setInterviews(res.data);
        setFilteredInterviews(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 🔥 Filter logic
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredInterviews(interviews);
    } else {
      setFilteredInterviews(
        interviews.filter((i) => i.status === activeFilter),
      );
    }
  }, [activeFilter, interviews]);

  const openFeedback = (interview) => {
    setSelectedInterview(interview);
    setFeedbackOpen(true);
  };

  // 🔥 Status colors
  const statusColors = {
    scheduled: "info",
    completed: "success",
    "on-hold": "warning",
    rejected: "error",
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Completed", value: "completed" },
    { label: "On Hold", value: "on-hold" },
    { label: "Rejected", value: "rejected" },
  ];

  // 🔥 Loading state
  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
        <Typography mt={2}>Loading interviews...</Typography>
      </Container>
    );
  }

  // 🔥 Empty state
  if (interviews.length === 0) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="info">
          <Typography variant="h6">No interviews assigned yet</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/*  Header + Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          Interviewer Dashboard
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {filters.map((f) => {
            const isActive = activeFilter === f.value;

            return (
              <Button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                variant={isActive ? "contained" : "outlined"}
                sx={{
                  borderRadius: "25px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  ...(isActive && {
                    backgroundColor: "#4f6657",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }),
                }}
              >
                {f.label}
              </Button>
            );
          })}
        </Stack>
      </Stack>

      {/*  Interview Cards */}
      <Stack spacing={3}>
        {filteredInterviews.map((interview) => {
          const isCompleted = interview.status === "completed";

          return (
            <Card
              key={interview._id}
              elevation={3}
              sx={{
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-3px)" },
                borderLeft: `6px solid ${
                  statusColors[interview.status] === "success"
                    ? "#4caf50"
                    : "#1976d2"
                }`,
              }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  {/* LEFT */}
                  <Box flex={1}>
                    {/* Status */}
                    <Stack direction="row" spacing={1} mb={1}>
                      <Chip
                        label={interview.status.toUpperCase()}
                        color={statusColors[interview.status]}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Stack>

                    {/* Candidate */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {interview.application.parsedData.name[0]}
                      </Avatar>

                      <Box>
                        <Typography fontWeight="bold">
                          {interview.application.parsedData.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          <Email sx={{ fontSize: 14, mr: 0.5 }} />
                          {interview.application.parsedData.email}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Job */}
                    <Typography mt={1}>
                      <Work sx={{ fontSize: 16, mr: 1 }} />
                      {interview.application.job.title}
                    </Typography>

                    {/* Time */}
                    <Typography variant="body2" color="text.secondary">
                      <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                      {new Date(
                        interview.scheduledAt,
                      ).toLocaleDateString()} •{" "}
                      {new Date(interview.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>

                  {/* RIGHT ACTION */}
                  <Box alignSelf="center">
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
                        onClick={() => openFeedback(interview)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          px: 3,
                        }}
                      >
                        Give Feedback
                      </Button>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/*  No filter result */}
      {filteredInterviews.length === 0 && (
        <Alert sx={{ mt: 4 }} severity="info">
          No interviews found for this filter
        </Alert>
      )}

      <FeedbackFormModal
        open={feedbackOpen}
        interview={selectedInterview}
        onClose={() => {
          setFeedbackOpen(false);
          setSelectedInterview(null);
        }}
      />
    </Container>
  );
}
