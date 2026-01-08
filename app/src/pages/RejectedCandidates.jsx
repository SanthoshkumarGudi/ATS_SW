// src/pages/RejectedCandidates.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import { Download, Person } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RejectedCandidates() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in or not authorized role, stop loading
    if (!user || !["admin", "hiring_manager"].includes(user.role)) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/interviews/rejected`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load rejected candidates");
        setLoading(false);
      });
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <Typography align="center" sx={{ mt: 8 }}>
        Loading...
      </Typography>
    );
  }

  // Unauthorized access
  if (!user || !["admin", "hiring_manager"].includes(user.role)) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" color="error" align="center">
          You are not authorized to view this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        align="center"
        gutterBottom
        color="error.main"
      >
        Rejected Candidates
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        Candidates who received a "Reject" recommendation
      </Typography>

      {applications.length === 0 ? (
        <Typography align="center" sx={{ mt: 8, fontStyle: "italic" }}>
          No rejected candidates yet.
        </Typography>
      ) : (
        applications.map((app) => (
          <Card key={app._id} sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {app.candidate?.name || "Unknown"}
                      </Typography>
                      <Typography color="text.secondary">
                        {app.candidate?.email || "No email"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{ textAlign: { xs: "left", md: "right" } }}
                >
                  <Chip label="REJECTED" color="error" />
                </Grid>
              </Grid>

              <Typography variant="body1" fontWeight="600" sx={{ mt: 2 }}>
                Applied for: {app.job?.title || "Unknown Job"} (
                {app.job?.department || "N/A"})
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
              </Typography>
              <Typography>Feedback Details</Typography>
              <Typography>
                <strong>Ratings: </strong>
                {app.feedback.rating}
              </Typography>
              <Typography>
                <strong>Overview: </strong>
                {app.feedback.notes}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  href={app.resumeUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={!app.resumeUrl}
                >
                  Download Resume
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
