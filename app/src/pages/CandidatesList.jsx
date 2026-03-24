import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Box,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CandidatesList() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!user || user.role === "candidate") {
      setLoading(false);
      return;
    }

    const fetchCandidates = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/applications/candidates-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCandidates(res.data);
        setFilteredCandidates(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [user]);

  // 🔥 Optimized counts using useMemo
  const stats = useMemo(() => {
    return {
      all: candidates.length,
      offered: candidates.filter((c) => c.status === "offered").length,
      rejected: candidates.filter((c) => c.status === "rejected").length,
      "on-hold": candidates.filter((c) => c.status === "on-hold").length,
    };
  }, [candidates]);

  const handleFilter = (status) => {
    setActiveFilter(status);
    if (status === "all") {
      setFilteredCandidates(candidates);
    } else {
      setFilteredCandidates(
        candidates.filter((c) => c.status === status)
      );
    }
  };

  const getStatusColor = (status) => {
    const map = {
      offered: "success",
      rejected: "error",
      "on-hold": "warning",
      "in-interview": "info",
    };
    return map[status] || "default";
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Hired", value: "offered" },
    { label: "Rejected", value: "rejected" },
    { label: "On Hold", value: "on-hold" },
  ];

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
        <Typography mt={2}>Loading candidates...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          Candidates Dashboard
        </Typography>

        {/* Filters */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={activeFilter === f.value ? "contained" : "outlined"}
              onClick={() => handleFilter(f.value)}
              sx={{ borderRadius: 5 }}
            >
              {f.label}
              <Chip
                label={stats[f.value]}
                backgroundColor="rgba(233, 237, 242, 0.17)"
                size="small"
                sx={{ ml: 1 }}
              />
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* Candidates */}
      {filteredCandidates.length === 0 ? (
        <Typography textAlign="center" mt={4}>
          No candidates found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredCandidates.map((app) => (
            <Grid item xs={12} md={6} lg={4} key={app._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  height: "100%",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {app.candidate?.name || "Unknown"}
                  </Typography>

                  <Typography color="text.secondary">
                    {app.parsedData?.email || "No email"}
                  </Typography>

                  <Box mt={1}>
                    <Typography variant="body2">
                      📌 {app.job?.title || "Job Removed"}
                    </Typography>
                    <Typography variant="body2">
                      📞 {app.parsedData?.phone || "N/A"}
                    </Typography>
                  </Box>

                  <Typography variant="body2" mt={1}>
                    Applied:{" "}
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </Typography>

                  <Chip
                    label={app.status}
                    color={getStatusColor(app.status)}
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}