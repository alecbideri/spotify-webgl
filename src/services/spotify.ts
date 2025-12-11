import type { MediaItem } from './mockData';


const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiration: number = 0;

export const getAccessToken = async (): Promise<string | null> => {
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    if (data.access_token) {
      accessToken = data.access_token;
      tokenExpiration = Date.now() + (data.expires_in * 1000);
      return accessToken;
    }
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
  }
  return null;
};

const searchSpotify = async (query: string, type: 'track' | 'show', limit: number = 20) => {
  const token = await getAccessToken();
  if (!token) return [];

  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data;
};

export const fetchSongs = async (): Promise<MediaItem[]> => {
  const data = await searchSpotify('genre:pop', 'track', 50);
  if (!data.tracks) return [];

  return data.tracks.items.map((track: any) => ({
    id: track.id,
    type: 'song',
    title: track.name,
    artist: track.artists[0].name,
    imageUrl: track.album.images[0]?.url || '',
    // Use a fallback track for demo purposes if Spotify preview is unavailable
    streamUrl: track.preview_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  }));

};

export const fetchPodcasts = async (): Promise<MediaItem[]> => {
  const data = await searchSpotify('technology', 'show', 50);
  if (!data.shows) return [];

  return data.shows.items.map((show: any) => ({
    id: show.id,
    type: 'podcast',
    title: show.name,
    artist: show.publisher,
    imageUrl: show.images[0]?.url || '',
    streamUrl: '' // Podcasts usually don't have direct simple preview URLs in this simple endpoint
  }));
};
