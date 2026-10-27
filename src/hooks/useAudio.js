import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';

/**
 * Custom hook wrapping HTML5 Audio API.
 * Manages audio lifecycle, buffering, seek synchronization,
 * autoplay rules, error fallback, and OS MediaSession integration.
 * Handles Deezer 30-second previews and refreshes expired preview URLs.
 */
export function useAudio() {
  const audioRef = useRef(null);
  const isSeekingRef = useRef(false);
  const isMountedRef = useRef(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setProgress,
    setDuration,
    nextTrack,
    pause,
    play,
    refreshTrack,
  } = usePlayerStore();

  const { showToast } = useLibraryStore();

  // 1. Initialize Audio element and attach listeners
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;
    isMountedRef.current = true;

    const handleTimeUpdate = () => {
      if (!isSeekingRef.current && audio.currentTime !== undefined && !isNaN(audio.currentTime)) {
        setProgress(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      const state = usePlayerStore.getState();
      const track = state.currentTrack;

      // For Deezer previews that end, show a toast before moving to next
      if (track?.source === 'deezer') {
        showToast(`Preview ended: "${track.title}". Full track on Deezer →`);
      }

      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        state.nextTrack();
        if (!usePlayerStore.getState().isPlaying) audio.currentTime = 0;
      }
    };

    const handleError = () => {
      // Ignore errors if component unmounted or src is empty
      if (!isMountedRef.current || !audio.src) return;

      const state = usePlayerStore.getState();
      const track = state.currentTrack;
      if (!track) return;

      if (track.source === 'deezer') {
        refreshTrack(track.id);
        return;
      }

      const trackTitle = track.title || 'Track';
      console.warn(`Audio playback error for "${trackTitle}"`);
      
      showToast(`Playback error for "${trackTitle}". Skipping to next track...`);
      setTimeout(() => {
        if (isMountedRef.current) {
          state.nextTrack();
        }
      }, 1200);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      isMountedRef.current = false;
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.src = '';
    };
  }, [setProgress, setDuration, showToast, refreshTrack]);

  // 2. Coordinated Audio Playback Controller
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const targetUrl = currentTrack.audioUrl;
    if (!targetUrl) return;

    // Check if source needs updating
    if (audio.src !== targetUrl) {
      audio.src = targetUrl;
      audio.currentTime = 0;
      setProgress(0);
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Check if abort was due to another load or browser policy
          if (err.name !== 'AbortError') {
            console.warn('Playback prevented or interrupted:', err.message);
            pause();
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, pause, setProgress]);

  // 3. Volume and Mute control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
  }, [volume, isMuted]);

  // 4. Seek handler
  const seek = useCallback((timeInSeconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    isSeekingRef.current = true;
    audio.currentTime = timeInSeconds;
    setProgress(timeInSeconds);
    
    setTimeout(() => {
      isSeekingRef.current = false;
    }, 150);
  }, [setProgress]);

  // 5. OS Media Session integration
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      try {
        const titleSuffix = currentTrack.source === 'deezer' ? ' (Preview)' : '';
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title + titleSuffix,
          artist: currentTrack.artist,
          album: currentTrack.album || 'LibreTune',
          artwork: [
            { src: currentTrack.artworkUrl, sizes: '300x300', type: 'image/jpeg' },
            { src: currentTrack.artworkUrl, sizes: '600x600', type: 'image/jpeg' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => play());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) {
            seek(details.seekTime);
          }
        });
      } catch (e) {
        // Safe catch for browsers with partial MediaSession support
      }
    }
  }, [currentTrack, play, pause, nextTrack, seek]);

  return { seek };
}
