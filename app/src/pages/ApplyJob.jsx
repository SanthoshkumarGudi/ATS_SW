// frontend/src/pages/ApplyJob.jsx
import { useState } from 'react';
import { Container, Typography, Box, Button, Alert, LinearProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoBackButton from '../GoBack';

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) return setError('Please select a resume');

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post(`http://localhost:5000/api/applications/${jobId}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
      console.log("inside apply job",err);
      
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <GoBackButton/>
      <Typography variant="h4" gutterBottom>Submit Your Application</Typography>

      {success && <Alert severity="success">Applied successfully! Redirecting...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}    
        onDrop={handleDrop}
        sx={{
          border: dragging ? '3px dashed #1976d2' : '3px dashed #ccc',
          borderRadius: 3,
          padding: 6,
          textAlign: 'center',
          backgroundColor: dragging ? '#e3f2fd' : '#fafafa',
          transition: 'all 0.3s',
          cursor: 'pointer'
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        {file ? (
          <Typography variant="h6" color="success.main">✓ {file.name}</Typography>
        ) : (
          <>
            <Typography variant="h6">Drop your resume here</Typography>
            <Typography color="text.secondary">or click to browse (PDF, DOC, DOCX)</Typography>
          </>
        )}
      </Box>

      <input
        id="file-input"
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files[0] && setFile(e.target.files[0])}
      />

      {uploading && <LinearProgress sx={{ mt: 3 }} />}

      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 4 }}
        onClick={handleSubmit}
        disabled={!file || uploading || success}
      >
        {uploading ? 'Uploading...' : 'Submit Application'}
      </Button>
    </Container>
  );
}