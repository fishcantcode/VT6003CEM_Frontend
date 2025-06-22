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
  Alert
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
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>('');

 
  const loadAvatar = async () => {
    try {
      const dataUrl = await authService.getAvatarDataUrl();
      setAvatarDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to load avatar:', error);
      setAvatarDataUrl('');
    }
  };

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
    loadAvatar(); 

    window.addEventListener('authChange', loadAvatar);
    return () => {
      window.removeEventListener('authChange', loadAvatar);
    };
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
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
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio
      }
    };

    const hasChanges = 
      formData.firstName !== profile.profile.firstName ||
      formData.lastName !== profile.profile.lastName ||
      formData.bio !== (profile.profile.bio || '');
    
    const hasAvatarChange = avatarFile !== null;

    if (!hasChanges && !hasAvatarChange) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      if (hasChanges) {
        const updatedProfile = await authService.updateUserProfile(payload);
        setProfile(updatedProfile);
      }

      if (hasAvatarChange && avatarFile) {
        await authService.uploadAvatar(avatarFile);
        await loadAvatar();
        setAvatarPreview(null);
      }

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
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

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={avatarPreview || avatarDataUrl || undefined}
            sx={{ width: 96, height: 96, mb: 1 }}
          >
            {!avatarPreview && !avatarDataUrl && (profile?.profile?.firstName?.charAt(0)?.toUpperCase() || 'U')}
          </Avatar>
          {isEditing && (
            <>
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{ mt: 1 }}
              >
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
              {avatarPreview && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Preview:</Typography>
                  <Avatar src={avatarPreview} sx={{ width: 64, height: 64, mt: 1 }} />
                </Box>
              )}
            </>
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
