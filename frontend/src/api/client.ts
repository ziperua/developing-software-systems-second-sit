import type {
  AuthResponse,
  CommunityMovie,
  CommunityMovieInput,
  WatchlistItem,
  WatchlistItemInput,
} from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4058';

const getToken = () => localStorage.getItem('movieWatchlistToken');

const parseError = async (response: Response) => {
  try {
    const data = await response.json();
    if (data.message) {
      return data.message;
    }
    if (data.errors) {
      return Object.values(data.errors).flat().join(' ');
    }
    if (data.title) {
      return data.title;
    }
  } catch {
    // Ignore JSON parse errors and use fallback below.
  }

  return `Request failed with status ${response.status}.`;
};

export const apiRequest = async <T>(path: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const login = (email: string, password: string) =>
  apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (displayName: string, email: string, password: string, confirmPassword: string) =>
  apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ displayName, email, password, confirmPassword }),
  });

export const getWatchlist = () => apiRequest<WatchlistItem[]>('/api/watchlist');

export const createWatchlistItem = (input: WatchlistItemInput) =>
  apiRequest<WatchlistItem>('/api/watchlist', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const updateWatchlistItem = (id: string, input: WatchlistItemInput) =>
  apiRequest<WatchlistItem>(`/api/watchlist/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });

export const deleteWatchlistItem = (id: string) =>
  apiRequest<void>(`/api/watchlist/${id}`, {
    method: 'DELETE',
  });

export const getCommunityMovies = () => apiRequest<CommunityMovie[]>('/api/community-movies');

export const createCommunityMovie = (input: CommunityMovieInput) =>
  apiRequest<CommunityMovie>('/api/community-movies', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const updateCommunityMovie = (id: string, input: CommunityMovieInput) =>
  apiRequest<CommunityMovie>(`/api/community-movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });

export const deleteCommunityMovie = (id: string) =>
  apiRequest<void>(`/api/community-movies/${id}`, {
    method: 'DELETE',
  });
