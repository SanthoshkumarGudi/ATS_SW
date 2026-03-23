import React, { useState, useEffect } from "react";
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
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CandidatesList() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clickedButton, setClickedButton] = useState("");

  useEffect(() => {
    if (!user || user.role === "candidate") {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/applications/candidates-dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setCandidates(res.data);
        setFilteredCandidates(res.data);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Error loading candidates"),
      )
      .finally(() => setLoading(false));
  }, [user]);

  const filterByStatus = (status) => {
    if (status === "all") {
      setClickedButton(status);
      setFilteredCandidates(candidates);
    } else {
      setClickedButton(status);
      const filtered = candidates.filter((app) => app.status === status);
      setFilteredCandidates(filtered);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "offered":
        return "success";
      case "rejected":
        return "error";
      case "on-hold":
        return "warning";
      case "in-interview":
        return "info";
      default:
        return "default";
    }
  };

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
  const totalCandidates = candidates.length;
  const totalHiredcandidates = candidates.filter(
    (app) => app.status === "offered",
  ).length;

  const totalRejectedcandidates = candidates.filter(
    (app) => app.status === "rejected",
  ).length;

  const totalOnHoldcandidates = candidates.filter(
    (app) => app.status === "on-hold",
  ).length;

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          Candidates Dashboard
        </Typography>

        {/* Filters */}
        <Stack direction="row" spacing={1}>
          <label style={{ marginTop: "8px", fontWeight: "bold" }}>
            {totalCandidates}{" "}
          </label>
          <Button
            {...(clickedButton === "all" && { variant: "contained" })}
            onClick={() => filterByStatus("all")}
          >
            All
          </Button>
          <label style={{ marginTop: "8px", fontWeight: "bold" }}>
            {" "}
            {totalHiredcandidates}{" "}
          </label>
          <Button
            {...(clickedButton === "offered" && { variant: "contained" })}
            onClick={() => filterByStatus("offered")}
          >
            Hired
          </Button>
          <label style={{ marginTop: "8px", fontWeight: "bold" }}>
            {" "}
            {totalRejectedcandidates}{" "}
          </label>
          <Button
            {...(clickedButton === "rejected" && { variant: "contained" })}
            onClick={() => filterByStatus("rejected")}
          >
            Rejected
          </Button>
          <label style={{ marginTop: "8px", fontWeight: "bold" }}>
            {" "}
            {totalOnHoldcandidates}{" "}
          </label>
          <Button
            {...(clickedButton === "on-hold" && { variant: "contained" })}
            onClick={() => filterByStatus("on-hold")}
          >
            On Hold
          </Button>
        </Stack>
      </Stack>

      {/* Candidates */}
      {filteredCandidates.length === 0 ? (
        <Typography>No candidates found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredCandidates.map((app) => (
            <Grid item xs={12} md={6} lg={4} key={app._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {app.candidate?.name || "Unknown"}
                  </Typography>

                  <Typography color="text.secondary" mb={1}>
                    {app.parsedData?.email}
                  </Typography>

                  <Typography variant="body2">
                    📌 {app.job?.title || "Job Removed"}
                  </Typography>

                  <Typography variant="body2">
                    📞 {app.parsedData?.phone || "N/A"}
                  </Typography>

                  <Typography variant="body2" mt={1}>
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </Typography>

                  {/* Status Chip */}
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
