import React, { useEffect, useState, useMemo } from "react";
import { Container, Typography, Box, Button, Stack, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/system";

/* --------------------------------------------------
   Animations
-------------------------------------------------- */
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

// Efficient Star Field using Box Shadows
const Stars = styled(Box)(() => {
  const generateStars = (n) => {
    let value = `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
    for (let i = 2; i <= n; i++) {
      value += `, ${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
    }
    return value;
  };

  const starShadows = generateStars(700);

  return {
    width: "1px",
    height: "1px",
    background: "transparent",
    boxShadow: starShadows,
    borderRadius: "50%",
    opacity: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
  };
});

// const CelestialObject = styled(Box)(({ isNight }) => ({
//   position: "absolute",
//   top: "15%",
//   right: "15%",
//   width: isNight ? "80px" : "100px",
//   height: isNight ? "80px" : "100px",
//   borderRadius: "50%",
//   background: isNight ? "#F4F4F4" : "#FFD700",
//   boxShadow: isNight 
//     ? "0 0 40px rgba(255,255,255,0.4)" 
//     : "0 0 60px rgba(255,215,0,0.6)",
//   transition: "all 2s ease-in-out",
//   animation: `${float} 6s ease-in-out infinite`,
//   "&::after": isNight ? {
//     content: '""',
//     position: "absolute",
//     top: "10%",
//     left: "25%",
//     width: "80%",
//     height: "80%",
//     borderRadius: "50%",
//     background: "inherit", // Matches parent sky color in actual impl
//     filter: "brightness(0.8)",
//     opacity: 0.8
//   } : {},
// }));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: "64px 40px",
  borderRadius: "40px",
  backdropFilter: "blur(16px) saturate(180%)",
  background: "rgba(255, 255, 255, 0.75)",
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

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scene, setScene] = useState({ gradient: "", isNight: false, greeting: "" });

  useEffect(() => {
    const updateScene = () => {
      // const hour = new Date().getHours();
 const hour = 19;
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
      {/* <CelestialObject isNight={scene.isNight} /> */}

      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <GlassCard elevation={0}>
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