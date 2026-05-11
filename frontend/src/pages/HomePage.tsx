import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <Box>
      <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 800 }}>
        Track movies privately. Discover movies publicly.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 800 }}>
        This example frontend consumes an ASP.NET backend running on port 4058. Students can use it as a reference for authentication, protected CRUD, and public contribution workflows.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                Personal Watchlist
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Protected CRUD area. Only logged-in users can manage their own watchlist items.
              </Typography>
              <Button component={RouterLink} to="/watchlist" variant="contained">
                Open My Watchlist
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                Community Movies
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Public area. Everyone can browse, and authenticated profiles can contribute.
              </Typography>
              <Button component={RouterLink} to="/community" variant="outlined">
                Browse Community Movies
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
