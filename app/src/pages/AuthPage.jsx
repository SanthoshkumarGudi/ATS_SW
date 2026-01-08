// src/pages/AuthPage.jsx
import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Link,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  // Individual field errors
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Server/general error
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error on typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  // Client-side validation for registration
  const validateRegister = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must contain at least one letter and one number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Run validation only on register
    if (!isLogin && !validateRegister()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    const url = isLogin ? "/api/login" : "/api/register";

    try {
      const res = await axios.post(`${API_URL}${url}`, {
        ...formData,
        email: formData.email.toLowerCase().trim(),
      });

      login(res.data.token, res.data.user);
      window.location.href = '/';
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isLogin ? "Invalid credentials" : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError("");
    setFieldErrors({ name: "", email: "", password: "" });
    setFormData({ name: "", email: "", password: "", role: "candidate" });
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError("");
    setFieldErrors({ name: "", email: "", password: "" });
    setFormData({ name: "", email: "", password: "", role: "candidate" });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          fontWeight="800"
          sx={{
            background: "linear-gradient(120deg, #4f46e5, #14b8a6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 1,
          }}
        >
          ATS Pro
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight="500">
          Intelligent Applicant Tracking System
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Name - Only on Register */}
        {!isLogin && (
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
          />
        )}

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
          autoFocus={isLogin}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
          error={!!fieldErrors.password}
          helperText={fieldErrors.password || "Min 8 chars, 1 letter & 1 number"}
        />

        {/* Role - Only on Register */}
        {!isLogin && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="candidate">Candidate</MenuItem>
              <MenuItem value="hiring_manager">Hiring Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="interviewer">Interviewer</MenuItem>
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, py: 1.5 }}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </Button>
      </Box>

      {/* Divider + Google Login + Toggle */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const { data } = await axios.post(`${API_URL}/api/auth/google`, {
                  credential: credentialResponse.credential,
                });
                login(data.token, data.user);
                window.location.href = '/';
              } catch (err) {
                setError(err.response?.data?.message || 'Google login failed');
              }
            }}
            onError={() => {
              setError('Google Login Failed');
            }}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="340"
          />
        </Box>

        {isLogin ? (
          <Typography variant="body1">
            Don't have an account?{" "}
            <Link component="button" variant="body1" onClick={switchToRegister} sx={{ fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>
        ) : (
          <Typography variant="body1">
            Already have an account?{" "}
            <Link component="button" variant="body1" onClick={switchToLogin} sx={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        )}
      </Box>
    </Container>
  );
}