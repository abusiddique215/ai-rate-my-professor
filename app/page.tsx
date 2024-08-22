"use client";
import ChatInterface from './components/ChatInterface';
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ 
      backgroundColor: '#1e88e5', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '2rem'
    }}>
      <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
        Rate My Professor Assistant
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'center', mb: 4 }}>
        University and bot chat!bot, meatined s proprest,<br />
        book sant chatts to alde with!, your cod gotter.
      </Typography>
      <ChatInterface />
    </Box>
  );
}