import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Sun, Moon } from 'lucide-react';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from html class
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('libretune_theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('libretune_theme', 'light');
      } catch (e) {}
    }
  };

  // ⌘K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full h-16 px-4 md:px-10 bg-brand-canvas/90 backdrop-blur-md border-b border-brand-border/40 gap-4">
      {/* Search Bar Input */}
      <div className="flex-1 max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="w-full flex items-center justify-between px-4 py-2 rounded-control bg-brand-surface border border-brand-border hover:border-brand-accent/50 text-brand-text-secondary text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
          aria-label="Search tracks, artists, albums"
        >
          <div className="flex items-center gap-3 truncate">
            <Search className="w-4 h-4 text-brand-text-secondary shrink-0" />
            <span className="truncate">
              {location.pathname === '/search' ? 'Search tracks, artists, albums...' : 'Search tracks, artists, albums...'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-brand-raised text-brand-text-secondary border border-brand-border/60">
            <span>⌘</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Action Items */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="hidden lg:inline-block text-xs font-medium text-brand-text-secondary">
          100% free. Always.
        </span>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-control flex items-center justify-center bg-brand-surface border border-brand-border text-brand-text-primary hover:bg-brand-raised transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-brand-text-secondary hover:text-brand-text-primary" />
          ) : (
            <Moon className="w-4 h-4 text-brand-text-secondary hover:text-brand-text-primary" />
          )}
        </button>
      </div>
    </header>
  );
}
