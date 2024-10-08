"use client";
import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

export default function ScraperForm() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!isValidUrl(url)) {
      setMessage('Please enter a valid URL');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape data');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Sorry, there was an error scraping the data.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Scrape Professor Data</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter RateMyProfessors URL"
          disabled={isLoading}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Scraping...' : 'Scrape Data'}
        </Button>
      </form>
      {message && (
        <Alert severity={message.includes('error') ? 'error' : 'success'} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}