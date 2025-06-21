import React, { useState } from 'react';
import type { Hotel } from '../mock/hotelData';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, Chip } from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChevronLeft,
  ChevronRight,
  Pool,
  HotTub,
} from '@mui/icons-material';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.length) % hotel.images.length);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card sx={{ display: 'flex', borderRadius: 4, my: 2, boxShadow: 3, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
      {/* Image Section */}
      <Box sx={{ position: 'relative', width: { xs: '100px', sm: '300px' }, flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ height: '100%', width: '100%' }}
          image={hotel.images[currentImageIndex]}
          alt={hotel.name}
        />
        {hotel.isAd && (
          <Chip label="Ad" size="small" sx={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', zIndex: 1 }} />
        )}
        <IconButton
          onClick={handleFavorite}
          sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' }, zIndex: 1 }}
        >
          {isFavorited ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        {hotel.images.length > 1 && (
          <>
            <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)'} }}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextImage} sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)'} }}>
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flex: '1 0 auto', p: { xs: 1, sm: 2 } }}>
        <Typography component="div" variant="h5" fontWeight="bold">
          {hotel.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {hotel.location}
        </Typography>
        <Typography variant="body1" fontWeight="bold" sx={{ my: 1 }}>
          {hotel.descriptionTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hotel.description}
        </Typography>
        {hotel.isFullyRefundable && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
            Fully refundable
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelCard;
