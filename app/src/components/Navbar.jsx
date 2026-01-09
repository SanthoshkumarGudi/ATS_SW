// src/components/Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)"); // Adjust breakpoint if needed (600px is very small)

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleHome = () => {
    navigate("/");
  };

  if (!user) {
    return null; // Hide on login page
  }

  // Navigation items based on role
  const navItems = [];

  if (user.role === "candidate") {
    navItems.push({ label: "Jobs", path: "/jobs" });
    navItems.push({ label: "My Applications", path: "/my-applications" });
  }

  if (user.role === "hiring_manager" || user.role === "admin") {
    navItems.push({ label: "Dashboard", path: "/dashboard" });
    navItems.push({ label: "Post Job", path: "/create-job" });
  }

  if (user.role === "interviewer") {
    navItems.push({ label: "My Interviews", path: "/interviewer-dashboard" });
  }

  if (user.role === "hiring_manager" || user.role === "admin") {
    navItems.push({ label: "Rejected Candidates", path: "/rejected" });
  }

  // Logout is always last
  navItems.push({ label: "Logout", onClick: handleLogout, isLogout: true });

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "primary.main",
        boxShadow: 2,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
        {/* Logo / Home */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
            }}
            onClick={handleHome}
          >
            ATS Pro
          </Typography>
        </Box>

        {/* Mobile: Hamburger Menu */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Drawer (Mobile Menu) */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{
                  width: 280,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    ATS Pro
                  </Typography>
                  <IconButton onClick={() => setDrawerOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Navigation Links */}
                <List sx={{ flexGrow: 1 }}>
                  {navItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (item.path) navigate(item.path);
                          if (item.onClick) item.onClick();
                          setDrawerOpen(false);
                        }}
                        sx={{
                          color: item.isLogout ? "error.main" : "text.primary",
                          fontWeight: item.isLogout ? 600 : 500,
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                <Divider />

                {/* Optional footer in drawer */}
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Logged in as {user.role}
                  </Typography>
                </Box>
              </Box>
            </Drawer>
          </>
        ) : (
          /* Desktop: Horizontal Buttons */
          <Box display="flex" gap={2} alignItems="center">
            {navItems.map((item, index) => (
              <Button
                key={index}
                color="inherit"
                onClick={() => {
                  if (item.path) navigate(item.path);
                  if (item.onClick) item.onClick();
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: item.isLogout ? "error.light" : "inherit",
                  "&:hover": {
                    bgcolor: item.isLogout ? "error.dark" : "primary.dark",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};