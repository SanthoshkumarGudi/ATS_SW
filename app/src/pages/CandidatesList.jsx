import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CandidatesList() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role === "candidate") {
      setLoading(false); // ✅ fix loading stuck
      return;
    }

    axios
      .get(`${API_URL}/api/applications/candidates-dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCandidates(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Error loading candidates")
      )
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography>Loading candidates...</Typography>
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

  console.log("canddate list", candidates);
  

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Candidates List
      </Typography>

      {candidates.length === 0 ? (
        <Typography>No candidates found.</Typography>
      ) : (
        candidates.map((app) => (
          <div key={app._id}> {/* ✅ fix key */}
            
            <Typography variant="h6">
              Name: {app.candidate?.name}
            </Typography>

            <Typography>
              {/* Email: {app.candidate?.email} */}
              Email: {app.parsedData?.email}
            </Typography>

            <Typography>
              Job Title: {app.job?.title || "Job Removed"}
            </Typography>

            <Typography>
              Phone: {app.parsedData?.phone}
            </Typography>

            <Typography>
              Applied At: {new Date(app.appliedAt).toLocaleString()}
            </Typography>

            <hr />
          </div>
        ))
      )}
    </Container>
  );
}