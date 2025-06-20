import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/navbar';
import HomePage from './pages/homePage';
import AuthPage from './pages/AuthPage';
import AccountInfoPage from './pages/AccountInfoPage';
import './App.css';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',   
    },
    primary: {
      main: '#085c54', 
    },
    secondary: {
      main: '#1976d2', 
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  }
});

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.error('Google OAuth Client ID is not set in environment variables');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account-info" element={<AccountInfoPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
