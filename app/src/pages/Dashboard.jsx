// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobApplicantsModal from "../components/JobApplicantsModal";
import { useAuth } from "../context/AuthContext";
import { GradientButton, GlowCard } from "../components/SStyledComponents";
export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [loadingApps, setLoadingApps] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {  
    axios
      .get("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setJobs(res.data));
  }, []);

  const fetchApplicationsForJob = async (jobId) => {
    setLoadingApps(true);
    try {
      console.log("inside fetching applications for selected job");

      const res = await axios.get(
        `http://localhost:5000/api/applications/job/${jobId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedJobApps(res.data);
    } catch (err) {
      alert("Failed to load applicants");
    } finally {
      setLoadingApps(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
        Jobs Published
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, <strong>{user.name || user.email}</strong> [{user.role}]
      </Typography>

      {["admin", "hiring_manager"].includes(user.role) && (
        <GradientButton
          size="large"
          onClick={() => navigate("/create-job")}
          sx={{ mb: 5, py: 2, px: 5 }}
        >
          + Create New Job Posting
        </GradientButton>
      )}

      <Stack spacing={4}>
        {jobs.length === 0 ? (
          <Card sx={{ p: 6, textAlign: "center", bgcolor: "#f8fafc" }}>
            <Typography variant="h6" color="text.secondary">
              No jobs posted yet.
            </Typography>
          </Card>
        ) : (
          jobs.map((job) => (
            <GlowCard key={job._id}>
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                {/* Header: Title + Edit Button */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={3}
                >
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="primary">
                      {job.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {job.department} • {job.location || "Remote"}
                    </Typography>
                  </Box>
                  <Tooltip title="Edit Job Posting">
                    <IconButton
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        "&:hover": { bgcolor: "success.dark" },
                        boxShadow: 3,
                      }}
                      onClick={() => navigate(`/job/edit/${job._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Description */}
                <Box
                  dangerouslySetInnerHTML={{
                    __html: job.description.substring(0, 280) + "...",
                  }}
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                    mb: 3,
                    fontSize: "0.95rem",
                  }}
                />

                {/* Skills */}
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
                  {job.skills?.slice(0, 8).map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{
                        backgroundColor: "secondary.main",
                        color: "#2D3436",
                        fontWeight: 600,
                      }}
                    />
                  ))}
                  {job.skills?.length > 8 && (
                    <Chip
                      label={`+${job.skills.length - 8} more`}
                      size="small"
                    />
                  )}
                </Stack>

                {/* Footer: Date + Gradient Button */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>

                  <GradientButton
                    startIcon={<PeopleIcon />}
                    onClick={() => fetchApplicationsForJob(job._id)}
                    size="large"
                  >
                    View Applicants
                  </GradientButton>
                </Box>
              </CardContent>
            </GlowCard>
          ))
        )}
      </Stack>

      <JobApplicantsModal
        open={!!selectedJobApps}
        onClose={() => setSelectedJobApps(null)}
        applications={selectedJobApps || []}
        loading={loadingApps}
      />
    </Container>
  );
}
