import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import HotelImageThumbnails from './HotelImageThumbnails';

interface HotelFormDialogProps {
  open: boolean;
  hotelForm: any;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setHotelForm: React.Dispatch<any>;
  editIndex: number | null;
}

const HotelFormDialog: React.FC<HotelFormDialogProps> = ({
  open,
  hotelForm,
  onClose,
  onSave,
  onChange,
  setHotelForm,
  editIndex
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{editIndex !== null ? 'Edit Hotel' : 'Add Hotel'}</DialogTitle>
    <DialogContent>
      {/* Images Section at Top */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Images</Typography>
        {/* Large Preview Window */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <img
            src={'/hotel.jpg'}
            alt={'main-hotel-img'}
            style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
          />
        </Box>
        {/* Upload/URL Inputs */}
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
        <HotelImageThumbnails
          images={hotelForm.images || []}
          selectedImgIdx={hotelForm.selectedImgIdx || 0}
          onSelect={idx => setHotelForm((prev: any) => ({ ...prev, selectedImgIdx: idx }))}
          onDelete={idx => setHotelForm((prev: any) => {
            const newImgs = prev.images.filter((_: any, i: number) => i !== idx);
            let newIdx = prev.selectedImgIdx;
            if (newIdx >= newImgs.length) newIdx = newImgs.length - 1;
            if (newIdx < 0) newIdx = 0;
            return { ...prev, images: newImgs, selectedImgIdx: newIdx };
          })}
        />
      </Box>
      <TextField
        margin="normal"
        label="Hotel Name"
        name="name"
        fullWidth
        value={hotelForm.name}
        onChange={onChange}
      />
      <TextField
        margin="normal"
        label="Address"
        name="formatted_address"
        fullWidth
        value={hotelForm.formatted_address}
        onChange={onChange}
      />
      <TextField
        margin="normal"
        label="Vicinity (optional)"
        name="vicinity"
        fullWidth
        value={hotelForm.vicinity}
        onChange={onChange}
      />
      {editIndex !== null ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin="dense"
            label="Rating"
            type="number"
            fullWidth
            variant="outlined"
            value={hotelForm.rating}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Rating Total"
            type="number"
            fullWidth
            variant="outlined"
            value={hotelForm.user_ratings_total}
            InputProps={{ readOnly: true }}
          />
        </Box>
      ) : (
        <>
          <TextField
            margin="dense"
            label="Rating"
            type="number"
            fullWidth
            variant="outlined"
            value={hotelForm.rating}
            onChange={e => setHotelForm({ ...hotelForm, rating: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Rating Total"
            type="number"
            fullWidth
            variant="outlined"
            value={hotelForm.user_ratings_total}
            onChange={e => setHotelForm({ ...hotelForm, user_ratings_total: parseInt(e.target.value) })}
          />
        </>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onSave} variant="contained">Save</Button>
    </DialogActions>
  </Dialog>
);

export default HotelFormDialog;
