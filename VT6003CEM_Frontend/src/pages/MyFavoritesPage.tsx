import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import HotelViewCard from '../components/HotelViewCard';
import { getFavoriteHotels, removeFavoriteHotel } from '../api/hotelServices';
import type { HotelInfo } from '../types/hotel';

const MyFavoritesPage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserJSON = localStorage.getItem('user');

    if (storedUserJSON) {
      try {
        const storedUser = JSON.parse(storedUserJSON);
        setUserRole(storedUser?.role || null);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFavoriteHotels();
        setHotels(data);
      } catch (err: any) {
        console.error('Error fetching favorite hotels:', err);
        setError(err.message || 'Failed to load favorite hotels');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggleFavorite = async (placeId: string) => {
  
    const isFavorite = hotels.some(h => h.place_id === placeId);

    if (isFavorite) {
      try {
        await removeFavoriteHotel(placeId);
        setHotels(prev => prev.filter(h => h.place_id !== placeId));
      } catch (err) {
        console.error('Failed to remove favorite:', err);
      }
    }
  
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorite Hotels
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          {hotels.length === 0 ? (
            <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 6 }}>
              You haven't saved any favorite hotels yet.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {hotels.map((hotel) => (
                <HotelViewCard 
                  hotel={hotel} 
                  key={hotel.place_id} 
                  userRole={userRole} 
                  isFavorite={true} // All hotels on this page are favorites
                  onToggleFavorite={handleToggleFavorite} 
                />
              ))}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
};

export default MyFavoritesPage;
