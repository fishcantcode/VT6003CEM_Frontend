import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Avatar,
  Button,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const AccountInfoPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [tempName, setTempName] = useState('');

  const handleEditClick = () => {
    setTempName(name);
    setIsEditing(true);
  };

  const handleSave = () => {
    setName(tempName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          My Profile
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Avatar 
            src={profileImage} 
            sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto 16px',
              border: '2px solid #f5f5f5'
            }} 
          />
          <Button 
            variant="outlined" 
            component="label"
            size="small"
            startIcon={<EditIcon />}
            sx={{ mb: 3 }}
          >
            Change Photo
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleProfileImageChange} 
            />
          </Button>
        </Box>

        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Full Name
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              sx={{ mb: 2 }}
            />
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>{name}</Typography>
          )}

        </Box>

        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleCancel}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave}
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleEditClick}
            startIcon={<EditIcon />}
            fullWidth
          >
            Edit Profile
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default AccountInfoPage;
