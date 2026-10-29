import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Player from './Player';
import MobileNav from './MobileNav';
import Toast from './Toast';
import OfflineBanner from './OfflineBanner';
import NowPlaying from './NowPlaying';
import { useAudio } from '../hooks/useAudio';

export default function Layout() {
  const { seek } = useAudio();

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-text-primary flex flex-col selection:bg-brand-action selection:text-white">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-brand-action text-white rounded-control font-medium shadow-soft"
      >
        Skip to main content
      </a>

      <OfflineBanner />

      <div className="flex flex-1 w-full relative">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <TopBar />

          <main id="main-content" className="flex-1 px-4 md:px-10 py-6 md:py-8 pb-40 md:pb-36 max-w-[1440px] w-full mx-auto">
            <Outlet />

            <footer className="mt-16 pt-8 border-t border-brand-border/60 text-xs text-brand-text-secondary/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>
                Music data and previews provided by Deezer,
              </p>
              <p className="text-[11px]">
                LibreTune &mdash; Free music for everyone. No subscription, ever.
              </p>
            </footer>
          </main>
        </div>
      </div>

      {/* Persistent Audio Player Bar */}
      <Player seek={seek} />

      {/* Expanded Now Playing View */}
      <NowPlaying seek={seek} />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Notification Toast */}
      <Toast />
    </div>
  );
}
