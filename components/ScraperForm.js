import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function ScraperForm() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
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

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Scrape Professor Data
      </Typography>
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
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}