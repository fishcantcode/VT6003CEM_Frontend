import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { authService, type UserProfile, type UpdateProfilePayload } from '../api/authService';

const AccountInfoPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userProfile = await authService.getUserProfile();
        setProfile(userProfile);
        setFormData({ 
          firstName: userProfile.profile.firstName || '', 
          lastName: userProfile.profile.lastName || '',
          bio: userProfile.profile.bio || ''
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (!profile) return;
    setFormData({ 
      firstName: profile.profile.firstName, 
      lastName: profile.profile.lastName,
      bio: profile.profile.bio || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!profile) return;

    const payload: UpdateProfilePayload = {
      profile: {}
    };
    let hasChanges = false;

    if (formData.firstName !== profile.profile.firstName) {
      payload.profile.firstName = formData.firstName;
      hasChanges = true;
    }
    if (formData.lastName !== profile.profile.lastName) {
      payload.profile.lastName = formData.lastName;
      hasChanges = true;
    }
    if (formData.bio !== profile.profile.bio) {
      payload.profile.bio = formData.bio;
      hasChanges = true;
    }
    
    // Handle avatar separately
    const hasAvatarChange = avatarFile !== null;

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      // Update profile information
      if (hasChanges) {
        const updatedProfile = await authService.updateUserProfile(payload);
        setProfile(updatedProfile);
      }
      
      // Upload avatar if changed
      if (hasAvatarChange && avatarFile) {
        await authService.uploadAvatar(avatarFile);
        // Refresh profile after avatar upload to get the updated avatar URL
        const refreshedProfile = await authService.getUserProfile();
        setProfile(refreshedProfile);
      }
      
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
          My Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Avatar 
            src={avatarPreview || profile?.avatarImage || undefined} 
            sx={{ width: 120, height: 120, border: '2px solid #f5f5f5' }}
          />
          {isEditing && (
            <Button variant="outlined" component="label" size="small">
              Change Photo
              <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
            </Button>
          )}
        </Box>

        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Email"
              fullWidth
              value={profile?.email || ''}
              disabled
              variant="filled"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Bio"
              name="bio"
              fullWidth
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {isEditing ? (
              <>
                <Button onClick={handleCancel} startIcon={<CancelIcon />} disabled={isSaving}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave} 
                  startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />} 
                  disabled={isSaving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleEditClick}
                startIcon={<EditIcon />}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccountInfoPage;
