import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { HotelInfo } from '../../types/hotel';

interface HotelTableProps {
  hotels: HotelInfo[];
  search: string;
  onEdit: (placeId: string) => void;
  onDelete: (placeId: string) => void;
  onToggleStatus: (placeId: string) => void;
}

const HotelTable: React.FC<HotelTableProps> = ({ hotels, search, onEdit, onDelete, onToggleStatus }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="hotels table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Address</TableCell>
          <TableCell>Rating</TableCell>
          <TableCell>User Ratings</TableCell>
          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {hotels.filter(hotel =>
          hotel.name.toLowerCase().includes(search.toLowerCase()) ||
          (hotel.formatted_address && hotel.formatted_address.toLowerCase().includes(search.toLowerCase()))
        ).map(hotel => (
          <TableRow key={hotel.place_id}>
            <TableCell component="th" scope="row">
              {hotel.name}
            </TableCell>
            <TableCell>{hotel.formatted_address || hotel.vicinity}</TableCell>
            <TableCell>{hotel.rating}</TableCell>
            <TableCell>{hotel.user_ratings_total}</TableCell>
            <TableCell>
              <Button
                variant={hotel.status === 'available' ? 'contained' : 'outlined'}
                color={hotel.status === 'available' ? 'success' : 'warning'}
                size="small"
                onClick={() => onToggleStatus(hotel.place_id)}
                sx={{ mr: 1 }}
              >
                {hotel.status === 'available' ? 'Available' : 'Unavailable'}
              </Button>
              {/*
                onEdit should open an edit dialog in the parent, and after editing,
                the parent should call the hotelServices API and update state.
                onDelete should call the parent handler, which calls the API and updates state.
              */}
              <IconButton color="primary" onClick={() => onEdit(hotel.place_id)}><Edit fontSize="small" /></IconButton>
              <IconButton color="error" onClick={() => onDelete(hotel.place_id)}><Delete fontSize="small" /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default HotelTable;
