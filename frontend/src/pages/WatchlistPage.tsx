import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import {
  createWatchlistItem,
  deleteWatchlistItem,
  getWatchlist,
  updateWatchlistItem,
} from '../api/client';
import type { WatchlistItem, WatchlistItemInput, WatchlistStatus } from '../types';

const emptyForm: WatchlistItemInput = {
  title: '',
  director: '',
  releaseYear: null,
  genre: '',
  status: 'PlanToWatch',
  rating: null,
  notes: '',
};

const statuses: WatchlistStatus[] = ['PlanToWatch', 'Watching', 'Watched', 'Dropped'];

const WatchlistPage = () => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [form, setForm] = useState<WatchlistItemInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      setItems(await getWatchlist());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load watchlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const updateField = <K extends keyof WatchlistItemInput>(key: K, value: WatchlistItemInput[K]) => {
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
        const updated = await updateWatchlistItem(editingId, form);
        setItems((current) => current.map((item) => (item.id === editingId ? updated : item)));
      } else {
        const created = await createWatchlistItem(form);
        setItems((current) => [created, ...current]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save watchlist item.');
    }
  };

  const startEdit = (item: WatchlistItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      director: item.director ?? '',
      releaseYear: item.releaseYear ?? null,
      genre: item.genre ?? '',
      status: item.status,
      rating: item.rating ?? null,
      notes: item.notes ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    setError('');

    try {
      await deleteWatchlistItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete watchlist item.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>
        My Protected Watchlist
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} data-cy="form-error">{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                {editingId ? 'Edit Watchlist Item' : 'Add Watchlist Item'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField label="Title" value={form.title} onChange={(event) => updateField('title', event.target.value)} data-cy="watchlist-title" />
                  <TextField label="Director" value={form.director} onChange={(event) => updateField('director', event.target.value)} data-cy="watchlist-director" />
                  <TextField label="Release year" type="number" value={form.releaseYear ?? ''} onChange={(event) => updateField('releaseYear', event.target.value ? Number(event.target.value) : null)} data-cy="watchlist-release-year" />
                  <TextField label="Genre" value={form.genre} onChange={(event) => updateField('genre', event.target.value)} data-cy="watchlist-genre" />
                  <TextField select label="Status" value={form.status} onChange={(event) => updateField('status', event.target.value as WatchlistStatus)} data-cy="watchlist-status">
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </TextField>
                  <TextField label="Rating" type="number" value={form.rating ?? ''} onChange={(event) => updateField('rating', event.target.value ? Number(event.target.value) : null)} data-cy="watchlist-rating" />
                  <TextField label="Notes" multiline minRows={3} value={form.notes} onChange={(event) => updateField('notes', event.target.value)} data-cy="watchlist-notes" />
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Button type="submit" variant="contained" data-cy="watchlist-save">
                      {editingId ? 'Save Changes' : 'Add Movie'}
                    </Button>
                    {editingId && <Button onClick={resetForm}>Cancel</Button>}
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2} data-cy="watchlist-items">
            {loading && <Typography>Loading...</Typography>}
            {!loading && items.length === 0 && <Typography>No watchlist items yet.</Typography>}
            {items.map((item) => (
              <Card key={item.id} data-cy="watchlist-card">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                  <Typography>{item.director || 'Unknown director'} {item.releaseYear ? `(${item.releaseYear})` : ''}</Typography>
                  <Typography>Status: {item.status}</Typography>
                  <Typography>Rating: {item.rating ?? 'Not rated'}</Typography>
                  {item.notes && <Typography sx={{ mt: 1 }}>{item.notes}</Typography>}
                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                    <Button variant="outlined" onClick={() => startEdit(item)} data-cy="watchlist-edit">Edit</Button>
                    <Button color="error" onClick={() => void handleDelete(item.id)} data-cy="watchlist-delete">Delete</Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WatchlistPage;
