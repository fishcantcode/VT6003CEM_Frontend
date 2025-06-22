import React from 'react';
import {
  Container, Typography, Box
} from '@mui/material';
import ChatRoomList from '../components/chat/ChatRoomList';
import { authService } from '../api/authService';

const InboxPage: React.FC = () => {
  const currentUserId = authService.getCurrentUser()?.id;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Conversations
        </Typography>
        <ChatRoomList currentUserId={currentUserId} />
      </Box>
    </Container>
  );
};

export default InboxPage;
