import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('Student');
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(displayName, email, password, confirmPassword);
      navigate('/watchlist');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 560, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }} data-cy="form-error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} data-cy="register-display-name" />
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} data-cy="register-email" />
            <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} data-cy="register-password" />
            <TextField label="Confirm password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} data-cy="register-confirm-password" />
            <Button type="submit" variant="contained" disabled={loading} data-cy="register-submit">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
