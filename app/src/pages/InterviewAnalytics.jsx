// src/pages/InterviewAnalytics.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CalendarToday,
  People,
  CheckCircle,
  Cancel,
  AccessTime,
  Star,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewAnalytics() {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    upcoming: 0,
    scheduled: 0,
    completed: 0,
    canceled: 0,
    avgRating: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/interviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const interviews = Array.isArray(response.data) ? response.data : [];

        // Calculate Statistics
        const total = interviews.length;
        const upcoming = interviews.filter(
          (i) => i.scheduledAt && new Date(i.scheduledAt) > new Date(),
        ).length;

        const completed = interviews.filter(
          (i) => i.feedback && i.feedback.rating,
        ).length;

        const canceled = interviews.filter(
          (i) =>
            i.application?.status === "rejected"
        ).length;

        const scheduled = total - completed - canceled;

        // Average Rating
        const ratedInterviews = interviews.filter(
          (i) => i.feedback?.rating && typeof i.feedback.rating === "number",
        );

        const avgRating =
          ratedInterviews.length > 0
            ? (
                ratedInterviews.reduce((sum, i) => sum + i.feedback.rating, 0) /
                ratedInterviews.length
              ).toFixed(1)
            : 0;

        setStats({
          totalInterviews: total,
          upcoming,
          scheduled,
          completed,
          canceled,
          avgRating: parseFloat(avgRating),
        });
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError(
          err.response?.status === 404
            ? "Interview endpoint not found. Please check your backend routes."
            : "Failed to load interview analytics. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress size={70} />
        <Typography sx={{ mt: 3, fontSize: "1.1rem" }}>
          Loading Interview Analytics...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography color="text.secondary">
          Make sure you have added the GET /api/interviews route in your
          backend.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Interview Analytics
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>
        Complete overview of all interview activities
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <People sx={{ fontSize: 45, color: "#1976d2" }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.totalInterviews}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Interviews
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AccessTime sx={{ fontSize: 45, color: "#ed6c02" }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.upcoming}
                  </Typography>
                  <Typography color="text.secondary">Upcoming</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle sx={{ fontSize: 45, color: "#2e7d32" }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.completed}
                  </Typography>
                  <Typography color="text.secondary">Completed</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Cancel sx={{ fontSize: 45, color: "#d32f2f" }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.canceled}
                  </Typography>
                  <Typography color="text.secondary">Canceled</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Average Rating Card */}
      {/* <Paper sx={{ p: 5, textAlign: "center", maxWidth: 500, mx: "auto" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Average Feedback Rating
        </Typography>
        <Typography variant="h2" fontWeight="bold" color="primary" sx={{ my: 2 }}>
          {stats.avgRating} <Star sx={{ fontSize: 40, verticalAlign: "middle", color: "#ffb400" }} />
        </Typography>
        <Typography color="text.secondary">
          Based on {stats.completed} completed interviews
        </Typography>
      </Paper> */}

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          More detailed analytics (charts, per-job breakdown, conversion rates)
          can be added later.
        </Typography>
      </Box>
    </Container>
  );
}
