// frontend/src/components/GoBackButton.jsx
import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoBackButton({ fallback = '/login', label = '← Back' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    localStorage.removeItem('token');
    // If there's history to go back to → go back
    if (window.history.length > 1) {
      navigate(-1); // This is the real "go back" behavior
    } else {
      // If no history (user opened page directly) → go to fallback
      navigate(fallback, { replace: true });
    }
  };

  // Optional: Hide the button if we're already on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={handleGoBack}
      sx={{
        mb: 3,
        borderColor: '#cbd5e1',
        color: '#64748b',
        '&:hover': {
          borderColor: '#94a3b8',
          backgroundColor: 'rgba(148, 163, 184, 0.04)',
        },
      }}
    >
      {label}
    </Button>
  );
}