import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { mockHotels } from '../mock/hotelData';
import type { Hotel } from '../mock/hotelData';

const emptyHotel: Omit<Hotel, 'id'> = {
  name: '',
  location: '',
  images: [],
  amenities: [],
  descriptionTitle: '',
  description: '',
  isFullyRefundable: false,
  canCollectStamps: false,
  rating: { score: 0, label: '', reviewCount: 0 },
  price: { original: 0, current: 0, total: 0, currency: '', discountPercentage: 0 },
  isAd: false,
};

const OperatorPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [hotelForm, setHotelForm] = useState<any>({ ...emptyHotel });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [googleHotelName, setGoogleHotelName] = useState('');

  const handleOpen = (index: number | null = null) => {
    setEditIndex(index);
    if (index !== null) {
      setHotelForm({ ...hotels[index] });
    } else {
      setHotelForm({ ...emptyHotel });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setHotelForm({ ...emptyHotel });
    setEditIndex(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHotelForm({ ...hotelForm, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    if (editIndex !== null) {
      const updated = hotels.slice();
      updated[editIndex] = { ...hotelForm, id: hotels[editIndex].id };
      setHotels(updated);
    } else {
      setHotels([
        ...hotels,
        { ...hotelForm, id: (Date.now() + Math.random()).toString() }
      ]);
    }
    handleClose();
  };

  const handleDelete = (index: number) => {
    setHotels(hotels.filter((_, i) => i !== index));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Operator: Manage Hotels
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen(null)}>
          Add Hotel
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setGoogleDialogOpen(true)}>
          Add Hotel by Google
        </Button>
      </Box>
      <TextField
        label="Search by name or location"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        onChange={e => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="hotels table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.filter(hotel =>
              hotel.name.toLowerCase().includes(search.toLowerCase()) ||
              hotel.location.toLowerCase().includes(search.toLowerCase())
            ).map((hotel, idx) => (
              <TableRow key={hotel.id}>
                <TableCell component="th" scope="row">
                  {hotel.name}
                </TableCell>
                <TableCell>{hotel.location}</TableCell>
                <TableCell>{hotel.description.slice(0, 50)}...</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpen(idx)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(idx)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Google Hotel Search Dialog */}
      <Dialog open={googleDialogOpen} onClose={() => setGoogleDialogOpen(false)}>
        <DialogTitle>Find Hotel by Google</DialogTitle>
        <DialogContent>
          <TextField
            label="Hotel Name"
            value={googleHotelName}
            onChange={e => setGoogleHotelName(e.target.value)}
            fullWidth
            autoFocus
            margin="normal"
            disabled={googleLoading}
          />
          {googleError && <Typography color="error">{googleError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGoogleDialogOpen(false)} disabled={googleLoading}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!googleHotelName || googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              setGoogleError(null);
              try {
                await new Promise(res => setTimeout(res, 1000));
                const mockResult = {
                  name: googleHotelName,
                  location: 'Mock City',
                  descriptionTitle: 'Found via Google Places',
                  description: 'This hotel was fetched using the Google Places API (mocked).',
                  images: [],
                  amenities: [],
                  isFullyRefundable: false,
                  canCollectStamps: false,
                  rating: { score: 0, label: '', reviewCount: 0 },
                  price: { original: 0, current: 0, total: 0, currency: '', discountPercentage: 0 },
                  isAd: false,
                };
                setHotelForm({ ...emptyHotel, ...mockResult });
                setOpen(true);
                setGoogleDialogOpen(false);
                setGoogleHotelName('');
              } catch (e) {
                setGoogleError('Failed to fetch hotel data.');
              } finally {
                setGoogleLoading(false);
              }
            }}
          >
            {googleLoading ? 'Searching...' : 'Search & Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Edit Hotel' : 'Add Hotel'}</DialogTitle>
        <DialogContent>
          {/* Images Section at Top */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Images</Typography>
            {/* Large Preview Window */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              {hotelForm.images && hotelForm.images.length > 0 ? (
                <img
                  src={hotelForm.images[hotelForm.selectedImgIdx ?? 0]}
                  alt="preview"
                  style={{ maxHeight: 200, maxWidth: '90%', borderRadius: 8, border: '1px solid #eee', objectFit: 'contain' }}
                />
              ) : (
                <Box sx={{ height: 200, width: '90%', bgcolor: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', border: '1px dashed #ccc' }}>
                  No image selected
                </Box>
              )}
            </Box>
            <Button
              variant="outlined"
              component="label"
              sx={{ mr: 2 }}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  Promise.all(
                    files.map(file => {
                      return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                      });
                    })
                  ).then(imgs => {
                    setHotelForm((prev: any) => ({
                      ...prev,
                      images: [...(prev.images || []), ...imgs],
                      selectedImgIdx: prev.images && prev.images.length > 0 ? prev.selectedImgIdx : 0
                    }));
                  });
                }}
              />
            </Button>
            {/* Add Image by URL */}
            <TextField
              label="Add Image URL"
              size="small"
              sx={{ width: 300, mr: 2 }}
              onKeyDown={e => {
                const input = e.target as HTMLInputElement;
                if (e.key === 'Enter' && input.value) {
                  setHotelForm((prev: any) => ({
                    ...prev,
                    images: [...(prev.images || []), input.value],
                    selectedImgIdx: prev.images && prev.images.length > 0 ? prev.selectedImgIdx : 0
                  }));
                  input.value = '';
                }
              }}
              placeholder="Paste image URL and press Enter"
            />
            {/* Thumbnails */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {(hotelForm.images || []).map((img: string, idx: number) => (
                <Box key={idx} sx={{ position: 'relative', width: 60, height: 60, cursor: 'pointer', border: hotelForm.selectedImgIdx === idx ? '2px solid #1976d2' : '1px solid #eee', borderRadius: 2 }} onClick={() => setHotelForm((prev: any) => ({ ...prev, selectedImgIdx: idx }))}>
                  <img
                    src={img}
                    alt={`hotel-img-${idx}`}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: -10, right: -10, background: '#fff' }}
                    onClick={ev => {
                      ev.stopPropagation();
                      setHotelForm((prev: any) => {
                        const newImgs = prev.images.filter((_: any, i: number) => i !== idx);
                        let newIdx = prev.selectedImgIdx;
                        if (newIdx >= newImgs.length) newIdx = newImgs.length - 1;
                        if (newIdx < 0) newIdx = 0;
                        return { ...prev, images: newImgs, selectedImgIdx: newIdx };
                      });
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
          <TextField
            margin="normal"
            label="Hotel Name"
            name="name"
            fullWidth
            value={hotelForm.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Location"
            name="location"
            fullWidth
            value={hotelForm.location}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Description Title"
            name="descriptionTitle"
            fullWidth
            value={hotelForm.descriptionTitle}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            fullWidth
            multiline
            minRows={2}
            value={hotelForm.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OperatorPage;
