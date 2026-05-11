import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/watchlist');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 520, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }} data-cy="form-error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} data-cy="login-email" />
            <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} data-cy="login-password" />
            <Button type="submit" variant="contained" disabled={loading} data-cy="login-submit">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
