import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, ListMusic, Lock, Music } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Playlists', path: '/playlists', icon: ListMusic },
  ];

  return (
    <aside 
      className="hidden md:flex flex-col w-[224px] shrink-0 min-h-screen bg-brand-surface border-r border-brand-border select-none p-5 pb-28 justify-between z-20"
      aria-label="Main Navigation"
    >
      <div className="flex flex-col gap-8">
        {/* LibreTune Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-control p-1"
          aria-label="LibreTune Home"
        >
          <div className="w-9 h-9 rounded-control bg-brand-action flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-brand-text-primary">
            LibreTune
          </span>
        </NavLink>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5" aria-label="Sidebar links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[44px] rounded-control font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-brand-raised text-brand-text-primary shadow-sm font-semibold'
                      : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised/40'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-brand-accent' : 'text-brand-text-secondary'
                      }`} 
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Brand Mission Card & Footer */}
      <div className="flex flex-col gap-3">
        <div className="p-4 rounded-card bg-brand-canvas border border-brand-border/60">
          <div className="w-7 h-7 rounded-lg bg-brand-raised flex items-center justify-center mb-2.5">
            <Lock className="w-4 h-4 text-brand-accent" />
          </div>
          <h4 className="text-xs font-bold text-brand-text-primary">
            Good music. No strings.
          </h4>
          <p className="text-[12px] text-brand-text-secondary leading-relaxed mt-1">
            Free to listen. Always. No account needed.
          </p>
        </div>

        <p className="text-[11px] text-brand-text-secondary/60 px-1 leading-snug">
          Independent sounds. Open possibilities.
        </p>
      </div>
    </aside>
  );
}
