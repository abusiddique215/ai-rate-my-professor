'use client';

import { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box, Paper, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 1) {
        // Add only the assistant's message
        setMessages((prevMessages) => [...prevMessages, data[1]]);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: `Sorry, an error occurred: ${errorMessage}. Please try again.` }]);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', 
        maxWidth: 600, 
        borderRadius: '20px', 
        overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      }}
    >
      <Box sx={{ 
        height: '40px', 
        backgroundColor: '#1976d2', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 15px' 
      }}>
        <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f57', marginRight: '8px' }} />
        <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#febc2e', marginRight: '8px' }} />
        <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28c840' }} />
      </Box>
      <Box sx={{ height: 400, p: 2, backgroundColor: '#ffffff', overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ 
            display: 'flex', 
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', 
            mb: 2,
            alignItems: 'flex-end'
          }}>
            {message.role === 'assistant' && (
              <Avatar sx={{ bgcolor: '#1976d2', mr: 1, mb: 1 }}>
                <SmartToyIcon />
              </Avatar>
            )}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1.5, 
                maxWidth: '70%', 
                backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: message.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0'
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
            {message.role === 'user' && (
              <Avatar sx={{ bgcolor: '#4caf50', ml: 1, mb: 1 }}>
                <PersonIcon />
              </Avatar>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', p: 2, backgroundColor: 'white' }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          sx={{ 
            mr: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#f5f5f5',
            }
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          endIcon={<SendIcon />}
          sx={{ 
            borderRadius: '20px', 
            minWidth: '100px',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            }
          }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}