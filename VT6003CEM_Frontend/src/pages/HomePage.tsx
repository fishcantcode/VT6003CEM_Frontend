import React from 'react';
import { Typography, Container, Box, useTheme } from '@mui/material';

const HomePage: React.FC = () => {
  const theme = useTheme();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Box sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          minHeight: '80vh',
          justifyContent: 'center',
          textAlign: 'center',
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 1
        }}>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
