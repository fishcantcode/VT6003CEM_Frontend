import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box
} from '@mui/material';

import HotelTable from '../components/operator/HotelTable';
import HotelFormDialog from '../components/operator/HotelFormDialog';
import GoogleHotelDialog from '../components/operator/GoogleHotelDialog';

import type { HotelInfo } from '../types/hotel';
import { getAllHotels, createHotel, updateHotel, deleteHotel, searchHotels, updateHotelStatus } from '../api/hotelServices';
import { getGoogleLocation } from '../services/googleLocationService';
const emptyHotel: HotelInfo = {
  formatted_address: '',
  geometry: { location: { lat: 0, lng: 0 } },
  name: '',
  place_id: '',
  rating: 0,
  user_ratings_total: 0,
  compound_code: '',
  vicinity: '',
  status: 'available',
};

const OperatorPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [hotels, setHotels] = useState<HotelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [hotelForm, setHotelForm] = useState<HotelInfo>({ ...emptyHotel });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [googleHotelName, setGoogleHotelName] = useState('');
  const [googleResults, setGoogleResults] = useState<HotelInfo[]>([]);
  const [googleSearched, setGoogleSearched] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllHotels()
      .then(setHotels)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  
  const handleGoogleSearch = async () => {
    if (!googleHotelName) return;
    setGoogleLoading(true);
    setGoogleError(null);
    setGoogleSearched(false);
    try {
      const results = await getGoogleLocation(googleHotelName);
      setGoogleResults(results.map(result => ({ ...result, status: 'available' })));
      setGoogleSearched(true);
    } catch (e: any) {
      setGoogleError('Failed to fetch hotel data.');
      setGoogleResults([]);
      setGoogleSearched(true);
    }
    setGoogleLoading(false);
  };

  
  const handleAddGoogleHotel = (hotel: HotelInfo) => {
    setHotels(hotels => [...hotels, { ...hotel, status: 'available' }]);
  };

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
  const handleAddOrEditHotel = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editIndex !== null) {
  
        await handleSaveEdits();
      } else {
        const created = await createHotel(hotelForm);
        setHotels(hotels => [...hotels, created]);
        handleClose();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHotel = (placeId: string) => {
  
    const index = hotels.findIndex(hotel => hotel.place_id === placeId);
    
    if (index !== -1) {
      handleOpen(index);
    } else {
      console.error(`Hotel with place_id ${placeId} not found`);
    }
  };

  
  const handleSaveEdits = async () => {
    if (editIndex === null) return;
    
    const hotel = hotels[editIndex];
    try {
      console.log(`Saving hotel with place_id: ${hotel.place_id}`);
      
      const updated = await updateHotel(hotelForm.place_id, hotelForm);
      
  
      setHotels(hotels => hotels.map(h => 
        h.place_id === hotel.place_id ? { ...h, ...updated } : h
      ));
      
      setEditError(null);
      handleClose(); // Close dialog after successful update
    } catch (err: any) {
      setEditError(err.message || 'Failed to update hotel');
    }
  };

  const handleDeleteHotel = async (placeId: string) => {
  
    const hotel = hotels.find(h => h.place_id === placeId);
    
    if (!hotel) {
      console.error(`Hotel with place_id ${placeId} not found`);
      return;
    }
    
    setLoading(true);
    setError(null);
    setDeleteError(null);
    
    console.log('Deleting hotel:', {
      name: hotel.name,
      place_id: hotel.place_id,
      address: hotel.formatted_address || hotel.vicinity
    });
    
    try {
      await deleteHotel(hotel.place_id);
      console.log(`Hotel deleted successfully: ${hotel.name} (place_id: ${hotel.place_id})`);
      
  
      setHotels(prevHotels => prevHotels.filter(h => h.place_id !== hotel.place_id));
      
      setError(null);
    } catch (err: any) {
      console.error('Error deleting hotel:', err);
      setError(err.message || 'Failed to delete hotel');
      setDeleteError(err.message || 'Failed to delete hotel');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (placeId: string) => {
  
    const hotel = hotels.find(h => h.place_id === placeId);
    
    if (!hotel) {
      console.error(`Hotel with place_id ${placeId} not found`);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
  
      const newStatus = hotel.status === 'available' ? 'unavailable' : 'available';
      
  
      console.log(`Toggling status for ${hotel.name} to ${newStatus}`);
      const updated = await updateHotelStatus(placeId, newStatus);
      
  
      setHotels(prevHotels => prevHotels.map(h => 
        h.place_id === placeId ? updated : h
      ));
    } catch (e: any) {
      console.error('Error toggling hotel status:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Operator: Manage Hotels
      </Typography>
      {loading && <Typography color="text.secondary">Loading...</Typography>}
      {error && <Typography color="error.main">{error}</Typography>}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="outlined" color="secondary" onClick={() => setGoogleDialogOpen(true)}>
          Add Hotel by Google
        </Button>
      </Box>
      <Box sx={{ mb: 3 }}>
        <input
          type="text"
          placeholder="Search by name or location"
          style={{
            width: '100%',
            padding: 8,
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #e0e0e0',
            background: '#fff',
            color: '#222',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
          onChange={async e => {
            setSearch(e.target.value);
            setLoading(true);
            setError(null);
            try {
              if (e.target.value.trim() === '') {
                const all = await getAllHotels();
                setHotels(all);
              } else {
                const results = await searchHotels(e.target.value);
                setHotels(results);
              }
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          }}
        />
      </Box>
      <HotelTable
        hotels={hotels}
        search={search}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEditHotel}
        onDelete={handleDeleteHotel}
      />
      <GoogleHotelDialog
        open={googleDialogOpen}
        googleHotelName={googleHotelName}
        setGoogleHotelName={setGoogleHotelName}
        googleLoading={googleLoading}
        googleError={googleError}
        googleResults={googleResults}
        googleSearched={googleSearched}
        onSearch={handleGoogleSearch}
        onAdd={handleAddGoogleHotel}
        onClose={() => setGoogleDialogOpen(false)}
      />
      <HotelFormDialog
        open={open}
        hotelForm={hotelForm}
        onClose={handleClose}
        onSave={editIndex !== null ? handleSaveEdits : handleAddOrEditHotel}
        onChange={handleChange}
        setHotelForm={setHotelForm}
        editIndex={editIndex}
      />
    </Container>
  );
};

export default OperatorPage;
