import { create } from 'zustand';
import { HistoricalYear, HistoricalEra, YearSnapshot } from '@/types/historical';

// Constants
export const MIN_YEAR: HistoricalYear = -1000; // 1000 BCE
export const MAX_YEAR: HistoricalYear = new Date().getFullYear(); // Current year
export const DEFAULT_PLAY_SPEED = 100; // years per second

interface TimelineState {
  // Mode
  mode: 'LIVE' | 'HISTORICAL';

  // Current selection
  selectedYear: HistoricalYear | null; // null = live/current

  // Playback
  isPlaying: boolean;
  playSpeed: number; // years per second
  playDirection: 'forward' | 'backward';

  // Current snapshot (loaded data)
  currentSnapshot: YearSnapshot | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setMode: (mode: 'LIVE' | 'HISTORICAL') => void;
  setYear: (year: HistoricalYear | null) => void;
  toggleMode: () => void;

  // Playback controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setPlaySpeed: (speed: number) => void;
  setPlayDirection: (direction: 'forward' | 'backward') => void;
  stepYear: (delta: number) => void;

  // Jump controls
  jumpToEra: (era: HistoricalEra) => void;
  jumpToYear: (year: HistoricalYear) => void;
  goToLive: () => void;

  // Data loading
  setSnapshot: (snapshot: YearSnapshot | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Era start years for quick jumping
const ERA_START_YEARS: Record<HistoricalEra, HistoricalYear> = {
  'ANCIENT': -1000,
  'CLASSICAL': -500,
  'MEDIEVAL': 500,
  'EARLY_MODERN': 1500,
  'MODERN': 1800,
  'CONTEMPORARY': 1945,
};

export const useTimelineStore = create<TimelineState>((set, get) => ({
  // Initial state
  mode: 'LIVE',
  selectedYear: null,
  isPlaying: false,
  playSpeed: DEFAULT_PLAY_SPEED,
  playDirection: 'forward',
  currentSnapshot: null,
  isLoading: false,
  error: null,

  // Mode actions
  setMode: (mode) => set({ mode, selectedYear: mode === 'LIVE' ? null : get().selectedYear }),

  setYear: (year) => {
    const clampedYear = year !== null
      ? Math.max(MIN_YEAR, Math.min(MAX_YEAR, year))
      : null;
    set({
      selectedYear: clampedYear,
      mode: clampedYear !== null ? 'HISTORICAL' : 'LIVE',
    });
  },

  toggleMode: () => {
    const { mode, selectedYear } = get();
    if (mode === 'LIVE') {
      // Switch to historical, default to most recent era start
      set({ mode: 'HISTORICAL', selectedYear: selectedYear ?? 1945 });
    } else {
      // Switch to live
      set({ mode: 'LIVE', selectedYear: null, isPlaying: false });
    }
  },

  // Playback actions
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setPlaySpeed: (speed) => set({ playSpeed: Math.max(1, Math.min(1000, speed)) }),
  setPlayDirection: (direction) => set({ playDirection: direction }),

  stepYear: (delta) => {
    const { selectedYear, mode } = get();
    if (mode === 'LIVE') return;

    const currentYear = selectedYear ?? MAX_YEAR;
    const newYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, currentYear + delta));

    // If we hit the bounds, stop playing
    if (newYear === MIN_YEAR || newYear === MAX_YEAR) {
      set({ selectedYear: newYear, isPlaying: false });
    } else {
      set({ selectedYear: newYear });
    }
  },

  // Jump actions
  jumpToEra: (era) => {
    const year = ERA_START_YEARS[era];
    set({ selectedYear: year, mode: 'HISTORICAL', isPlaying: false });
  },

  jumpToYear: (year) => {
    const clampedYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
    set({ selectedYear: clampedYear, mode: 'HISTORICAL', isPlaying: false });
  },

  goToLive: () => set({ mode: 'LIVE', selectedYear: null, isPlaying: false }),

  // Data actions
  setSnapshot: (snapshot) => set({ currentSnapshot: snapshot }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selector hooks for common use cases
export const useIsHistoricalMode = () => useTimelineStore((state) => state.mode === 'HISTORICAL');
export const useSelectedYear = () => useTimelineStore((state) => state.selectedYear);
export const useTimelineMode = () => useTimelineStore((state) => state.mode);
