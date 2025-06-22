import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import type { ChatMessage as ChatMessageType, UserInfo } from '../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  sender?: Pick<UserInfo, 'name' | 'avatarUrl'>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser, sender }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      {!isCurrentUser && (
        <Avatar
          src={sender?.avatarUrl}
          sx={{ width: 32, height: 32, mr: 1 }}
          alt={sender?.name}
        />
      )}

      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: '70%',
          bgcolor: isCurrentUser ? 'success.light' : 'grey.200',
          color: 'text.primary',
          borderRadius: 4,
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.7 }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Paper>

      {isCurrentUser && (
        <Avatar
          src={sender?.avatarUrl}
          sx={{ width: 32, height: 32, ml: 1 }}
          alt={sender?.name}
        />
      )}
    </Box>
  );
};

export default ChatMessage;
