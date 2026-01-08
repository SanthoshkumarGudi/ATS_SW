import axios from "axios";

// This automatically picks the correct URL:
// - Local dev: http://localhost:5000 (from .env)
// - Production: https://ats-sw.onrender.com (from .env.production)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Set the base URL for all axios requests
axios.defaults.baseURL = `${API_BASE_URL}/api`;

// Optional: Automatically add JWT token to every request if user is logged in
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Handle common errors (e.g., 401 logout)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;