import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { createChatRoomWithOffer, sendMessage } from '../../api/chatService';
import type { HotelInfo } from '../../types/hotel';
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

interface CreateChatOfferButtonProps {
  hotel: HotelInfo;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const CreateChatOfferButton: React.FC<CreateChatOfferButtonProps> = ({ 
  hotel, 
  variant = 'contained',
  size = 'medium',
  fullWidth = false
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(`I am interested in hotel ${hotel.name} and would like more information.`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleClickOpen = () => {
    if (!authService.isAuthenticated()) {
      navigate('/auth', { state: { from: window.location.pathname } });
      return;
    }
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        setError("You must be logged in to create a chat.");
        setLoading(false);
        return;
      }
      
      const chatRoom = await createChatRoomWithOffer(hotel.place_id);
      if (message.trim()) {
        try {
          await sendMessage(chatRoom.id, message.trim(), currentUser.id);
        } catch (err) {
          console.error('Failed to send initial message:', err);
        }
      }
      
      setLoading(false);
      setOpen(false);
      
  
      navigate(`/chats/${chatRoom.id}`);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to create chat request');
      console.error('Error creating chat room:', err);
    }
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        color="primary"
        startIcon={<ChatIcon />}
        onClick={handleClickOpen}
      >
        Request Info
      </Button>
      
      <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Request Information about {hotel.name}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Your message will be sent to hotel operators who can provide you with information and special offers.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Your message"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={loading || !message.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateChatOfferButton;
