import { Box, Typography } from '@mui/material';

export default function MessageList({ messages }) {
  return (
    <Box>
      {messages.map((message, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: message.role === 'user' ? 'grey.100' : 'primary.light' }}>
          <Typography>{message.content}</Typography>
        </Box>
      ))}
    </Box>
  );
}