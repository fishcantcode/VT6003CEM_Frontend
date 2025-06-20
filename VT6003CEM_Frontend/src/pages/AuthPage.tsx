import { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { authService, type SignupData } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOperator, setIsOperator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    operatorCode: ''
  });

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Here you would typically send the credential to your backend for verification
      console.log('Google auth success:', credentialResponse);
      
      // For now, we'll just redirect to home
      // In a real app, you would verify the token with your backend
      navigate('/');
    } catch (error: any) {
      setError('Failed to authenticate with Google. Please try again.');
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        // This is just a placeholder - authentication is handled by the backend
        // You would typically call an API endpoint here
        console.log('Login attempt with:', { email: formData.email });
        navigate('/');
      } else {
        // Handle signup
        const userData: SignupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isOperator: isOperator,
          ...(isOperator && { operatorCode: formData.operatorCode })
        };
        
        await authService.signup(userData);
        // After successful signup, redirect to home or show success message
        navigate('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleOperatorCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      operatorCode: e.target.value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      email: e.target.value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      password: e.target.value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          {isLogin ? 'Sign In' : 'Create an account'}
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Tabs
            value={isLogin ? 0 : 1}
            onChange={(_, newValue) => {
              setIsLogin(newValue === 0);
              setError(null);
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>



          <Box component="form" onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus={!isLogin}
                value={formData.name}
                onChange={handleNameChange}
                sx={{ mb: 2 }}
              />
            )}
            
            {!isLogin && isOperator && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="operatorCode"
                label="Operator Code"
                name="operatorCode"
                type="password"
                value={formData.operatorCode}
                onChange={handleOperatorCodeChange}
                sx={{ mb: 2 }}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleEmailChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />


            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {!isLogin && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isOperator}
                    onChange={(e) => setIsOperator(e.target.checked)}
                    color="primary"
                  />
                }
                label="I am an operator"
                sx={{ mt: 1, mb: 2 }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Link 
                component="button" 
                variant="body2"
                onClick={() => setIsLogin(!isLogin)}
                sx={{ color: '#085c54' }}
              >
                {isLogin 
                  ? "Don't have an account? Sign Up" 
                  : 'Already have an account? Sign In'}
              </Link>
            </Box>

            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">OR</Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                text={isLogin ? 'signin_with' : 'signup_with'}
                shape="rectangular"
                width="100%"
                size="large"
                type="standard"
                theme="outline"
                logo_alignment="left"
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;
