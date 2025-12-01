// frontend/src/pages/EditJob.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Tiptap from "./TipTap";
import GoBackButton from "../GoBack";

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    clearanceLevel: "None",
    department: "",
    location: "",
    status: "published",
  });

  // Fetch job on mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const job = res.data;
        setFormData({
          title: job.title || "",
          description: job.description || "",
          skills: job.skills?.join(", ") || "",
          clearanceLevel: job.clearanceLevel || "None",
          department: job.department || "",
          location: job.location || "",
          status: job.status || "published",
        });
      } catch (err) {
        setError("Failed to load job or you don’t have permission");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      };

      await axios.put(`http://localhost:5000/api/jobs/${jobId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const handleDescriptionChange = (html) => {
    setFormData((prev) => ({ ...prev, description: html }));
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading job details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      {/* <GoBackButton label="Back to Dashboard" fallback="/dashboard" /> */}

      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Edit Job Posting
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Job updated successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Job Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          margin="normal"
          required
        />

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          Job Description
        </Typography>
        <Tiptap
          value={formData.description}
          onChange={handleDescriptionChange}
        />
        <input type="hidden" value={formData.description} />

        <TextField
          fullWidth
          label="Required Skills (comma-separated)"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          margin="normal"
          placeholder="React, Node.js, AWS, Docker"
          helperText="e.g., React, TypeScript, MongoDB"
          required
        />


        <TextField
          fullWidth
          label="Department"
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          margin="normal"
        />

        <TextField
          fullWidth
          label="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          margin="normal"
          placeholder="e.g., Bangalore, Remote, USA"
        />

        <TextField
          select
          fullWidth
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          margin="normal"
        >
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </TextField>

        <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={saving || success}
            sx={{ py: 1.8, borderRadius: 3 }}
          >
            {saving ? "Saving Changes..." : "Update Job"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
