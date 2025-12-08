import { styled, Box, Button, Card, Typography } from '@mui/material';

export const GradientButton = styled(Button)(({ theme }) => ({
  background: theme.palette.gradient?.main || 'linear-gradient(135deg, #FF6B35, #E65100)',
  color: 'white',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #E65100, #FF3D00)',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)',
  },
}));

export const GlowCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: theme.palette.gradient?.glow || 'transparent',
    pointerEvents: 'none',
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.accent.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 800,
}));