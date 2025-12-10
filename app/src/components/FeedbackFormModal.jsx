// src/components/FeedbackFormModal.jsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Rating,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function FeedbackFormModal({ open, onClose, interview, applicationId }) {
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!recommendation) {
      alert("Please select a recommendation");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/interviews/${interview._id}/feedback`,
        {
          rating,
          notes,
          recommendation,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Feedback submitted successfully!");
      onClose();
      window.location.reload(); // Refresh to see updated status
    } catch (err) {
      alert("Error submitting feedback");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Give Interview Feedback</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6">Candidate Performance</Typography>

          <Box>
            <Typography component="legend">Overall Rating</Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue || 1)}
              size="large"
            />
          </Box>

          <TextField
            label="Detailed Notes"
            multiline
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            placeholder="Strengths, weaknesses, communication, technical skills..."
          />

          <TextField
            select
            label="Final Recommendation"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            fullWidth
          >
            <MenuItem value="hire">Strong Hire</MenuItem>
            <MenuItem value="next-round">Next Round</MenuItem>
            <MenuItem value="hold">Hold</MenuItem>
            <MenuItem value="reject">Reject</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}