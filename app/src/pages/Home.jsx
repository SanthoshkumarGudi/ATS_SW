// src/pages/Home.jsx
import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        background:
          "linear-gradient(135deg, #6366F1 0%, #A855F7 45%, #EC4899 100%)",
        py: 10,
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "24px",
          p: { xs: 4, sm: 6 },
          textAlign: "center",
          backdropFilter: "blur(14px)",
          background: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            color: "#444",
            mb: 1,
            fontWeight: 500,
          }}
        >
          {user ? `Hello, ${user.name}` : "Ready to get started?"}
        </Typography>

        {/* Gradient Main Title */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mb: 2,
            background: "linear-gradient(90deg, #4F46E5, #EC4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}
        >
          Welcome to ATS Pro
        </Typography>

        {/* Sub-tagline */}
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 400,
            color: "rgba(0,0,0,0.65)",
          }}
        >
          Your all-in-one Applicant Tracking System for better hiring & smarter
          job search.
        </Typography>

        {/* Login Button */}
        {!user && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              py: 1.7,
              px: 6,
              fontSize: "1.15rem",
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(90deg, #4F46E5, #A855F7)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              ":hover": {
                background: "linear-gradient(90deg, #4338CA, #9333EA)",
              },
            }}
          >
            Sign In / Register
          </Button>
        )}

        {/* Candidate Actions */}
        {user?.role === "candidate" && (
          <Stack spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/jobs")}
              sx={{
                py: 1.4,
                borderRadius: "12px",
                fontSize: "1.1rem",
                textTransform: "none",
                background: "linear-gradient(90deg, #10B981, #34D399)",
                boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
              }}
            >
              Explore Jobs
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/my-applications")}
              sx={{
                py: 1.4,
                borderRadius: "12px",
                fontSize: "1.1rem",
                textTransform: "none",
                background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.25)",
              }}
            >
              Track Your Applications
            </Button>
          </Stack>
        )}

        {/* Hiring Manager/Admin Info */}
        {user?.role === "hiring_manager" && (
          <Typography
            variant="h6"
            sx={{
              mt: 4,
              color: "rgba(0,0,0,0.65)",
              fontWeight: 500,
            }}
          >
            Publish jobs, manage applicants, and track shortlisted candidates.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
