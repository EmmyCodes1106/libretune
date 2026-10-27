import { create } from 'zustand';
import { getDeezerTrack } from '../services/deezer';
import { useLibraryStore } from './libraryStore';

let playbackRequestId = 0;

export const usePlayerStore = create((set, get) => ({
  // Playback state
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  shuffle: false,
  repeatMode: 'off', // 'off' | 'all' | 'one'
  
  // Queue state
  queue: [],
  history: [],
  isExpanded: false, // For Now Playing full overlay
  isQueuePanelOpen: false,

  // Actions
  setCurrentTrack: (track) => set({ currentTrack: track, progress: 0, duration: track?.duration || 0 }),
  
  playTrack: async (track, newQueue = null) => {
    if (!track) return;
    const { currentTrack, history } = get();
    if (track.hasPreview === false) {
      useLibraryStore.getState().showToast('No preview available.');
      return;
    }

    const requestId = ++playbackRequestId;
    const updatedHistory = currentTrack && currentTrack.id !== track.id
      ? [currentTrack, ...history.slice(0, 49)]
      : history;
    let updatedQueue = get().queue;
    if (newQueue && Array.isArray(newQueue)) {
      updatedQueue = newQueue.filter((t) => t.id !== track.id);
    }

    set({
      currentTrack: track,
      isPlaying: Boolean(track.audioUrl),
      progress: 0,
      duration: track.duration || 0,
      queue: updatedQueue,
      history: updatedHistory,
    });

    if (track.source !== 'deezer' || track.audioUrl) return;

    try {
      const refreshedTrack = await getDeezerTrack(track.id);
      if (requestId !== playbackRequestId) return;
      set({
        currentTrack: refreshedTrack,
        isPlaying: Boolean(refreshedTrack.audioUrl),
        duration: refreshedTrack.duration || 0,
      });
      if (!refreshedTrack.audioUrl) {
        useLibraryStore.getState().showToast('No preview available.');
      }
    } catch (error) {
      if (requestId !== playbackRequestId) return;
      console.error(`Could not refresh Deezer preview for "${track.title}":`, error);
      useLibraryStore.getState().showToast(`Could not load preview for "${track.title}".`);
    }
  },

  togglePlay: () => {
    const { isPlaying, currentTrack, queue } = get();
    if (!currentTrack && queue.length > 0) {
      get().playTrack(queue[0]);
      return;
    }
    if (isPlaying) {
      playbackRequestId += 1;
      set({ isPlaying: false });
      return;
    }
    if (currentTrack?.source === 'deezer' && !currentTrack.audioUrl) {
      get().playTrack(currentTrack, queue);
      return;
    }
    set({ isPlaying: !isPlaying });
  },

  pause: () => {
    playbackRequestId += 1;
    set({ isPlaying: false });
  },
  play: () => {
    const { currentTrack, queue } = get();
    if (currentTrack?.source === 'deezer' && !currentTrack.audioUrl) {
      get().playTrack(currentTrack, queue);
    } else {
      set({ isPlaying: true });
    }
  },
  refreshTrack: async (trackId) => {
    const previousTrack = get().currentTrack;
    if (!previousTrack || previousTrack.id !== trackId || previousTrack.source !== 'deezer') return;
    const requestId = ++playbackRequestId;
    set({ isPlaying: false });
    try {
      const refreshedTrack = await getDeezerTrack(trackId);
      if (requestId !== playbackRequestId || get().currentTrack?.id !== trackId) return;
      set({
        currentTrack: refreshedTrack,
        isPlaying: Boolean(refreshedTrack.audioUrl),
        progress: 0,
        duration: refreshedTrack.duration || 0,
      });
      if (!refreshedTrack.audioUrl) {
        useLibraryStore.getState().showToast('No preview available.');
      }
    } catch (error) {
      if (requestId !== playbackRequestId) return;
      console.error(`Could not refresh Deezer preview for "${previousTrack.title}":`, error);
      set({ isPlaying: false });
      useLibraryStore.getState().showToast(`Could not refresh preview for "${previousTrack.title}".`);
    }
  },

  nextTrack: () => {
    const { queue } = get();
    if (queue.length === 0) {
      playbackRequestId += 1;
      set({ isPlaying: false, progress: 0 });
      return;
    }

    const [nextTrack, ...remainingQueue] = queue;
    if (nextTrack.hasPreview === false) {
      set({ queue: remainingQueue });
      get().nextTrack();
      return;
    }
    get().playTrack(nextTrack, remainingQueue);
  },

  prevTrack: () => {
    const { history, currentTrack, progress, queue } = get();
    // If more than 3 seconds in, restart track
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    if (history.length === 0) {
      set({ progress: 0 });
      return;
    }

    const [previousTrack, ...restHistory] = history;
    const updatedQueue = currentTrack ? [currentTrack, ...queue] : queue;
    set({ history: restHistory });
    get().playTrack(previousTrack, updatedQueue);
  },

  seekTo: (seconds) => set({ progress: Math.max(0, Math.min(seconds, get().duration || seconds)) }),
  setProgress: (seconds) => set({ progress: seconds }),
  setDuration: (seconds) => set({ duration: seconds }),

  setVolume: (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    set({ volume: clamped, isMuted: clamped === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume } = get();
    if (isMuted) {
      set({ isMuted: false, volume: volume === 0 ? 0.7 : volume });
    } else {
      set({ isMuted: true });
    }
  },

  toggleShuffle: () => {
    const { shuffle, queue } = get();
    if (!shuffle) {
      // Shuffle existing queue
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      set({ shuffle: true, queue: shuffled });
    } else {
      set({ shuffle: false });
    }
  },

  toggleRepeat: () => {
    const modes = ['off', 'all', 'one'];
    const { repeatMode } = get();
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    set({ repeatMode: nextMode });
  },

  addToQueue: (track) => {
    if (!track) return;
    const { queue } = get();
    if (get().currentTrack?.id === track.id || queue.some((t) => t.id === track.id)) return;
    set({ queue: [...queue, track] });
    useLibraryStore.getState().showToast('Added to queue');
  },

  playNext: (track) => {
    if (!track) return;
    const { queue } = get();
    if (get().currentTrack?.id === track.id) return;
    const filtered = queue.filter((t) => t.id !== track.id);
    set({ queue: [track, ...filtered] });
    useLibraryStore.getState().showToast('Playing next');
  },

  playNextInQueue: (track) => get().playNext(track),

  removeFromQueue: (trackId) => {
    const { queue } = get();
    set({ queue: queue.filter((t) => t.id !== trackId) });
  },

  clearQueue: () => set({ queue: [] }),
  reorderQueue: (sourceIndex, destinationIndex) => {
    const queue = [...get().queue];
    if (
      sourceIndex < 0 ||
      sourceIndex >= queue.length ||
      destinationIndex < 0 ||
      destinationIndex >= queue.length ||
      sourceIndex === destinationIndex
    ) return;
    const [track] = queue.splice(sourceIndex, 1);
    queue.splice(destinationIndex, 0, track);
    set({ queue });
  },
  stopCurrentTrack: () => {
    playbackRequestId += 1;
    set({ currentTrack: null, isPlaying: false, progress: 0, duration: 0 });
  },
  setQueue: (newQueue) => set({ queue: newQueue }),

  setExpanded: (isExpanded) => set({ isExpanded }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  toggleQueuePanel: () => set((state) => ({ isQueuePanelOpen: !state.isQueuePanelOpen })),
  setQueuePanelOpen: (isQueuePanelOpen) => set({ isQueuePanelOpen }),
}));
