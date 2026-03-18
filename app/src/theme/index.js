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
      main: "#4B5D52", // Deep muted green (sidebar/header)
      light: "#6F8577",
      dark: "#2F3E35",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#D8D2C2", // Beige tone (header background feel)
      light: "#ECE7DC",
      dark: "#BFB7A4",
    },

    success: {
      main: "#6BAF92", // Soft green success
    },

    background: {
      default: "#F5F3EE", // warm light background
      paper: "#FFFFFF",
    },

    text: {
      primary: "#2E2E2E",
      secondary: "#6B6B6B",
    },
  },

  shape: { borderRadius: 14 },

  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "0 4px 12px rgba(75, 93, 82, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 20px rgba(75, 93, 82, 0.3)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  },
});

export default theme;