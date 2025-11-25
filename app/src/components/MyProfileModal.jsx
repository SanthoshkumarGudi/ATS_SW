// frontend/src/components/MyProfileModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import {
  AccountCircle,
  LocationOn,
  Work,
  Timer,
  Code,
  TrendingUp,
  Edit // ← New icon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EditCandidateProfile from '../pages/EditCandidateProfile';

export default function MyProfileModal({ open, onClose, profile }) {
  const navigate = useNavigate();

  if (!profile) return null;

  const handleEdit = () => {
    onClose(); // Close modal first
    navigate('/profile/edit');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
        }
      }}
    >
      {/* Header with Edit Button */}
      <DialogTitle sx={{ bgcolor: '#6366f1', color: 'white', py: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="700">
            My Profile
          </Typography>

          {/* Edit Button – Right Side */}
          <Button
            variant="contained"
            size="small"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#fafbfc', py: 5, px: 5 }}>
        <Box sx={{ display: 'grid', gap: 4.5 }}>
          {/* Avatar + Name + Title */}
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#e0e7ff',
                color: '#4f46e5',
                fontSize: 36,
                fontWeight: 'bold',
                border: '4px solid white'
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="700" color="#1e293b">
                {profile.name}
              </Typography>
              <Typography variant="body1" color="#64748b" fontWeight="500">
                {profile.targetJobTitle}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Current Location */}
          <Box display="flex" alignItems="flex-start" gap={3}>
            <LocationOn sx={{ color: '#64748b', fontSize: 28, mt: 0.5 }} />
            <Box>
              <Typography variant="body2" color="#64748b" fontWeight="500">Current Location</Typography>
              <Typography variant="h6" fontWeight="600" color="#1e293b">
                {profile.currentLocation || 'Not specified'}
              </Typography>
            </Box>
          </Box>

          {/* Preferred Location */}
          <Box display="flex" alignItems="flex-start" gap={3}>
            <LocationOn sx={{ color: '#10b981', fontSize: 28, mt: 0.5 }} />
            <Box>
              <Typography variant="body2" color="#64748b" fontWeight="500">Preferred Location</Typography>
              <Typography variant="h6" fontWeight="600" color="#1e293b">
                {profile.preferredLocation || 'Anywhere'}
              </Typography>
            </Box>
          </Box>

          {/* Skills */}
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Code sx={{ color: '#64748b', fontSize: 28 }} />
              <Typography variant="body2" color="#64748b" fontWeight="500">Skills</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill) => (
                  <Chip key={skill} label={skill} color="primary" size="small" />
                ))
              ) : (
                <Typography color="text.secondary">No skills added</Typography>
              )}
            </Box>
          </Box>

          {/* Notice Period & Experience */}
          <Box display="flex" gap={6} flexDirection={{ xs: 'column', sm: 'row' }}>
            <Box display="flex" alignItems="flex-start" gap={3} flex={1}>
              <Timer sx={{ color: '#64748b', fontSize: 28, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" color="#64748b" fontWeight="500">Notice Period</Typography>
                <Typography variant="h6" fontWeight="600" color="#1e293b">
                  {profile.noticePeriod} days
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="flex-start" gap={3} flex={1}>
              <TrendingUp sx={{ color: '#64748b', fontSize: 28, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" color="#64748b" fontWeight="500">Experience</Typography>
                <Typography variant="h6" fontWeight="600" color="#1e293b">
                  {profile.experience} years
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}