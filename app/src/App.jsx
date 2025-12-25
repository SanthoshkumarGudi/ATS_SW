// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
// Pages
import AuthPage from "./pages/AuthPage";
import JobsList from "./pages/JobsList";
import ApplyJobFlow from "./pages/ApplyJobFlow";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import CandidateProfileForm from "./pages/CandidateProfileForm";
import GoBackButton from "./GoBack";
import EditJob from "./pages/EditJob";
import  Home  from "./pages/Home"; // Import the Home component
import MyApplications from "./pages/MyApplications"; // Import for new route
import { Navbar } from "./components/Navbar"; // Import the new Navbar
import Footer from "./components/Footer";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import EditCandidateProfile from "./pages/EditCandidateProfile";
import RejectedCandidates from "./pages/RejectedCandidates";

export default function App() {
  const { user, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState(null); // null = checking

  // Only check profile if candidate and logged in
  useEffect(() => {
    if (!user || user.role !== "candidate") {
      setHasProfile(null);
      return;
    }

    axios
      .get("http://localhost:5000/api/candidate/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => setHasProfile(true))
      .catch((err) => setHasProfile(err.response?.status !== 404));
  }, [user]);

  // Show loading while checking auth
  if (loading || (user?.role === "candidate" && hasProfile === null)) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography>Loading your session...</Typography>
      </Box>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />{" "}
        {/* Added Navbar here - it conditionally renders based on auth */}
        {/* MAIN CONTENT AREA - pushes footer down when tall */}
        <Box
          sx={{
            minHeight: "100vh",
            pt: { xs: 8, sm: 10 }, // space for fixed navbar
            pb: { xs: 10, sm: 12 }, // space for fixed footer
            boxSizing: "border-box",
          }}
        >
          {/* <GoBackButton /> */}
          <Routes>
            {/* Public */}
            <Route
              path="/login"
              element={!user ? <AuthPage /> : <Navigate to="/" />}
            />

            {/* Home Route - Renders Home component, redirects if not authenticated */}
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />

            {/* Candidate Routes */}
            <Route
              path="/jobs"
              element={
                user?.role === "candidate" ? (
                  hasProfile ? (
                    <JobsList />
                  ) : (
                    <CandidateProfileForm />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/apply/:jobId"
              element={
                user?.role === "candidate" ? (
                  <ApplyJobFlow />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* HM / Admin Routes */}
            <Route
              path="/dashboard"
              element={
                user && user.role !== "candidate" ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/create-job"
              element={
                user && user.role !== "candidate" ? (
                  <CreateJob />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Root Redirect */}
            {/* <Route
          path="/"
          element={
            user ? (
              user.role === "candidate" ? (
                <Navigate to="/jobs" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}

            {/* Edit Job*/}
            <Route
              path="/job/edit/:jobId"
              element={
                user && user.role !== "candidate" ? (
                  <EditJob />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Edit Candidate Profile */}
            <Route
              path="/profile/edit"
              element={<EditCandidateProfile user />}
            />

            {/* Go to My Appllication */}
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="*" element={<Navigate to="/" />} />

            {/* for handling the interview */}
            <Route
              path="/interviewer-dashboard"
              element={
                user?.role === "interviewer" ? (
                  <InterviewerDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/rejected" element={<RejectedCandidates />} />
          </Routes>
          <Footer />
        </Box>
      </BrowserRouter>
    </>
  );
}
