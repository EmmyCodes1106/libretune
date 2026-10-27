import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchX, Disc, Sparkles } from 'lucide-react';
import { searchTracks, searchArtists, searchAlbums, getAlbumTracks, getArtistTracks } from '../services/deezer';
import { useDebounce } from '../hooks/useDebounce';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import SearchBar from '../components/SearchBar';
import TrackRow from '../components/TrackRow';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import { TrackRowSkeleton } from '../components/Skeletons';
import ErrorState from '../components/ErrorState';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Tracks' | 'Artists' | 'Albums'
  const debouncedQuery = useDebounce(searchTerm.trim(), 400);

  const { playTrack } = usePlayerStore();
  const { showToast } = useLibraryStore();

  // 1. Fetch Tracks with TanStack Query
  const {
    data: tracks = [],
    isLoading: isLoadingTracks,
    isError: isErrorTracks,
    refetch: refetchTracks,
  } = useQuery({
    queryKey: ['searchTracks', debouncedQuery],
    queryFn: () => searchTracks(debouncedQuery, { limit: 12 }),
    enabled: Boolean(debouncedQuery),
  });

  // 2. Fetch Artists with TanStack Query
  const {
    data: artists = [],
    isLoading: isLoadingArtists,
    isError: isErrorArtists,
  } = useQuery({
    queryKey: ['searchArtists', debouncedQuery],
    queryFn: () => searchArtists(debouncedQuery, { limit: 4 }),
    enabled: Boolean(debouncedQuery),
  });

  // 3. Fetch Albums with TanStack Query
  const {
    data: albums = [],
    isLoading: isLoadingAlbums,
    isError: isErrorAlbums,
  } = useQuery({
    queryKey: ['searchAlbums', debouncedQuery],
    queryFn: () => searchAlbums(debouncedQuery, { limit: 4 }),
    enabled: Boolean(debouncedQuery),
  });

  const isLoading = isLoadingTracks || isLoadingArtists || isLoadingAlbums;
  const hasResults = tracks.length > 0 || artists.length > 0 || albums.length > 0;
  const isSearching = Boolean(debouncedQuery);

  // Generate dynamic typeahead suggestions matching Figma
  const suggestions = [
    ...tracks.slice(0, 2).map((t) => ({
      type: 'track',
      id: t.id,
      title: t.title,
      subtitle: `${t.artist} · ${t.hasPreview ? 'Preview' : 'No preview available'}`,
      track: t,
    })),
    ...(debouncedQuery
      ? [
          { type: 'term', title: debouncedQuery, subtitle: 'Search query' },
          { type: 'term', title: `${debouncedQuery} ambient`, subtitle: 'Search query' },
        ]
      : []),
  ];

  const handleSelectSuggestion = (suggestion) => {
    if (suggestion.type === 'track') {
      playTrack(suggestion.track, tracks);
    } else {
      setSearchTerm(suggestion.title);
    }
  };

  const handlePlayAlbum = async (album) => {
    try {
      showToast(`Loading album "${album.name}"...`);
      const albumTracks = await getAlbumTracks(album.id);
      if (albumTracks && albumTracks.length > 0) {
        playTrack(albumTracks[0], albumTracks);
      } else {
        showToast(`No audio tracks found for this album.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`Could not load album tracks.`);
    }
  };

  const handleSelectArtist = async (artist) => {
    try {
      showToast(`Loading tracks by ${artist.name}...`);
      const artistTracks = await getArtistTracks(artist.id);
      if (artistTracks && artistTracks.length > 0) {
        playTrack(artistTracks[0], artistTracks);
      } else {
        setSearchTerm(artist.name);
      }
    } catch (e) {
      setSearchTerm(artist.name);
    }
  };

  const filterTabs = ['All', 'Tracks', 'Artists', 'Albums'];
  const suggestedPills = ['Afrobeat', 'African', 'Chill', 'Jazz', 'Pop', 'Electronic', 'Rock', 'Ambient'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search Input Bar */}
      <section className="space-y-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          onSelectSuggestion={handleSelectSuggestion}
          suggestions={suggestions}
          placeholder="Search tracks, artists, albums..."
        />
      </section>

      {/* Header with Query & Tabs */}
      {isSearching && (
        <section className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary">
              Results for &ldquo;{debouncedQuery}&rdquo;
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-secondary">
              A little discovery goes a long way.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
            {filterTabs.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-chip text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[38px] ${
                    isSelected
                      ? 'bg-brand-action text-white shadow-soft font-semibold'
                      : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-brand-raised rounded w-32 animate-pulse mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <TrackRowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isErrorTracks && (
        <ErrorState onRetry={refetchTracks} message="Couldn't complete search. Try again." />
      )}

      {/* No Results State (Specimen 04 matching Figma) */}
      {!isLoading && isSearching && !hasResults && (
        <section 
          className="p-8 sm:p-14 rounded-card bg-brand-surface border border-brand-border/60 flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto my-6"
          role="region"
          aria-label="No results"
        >
          <div className="w-14 h-14 rounded-full bg-brand-raised flex items-center justify-center text-brand-accent shadow-sm">
            <SearchX className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-brand-text-primary">
              No results found
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
              We couldn&apos;t find &ldquo;{debouncedQuery}&rdquo;. Try another title, artist, or a broader search.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {suggestedPills.slice(0, 4).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTerm(tag)}
                className="px-4 py-1.5 rounded-chip text-xs font-medium bg-brand-canvas border border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Initial Landing State (before search input) */}
      {!isSearching && (
        <section className="py-12 sm:py-16 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-card bg-brand-action/15 flex items-center justify-center text-brand-accent shadow-soft">
            <Disc className="w-8 h-8 animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-brand-text-primary">
              Search LibreTune
            </h2>
            <p className="text-sm text-brand-text-secondary leading-relaxed">
              Find tracks, artists, and albums, then listen to available previews.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {suggestedPills.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSearchTerm(genre)}
                className="px-4 py-2 rounded-chip text-xs font-semibold bg-brand-surface border border-brand-border hover:border-brand-accent text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-all"
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Grouped Results Display */}
      {!isLoading && isSearching && hasResults && (
        <div className="space-y-10">
          {/* 1. Tracks Section */}
          {(activeTab === 'All' || activeTab === 'Tracks') && tracks.length > 0 && (
            <section className="space-y-4" aria-label="Track results">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-brand-text-primary">
                  Tracks
                </h3>
                <span className="text-xs text-brand-text-secondary font-medium">
                  {tracks.length} {tracks.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              <div className="space-y-2">
                {tracks.map((track) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    queueContext={tracks}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 2. Artists Section */}
          {(activeTab === 'All' || activeTab === 'Artists') && artists.length > 0 && (
            <section className="space-y-4" aria-label="Artist results">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-brand-text-primary">
                  Artists
                </h3>
                <span className="text-xs text-brand-text-secondary font-medium">
                  {artists.length} {artists.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onClick={() => handleSelectArtist(artist)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 3. Albums Section */}
          {(activeTab === 'All' || activeTab === 'Albums') && albums.length > 0 && (
            <section className="space-y-4" aria-label="Album results">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-brand-text-primary">
                  Albums
                </h3>
                <span className="text-xs text-brand-text-secondary font-medium">
                  {albums.length} {albums.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {albums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onPlayAlbum={() => handlePlayAlbum(album)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
