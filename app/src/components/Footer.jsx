// // src/components/Footer.jsx
// import { Box, Typography, Link, Container } from '@mui/material';
// import { useEffect, useState } from 'react';

// const Footer = () => {
//   const [version, setVersion] = useState('1.0.0');

//   useEffect(() => {
//     // Vite injects __APP_VERSION__ at build time
//     const currentVersion = __APP_VERSION__ || '1.0.0';

//     // Optional: show "NEW" badge for 7 days after version change
//     const savedVersion = localStorage.getItem('atsProVersion');
//     if (savedVersion !== currentVersion) {
//       localStorage.setItem('atsProVersion', currentVersion);
//       localStorage.setItem('atsProVersionDate', Date.now().toString());
//     }

//     setVersion(currentVersion);
//   }, []);

//   return (
//     <Box
//       component="footer"
//       sx={{
//         mt: 10,
//         py: 4,
//         borderTop: '1px solid #e5e7eb',
//         bgcolor: '#fafafa',
//       }}
//     >
//       <Container maxWidth="lg">
//         <Box
//           display="flex"
//           flexDirection={{ xs: 'column', sm: 'row' }}
//           justifyContent="space-between"
//           alignItems="center"
//           gap={2}
//           textAlign={{ xs: 'center', sm: 'left' }}
//         >
//           {/* Left */}
//           <Typography variant="body2" color="text.secondary">
//             © {new Date().getFullYear()} <strong>ATS Pro</strong>
//           </Typography>

//           {/* Center Links */}
//           <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
//             {['Policy', 'Terms', 'Contact'].map((text) => (
//               <Link
//                 key={text}
//                 href="#"
//                 underline="none"
//                 sx={{
//                   color: 'text.secondary',
//                   fontSize: '0.9rem',
//                   '&:hover': { color: 'black' },
//                 }}
//               >
//                 {text}
//               </Link>
//             ))}
//           </Box>

//           {/* Right */}
//           <Typography
//             variant="caption"
//             sx={{
//               fontWeight: 600,
//               color: '#6b7280',
//             }}
//           >
//             v{version}
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Footer;

//////////////

// src/components/Footer.jsx
import { Box, Container, Typography, Link } from '@mui/material';
import { useState, useEffect } from 'react';

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
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2.5,
        zIndex: 1200,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {new Date().getFullYear()} <strong>ATS Pro</strong> • All Rights Reserved
          </Typography>

          <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                underline="hover"
                sx={{
                  color: 'white',
                  fontSize: '0.9rem',
                  opacity: 0.85,
                  '&:hover': { opacity: 1 },
                }}
              >
                {item}
              </Link>
            ))}
          </Box>

          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            v1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
