// frontend/src/pages/CreateJob.jsx
import { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, IconButton, Stack, Chip,
  FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, Paper
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Tiptap from './TipTap';

export default function CreateJob() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', type: 'text', options: [], required: true }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', type: 'text', options: [], required: true }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jobData = {
      title: formData.get('title'),
      description,
      skills: formData.get('skills'),
      department: formData.get('department'),
      location: formData.get('location'),
      screeningQuestions: questions.filter(q => q.question.trim() !== '')
    };

    try {
      await axios.post('http://localhost:5000/api/jobs', jobData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert('Error creating job');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Create New Job Posting
      </Typography>

      <Box component="form" onSubmit={onSubmit} sx={{ mt: 4 }}>
        <Stack spacing={3}>
          <TextField name="title" label="Job Title" fullWidth required />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>Description</Typography>
            <Tiptap value={description} onChange={setDescription} />
            <input type="hidden" name="description" value={description} />
          </Box>

          <TextField name="skills" label="Required Skills (comma separated)" fullWidth helperText="e.g. React, Node.js, MongoDB" />
          <TextField name="department" label="Department" fullWidth />
          <TextField name="location" label="Location" fullWidth placeholder="e.g. Bangalore, Remote" />

          {/* Screening Questions Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Screening Questions (Optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Add custom questions to filter candidates early
            </Typography>

            {questions.map((q, qIndex) => (
              <Paper key={qIndex} variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <TextField
                      label={`Question ${qIndex + 1}`}
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      fullWidth
                      required
                    />
                    <IconButton onClick={() => removeQuestion(qIndex)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={q.type}
                      onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                      label="Question Type"
                    >
                      <MenuItem value="text">Short Text</MenuItem>
                      <MenuItem value="yes-no">Yes/No</MenuItem>
                      <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                      <MenuItem value="salary">Expected Salary</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={q.required}
                        onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                      />
                    }
                    label="Required"
                  />

                  {q.type === 'multiple-choice' && (
                    <Box>
                      <Typography variant="subtitle2">Options</Typography>
                      {q.options.map((opt, oIndex) => (
                        <Box key={oIndex} display="flex" gap={1} mt={1}>
                          <TextField
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder="Option"
                            fullWidth
                          />
                          <IconButton onClick={() => removeOption(qIndex, oIndex)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                      <Button startIcon={<Add />} onClick={() => addOption(qIndex)} sx={{ mt: 1 }}>
                        Add Option
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}

            <Button
              startIcon={<Add />}
              onClick={addQuestion}
              variant="outlined"
              fullWidth
              sx={{ mt: 3 }}
            >
              Add New Question
            </Button>
          </Box>

          <Button type="submit" variant="contained" size="large" sx={{ mt: 4 }}>
            Post Job
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}