import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface HotelImageThumbnailsProps {
  images: string[];
  selectedImgIdx: number;
  onSelect: (idx: number) => void;
  onDelete: (idx: number) => void;
}

const HotelImageThumbnails: React.FC<HotelImageThumbnailsProps> = ({ images, selectedImgIdx, onSelect, onDelete }) => (
  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
    {images.map((_, idx) => (
      <Box
        key={idx}
        sx={{
          position: 'relative',
          width: 60,
          height: 60,
          cursor: 'pointer',
          border: selectedImgIdx === idx ? '2px solid #1976d2' : '1px solid #eee',
          borderRadius: 2,
        }}
        onClick={() => onSelect(idx)}
      >
        <img
          src={'/hotel.jpg'}
          alt={`hotel-img-${idx}`}
          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
        />
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: -10, right: -10, background: '#fff' }}
          onClick={ev => {
            ev.stopPropagation();
            onDelete(idx);
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    ))}
  </Box>
);

export default HotelImageThumbnails;
