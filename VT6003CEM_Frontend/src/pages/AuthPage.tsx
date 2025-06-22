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
import { authService, type SignupData, type LoginData } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOperator, setIsOperator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    operatorCode: ''
  });

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Google auth success:', credentialResponse);
      
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!isLogin) {
      if (!formData.username || formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters long';
      }
      if (!formData.firstname) {
        errors.firstname = 'First name is required';
      }
      if (!formData.lastname) {
        errors.lastname = 'Last name is required';
      }
      if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      if (isOperator && !formData.operatorCode.trim()) {
        errors.operatorCode = 'Operator code is required';
      }
    } else {
      // Login validation
      if (formData.password.length < 8) { // Login still requires 8 chars as per backend
        errors.password = 'Password must be at least 8 characters long';
      }
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password
        };
        
        await authService.login(loginData);
        navigate('/');
      } else {
        const userData: SignupData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          isOperator: isOperator,
        };
        if (isOperator) {
          userData.operatorCode = formData.operatorCode.trim();
        }
        try {
          await authService.register(userData);
          setError('Registration successful! You can now sign in.');
          setIsLogin(true);
        } catch (err: any) {
          // Parse backend field errors if present
          try {
            const parsed = JSON.parse(err.message);
            setError(parsed.message);
            if (parsed.errors) {
              const backendFieldErrors: Record<string, string> = {};
              parsed.errors.forEach((e: any) => {
                if (e.path && e.message) {
                  backendFieldErrors[e.path[0]] = e.message;
                }
              });
              setValidationErrors(backendFieldErrors);
            }
          } catch {
            setError(err.message || 'Registration failed.');
          }
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  


  const handleOperatorCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      operatorCode: e.target.value
    }));
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      username: e.target.value
    }));
  };
  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      firstname: e.target.value
    }));
  };
  const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      lastname: e.target.value
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
    <Container component="main" maxWidth="xs" sx={{ mb: 18 }}>
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
            {/* Name fields - only shown on signup */}


            {/* Email field - shown for both login and signup */}
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
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            
            {/* Password field */}
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
              error={!!validationErrors.password}
              helperText={validationErrors.password}
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
            
            {/* Registration-only fields: username, firstname, lastname */}
            {!isLogin && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  error={!!validationErrors.username}
                  helperText={validationErrors.username}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleFirstnameChange}
                  error={!!validationErrors.firstname}
                  helperText={validationErrors.firstname}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleLastnameChange}
                  error={!!validationErrors.lastname}
                  helperText={validationErrors.lastname}
                />
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
              </>
            )}

            {/* Operator code field - only shown on signup when operator is checked */}
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
                error={!!validationErrors.operatorCode}
                helperText={validationErrors.operatorCode}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 3 }}
            >
              {isLoading ? <CircularProgress size={24} /> : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            

            
            {/* Google Sign-In (always show on sign-in tab) */}
            {isLogin && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">OR</Typography>
                </Divider>
                {/* <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                  size="large"
                  type="standard"
                  theme="outline"
                  logo_alignment="left"
                /> */}
              </Box>
            )}

            {/* Google Sign-Up (hide if operator is selected) */}
            {!isLogin && !isOperator && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">OR</Typography>
                </Divider>
                {/* <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  text="signup_with"
                  shape="rectangular"
                  width="100%"
                  size="large"
                  type="standard"
                  theme="outline"
                  logo_alignment="left"
                /> */}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;
