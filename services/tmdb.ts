
import { TMDB_CONFIG } from '../constants';

export const getTMDBImageUrl = (path: string | null | undefined, size: string = 'w500') => {
  if (!path) return undefined;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchTrendingMovies = async () => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/trending/movie/week?api_key=${TMDB_CONFIG.API_KEY}&language=en-US`);
    if (!response.ok) throw new Error('Trending fetch failed');
    const data = await response.json();
    return data.results.slice(0, 15);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const fetchNowPlaying = async () => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/now_playing?api_key=${TMDB_CONFIG.API_KEY}&language=en-US&page=1`);
    if (!response.ok) throw new Error('Now playing fetch failed');
    const data = await response.json();
    return data.results.slice(0, 15);
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (title: string, year: string | null = null) => {
  try {
    const searchUrl = `${TMDB_CONFIG.BASE_URL}/search/movie?api_key=${TMDB_CONFIG.API_KEY}&query=${encodeURIComponent(title)}&language=en-US&page=1`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.results?.length) return null;
    
    let bestMatch = searchData.results[0];
    if (year) {
      const exactMatch = searchData.results.find((m: any) => m.release_date?.startsWith(year));
      if (exactMatch) bestMatch = exactMatch;
    }
    
    const detailUrl = `${TMDB_CONFIG.BASE_URL}/movie/${bestMatch.id}?api_key=${TMDB_CONFIG.API_KEY}&language=en-US&append_to_response=credits,videos`;
    const detailResponse = await fetch(detailUrl);
    return await detailResponse.json();
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
};

export const fetchTVDetails = async (title: string) => {
  try {
    const searchUrl = `${TMDB_CONFIG.BASE_URL}/search/tv?api_key=${TMDB_CONFIG.API_KEY}&query=${encodeURIComponent(title)}&language=en-US&page=1`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.results?.length) return null;
    
    const series = searchData.results[0];
    const detailUrl = `${TMDB_CONFIG.BASE_URL}/tv/${series.id}?api_key=${TMDB_CONFIG.API_KEY}&language=en-US&append_to_response=credits,aggregate_credits,videos`;
    const detailResponse = await fetch(detailUrl);
    return await detailResponse.json();
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
};

export const fetchSeasonDetails = async (tvId: number, seasonNumber: number = 1) => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_CONFIG.API_KEY}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching Season details:', error);
    return null;
  }
};
