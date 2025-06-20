import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import brandLogo from '../assets/brandLogo.png'; 

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigateToAccount = () => {
    navigate('/account-info');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#085c54' }}>
      <Toolbar> 
        <IconButton
          edge="start"
          color="primary"
          aria-label="home"
          component={RouterLink}
          to="/"
          sx={{ mr: 2 }}
        >
          <img 
            src={brandLogo} 
            alt="Brand Logo" 
            style={{ 
              height: '40px',
              filter: 'brightness(0) invert(1)' 
            }} 
          />
        </IconButton>
        {/* this session for texting only will be removeed in next verison*/}       
        {/* <IconButton 
          color="inherit"
          onClick={handleNavigateToAccount}
          sx={{ ml: 1 }} 
        >
          <AccountCircleIcon />
        </IconButton> */}
        <Box sx={{ flexGrow: 1 }} /> 

        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/auth"
          sx={{ ml: 'auto' }}
        >
          Login / Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
