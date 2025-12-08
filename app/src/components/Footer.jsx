// src/components/Footer.jsx
import { Box, Typography, Link, Container } from '@mui/material';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [version, setVersion] = useState('1.0.0');

  useEffect(() => {
    // Vite injects __APP_VERSION__ at build time
    const currentVersion = __APP_VERSION__ || '1.0.0';

    // Optional: show "NEW" badge for 7 days after version change
    const savedVersion = localStorage.getItem('atsProVersion');
    if (savedVersion !== currentVersion) {
      localStorage.setItem('atsProVersion', currentVersion);
      localStorage.setItem('atsProVersionDate', Date.now().toString());
    }

    setVersion(currentVersion);
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        py: 4,
        borderTop: '1px solid #e5e7eb',
        bgcolor: '#fafafa',
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          textAlign={{ xs: 'center', sm: 'left' }}
        >
          {/* Left */}
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} <strong>ATS Pro</strong>
          </Typography>

          {/* Center Links */}
          <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
            {['Policy', 'Terms', 'Contact'].map((text) => (
              <Link
                key={text}
                href="#"
                underline="none"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  '&:hover': { color: 'black' },
                }}
              >
                {text}
              </Link>
            ))}
          </Box>

          {/* Right */}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: '#6b7280',
            }}
          >
            v{version}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
