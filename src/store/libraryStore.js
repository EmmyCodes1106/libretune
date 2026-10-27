import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_PLAYLISTS = [
  {
    id: 'pl-after-hours',
    name: 'After Hours',
    description: 'For the long way home. Electronic textures, quiet beats, and a little space to get lost.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    tracks: [],
    createdAt: Date.now(),
  },
  {
    id: 'pl-slow-sundays',
    name: 'Slow Sundays',
    description: 'Take a breath. Stay a while.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tracks: [],
    createdAt: Date.now() - 100000,
  },
  {
    id: 'pl-golden-state',
    name: 'Golden State',
    description: 'A little warmth, on repeat.',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    tracks: [],
    createdAt: Date.now() - 200000,
  },
  {
    id: 'pl-deep-focus',
    name: 'Deep Focus',
    description: 'Find your flow.',
    coverImage: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&auto=format&fit=crop&q=80',
    tracks: [],
    createdAt: Date.now() - 300000,
  },
  {
    id: 'pl-blue-notes',
    name: 'Blue Notes',
    description: 'Jazz for the in-between.',
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    tracks: [],
    createdAt: Date.now() - 400000,
  },
  {
    id: 'pl-fresh-rotation',
    name: 'Fresh Rotation',
    description: 'New sounds, open minds.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    tracks: [],
    createdAt: Date.now() - 500000,
  },
];

export const useLibraryStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      playlists: INITIAL_PLAYLISTS,
      recentlyPlayed: [],
      toastMessage: null,

      showToast: (message, undoAction = null) => {
        set({ toastMessage: { id: Date.now(), message, undoAction } });
      },

      hideToast: () => {
        set({ toastMessage: null });
      },

      isFavorite: (trackId) => {
        return get().favorites.some((t) => t.id === trackId);
      },

      toggleFavorite: (track) => {
        if (!track) return;
        const { favorites, isFavorite, showToast } = get();
        const exists = isFavorite(track.id);

        if (exists) {
          const removed = favorites.find((t) => t.id === track.id);
          set({ favorites: favorites.filter((t) => t.id !== track.id) });
          showToast(`Removed from Favorites`, () => {
            set((state) => ({ favorites: [removed, ...state.favorites] }));
          });
        } else {
          set({ favorites: [track, ...favorites] });
          showToast(`Added to Favorites`, () => {
            set((state) => ({ favorites: state.favorites.filter((t) => t.id !== track.id) }));
          });
        }
      },

      createPlaylist: (name, description = '') => {
        const id = 'pl-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        const newPlaylist = {
          id,
          name: name.trim() || 'Untitled Playlist',
          description: description.trim(),
          coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          tracks: [],
          createdAt: Date.now(),
        };

        set((state) => ({
          playlists: [newPlaylist, ...state.playlists],
        }));

        get().showToast(`Created playlist "${newPlaylist.name}"`);
        return id;
      },

      renamePlaylist: (id, name, description = '') => {
        set((state) => ({
          playlists: state.playlists.map((pl) =>
            pl.id === id ? { ...pl, name: name.trim(), description: description.trim() } : pl
          ),
        }));
        get().showToast(`Updated playlist`);
      },

      deletePlaylist: (id) => {
        const target = get().playlists.find((pl) => pl.id === id);
        if (!target) return;
        set((state) => ({
          playlists: state.playlists.filter((pl) => pl.id !== id),
        }));
        get().showToast(`Deleted "${target.name}"`);
      },

      addTrackToPlaylist: (playlistId, track) => {
        if (!track) return;
        const target = get().playlists.find((pl) => pl.id === playlistId);
        if (!target) return;

        // Check if track is already in playlist
        if (target.tracks.some((t) => t.id === track.id)) {
          get().showToast(`Already in ${target.name}`);
          return;
        }

        set((state) => ({
          playlists: state.playlists.map((pl) =>
            pl.id === playlistId
              ? {
                  ...pl,
                  tracks: [track, ...pl.tracks],
                  coverImage: pl.tracks.length === 0 ? track.artworkUrl : pl.coverImage,
                }
              : pl
          ),
        }));

        get().showToast(`Added to ${target.name}`);
      },

      removeTrackFromPlaylist: (playlistId, trackId) => {
        const target = get().playlists.find((pl) => pl.id === playlistId);
        if (!target) return;
        const removed = target.tracks.find((t) => t.id === trackId);

        set((state) => ({
          playlists: state.playlists.map((pl) =>
            pl.id === playlistId
              ? {
                  ...pl,
                  tracks: pl.tracks.filter((t) => t.id !== trackId),
                }
              : pl
          ),
        }));

        get().showToast(`Removed from ${target.name}`, () => {
          if (removed) {
            get().addTrackToPlaylist(playlistId, removed);
          }
        });
      },

      reorderPlaylistTracks: (playlistId, sourceIndex, destIndex) => {
        const target = get().playlists.find((pl) => pl.id === playlistId);
        if (!target || sourceIndex === destIndex) return;

        const newTracks = Array.from(target.tracks);
        const [moved] = newTracks.splice(sourceIndex, 1);
        newTracks.splice(destIndex, 0, moved);

        set((state) => ({
          playlists: state.playlists.map((pl) =>
            pl.id === playlistId ? { ...pl, tracks: newTracks } : pl
          ),
        }));
      },

      addRecentlyPlayed: (track) => {
        if (!track) return;
        set((state) => {
          const filtered = state.recentlyPlayed.filter((t) => t.id !== track.id);
          return { recentlyPlayed: [track, ...filtered].slice(0, 30) };
        });
      },
    }),
    {
      name: 'libretune_library_v1',
      version: 2,
      partialize: (state) => ({
        ...state,
        favorites: state.favorites.map(toStoredTrack).filter(Boolean),
        playlists: state.playlists.map((playlist) => ({
          ...playlist,
          tracks: playlist.tracks.map(toStoredTrack).filter(Boolean),
        })),
        recentlyPlayed: state.recentlyPlayed.map(toStoredTrack).filter(Boolean),
      }),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState;
        const validTracks = (tracks) =>
          (Array.isArray(tracks) ? tracks : []).map(toStoredTrack).filter(Boolean);
        return {
          ...persistedState,
          favorites: validTracks(persistedState.favorites),
          playlists: (Array.isArray(persistedState.playlists) ? persistedState.playlists : [])
            .map((playlist) => ({
              ...playlist,
              tracks: validTracks(playlist.tracks),
            })),
          recentlyPlayed: validTracks(persistedState.recentlyPlayed),
        };
      },
    }
  )
);

function toStoredTrack(track) {
  if (!track || !track.id || track.source !== 'deezer') return null;
  return {
    id: String(track.id).replace(/^deezer-/, ''),
    title: track.title,
    artist: track.artist,
    album: track.album,
    artworkUrl: track.artworkUrl,
    duration: track.duration,
    shareUrl: track.shareUrl,
    artistId: track.artistId,
    albumId: track.albumId,
    source: 'deezer',
    hasPreview: track.hasPreview ?? Boolean(track.isPreview),
  };
}
