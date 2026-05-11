export type User = {
  id: string;
  email: string;
  displayName: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type WatchlistStatus = 'PlanToWatch' | 'Watching' | 'Watched' | 'Dropped';

export type WatchlistItem = {
  id: string;
  title: string;
  director?: string | null;
  releaseYear?: number | null;
  genre?: string | null;
  status: WatchlistStatus;
  rating?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WatchlistItemInput = {
  title: string;
  director?: string;
  releaseYear?: number | null;
  genre?: string;
  status: WatchlistStatus;
  rating?: number | null;
  notes?: string;
};

export type CommunityMovie = {
  id: string;
  title: string;
  director?: string | null;
  releaseYear?: number | null;
  genre?: string | null;
  description?: string | null;
  createdByUserId: string;
  createdByDisplayName: string;
  createdAt: string;
  updatedAt: string;
};

export type CommunityMovieInput = {
  title: string;
  director?: string;
  releaseYear?: number | null;
  genre?: string;
  description?: string;
};
