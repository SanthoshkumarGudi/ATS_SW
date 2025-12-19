// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleLogout = () => {
    logout();
  };

  const handleHome = () => {
    navigate("/");
  };

  if (!user) {
    // Hide Navbar on login page for a cleaner experience
    return null;
  }

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo/Title */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, color: "white" }}
          >
            ATS Pro
          </Typography>
          {!isMobile && (
            <Button
              color="inherit"
              onClick={handleHome}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Home
            </Button>
          )}
        </Box>

        {/* Navigation Links - Role-based */}
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-end">
          {user.role === "candidate" && (
            <>
              <Button color="inherit" onClick={() => navigate("/jobs")}>
                Jobs
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/my-applications")}
              >
                My Applications
              </Button>
            </>
          )}

          {user.role === "hiring_manager" || user.role === "admin" ? (
            <>
              <Button color="inherit" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => navigate("/create-job")}>
                Post Job
              </Button>
              {/* <Button
                color="inherit"
                onClick={() => navigate("/my-availability")}
              >
                My Availability
              </Button> */}
            </>
          ) : (
            user.role === "interviewer" && (
              <Button
                color="inherit"
                onClick={() => navigate("/interviewer-dashboard")}
              >
                My Interviews
              </Button>
            )
          )}
          {user.role === "hiring_manager" && (
            <Button color="inherit" onClick={() => navigate("/rejected")}>
              Rejected Candidates
            </Button>
          )}

          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
