import { create } from 'zustand';
import type { MediaItem } from '../services/mockData';

interface AppState {
  items: MediaItem[];
  mode: 'song' | 'podcast';
  setItems: (items: MediaItem[]) => void;
  setMode: (mode: 'song' | 'podcast') => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  isInteracting: boolean;
  setIsInteracting: (isInteracting: boolean) => void;
  autoScrollEnabled: boolean;
  toggleAutoScroll: () => void;
  currentTrack: MediaItem | null;
  isPlaying: boolean;
  playTrack: (track: MediaItem) => void;
  togglePlay: () => void;
}



export const useStore = create<AppState>((set) => ({
  items: [],
  mode: 'song',
  setItems: (items) => set({ items }),
  setMode: (mode) => set({ mode }),
  zoomLevel: 5, // Initial camera Z position
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  isInteracting: false,
  setIsInteracting: (isInteracting) => set({ isInteracting }),

  autoScrollEnabled: true,
  toggleAutoScroll: () => set((state) => ({ autoScrollEnabled: !state.autoScrollEnabled })),

  currentTrack: null,
  isPlaying: false,
  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));


