"use client";
import ChatInterface from "../components/ChatInterface";
import ScraperForm from "../components/ScraperForm";
import RecommendationForm from "../components/RecommendationForm";
import SentimentTrends from "../components/SentimentTrends";
import { Box, Typography } from "@mui/material";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Rate My Professor Assistant
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 600 }}>
        <ChatInterface />
        <ScraperForm />
        <RecommendationForm />
        <SentimentTrends />
      </Box>
    </main>
  );
}