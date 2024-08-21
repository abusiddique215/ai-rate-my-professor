import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function RecommendationForm() {
  const [preferences, setPreferences] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendation('');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();
      setRecommendation(data.message);
    } catch (error) {
      console.error('Error:', error);
      setRecommendation('Sorry, there was an error generating recommendations.');
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
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
        </Button>
      </form>
      {recommendation && (
        <Typography sx={{ mt: 2 }}>
          {recommendation}
        </Typography>
      )}
    </Box>
  );
}
