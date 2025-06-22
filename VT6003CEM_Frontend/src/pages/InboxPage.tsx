import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, Paper, TextField, List, ListItem, ListItemText, ListItemButton, Divider, Avatar
} from '@mui/material';
import { Reply } from '@mui/icons-material';
import { mockHotels } from '../mock/hotelData';

interface Message {
  id: string;
  hotelId: string;
  hotelName: string;
  sender: 'user' | 'operator';
  content: string;
  timestamp: number;
  replyTo?: string; // ID of the message being replied to
}

const InboxPage: React.FC = () => {
  const [role, setRole] = useState<'user' | 'operator'>('user');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

 
  const toggleRole = () => {
    setRole(prev => prev === 'user' ? 'operator' : 'user');
    setSelectedHotelId('');
    setMessageInput('');
    setReplyingTo(null);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleSend = () => {
    if (!selectedHotelId || !messageInput.trim()) return;

    if (replyingTo) {
 
      const originalMessage = messages.find(m => m.id === replyingTo);
      if (!originalMessage) return;

      const reply: Message = {
        id: Date.now().toString(),
        hotelId: originalMessage.hotelId,
        hotelName: originalMessage.hotelName,
        sender: role, 
        content: messageInput,
        timestamp: Date.now(),
        replyTo: replyingTo
      };
      setMessages(prev => [...prev, reply]);
    } else {
      const hotel = mockHotels.find(h => h.id === selectedHotelId);
      if (!hotel) return;

      const newMessage: Message = {
        id: Date.now().toString(),
        hotelId: selectedHotelId,
        hotelName: hotel.name,
        sender: role, // The current user is sending the message
        content: messageInput,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
    }

    setMessageInput('');
    setReplyingTo(null);
  };


 
  const handleReply = (messageId: string) => {
    const messageToReply = messages.find(m => m.id === messageId);
    if (messageToReply) {
      const quotedText = `> ${messageToReply.content.split('\n').join('\n> ')}\n\n`;
      setMessageInput(quotedText);
      setReplyingTo(messageId);
      document.getElementById('message-input-field')?.focus();
    }
  };

 
  const hotelMessages = selectedHotelId
    ? messages
        .filter(msg => msg.hotelId === selectedHotelId)
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

 
  const hotelsWithMessages = Array.from(
    new Set(messages.map(msg => msg.hotelId))
  ).map(id => mockHotels.find(h => h.id === id)).filter(Boolean);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {role === 'user' ? 'My Inbox' : 'Operator Inbox'}
          </Typography>
          <Button variant="outlined" onClick={toggleRole}>
            Switch to {role === 'user' ? 'Operator' : 'User'} View
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left sidebar - Hotel list */}
          <Paper sx={{ width: 300, p: 2, height: '70vh', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              {role === 'user' ? 'My Hotels' : 'All Hotels'}
            </Typography>
            <List>
              {(role === 'user' ? hotelsWithMessages : mockHotels).map((hotel) => (
                <React.Fragment key={hotel?.id}>
                  <ListItem
                    disablePadding
                    onClick={() => setSelectedHotelId(hotel?.id ?? '')}
                    sx={{
                      bgcolor: selectedHotelId === hotel?.id ? 'action.selected' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }
                    }}
                  >
                    <ListItemButton>
                      <ListItemText primary={hotel?.name} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Right side - Message view */}
          <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', height: '70vh' }}>
            {selectedHotelId ? (
              <>
                <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
                  {hotelMessages.length > 0 ? (
                    hotelMessages.map((msg) => {
                      const originalMessage = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;
                      return (
                        <Box key={msg.id} sx={{ mb: 2, textAlign: msg.sender === role ? 'right' : 'left' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: msg.sender === role ? 'flex-end' : 'flex-start' }}>
                            <Avatar sx={{ width: 24, height: 24, mr: msg.sender === role ? 0 : 1, ml: msg.sender === role ? 1 : 0 }}>
                              {msg.sender.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" color="textSecondary">
                              {msg.sender === role ? 'You' : msg.sender} • {formatTime(msg.timestamp)}
                            </Typography>
                          </Box>
                                                    <Paper sx={{ p: 1.5, display: 'inline-block', maxWidth: '80%', bgcolor: msg.sender === role ? '#2e7d32' : 'grey.200', color: msg.sender === role ? 'white' : 'inherit', mt: 0.5 }}>
                            {originalMessage && (
                              <Box
                                sx={{
                                  mb: 1,
                                  p: 1,
                                  borderLeft: '3px solid',
                                  borderColor: 'grey.400',
                                  bgcolor: 'rgba(0,0,0,0.05)',
                                  borderRadius: '4px',
                                  textAlign: 'left',
                                }}
                              >
                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                  {originalMessage.sender}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{
                                    fontStyle: 'italic',
                                    whiteSpace: 'pre-wrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {originalMessage.content}
                                </Typography>
                              </Box>
                            )}
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                          </Paper>
                          <Box sx={{ mt: 0.5, textAlign: msg.sender === role ? 'right' : 'left' }}>
                            {role === 'operator' && msg.sender === 'user' && !replyingTo && (
                              <Button
                                size="small"
                                startIcon={<Reply />}
                                onClick={() => handleReply(msg.id)}
                                sx={{ mt: 0.5 }}
                              >
                                Reply
                              </Button>
                            )}
                          </Box>
                        </Box>
                      );
                    })
                  ) : (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Typography color="textSecondary">
                        No messages yet. Send a message to get started!
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Message input */}
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  sx={{ display: 'flex', gap: 1, mt: 'auto' }}
                >
                  <TextField
                    id="message-input-field"
                    fullWidth
                    variant="outlined"
                    placeholder={replyingTo ? 'Type your reply...' : 'Type your message...'}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    size="small"
                    multiline
                    maxRows={4}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!messageInput.trim()}
                    sx={{ alignSelf: 'flex-end' }}
                  >
                    {replyingTo ? 'Send Reply' : 'Send'}
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                textAlign: 'center',
                p: 2
              }}>
                <Typography color="textSecondary">
                  Select a hotel to view messages
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default InboxPage;
