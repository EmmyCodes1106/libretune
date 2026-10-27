import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, ListMusic } from 'lucide-react';

export default function MobileNav() {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Playlists', path: '/playlists', icon: ListMusic },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-brand-surface/95 backdrop-blur-lg border-t border-brand-border flex items-center justify-around px-2 select-none"
      aria-label="Mobile Navigation Bar"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 rounded-control transition-colors ${
                isActive
                  ? 'text-brand-accent'
                  : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[11px] font-medium mt-1">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
