import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Alert, Paper, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';

import { getChatRoomById, sendMessage, closeChatRoom } from '../api/chatService';
import { authService } from '../api/authService';
import type { ChatRoom, Message } from '../types/chat';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = authService.getCurrentUser()?.id?.toString() || '';

  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        setLoading(true);
        try {
          const room = await getChatRoomById(id);
          setChatRoom(room);
        } catch (e) {
          setError('Failed to load chat room.');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatRoom?.messages]);

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);

  const handleConfirmDelete = async () => {
    if (!chatRoom?.id) return;
    try {
      await closeChatRoom(chatRoom.id);
      navigate('/inbox');
    } catch (err) {
      setError('Failed to delete chat room.');
      console.error(err);
    }
    setConfirmOpen(false);
  };

  const handleReplyToMessage = (messageContent: string) => {
    const truncatedContent = messageContent.length > 50 ? `${messageContent.substring(0, 50)}...` : messageContent;
    const replyText = `Re: "${truncatedContent}"\n\n`;
    setNewMessage(replyText);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = replyText.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatRoom) return;

    (async () => {
      try {
        const sent = await sendMessage(chatRoom.id, newMessage);
  
        sent.timestamp = new Date(sent.timestamp);
        setChatRoom(prev => prev ? { ...prev, messages: [...prev.messages, sent], updatedAt: new Date() } : null);
        setNewMessage('');
      } catch (e) {
        console.error('Failed to send message:', e);
      }
    })();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!chatRoom) {
    return (
      <Container sx={{ my: 4 }}>
        <Typography variant="h6">No chat room data.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h5">{chatRoom.hotel.name}</Typography>
            <Typography variant="body2" color="text.secondary">{chatRoom.hotel.formatted_address}</Typography>
          </div>
          {authService.isOperator() && (
            <IconButton onClick={handleOpenConfirm} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
          {chatRoom.messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              return (
                <Box key={message.id} sx={{ display: 'flex', justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', mb: 2 }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: isCurrentUser ? 'primary.light' : 'grey.100',
                      color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2,
                      maxWidth: '85%',
                      position: 'relative',
                    }}
                  >
                    <Typography variant="body1" sx={{ mb: 1, pr: 3 }}>
                      {message.content}
                    </Typography>
                    <Typography variant="caption" color={isCurrentUser ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ display: 'block', textAlign: 'right' }}>
                      {new Date(message.timestamp).toLocaleString()}
                    </Typography>
                    {authService.isOperator() && !isCurrentUser && (
                      <IconButton
                        size="small"
                        onClick={() => handleReplyToMessage(message.content)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: 'action.active',
                        }}
                      >
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Paper>
                </Box>
              );
            })}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
          <Box component="form" sx={{ display: 'flex' }} onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              inputRef={inputRef}
              multiline
              rows={4}
              size="small"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }}>
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>Delete Chat Room?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this chat room? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChatPage;
