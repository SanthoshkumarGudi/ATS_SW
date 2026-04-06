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
  Button,
} from "@mui/material";
import {
  People,
  AccessTime,
  CheckCircle,
  Cancel,
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
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState("total");

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

        const data = Array.isArray(response.data) ? response.data : [];
        setInterviews(data);
        setFilteredInterviews(data);        // Show all by default

        // Calculate Stats
        const total = data.length;
        const upcoming = data.filter((i) => i.scheduledAt && new Date(i.scheduledAt) > new Date()).length;
        const completed = data.filter((i) => i.feedback?.rating).length;
        const canceled = data.filter((i) => 
          i.application?.status === "rejected" || 
          i.status === "canceled" || 
          i.status === "cancelled"
        ).length;
        const scheduled = total - completed - canceled;

        const rated = data.filter((i) => typeof i.feedback?.rating === "number");
        const avgRating = rated.length > 0 
          ? (rated.reduce((sum, i) => sum + i.feedback.rating, 0) / rated.length).toFixed(1) 
          : 0;

        setStats({ totalInterviews: total, upcoming, scheduled, completed, canceled, avgRating: parseFloat(avgRating) });
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError(
          err.response?.status === 404
            ? "Interview endpoint not found. Please add GET /api/interviews route in backend."
            : "Failed to load interview analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, []);

  const showIntDetails = (param) => {
    setActiveFilter(param);
    setShowDetails(true);

    let filtered = [];

    if (param === "total") {
      filtered = [...interviews];
    } else if (param === "upcoming") {
      filtered = interviews.filter((i) => i.scheduledAt && new Date(i.scheduledAt) > new Date() && i.application?.status!== "rejected" && i.application?.status!== "offered" && i.application?.status!== "on-hold"  );
    } else if (param === "completed") {
      filtered = interviews.filter((i) => i.application?.status === "offered" || i.application?.status === "on-hold" || i.application?.status==='rejected');
    } else if (param === "canceled") {
      filtered = interviews.filter((i) => 
        i.application?.status === "rejected" || 
        i.status === "canceled" || 
        i.status === "cancelled"
      );
    }

    setFilteredInterviews(filtered);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress size={70} />
        <Typography sx={{ mt: 3 }}>Loading Interview Analytics...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Interview Analytics
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: "Total Interviews", value: stats.totalInterviews, icon: People, color: "#1976d2", param: "total" },
          { label: "Upcoming", value: stats.upcoming, icon: AccessTime, color: "#ed6c02", param: "upcoming" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "#2e7d32", param: "completed" },
          { label: "Canceled", value: stats.canceled, icon: Cancel, color: "#d32f2f", param: "canceled" },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.param}>
            <Card sx={{ height: "100%", cursor: "pointer" }} onClick={() => showIntDetails(item.param)}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <item.icon sx={{ fontSize: 45, color: item.color }} />
                  <Box>
                    <Typography variant="h3" fontWeight="bold">{item.value}</Typography>
                    <Typography color="text.secondary">{item.label}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Interview Details Table */}
      {showDetails && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {activeFilter === "total" ? "All Interviews" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Interviews`}
          </Typography>

          <Paper sx={{ overflow: "auto", maxHeight: 500 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Candidate</th>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Job Title</th>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Interviewer</th>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Scheduled At</th>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Status</th>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.map((intv) => (
                  <tr key={intv._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>{intv.application?.parsedData?.name || "N/A"}</td>
                    <td style={{ padding: 12 }}>{intv.application?.job?.title || "N/A"}</td>
                    <td style={{ padding: 12 }}>{intv.interviewer?.name || "N/A"}</td>
                    <td style={{ padding: 12 }}>
                      {intv.scheduledAt ? new Date(intv.scheduledAt).toLocaleString() : "N/A"}
                    </td>
                    <td style={{ padding: 12 }}>{intv.application?.status}</td>
                    <td style={{ padding: 12 }}>{intv.feedback?.rating || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Box>
      )}
    </Container>
  );
}