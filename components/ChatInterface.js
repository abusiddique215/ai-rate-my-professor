"use client";
import { useState } from "react";
import { TextField, Button, Paper, Typography, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [minRating, setMinRating] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          filters: {
            department: department || undefined,
            minRating: minRating || undefined
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.message };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: "assistant", content: "Sorry, there was an error processing your request." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, maxHeight: 400, overflow: "auto" }}>
        {messages.map((message, index) => (
          <Typography key={index} sx={{ mb: 1, textAlign: message.role === "user" ? "right" : "left" }}>
            {message.content}
          </Typography>
        ))}
        {isLoading && <Typography sx={{ fontStyle: "italic" }}>AI is thinking...</Typography>}
      </Paper>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a professor..."
          disabled={isLoading}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            label="Department"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="Computer Science">Computer Science</MenuItem>
            <MenuItem value="Mathematics">Mathematics</MenuItem>
            <MenuItem value="Physics">Physics</MenuItem>
            {/* Add more departments as needed */}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="number"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          placeholder="Minimum Rating (e.g., 3.5)"
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </Box>
  );
}