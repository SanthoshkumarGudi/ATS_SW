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
  Grid,
  Paper,
  CircularProgress,
  Collapse,
  Alert,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobApplicantsModal from "../components/JobApplicantsModal";
import { useAuth } from "../context/AuthContext";
import { GradientButton, GlowCard } from "../components/SStyledComponents";

// Import Recharts
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicationsByJob, setApplicationsByJob] = useState({});
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loading, setLoading] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState({}); // Tracks which job's analytics is open
  const [jobToDelete, setJobToDelete] = useState(null); // Store job to delete after confirmation
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Control delete confirmation dialog    
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const jobsRes = await axios.get(`${API_URL}/api/jobs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setJobs(jobsRes.data);

        const appsRes = await axios.get(
          `${API_URL}/api/applications/all-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const grouped = appsRes.data.reduce((acc, app) => {
          const jobId = app.job?._id || app.job;
          if (!acc[jobId]) acc[jobId] = [];
          acc[jobId].push(app);
          return acc;
        }, {});
        setApplicationsByJob(grouped);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const fetchApplicationsForJob = async (jobId) => {
    setSelectedJobApps([]); // open modal immediately
    setLoadingApps(true);
    try {
      const appsRes = await axios.get(
        `${API_URL}/api/applications/job/${jobId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const applications = appsRes.data;
      if (applications.length === 0) {
        setSelectedJobApps([]);
        return;
      }

      const enrichedApps = await Promise.all(
        applications.map(async (app) => {
          try {
            const interviewRes = await axios.get(
              `${API_URL}/api/interviews/application/${app._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );
            return { ...app, interview: interviewRes.data };
          } catch (err) {
            return { ...app, interview: null };
          }
        }),
      );
      setSelectedJobApps(enrichedApps);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to load applicants");
    } finally {
      setLoadingApps(false);
    }
  };

  const toggleAnalytics = (jobId) => {
    setAnalyticsOpen((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const COLORS = ["#1976d2", "#4caf50", "#d32f2f", "#ff9800", "#9c27b0"];

  const deleteJob = async (jobId) => {

    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      alert("Job deleted successfully");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job");
    }
  };

  const handleDeleteDialog = (jobId) => {
    setJobToDelete(jobId);
    setOpenDeleteDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" fontWeight="bold">
          Job Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={()=>navigate("/candidates-list")}
          sx={{ textTransform: "none" }}
        >
          Candidates
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/create-job")}
          sx={{ textTransform: "none" }}
        >
          + Publish New Job
        </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" my={10}>
          <CircularProgress size={60} />
        </Box>
      ) : jobs.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" my={10}>
          No jobs posted yet. Create your first job!
        </Typography>
      ) : (
        <Stack spacing={5}>
          {jobs.map((job) => {
            const jobApps = applicationsByJob[job._id] || [];
            console.log("job Apps are ===================", jobApps);
            
            const total = jobApps.length;

            const shortlisted = jobApps.filter((app) =>
              [
                "first-round",
                "second-round",
                "final-round",
                "in-interview",
                "offered",
              ].includes(app.status),
            ).length;

            const rejected = jobApps.filter(
              (app) => app.status === "rejected",
            ).length;
            const hired = jobApps.filter(
              (app) => app.status === "offered",
            ).length;
            const onHold = jobApps.filter(
              (app) => app.status === "on-hold",
            ).length;

            const isAnalyticsOpen = analyticsOpen[job._id];

            // Data for Pie Chart
            const chartData = [
              { name: "Shortlisted", value: shortlisted },
              { name: "Hired", value: hired },
              { name: "Rejected", value: rejected },
              { name: "On Hold", value: onHold },
            ].filter((item) => item.value > 0);

            return (
              <GlowCard key={job._id} elevation={isAnalyticsOpen ? 12 : 6}>
                <CardContent>
                  <Box
                    display="flex"
                    // justifyContent="space-between"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                  >
                   
                    <Box>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {job.title}
                      </Typography>
                      <Typography color="text.secondary" variant="body1">
                        {job.department} • {job.location}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                      <Tooltip title="Edit Job" >
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/edit/${job._id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Job">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteDialog(job._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  {/* Skills */}
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ my: 3 }}>
                    {job.skills?.slice(0, 10).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {job.skills?.length > 10 && (
                      <Chip
                        label={`+${job.skills.length - 10} more`}
                        size="small"
                      />
                    )}
                  </Stack>

                  {/* Footer Buttons */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 4 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                      {total > 0 && (
                        <>
                          <GradientButton
                            startIcon={<AnalyticsIcon />}
                            onClick={() => toggleAnalytics(job._id)}
                            variant={isAnalyticsOpen ? "contained" : "outlined"}
                          >
                            {isAnalyticsOpen ? "Hide" : "View"} Analytics
                          </GradientButton>

                          <GradientButton
                            startIcon={<PeopleIcon />}
                            onClick={() => fetchApplicationsForJob(job._id)}
                            size="large"
                          >
                            View Applicants ({total})
                          </GradientButton>
                        </>
                      )}
                    </Stack>
                  </Box>

                  {/* Analytics Section - Collapsible */}
                  <Collapse in={isAnalyticsOpen} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        mt: 4,
                        pt: 4,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Application Status Overview
                      </Typography>

                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={3}
                            sx={{
                              p: 3,
                              textAlign: "center",
                              bgcolor: "#e3f2fd",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="primary"
                            >
                              {total}
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                              Total Applied
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={3}
                            sx={{
                              p: 3,
                              textAlign: "center",
                              bgcolor: "#e8f5e9",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="success.main"
                            >
                              {shortlisted}
                            </Typography>
                            <Typography variant="body1">Shortlisted</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={3}
                            sx={{
                              p: 3,
                              textAlign: "center",
                              bgcolor: "#ffebee",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="error.main"
                            >
                              {rejected}
                            </Typography>
                            <Typography variant="body1">Rejected</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={3}
                            sx={{
                              p: 3,
                              textAlign: "center",
                              bgcolor: "#ffebee",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="error.main"
                            >
                              {onHold}
                            </Typography>
                            <Typography variant="body1">On Hold</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={3}
                            sx={{
                              p: 3,
                              textAlign: "center",
                              bgcolor: "#fff3e0",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              color="warning.main"
                            >
                              {hired}
                            </Typography>
                            <Typography variant="body1">Hired</Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {total > 0 && (
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {chartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Confirm Deletion
                    </Typography>
                    <Typography mb={3}>
                      Are you sure you want to delete this job? This action cannot be undone.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          deleteJob(jobToDelete);
                          setOpenDeleteDialog(false);
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                </Dialog> 
              </GlowCard>
            );
          })}
        </Stack>
      )}

      <JobApplicantsModal
        open={!!selectedJobApps}
        onClose={() => setSelectedJobApps(null)}
        applications={selectedJobApps || []}
        loading={loadingApps}
      />
    </Container>
  );
}

