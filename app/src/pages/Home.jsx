// src/pages/Home.jsx
import React from "react";
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

//   const handleQuickLogin = () => {
//     navigate('/login');
//   };

  return (
    <Container 
      maxWidth="md"
      sx={{
        py: 10,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Hero Section */}
      <Box sx={{ maxWidth: "700px", mx: "auto" }}>
        {/* Subheading */}
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ letterSpacing: 0.5, mb: 1 }}
        >
          {user ? `Hello, ${user.name}` : "Ready to get started?"}
        </Typography>

        {/* Main Title */}
   
  <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mb: 2,
            background: "linear-gradient(90deg, var(--charcoal), var(--sage))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to ATS Pro
        </Typography>
   
      

        {/* Sub-tagline */}
        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ mb: 4, fontWeight: 400 }}
        >
          Your all-in-one Applicant Tracking System.
        </Typography>

        {/* Action Button */}
        {!user && (
          <Button
            variant="contained"
            size="large"
            onClick={handleQuickLogin}
            sx={{
              py: 1.7, 
              px: 5,
              fontSize: "1.15rem",          
              borderRadius: "14px",    
              textTransform: "none",
              fontWeight: 600,      
              boxShadow: "0 4px 18px rgba(0,0,0,0.1)"
            }}
          >
            Sign In / Register
          </Button>
        )}
      </Box>

      {/* Displaying it for only the candidates */}

           {user.role==='candidate'&&(
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        Explore jobs, manage applications.
      </Typography>
         )} 

           {/* Displaying it for the hiring manager nd the adminL */}
           
           {user.role==='hiring_manager'  && (
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        Publish Jobs, View Applicants for the specific job also the Shortlisted candidates
      </Typography>
           )}
    </Container>
  );
};
