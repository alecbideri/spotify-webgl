import { v4 as uuidv4 } from 'uuid';

export interface MediaItem {

  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  type: 'song' | 'podcast';
  streamUrl?: string;
}



const SONG_IMAGES = [
  'https://picsum.photos/id/10/500/500',
  'https://picsum.photos/id/11/500/500',
  'https://picsum.photos/id/12/500/500',
  'https://picsum.photos/id/13/500/500',
  'https://picsum.photos/id/14/500/500',
];

const PODCAST_IMAGES = [
  'https://picsum.photos/id/20/500/500',
  'https://picsum.photos/id/21/500/500',
  'https://picsum.photos/id/22/500/500',
  'https://picsum.photos/id/23/500/500',
  'https://picsum.photos/id/24/500/500',
];

export const generateMockData = (count: number = 50, type: 'song' | 'podcast' = 'song'): MediaItem[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: uuidv4(),
    title: `${type === 'song' ? 'Song' : 'Episode'} ${i + 1}`,
    artist: `Artist ${i + 1}`,
    imageUrl: type === 'song'
      ? SONG_IMAGES[i % SONG_IMAGES.length]
      : PODCAST_IMAGES[i % PODCAST_IMAGES.length],
    type,
  }));
};
