// frontend/src/pages/JobsList.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
  Tooltip,
  IconButton,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoBackButton from "../GoBack";
import MyProfileModal from "../components/MyProfileModal";
import { AccountCircle } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchJobsAndApplications = async () => {
      try {
        // 1. Fetch all published jobs
        const jobsRes = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const publishedJobs = jobsRes.data.filter(
          (j) => j.status === "published"
        );

        // 2. Fetch user's applications
        const appsRes = await axios.get(
          "http://localhost:5000/api/applications/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const appliedIds = new Set(appsRes.data.map((app) => app.job._id));

        // 3. Fetch profile
        const profileRes = await axios.get(
          "http://localhost:5000/api/candidate/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Set state
        setJobs(publishedJobs);
        setAppliedJobIds(appliedIds);
        setProfile(profileRes.data);

        // AUTO-FILTER: Only show jobs NOT applied to
        const notApplied = publishedJobs.filter(
          (job) => !appliedIds.has(job._id)
        );
        setFilteredJobs(notApplied);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs or applications.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "candidate") {
      fetchJobsAndApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const hasApplied = (jobId) => appliedJobIds.has(jobId);

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header: Title + Profile Icon */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h3" gutterBottom sx={{ mt: 1 }}>
            Open Positions
          </Typography>
        </Box>
        <Tooltip title="View Profile">
          <IconButton onClick={() => setOpenProfile(true)} size="large">
            <Avatar sx={{ bgcolor: "#4f46e5", width: 48, height: 48 }}>
              <AccountCircle sx={{ fontSize: 36 }} />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Welcome Message */}
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Welcome, {user?.name} [{user?.role}]
      </Typography>

      {/* Error / Loading */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading && <Typography>Loading jobs...</Typography>}

      {/* Job Cards – Only Unapplied Jobs */}
      <Stack spacing={4} mt={4}>
        {filteredJobs.length === 0 && !loading ? (
          <Typography variant="h6" color="text.secondary">
            No new positions available. You've applied to all open jobs!
          </Typography>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job._id} variant="outlined">
              <CardContent>
                <Typography variant="h5">{job.title}</Typography>
                <Typography color="text.secondary">
                  {job.department} • {job.location}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {job.skills?.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <div
                  dangerouslySetInnerHTML={{ __html: job.description }}
                  style={{ margin: "20px 0", opacity: 0.85 }}
                />

                {/* Apply Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(`/apply/${job._id}`)}
                  sx={{ mt: 2 }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Profile Modal */}
      <MyProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        profile={profile}
      />
    </Container>
  );
}
