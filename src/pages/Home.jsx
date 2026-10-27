import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Sparkles } from 'lucide-react';
import { getGenres, getTrendingTracks, getNewReleases } from '../services/deezer';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import GenreChips from '../components/GenreChips';
import TrackCard from '../components/TrackCard';
import TrackRow from '../components/TrackRow';
import { TrackCardSkeleton, TrackRowSkeleton } from '../components/Skeletons';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { recentlyPlayed } = useLibraryStore();

  const {
    data: genres = [],
    isError: isErrorGenres,
    refetch: refetchGenres,
  } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  // 1. Fetch Trending Tracks with TanStack Query
  const {
    data: trendingTracks,
    isLoading: isLoadingTrending,
    isError: isErrorTrending,
    error: errorTrending,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ['trendingTracks', selectedGenre],
    queryFn: () => getTrendingTracks({ tags: selectedGenre === 'all' ? null : selectedGenre, limit: 8 }),
  });

  // 2. Fetch New Releases with TanStack Query
  const {
    data: newReleases,
    isLoading: isLoadingNewReleases,
    isError: isErrorNewReleases,
    refetch: refetchNewReleases,
  } = useQuery({
    queryKey: ['newReleases'],
    queryFn: () => getNewReleases({ limit: 4 }),
  });

  const firstPlayableTrack = trendingTracks?.find((track) => track.hasPreview !== false);

  const handleStartListening = () => {
    if (firstPlayableTrack) {
      playTrack(firstPlayableTrack, trendingTracks);
    } else if (currentTrack) {
      if (!isPlaying) togglePlay();
    }
  };

  return (
    <div className="space-y-10 md:space-y-12 animate-in fade-in duration-300">
      {/* 1. Hero Banner Matching Figma Design */}
      <section 
        className="relative overflow-hidden rounded-card bg-gradient-to-r from-[#171328] via-[#241A42] to-[#120F20] border border-brand-border/70 p-6 sm:p-10 md:p-12 text-white shadow-soft"
        aria-label="Editorial hero"
      >
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest text-brand-accent uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Independent music. Unlimited discovery.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-brand-text-primary">
            Free music for everyone. <br className="hidden sm:inline" />
            No subscription, ever.
          </h1>

          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed max-w-xl">
            Find your next favorite. Explore music and listen to 30-second previews.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleStartListening}
              className="px-6 py-3 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white font-semibold text-sm flex items-center gap-2.5 shadow-soft transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start listening</span>
            </button>
            <span className="text-xs text-brand-text-secondary">
              No account. Just press play.
            </span>
          </div>
        </div>

        {/* Ambient atmospheric lighting */}
        <div 
          className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-brand-action/25 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
      </section>

      {/* 2. Interactive Genre Chips */}
      <section aria-label="Browse by genre">
        {isErrorGenres ? (
          <ErrorState message="Couldn't load Deezer genres." onRetry={refetchGenres} />
        ) : (
          <GenreChips
            selectedGenre={selectedGenre}
            genres={genres}
            onSelectGenre={(genreId) => setSelectedGenre(genreId)}
          />
        )}
      </section>

      {/* 3. Trending Now Section */}
      <section className="space-y-4" aria-label="Trending tracks">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight">
              Trending Now
            </h2>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Popular tracks on Deezer
            </p>
          </div>

          {firstPlayableTrack && (
            <button
              type="button"
              onClick={() => playTrack(firstPlayableTrack, trendingTracks)}
              className="text-xs font-semibold text-brand-accent hover:text-brand-text-primary flex items-center gap-1 transition-colors min-h-[36px]"
            >
              Play all &rarr;
            </button>
          )}
        </div>

        {/* State Handlers: Loading / Error / Empty / Grid */}
        {isLoadingTrending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <TrackCardSkeleton key={i} />
            ))}
          </div>
        ) : isErrorTrending ? (
          <ErrorState 
            message={errorTrending?.message || "Couldn't load trending tracks."} 
            onRetry={refetchTrending} 
          />
        ) : !trendingTracks || trendingTracks.length === 0 ? (
          <EmptyState
            title="No tracks found for this genre"
            description="Try selecting a different genre or browse all trending tracks."
            actionLabel="Reset to All"
            onAction={() => setSelectedGenre('all')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                queueContext={trendingTracks}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. New Releases Section */}
      <section className="space-y-4" aria-label="New releases">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight">
              More to Discover
            </h2>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              More tracks from Deezer charts
            </p>
          </div>
        </div>

        {isLoadingNewReleases ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <TrackRowSkeleton key={i} />
            ))}
          </div>
        ) : isErrorNewReleases ? (
          <ErrorState onRetry={refetchNewReleases} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {newReleases?.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                queueContext={newReleases}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Recently Played Section (persisted in localStorage) */}
      {recentlyPlayed && recentlyPlayed.length > 0 && (
        <section className="space-y-4" aria-label="Recently played tracks">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight">
                Recently Played
              </h2>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Saved locally on this device
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {recentlyPlayed.slice(0, 4).map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                queueContext={recentlyPlayed}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
