"use client";
import ChatInterface from './components/ChatInterface';
import { Box, Container } from "@mui/material";
import styles from "./page.module.css";

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
      <Container maxWidth="sm">
        <ChatInterface />
      </Container>
    </Box>
  );
}