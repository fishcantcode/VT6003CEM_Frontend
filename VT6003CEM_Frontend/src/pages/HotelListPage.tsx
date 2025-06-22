import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { LocationOn, People, Search as SearchIcon } from '@mui/icons-material';
import HotelCard from '../components/HotelCard';
import { getGoogleLocation } from '../services/googleLocationService';
import type { HotelInfo } from '../types/hotel';
import { updateHotel } from '../api/hotelServices';

const HotelListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [location, setLocation] = useState(searchParams.get('search') || 'Hong Kong Hyatt hotel');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  
  const [hotels, setHotels] = useState<HotelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    setLocation(searchParams.get('search') || 'Hong Kong Hyatt hotel');
    setCheckIn(searchParams.get('checkIn') || '');
    setCheckOut(searchParams.get('checkOut') || '');
    setGuests(searchParams.get('guests') || '2');
  }, [searchParams]);
  
  useEffect(() => {
  
    handleSearch();
  
  }, []);

  const handleStatusToggle = async (hotelId: string, newStatus: 'available' | 'unavailable') => {
    setStatusLoading(hotelId);
    setStatusError(null);
    try {
      const token = localStorage.getItem('token') || '';
      setHotels(prevHotels =>
        prevHotels.map(hotel =>
          hotel.place_id === hotelId ? { ...hotel, status: newStatus } : hotel
        )
      );
    } catch (err: any) {
      setStatusError(err.message || 'Failed to update hotel status');
    } finally {
      setStatusLoading(null);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getGoogleLocation(location);
      setHotels(results);
    } catch (err) {
      setError('Failed to fetch hotels. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newParams = new URLSearchParams();
    if (location) newParams.set('search', location);
    if (checkIn) newParams.set('checkIn', checkIn);
    if (checkOut) newParams.set('checkOut', checkOut);
    if (guests) newParams.set('guests', guests);
    setSearchParams(newParams);
    
    handleSearch();
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Hotels
        </Typography>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          elevation={3}
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                fullWidth
                label="Check-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                fullWidth
                label="Check-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ height: '100%' }}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <Box
                key={hotel.place_id}
                sx={{ p: 1, width: { xs: '100%', sm: '50%', md: '33.333%' } }}
              >
                <HotelCard hotel={hotel} />
              </Box>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
              No hotels found matching your search criteria.
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default HotelListPage;
