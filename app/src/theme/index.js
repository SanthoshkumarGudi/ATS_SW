// src/theme/index.js  ← REPLACE YOUR ENTIRE FILE WITH THIS
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
      main: "#4A90E2", // Soft Blue
      light: "#7AB8F5",
      dark: "#2E6BB0",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A7E6D7", // Pale Mint
      light: "#C8F0E8",
      dark: "#85B8A8",
    },
    success: {
      main: "#50C878",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D3436",
      secondary: "#636E72",
    },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          padding: "12px 28px",
          fontWeight: 600,
          boxShadow: "0 4px 16px rgba(74, 144, 226, 0.2)",
          transition: "all 0.35s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px rgba(74, 144, 226, 0.3)",
          },
        },
        // REMOVE ALL GRADIENT HERE — MUI will crash!
        // containedPrimary: { ... } ← DELETE THIS ENTIRE BLOCK
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 10px 30px rgba(74, 144, 226, 0.1)",
          border: "1px solid rgba(167, 230, 215, 0.2)",
          transition: "all 0.4s ease",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 20px 40px rgba(80, 200, 120, 0.15)",
          },
        },
      },
    },
  },
});

export default theme;
