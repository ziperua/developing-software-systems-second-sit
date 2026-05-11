import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import {
  createCommunityMovie,
  deleteCommunityMovie,
  getCommunityMovies,
  updateCommunityMovie,
} from '../api/client';
import { useAuth } from '../auth';
import type { CommunityMovie, CommunityMovieInput } from '../types';

const emptyForm: CommunityMovieInput = {
  title: '',
  director: '',
  releaseYear: null,
  genre: '',
  description: '',
};

const CommunityMoviesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [movies, setMovies] = useState<CommunityMovie[]>([]);
  const [form, setForm] = useState<CommunityMovieInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMovies = async () => {
    setLoading(true);
    setError('');

    try {
      setMovies(await getCommunityMovies());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load community movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMovies();
  }, []);

  const updateField = <K extends keyof CommunityMovieInput>(key: K, value: CommunityMovieInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        const updated = await updateCommunityMovie(editingId, form);
        setMovies((current) => current.map((movie) => (movie.id === editingId ? updated : movie)));
      } else {
        const created = await createCommunityMovie(form);
        setMovies((current) => [created, ...current]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save community movie.');
    }
  };

  const startEdit = (movie: CommunityMovie) => {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      director: movie.director ?? '',
      releaseYear: movie.releaseYear ?? null,
      genre: movie.genre ?? '',
      description: movie.description ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    setError('');

    try {
      await deleteCommunityMovie(id);
      setMovies((current) => current.filter((movie) => movie.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete community movie.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>
        Public Community Movies
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} data-cy="form-error">{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                {editingId ? 'Edit Your Contribution' : 'Contribute a Movie'}
              </Typography>
              {!isAuthenticated ? (
                <Alert severity="info" data-cy="community-login-message">
                  Log in to contribute a public movie.
                </Alert>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField label="Title" value={form.title} onChange={(event) => updateField('title', event.target.value)} data-cy="community-title" />
                    <TextField label="Director" value={form.director} onChange={(event) => updateField('director', event.target.value)} data-cy="community-director" />
                    <TextField label="Release year" type="number" value={form.releaseYear ?? ''} onChange={(event) => updateField('releaseYear', event.target.value ? Number(event.target.value) : null)} data-cy="community-release-year" />
                    <TextField label="Genre" value={form.genre} onChange={(event) => updateField('genre', event.target.value)} data-cy="community-genre" />
                    <TextField label="Description" multiline minRows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} data-cy="community-description" />
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      <Button type="submit" variant="contained" data-cy="community-save">
                        {editingId ? 'Save Contribution' : 'Contribute Movie'}
                      </Button>
                      {editingId && <Button onClick={resetForm}>Cancel</Button>}
                    </Stack>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2} data-cy="community-movies">
            {loading && <Typography>Loading...</Typography>}
            {!loading && movies.length === 0 && <Typography>No community movies yet.</Typography>}
            {movies.map((movie) => {
              const isOwner = Boolean(user && user.id === movie.createdByUserId);
              return (
                <Card key={movie.id} data-cy="community-card">
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{movie.title}</Typography>
                    <Typography>{movie.director || 'Unknown director'} {movie.releaseYear ? `(${movie.releaseYear})` : ''}</Typography>
                    <Typography>Genre: {movie.genre || 'Not specified'}</Typography>
                    <Typography>Contributed by: {movie.createdByDisplayName}</Typography>
                    {movie.description && <Typography sx={{ mt: 1 }}>{movie.description}</Typography>}
                    {isOwner && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }} data-cy="owner-controls">
                        <Button variant="outlined" onClick={() => startEdit(movie)} data-cy="community-edit">Edit</Button>
                        <Button color="error" onClick={() => void handleDelete(movie.id)} data-cy="community-delete">Delete</Button>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommunityMoviesPage;
