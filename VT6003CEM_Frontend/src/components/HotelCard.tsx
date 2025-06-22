import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { HotelInfo } from '../types/hotel';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, Rating } from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn, Star } from '@mui/icons-material';
import hotelImage from '../assets/hotel.jpg';

interface HotelCardProps {
  hotel: HotelInfo;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card
      sx={{
        display: 'flex', 
        borderRadius: 4, 
        my: 2, 
        boxShadow: 3, 
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: 6 
        }
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', width: { xs: '100px', sm: '300px' }, flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ height: '100%', width: '100%' }}
          image={hotelImage}
          alt={hotel.name}
        />
        <IconButton
          onClick={handleFavorite}
          sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' }, zIndex: 1 }}
        >
          {isFavorited ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flex: '1 0 auto', p: { xs: 1, sm: 2 } }}>
        <Typography component="div" variant="h5" fontWeight="bold">
          {hotel.name}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <Rating
            value={hotel.rating}
            precision={0.1}
            readOnly
            size="small"
            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Typography variant="body2" color="text.secondary" ml={0.5}>
            {hotel.rating?.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" ml={1}>
            ({hotel.user_ratings_total} reviews)
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <LocationOn color="action" fontSize="small" />
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {hotel.vicinity || hotel.formatted_address}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
