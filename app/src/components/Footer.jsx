// src/components/Footer.jsx
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg" className="footer-inner">
        <Typography variant="body2" className="footer-left">
          © {new Date().getFullYear()} <strong>ATS Pro</strong>
        </Typography>

        <Box className="footer-links">
          {["Privacy Policy", "Terms", "Contact"].map((t) => (
            <Link key={t} href="#" underline="none">{t}</Link>
          ))}
        </Box>

        <Typography variant="caption" className="footer-version">
          v1.5.2
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
