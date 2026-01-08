import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  Button,
  Divider,
  Stack,
  Paper,
  Grid,
} from "@mui/material";
import { CheckCircle, Cancel, Download, Person } from "@mui/icons-material";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ApplicantsDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/applications/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setApplications(res.data))
      .catch(() => alert("Failed to load applicants"));
  }, []);

  const shortlisted = applications.filter((a) => a.parsedData?.isShortlisted);
  const others = applications.filter((a) => !a.parsedData?.isShortlisted);

  const ApplicantCard = ({ app }) => (
    <Card
      elevation={6}
      sx={{
        borderRadius: 3,
        mb: 3,
        border: app.parsedData.isShortlisted
          ? "3px solid #4caf50"
          : "1px solid #e0e0e0",
      }}
    >
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {app.parsedData.name}
                </Typography>
                <Typography color="text.secondary">
                  {app.parsedData.email}{" "}
                  {app.parsedData.phone && `• ${app.parsedData.phone}`}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Applied for: <strong>{app.job.title}</strong> (
                  {app.job.department})
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box textAlign={{ xs: "left", md: "right" }}>
              <Chip
                icon={
                  app.parsedData.isShortlisted ? <CheckCircle /> : <Cancel />
                }
                label={app.parsedData.isShortlisted ? "SHORTLISTED" : "APPLIED"}
                color={app.parsedData.isShortlisted ? "success" : "default"}
                size="small"
              />
              <Typography
                variant="h3"
                fontWeight="bold"
                color={
                  app.parsedData.matchPercentage >= 70
                    ? "success.main"
                    : "warning.main"
                }
              >
                {app.parsedData.matchPercentage}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={app.parsedData.matchPercentage}
                sx={{
                  height: 12,
                  borderRadius: 5,
                  mt: 1,
                  bgcolor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    bgcolor:
                      app.parsedData.matchPercentage >= 70
                        ? "#4caf50"
                        : app.parsedData.matchPercentage >= 50
                        ? "#ff9800"
                        : "#f44336",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Matched Skills ({app.parsedData.matchedSkills.length} of{" "}
          {app.job.skills.length})
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {app.parsedData.matchedSkills.map((skill) => (
            <Chip key={skill} label={skill} color="success" size="small" />
          ))}
          {app.parsedData.missingSkills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              color="error"
              variant="outlined"
              size="small"
            />
          ))}
        </Stack>

        <Box mt={3} textAlign="right">
          <Button
            variant="contained"
            size="small"
            startIcon={<Download />}
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement("a");
              link.href = app.resumeUrl;
              link.download = `${
                app.parsedData?.name.replace(/\s+/g, "_") || "Resume"
              }.pdf`;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download Resume
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        gutterBottom
        color="primary"
      >
        Applicant Tracking System
      </Typography>

      <Paper
        elevation={10}
        sx={{
          p: 5,
          mb: 6,
          background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)",
          border: "2px solid #86efac",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 15px 35px rgba(16, 185, 129, 0.15)",
        }}
      >
        <Typography
          variant="h3"
          color="success.main"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Shortlisted Candidates ({shortlisted.length})
        </Typography>
        <Typography variant="h6" color="success.dark">
          These candidates match ≥70% of required skills
        </Typography>
      </Paper>

      {shortlisted.map((app) => (
        <ApplicantCard key={app._id} app={app} />
      ))}

      <Typography variant="h5" sx={{ mt: 8, mb: 3 }} color="text.secondary">
        Other Applicants ({others.length})
      </Typography>
      {others.map((app) => (
        <ApplicantCard key={app._id} app={app} />
      ))}
    </Container>
  );
}
