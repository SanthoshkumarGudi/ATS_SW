// src/components/GradientButton.jsx
import { styled, Button } from '@mui/material';

export const GradientButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  backgroundImage: 'linear-gradient(135deg, #4A90E2 0%, #7AB8F5 50%, #A7E6D7 100%)',
  backgroundSize: '200% 200%',
  backgroundPosition: 'left center',
  color: 'white',
  fontWeight: 600,
  borderRadius: 18,
  padding: '14px 32px',
  boxShadow: '0 6px 20px rgba(74, 144, 226, 0.3)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundPosition: 'right center',
    boxShadow: '0 12px 32px rgba(80, 200, 120, 0.35)',
    transform: 'translateY(-4px)',
  },
  '& .MuiButton-startIcon': {
    color: 'white',
  },
}));