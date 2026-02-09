
export interface Media {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'tmdb_movie';
  genre?: string;
  description?: string;
  poster?: string;
  image?: string;
  video?: string;
  downloadLink?: string;
  createdAt?: number;
  extractedTags?: string[];
  tmdbData?: any;
  // Specific to series/episodes
  episodeNumber?: number;
  seriesId?: string;
}

export interface UserProfile {
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt?: number;
  isFreeTrial?: boolean;
  freeTrialEnd?: number;
  photoUpdatedAt?: number;
}

export interface Download {
  id: string;
  mediaId: string;
  title: string;
  type: string;
  genre: string;
  poster: string;
  downloadedAt: number;
  success: boolean;
  error?: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}
