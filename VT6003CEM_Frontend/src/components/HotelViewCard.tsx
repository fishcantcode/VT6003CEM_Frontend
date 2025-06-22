import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  IconButton,
  Button
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import type { HotelInfo } from '../types/hotel';
import hotelImage from '../assets/hotel.jpg';
import { useNavigate } from 'react-router-dom';
import { createChatRoomWithOffer, sendMessage } from '../api/chatService';

interface HotelViewCardProps {
  hotel: HotelInfo;
  userRole?: string | null;
  isFavorite?: boolean;
  onToggleFavorite?: (placeId: string) => void;
}

const HotelViewCard: React.FC<HotelViewCardProps> = ({ hotel, userRole, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(hotel.place_id);
    }
  };

  const handleCreateOffer = async () => {
    try {
      const chatRoom = await createChatRoomWithOffer(hotel.place_id);
      navigate(`/chat/${chatRoom.id}`);
    } catch (err) {
      console.error('Failed to create chat room from ViewAllHotels:', err);
    }
  };

  return (
    <Card sx={{ 
      display: 'flex',
      borderRadius: 2, 
      overflow: 'hidden',
      boxShadow: 2,
      position: 'relative',
      width: '100%',
    }}>
      <Box sx={{ position: 'relative', width: { xs: 150, sm: 250 }, flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          image={hotelImage}
          alt={hotel.name}
        />
        {userRole !== 'operator' && (
          <IconButton
            onClick={handleFavorite}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              zIndex: 2
            }}
          >
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            {hotel.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {hotel.vicinity || hotel.formatted_address}
          </Typography>
          
          {hotel.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    width: 'fit-content',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    mr: 1
                }}>
                    <Typography variant="body2" fontWeight="bold">
                      {hotel.rating.toFixed(1)}
                    </Typography>
                </Box>
                {hotel.user_ratings_total && (
                  <Typography variant="body2" color="text.secondary">
                    {hotel.user_ratings_total} reviews
                  </Typography>
                )}
            </Box>
          )}
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button 
                variant="contained" 
                color="primary"
                onClick={handleCreateOffer}
            >
                Create Offer
            </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default HotelViewCard;
