import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box 
    component="footer" 
    sx={{ 
      py: 3, 
      px: 2, 
      mt: 'auto',
      backgroundColor: '#f5f5f5',
      textAlign: 'center',
      borderTop: '1px solid #e0e0e0',
      width: '100%',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Created by fishfish
    </Typography>
  </Box>
);

export default Footer;
