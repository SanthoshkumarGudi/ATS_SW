import React, { useEffect, useState, useMemo } from "react";
import { Container, Typography, Box, Button, Stack, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/system";
import atsImg2 from '../assets/ats_.png'
/* --------------------------------------------------
   Animations
-------------------------------------------------- */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const twinkle = keyframes`
  0%   { opacity: 0.3; }
  50%  { opacity: 1; }
  100% { opacity: 0.3; }
`;


/* --------------------------------------------------
   Styled Components
-------------------------------------------------- */
const Sky = styled(Box)(({ gradient }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center", // ✅ CENTER vertically
  position: "relative",
  overflow: "hidden",
  transition: "background 2s ease-in-out",
  background: gradient,
  //  backgroundImage:`url(${atsImg2})`
  // zIndex: -1
}));


const generateStars = (count) => {
  let shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 2000;
    const y = Math.random() * 2000;
    const opacity = Math.random() * 0.8 + 0.2;
    const color = Math.random() > 0.85 ? '#bcdcff' : '#ffffff'; // subtle blue stars
    shadows.push(`${x}px ${y}px rgba(${color === '#ffffff' ? '255,255,255' : '188,220,255'}, ${opacity})`);
  }
  return shadows.join(', ');
};


export const StarsSmall = styled(Box)({
  position: 'absolute',
  inset: 0,
  width: '1px',
  height: '1px',
  background: 'transparent',
  boxShadow: generateStars(900),
  animation: `${twinkle} 4s infinite ease-in-out`,
});

export const StarsMedium = styled(Box)({
  position: 'absolute',
  inset: 0,
  width: '2px',
  height: '2px',
  background: 'transparent',
  boxShadow: generateStars(400),
  animation: `${twinkle} 6s infinite ease-in-out`,
  filter: 'blur(0.3px)',
});

export const StarsBig = styled(Box)({
  position: 'absolute',
  inset: 0,
  width: '3px',
  height: '3px',
  background: 'transparent',
  boxShadow: generateStars(120),
  animation: `${twinkle} 8s infinite ease-in-out`,
  filter: 'blur(0.6px)',
});


// Efficient Star Field using Box Shadows
const Stars = styled(Box)(({ size = '1px', duration = '50s' }) => {
  const generateStars = (count) => {
  let shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 2000;
    const y = Math.random() * 2000;
    const opacity = Math.random() * 0.8 + 0.2;
    const color = Math.random() > 0.85 ? '#bcdcff' : '#ffffff'; // subtle blue stars
    shadows.push(`${x}px ${y}px rgba(${color === '#ffffff' ? '255,255,255' : '188,220,255'}, ${opacity})`);
  }
  return shadows.join(', ');
};


  return {
    width: size,
    height: size,
    background: 'transparent',
    boxShadow: generateStars(700),
    animation: `${twinkle} ${duration} infinite ease-in-out`,
    borderRadius: '50%', // Makes them look like dots rather than tiny squares
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '2000px', // Creates a seamless loop if you decide to scroll them
      width: size,
      height: size,
      background: 'transparent',
      boxShadow: generateStars(1000),
    }
  };
});

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: "64px 40px",
  borderRadius: "40px",
  backdropFilter: "blur(16px) saturate(180%)",
  background: "white",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  textAlign: "center",
  maxWidth: 700,
  animation: `${fadeIn} 1s ease-out`,
}));

/* --------------------------------------------------
   Helper Functions
-------------------------------------------------- */
const getSkyConfig = (hour) => {
  if (hour >= 5 && hour < 7) {
    return {
      gradient: "linear-gradient(180deg, #FF9A76 0%, #FFD6A5 50%, #A0C4FF 100%)",
      isNight: false,
    };
  }
  if (hour >= 7 && hour < 17) {
    return {
      gradient: "linear-gradient(180deg, #5AA9E6 0%, #89CFF0 60%, #BEE3F8 100%)",
      isNight: false,
    };
  }
  if (hour >= 17 && hour < 19) {
    return {
      gradient: "linear-gradient(180deg, #2E3A59 0%,rgb(163, 101, 57) 60%,rgb(171, 150, 121) 100%)",
      isNight: true, // Sunset starts showing stars
    };
  }
  return {
    gradient: "linear-gradient(180deg, #020111 0%, #0B1D3A 50%, #123D6A 100%)",
    isNight: true,
  };
};
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scene, setScene] = useState({ gradient: "", isNight: false, greeting: "" });

  useEffect(() => {
    const updateScene = () => {
      const hour = new Date().getHours();
      // const hour = 17.9
      const config = getSkyConfig(hour);


      
      let greeting = "Good Evening";
      if (hour < 12) greeting = "Good Morning";
      else if (hour < 17) greeting = "Good Afternoon";

      setScene({ ...config, greeting });
    };

    updateScene();
    const interval = setInterval(updateScene, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Sky gradient={scene.gradient}>
      {scene.isNight && <Stars />}
        {scene.isNight && <StarsSmall />}
  {scene.isNight && <StarsMedium />}
  {scene.isNight && <StarsBig />}
      {/* <CelestialObject isNight={scene.isNight} /> */}
      
      <Container maxWidth="md">
        <GlassCard
        elevation={0}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, fontWeight: 800, color: "primary.dark", display: "block", mb: 1 }}
          >
            {user ? `${scene.greeting}, ${user.name}` : scene.greeting}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: "3rem", md: "4.5rem" },
              background: "linear-gradient(45deg, #1976d2, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ATS Pro
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "text.secondary", mb: 5, fontWeight: 400, maxWidth: "500px", mx: "auto" }}
          >
            Elevating the recruitment experience through intelligent automation.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            {!user ? (
              <Button
                size="large"
                variant="contained"
                sx={{ 
                  px: 8, py: 2, 
                  borderRadius: "15px", 
                  textTransform: "none", 
                  fontSize: "1.1rem",
                  boxShadow: "0 10px 20px rgba(25, 118, 210, 0.3)"
                }}
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
            ) : (
              <>
                {user.role === "candidate" ? (
                  <>
                    <Button 
                      variant="contained" 
                      sx={{ borderRadius: "12px", px: 4 }}
                      onClick={() => navigate("/jobs")}
                    >
                      Browse Jobs
                    </Button>
                    <Button 
                      variant="outlined" 
                      sx={{ borderRadius: "12px", px: 4, bgcolor: "rgba(255,255,255,0.5)" }}
                      onClick={() => navigate("/my-applications")}
                    >
                      My Applications
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ borderRadius: "12px", px: 6 }}
                    onClick={() => navigate("/dashboard")}
                  >
                    Employer Dashboard
                  </Button>
                )}
              </>
            )}
          </Stack>
        </GlassCard>
      </Container>
    </Sky>
  );
}