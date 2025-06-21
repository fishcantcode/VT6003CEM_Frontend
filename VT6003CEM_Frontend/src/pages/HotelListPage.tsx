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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { LocationOn, People, Search as SearchIcon } from '@mui/icons-material';
import { mockHotels } from '../mock/hotelData';
import HotelCard from '../components/HotelCard';

const HotelListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for search fields
  const [location, setLocation] = useState(searchParams.get('search') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');

  // Update state when URL search params change
  useEffect(() => {
    setLocation(searchParams.get('search') || '');
    setCheckIn(searchParams.get('checkIn') || '');
    setCheckOut(searchParams.get('checkOut') || '');
    setGuests(searchParams.get('guests') || '2');
  }, [searchParams]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newParams = new URLSearchParams();
    if (location) newParams.set('search', location);
    if (checkIn) newParams.set('checkIn', checkIn);
    if (checkOut) newParams.set('checkOut', checkOut);
    if (guests) newParams.set('guests', guests);
    setSearchParams(newParams);
  };

  // Filter hotels based on location/name.
  // NOTE: Date and guest count filtering is not implemented as mock data does not support it.
  const filteredHotels = mockHotels.filter((hotel) => {
    const locationMatch =
      location.trim() === '' ||
      hotel.name.toLowerCase().includes(location.toLowerCase()) ||
      hotel.location.toLowerCase().includes(location.toLowerCase());

    // In a real application, you would also filter by date and guest count.
    // For this mock setup, we only filter by location.
    return locationMatch;
  });

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

      <Box>
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
            No hotels found matching your search criteria.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HotelListPage;
