'use client';

import { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box, Paper, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { BorderBeam } from "../ui/border-beam";

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const aiMessage: Message = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="w-full max-w-[600px]">
      <div className="relative w-full rounded-xl overflow-hidden" style={{ height: '600px' }}>
        {/* BorderBeam component */}
        <BorderBeam />

        {/* Chat interface */}
        <div className="absolute inset-[2px] bg-white rounded-xl overflow-hidden">
          <Paper 
            elevation={0}
            sx={{ 
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
              backgroundColor: 'transparent',
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
            <Box component="form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }} sx={{ display: 'flex', p: 2, backgroundColor: 'white' }}>
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
        </div>
      </div>
    </div>
  );
}