import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Paper,
  Box
} from '@mui/material';
import type { HotelInfo } from '../../types/hotel';
import { createHotel } from '../../api/hotelServices';

interface GoogleHotelDialogProps {
  open: boolean;
  googleHotelName: string;
  setGoogleHotelName: (name: string) => void;
  googleLoading: boolean;
  googleError: string | null;
  googleResults: HotelInfo[];
  googleSearched: boolean;
  onSearch: () => void;
  onAdd: (hotel: HotelInfo) => void;
  onClose: () => void;
}

const GoogleHotelDialog: React.FC<GoogleHotelDialogProps> = ({
  open,
  googleHotelName,
  setGoogleHotelName,
  googleLoading,
  googleError,
  googleResults,
  googleSearched,
  onSearch,
  onAdd,
  onClose
}) => {
  const [addLoading, setAddLoading] = useState<number | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Find Hotel by Google</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <TextField
            label="Hotel Name"
            value={googleHotelName}
            onChange={e => setGoogleHotelName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
            fullWidth
            disabled={googleLoading}
          />
          <Button variant="contained" onClick={onSearch} disabled={googleLoading || !googleHotelName.trim()}>
            Search
          </Button>
        </Box>
        {googleError && (
          <Typography color="error" mb={2}>{googleError}</Typography>
        )}
        <Box>
          {googleLoading ? (
            <Box display="flex" justifyContent="center" my={4}>Loading...</Box>
          ) : (
            <Box>
              {googleResults.map((hotel, idx) => (
                <Paper key={hotel.place_id || idx} sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6">{hotel.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{hotel.formatted_address || hotel.vicinity}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, alignSelf: 'flex-end' }}
                    disabled={addLoading === idx}
                    onClick={async () => {
                      setAddLoading(idx);
                      setAddError(null);
                      try {
                        const created = await createHotel(hotel);
                        onAdd(created);
                      } catch (e: any) {
                        setAddError(e.message || 'Failed to add hotel');
                      } finally {
                        setAddLoading(null);
                      }
                    }}
                  >
                    {addLoading === idx ? 'Adding...' : 'Add'}
                  </Button>
                  {addError && addLoading === idx && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>{addError}</Typography>
                  )}
                </Paper>
              ))}
              {!googleLoading && googleResults.length === 0 && googleSearched && (
                <Typography align="center" color="text.secondary">No hotels found.</Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={googleLoading}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoogleHotelDialog;