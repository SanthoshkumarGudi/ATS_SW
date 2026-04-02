// src/theme/index.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  zIndex: {
    appBar: 1100,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  palette: {
    mode: "light",

    primary: {
      main: "#1a365d",        // Classic deep navy blue
      light: "#2c5282",
      dark: "#0f2a4a",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#64748b",        // Classic slate gray
      light: "#94a3b8",
      dark: "#475569",
    },

    success: {
      main: "#15803d",        // Deep forest green (classic & trustworthy)
      light: "#4ade80",
      dark: "#166534",
    },

    background: {
      default: "#f8fafc",     // Very clean off-white
      paper: "#ffffff",
    },

    text: {
      primary: "#1e2937",
      secondary: "#64748b",
    },

    divider: "#e2e8f0",
  },

  shape: {
    borderRadius: 12,         // Classic subtle rounding
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "12px 32px",
          fontWeight: 600,
          boxShadow: "0 4px 12px rgba(26, 54, 93, 0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 25px rgba(26, 54, 93, 0.25)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #1a365d 0%, #2c5282 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #0f2a4a 0%, #1a365d 100%)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 25px rgba(26, 54, 93, 0.08)",
          border: "1px solid rgba(226, 232, 240, 0.7)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 40px rgba(26, 54, 93, 0.12)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;