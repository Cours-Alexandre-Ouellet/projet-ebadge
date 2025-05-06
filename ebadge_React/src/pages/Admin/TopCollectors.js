import React, { useEffect, useState } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import Api from '../../utils/Api'; 

const TopCollectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.get('/stats/leaderboard') 
      .then(res => {
        setCollectors(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🏆 Top 10 des meilleurs collectionneurs
      </Typography>

      <Paper elevation={2} sx={{ padding: 3, mt: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          collectors.slice(0, 10).map((user, index) => (
            <Box key={user.id} sx={{ mb: 2 }}>
              <Typography>
                <strong>{index + 1}.</strong> {user.first_name} {user.last_name} — {user.badges_count} badge{user.badges_count > 1 ? 's' : ''}
              </Typography>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default TopCollectors;
