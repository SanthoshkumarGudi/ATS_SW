// frontend/src/components/GoBackButton.jsx
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GoBackButton() {
  const navigate = useNavigate();

  const goToLogin = () => {
    localStorage.removeItem('token');  // Optional: logout user
    navigate('/login', { replace: true });
  };

  return (
    <Button 
      variant="outlined" 
      color="error"
      onClick={goToLogin}
      sx={{ mb: 2 }}
    >
      ← Back to Login
    </Button>
  );
}                                   