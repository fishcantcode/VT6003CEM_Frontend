import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AccountInfoPage from './pages/AccountInfoPage';
import OperatorPage from './pages/OperatorPage';
import InboxPage from './pages/InboxPage';
import HotelListPage from './pages/HotelListPage'; // Import the new page
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
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/account-info" element={<AccountInfoPage />} />
                <Route path="/operator" element={<OperatorPage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/hotels" element={<HotelListPage />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
