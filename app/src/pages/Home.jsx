import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Stack, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/system";
import atsImg2 from '../assets/ats_.png';

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
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  transition: "background 2s ease-in-out",
  background: gradient,
}));

// Star components (kept as-is - they are already responsive)
const generateStars = (count) => {
  let shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 2000;
    const y = Math.random() * 2000;
    const opacity = Math.random() * 0.8 + 0.2;
    const color = Math.random() > 0.85 ? '#bcdcff' : '#ffffff';
    shadows.push(`${x}px ${y}px rgba(${color === '#ffffff' ? '255,255,255' : '188,220,255'}, ${opacity})`);
  }
  return shadows.join(', ');
};

const StarsSmall = styled(Box)({
  position: 'absolute',
  inset: 0,
  width: '1px',
  height: '1px',
  background: 'transparent',
  boxShadow: generateStars(900),
  animation: `${twinkle} 4s infinite ease-in-out`,
});

const StarsMedium = styled(Box)({
  position: 'absolute',
  inset: 0,
  width: '2px',
  height: '2px',
  background: 'transparent',
  boxShadow: generateStars(400),
  animation: `${twinkle} 6s infinite ease-in-out`,
  filter: 'blur(0.3px)',
});

const StarsBig = styled(Box)({
  position: 'absolute',
  inset: 0,
  width: '3px',
  height: '3px',
  background: 'transparent',
  boxShadow: generateStars(120),
  animation: `${twinkle} 8s infinite ease-in-out`,
  filter: 'blur(0.6px)',
});

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: "40px 24px", // Reduced padding for mobile
  borderRadius: "32px",
  backdropFilter: "blur(16px) saturate(180%)",
  background: "rgba(255, 255, 255, 0.75)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
  textAlign: "center",
  maxWidth: "90%", // Responsive max width
  width: "100%",
  animation: `${fadeIn} 1s ease-out`,
  [theme.breakpoints.up("sm")]: {
    padding: "64px 40px",
    maxWidth: 700,
  },
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
      gradient: "linear-gradient(180deg, #2E3A59 0%, rgb(163, 101, 57) 60%, rgb(171, 150, 121) 100%)",
      isNight: true,
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
      {scene.isNight && <StarsSmall />}
      {scene.isNight && <StarsMedium />}
      {scene.isNight && <StarsBig />}

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <GlassCard elevation={0}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 3,
              fontWeight: 800,
              color: "primary.dark",
              display: "block",
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {user ? `${scene.greeting}, ${user.name}` : scene.greeting}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "2.8rem", sm: "3.8rem", md: "4.5rem" },
              background: "linear-gradient(45deg, #1976d2, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            ATS Pro
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: { xs: 4, sm: 5 },
              fontWeight: 400,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Elevating the recruitment experience through intelligent automation.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            {!user ? (
              <Button
                size="large"
                variant="contained"
                sx={{
                  px: { xs: 6, sm: 8 },
                  py: 2,
                  borderRadius: "15px",
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  boxShadow: "0 10px 20px rgba(25, 118, 210, 0.3)",
                  width: { xs: "100%", sm: "auto" },
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
                      size="large"
                      sx={{
                        borderRadius: "12px",
                        px: 5,
                        width: { xs: "100%", sm: "auto" },
                      }}
                      onClick={() => navigate("/jobs")}
                    >
                      Browse Jobs
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderRadius: "12px",
                        px: 5,
                        bgcolor: "rgba(255,255,255,0.5)",
                        width: { xs: "100%", sm: "auto" },
                      }}
                      onClick={() => navigate("/my-applications")}
                    >
                      My Applications
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      borderRadius: "12px",
                      px: 6,
                      width: { xs: "100%", sm: "auto" },
                    }}
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