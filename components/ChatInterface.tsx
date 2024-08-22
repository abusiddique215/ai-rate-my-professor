"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: "Sorry, there was an error processing your request." }]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Chat with AI Assistant</Typography>
      <Paper elevation={2} sx={{ height: 300, p: 2, mb: 2, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 1, textAlign: msg.role === "user" ? "right" : "left" }}>
            <Paper elevation={1} sx={{ display: 'inline-block', p: 1, backgroundColor: msg.role === "user" ? "#e3f2fd" : "#f5f5f5" }}>
              <Typography variant="body1">{msg.content}</Typography>
            </Paper>
          </Box>
        ))}
      </Paper>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          Send
        </Button>
      </Box>
    </Box>
  );
}