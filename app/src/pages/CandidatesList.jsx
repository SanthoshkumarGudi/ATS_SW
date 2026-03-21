import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/candidate/candidateslist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Failed to load candidates. Please try again.",
        );
        setLoading(false);
      });
  }, []);

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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Candidates
      </Typography>
      {candidates.length === 0 ? (
        <Typography>No candidates found.</Typography>
      ) : (
        candidates.map((candidate) => (
          <div key={candidate._id}>
            <Typography variant="h6">{candidate.name}</Typography>
            <Typography>Email: {candidate.email}</Typography>
            <Typography>Skills: {candidate.skills.join(", ")}</Typography>
            <hr />
          </div>
        ))
      )}
    </Container>
  );
}
