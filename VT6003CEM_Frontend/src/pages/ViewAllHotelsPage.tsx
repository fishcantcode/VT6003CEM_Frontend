import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Stack
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import HotelViewCard from '../components/HotelViewCard';
import { getAllHotels, getFavoriteHotels, addFavoriteHotel, removeFavoriteHotel } from '../api/hotelServices';
import type { HotelInfo } from '../types/hotel';

const ViewAllHotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<Set<string>>(new Set());

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavoriteHotels();
      setFavoritePlaceIds(new Set(data.map(hotel => hotel.place_id)));
      const allHotels = await getAllHotels();
      setHotels(allHotels);
    } catch (err: any) {
      console.error('Error fetching hotels:', err);
      setError(err.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHotelsOnly = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllHotels();
      setHotels(data);
    } catch (err: any) {
      console.error('Error fetching hotels:', err);
      setError(err.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserJSON = localStorage.getItem('user');
    let userToken: string | null = null;

    if (storedUserJSON) {
      try {
        const storedUser = JSON.parse(storedUserJSON);
        userToken = storedUser?.token || null;
        setUserRole(storedUser?.role || null);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }

    if (userToken) {
      fetchInitialData();
    } else {
      fetchAllHotelsOnly();
    }
  }, []);

  const handleToggleFavorite = async (placeId: string) => {
  
    const isCurrentlyFavorite = favoritePlaceIds.has(placeId);

    try {
      if (isCurrentlyFavorite) {
        await removeFavoriteHotel(placeId);
        setFavoritePlaceIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(placeId);
          return newSet;
        });
      } else {
        await addFavoriteHotel(placeId);
        setFavoritePlaceIds(prev => new Set(prev).add(placeId));
      }
    } catch (err) {
      console.error('Failed to update favorite status:', err);
      setError('Could not update favorite status. Please try again.');
    }
  };

  const filteredHotels = hotels.filter(hotel => {
    const query = searchQuery.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(query) ||
      (hotel.formatted_address && hotel.formatted_address.toLowerCase().includes(query)) ||
      (hotel.vicinity && hotel.vicinity.toLowerCase().includes(query))
    );
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        View All Hotels
      </Typography>
      
      {/* Search Box */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField 
            fullWidth
            variant="outlined"
            placeholder="Search hotels by name or location"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ ml: 2, height: '56px' }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Hotel Count */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              {filteredHotels.length} hotels found
            </Typography>
          </Box>
          
          {/* Hotel Grid */}
          <Stack spacing={3}>
            {filteredHotels.map((hotel) => (
              <HotelViewCard 
                hotel={hotel} 
                key={hotel.place_id} 
                userRole={userRole} 
                isFavorite={favoritePlaceIds.has(hotel.place_id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
            {filteredHotels.length === 0 && !loading && (
              <Box>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 6 }}>
                  No hotels found matching your search criteria.
                </Typography>
              </Box>
            )}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default ViewAllHotelsPage;
