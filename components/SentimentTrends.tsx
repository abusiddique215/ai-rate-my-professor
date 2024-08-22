"use client";
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export default function SentimentTrends() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      setTrendData(data);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Sentiment Trends Over Time</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="positive" stroke="#4caf50" />
          <Line type="monotone" dataKey="neutral" stroke="#ff9800" />
          <Line type="monotone" dataKey="negative" stroke="#f44336" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}