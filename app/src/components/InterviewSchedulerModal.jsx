// src/components/InterviewSchedulerModal.jsx
import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewSchedulerModal({
  open,
  onClose,
  application,
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [interviewerId, setInterviewerId] = useState("");
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch interviewers when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchInterviewers = async () => {
      setLoading(true);
      try {
        console.log("inside fetching interviwers frontend");
        const res = await axios.get(
          `${API_URL}/api/interviews/interviewers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setInterviewers(res.data); // Expected: [{ _id, name }]
      } catch (err) {
        console.error("Failed to load interviewers");
        alert("Could not load interviewers");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewers();
  }, [open]);

  var round;
  if(application.status==='second-round'){
    round=2

  }else if(application.status==="final-round"){
    round=3
  }else{
    round=1;
  }

  console.log("status round is", round);
  

  const handleSubmit = async () => {
    if (!date || !time || !interviewerId) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/interviews`,
        {
          applicationId: application._id,
          scheduledAt: new Date(`${date}T${time}`),
          interviewerId,
          round
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Interview scheduled successfully!");
      onClose();
    } catch (err) {
      const errorData = err.response?.data;
      console.log("errorData is ",errorData);
      
      // alert("Failed to schedule interview", err);
      if (errorData?.type === "ROUND_ALREADY_SCHEDULED") {
      alert(`⚠️ ${errorData.message}`);
    }
  }
}

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: "white",
          borderRadius: 3,
          width: { xs: "90%", sm: 450 },
          mx: "auto",
          mt: "10%",
          boxShadow: 24,
          zIndex: 1400 
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Schedule Interview
        </Typography>

        <TextField
          label="Date"
          type="date"
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <TextField
          label="Time"
          type="time"
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <TextField
          select
          label="Interviewer"
          fullWidth
          value={interviewerId}
          onChange={(e) => setInterviewerId(e.target.value)}
          disabled={loading}
          sx={{ mb: 3 }}
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={20} /> Loading...
            </MenuItem>
          ) : interviewers.length === 0 ? (
            <MenuItem disabled>No interviewers found</MenuItem>
          ) : (
            interviewers.map((interviewer) => (
              <MenuItem key={interviewer._id} value={interviewer._id}>
                {interviewer.name}
              </MenuItem>
            ))
          )}
        </TextField>

        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            disabled={!date || !time || !interviewerId}
          >
            Schedule Interview
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
