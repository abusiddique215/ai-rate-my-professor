import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function RecommendationForm() {
  const [preferences, setPreferences] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendation('');
    setError('');

    if (preferences.trim().length < 10) {
      setError('Please provide more detailed preferences (at least 10 characters).');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setRecommendation(data.message);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Sorry, there was an error generating recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Get Professor Recommendations
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Describe your preferences (e.g., teaching style, course difficulty, department)"
          disabled={isLoading}
          sx={{ mb: 2 }}
          error={!!error}
          helperText={error}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
        </Button>
      </form>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {recommendation && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {recommendation}
        </Alert>
      )}
    </Box>
  );
}