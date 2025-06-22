import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, Avatar, AvatarGroup, ListItemText, Typography, Paper, CircularProgress, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getChatRoomsForCurrentUser, getAllChatRooms, closeChatRoom as deleteChatRoom } from '../../api/chatService';
import { authService } from '../../api/authService';
import type { ChatRoom, UserInfo } from '../../types/chat';

interface ChatRoomListProps {
  currentUserId: number | undefined;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ currentUserId }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const rooms = authService.isOperator()
          ? await getAllChatRooms()
          : await getChatRoomsForCurrentUser();
        // Filter out rooms where the associated hotel might have been deleted
        const validRooms = rooms.filter(room => room.hotel);
        setChatRooms(validRooms);
      } catch (e) {
        setError('Failed to load chat rooms.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    window.addEventListener('authChange', fetchRooms);
    return () => window.removeEventListener('authChange', fetchRooms);
  }, []);

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteChatRoom(roomId);
      setChatRooms(chatRooms.filter(room => room.id !== roomId));
      console.log(`Chat room ${roomId} deleted`);
    } catch (error) {
      setError('Failed to delete chat room.');
      console.error('Failed to delete chat room', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Inbox
      </Typography>
      {chatRooms.length === 0 ? (
        <Typography>No conversations yet.</Typography>
      ) : (
        <List>
          {chatRooms.map((room) => {
            const otherParticipants = room.participants.filter(p => p.id !== currentUserId);
            return (
              <ListItem
                key={room.id}
                disablePadding
                secondaryAction={
                  authService.isOperator() ? (
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoom(room.id)}>
                      <DeleteIcon />
                    </IconButton>
                  ) : undefined
                }
                sx={{ borderBottom: '1px solid #eee', mb: 1, borderRadius: 2 }}
              >
                <ListItemButton 
                  onClick={() => handleRoomClick(room.id)}
                  sx={{ borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <AvatarGroup max={4} sx={{ pr: 2 }}>
                    {otherParticipants.map((p: UserInfo) => (
                      <Avatar key={p.id} alt={p.username} src={p.avatarImage} />
                    ))}
                  </AvatarGroup>
                  <ListItemText
                    primary={room.hotel.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {otherParticipants.map(p => p.username).join(', ')}
                        </Typography>
                        {` — ${room.messages[0]?.content || 'No messages yet'}`}
                      </>
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(room.updatedAt).toLocaleDateString()}
                  </Typography>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default ChatRoomList;
