import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { HotelInfo } from '../types/hotel';
import { Box, Card, CardActions, Button, CardContent, CardMedia, Typography, IconButton, Rating } from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn, Star, Message as MessageIcon } from '@mui/icons-material';
import hotelImage from '../assets/hotel.jpg';

interface HotelCardProps {
  hotel: HotelInfo;
  onCreateOffer: (hotel: HotelInfo) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onCreateOffer }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleCreateOfferClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCreateOffer(hotel);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 4,
        boxShadow: 3,
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexGrow: 1 }}>
        {/* Image Section */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', sm: '200px' },
            height: { xs: '150px', sm: 'auto' },
            flexShrink: 0,
          }}
        >
          <CardMedia
            component="img"
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
            image={hotelImage}
            alt={hotel.name}
          />
          <IconButton
            onClick={handleFavorite}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f0f0f0' },
              zIndex: 1,
            }}
          >
            {isFavorited ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
          <Typography component="div" variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
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
            <LocationOn color="action" fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary" component="div">
              {hotel.vicinity || hotel.formatted_address}
            </Typography>
          </Box>
        </CardContent>
      </Box>
      {/* Action Button Section */}
      <CardActions sx={{ p: 2, pt: 1, alignSelf: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<MessageIcon />}
          onClick={handleCreateOfferClick}
        >
          Create Offer
        </Button>
      </CardActions>
    </Card>
  );
};

export default HotelCard;
