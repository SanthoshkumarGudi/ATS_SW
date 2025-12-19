// frontend/src/utils/axiosConfig.js
import axios from "axios";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Optional: refresh on every app load
axios.interceptors.request.use((config) => {
  const currentToken = localStorage.getItem("token");
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

export default axios;
