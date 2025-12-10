// src/components/InterviewSchedulerModal.jsx
import { useState } from 'react';
import { Modal, Box, Button, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

export default function InterviewSchedulerModal({ open, onClose, application }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [interviewerId, setInterviewerId] = useState('');

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/api/interviews', {
      applicationId: application._id,
      scheduledAt: new Date(`${date}T${time}`),
      interviewerId
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 400, mx: 'auto', mt: '10%' }}>
        <h3>Schedule Interview</h3>
        <TextField label="Date" type="date" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={(e) => setDate(e.target.value)} />
        <TextField label="Time" type="time" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={(e) => setTime(e.target.value)} />
        <TextField select label="Interviewer" fullWidth value={interviewerId} onChange={(e) => setInterviewerId(e.target.value)}>
          <MenuItem value="interviewer1">John Doe</MenuItem>
          <MenuItem value="interviewer2">Jane Smith</MenuItem>
        </TextField>
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Schedule</Button>
      </Box>
    </Modal>
  );
}