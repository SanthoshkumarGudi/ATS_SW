// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
