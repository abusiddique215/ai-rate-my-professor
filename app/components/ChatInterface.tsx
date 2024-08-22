'use client';

import { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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
        throw new Error('Failed to get response from API');
      }
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }]);
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
          <Box key={index} sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1, 
                maxWidth: '70%', 
                backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: message.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0'
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
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