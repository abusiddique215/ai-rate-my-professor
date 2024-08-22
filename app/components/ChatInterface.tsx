'use client';

import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import MessageList from './MessageList';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    // TODO: Implement API call to process user input and get AI response
    // const aiResponse = await processUserInput(input);
    // setMessages((prevMessages) => [...prevMessages, aiResponse]);
  };

  return (
    <Box>
      <MessageList messages={messages} />
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a professor..."
        />
        <Button type="submit" variant="contained">
          Send
        </Button>
      </form>
    </Box>
  );
}