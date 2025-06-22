import React, { useEffect, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  IconButton, 
  Avatar, 
  Typography, 
  Menu, 
  MenuItem 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import brandLogo from '../assets/brandLogo.png';
import { authService } from '../api/authService';
import type { User } from '../types/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is logged in on component mount and on auth changes
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
      
      if (isAuthenticated) {
        const userData = authService.getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes (e.g., login/logout from other tabs or within the same tab)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    handleClose();
    navigate('/auth');
  };

  const getUserInitials = (user: User | null): string => {
    if (!user) return '';
    if (user.firstname) return user.firstname.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return '';
  };

  const getUserDisplayName = (user: User | null): string => {
    if (!user) return '';
    if (user.firstname) return user.firstname;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#085c54' }}>
      <Toolbar>
        {/* Logo/Brand */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          component={RouterLink}
          to="/"
          sx={{ mr: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
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

        {/* Navigation Buttons - Only show if logged in */}
        {isLoggedIn && (
          <>
            {user?.isOperator && (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/operator"
                sx={{ mr: 1 }}
              >
                Operator Page
              </Button>
            )}
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/inbox"
              sx={{ mr: 1 }}
            >
              Inbox
            </Button>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* User Account Section */}
        {isLoggedIn && user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                mr: 2, 
                display: { xs: 'none', sm: 'block' },
                color: 'white'
              }}
            >
              Hi, {getUserDisplayName(user)}
            </Typography>
            <IconButton
              onClick={handleAccountMenu}
              color="inherit"
              sx={{ 
                p: 0, 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                }
              }}
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'white', 
                  color: '#085c54',
                  width: 36,
                  height: 36,
                  fontSize: '1rem'
                }}
              >
                {getUserInitials(user) || <AccountCircleIcon />}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem 
                component={RouterLink} 
                to="/account-info" 
                onClick={handleClose}
              >
                My Account
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/auth"
            sx={{ 
              ml: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '4px',
              padding: '6px 16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Login / Sign Up
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
