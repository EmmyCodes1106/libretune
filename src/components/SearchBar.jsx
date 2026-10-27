import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Music } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  onSelectSuggestion,
  suggestions = [],
  placeholder = 'Search tracks, artists, albums...',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl select-none">
      <div 
        className={`flex items-center px-4 py-3 rounded-control bg-brand-surface border transition-all duration-200 ${
          isOpen && value.trim()
            ? 'border-brand-accent ring-2 ring-brand-accent/20'
            : 'border-brand-border focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/20'
        }`}
      >
        <SearchIcon className="w-5 h-5 text-brand-text-secondary mr-3 shrink-0" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-brand-text-primary placeholder:text-brand-text-secondary text-sm md:text-base focus:outline-none"
          aria-label="Search"
          autoFocus
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            className="p-1 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors ml-2"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions As You Type Dropdown (matches Figma specimen) */}
      {isOpen && value.trim().length > 1 && suggestions.length > 0 && (
        <div 
          className="absolute left-0 right-0 top-full mt-2 z-40 rounded-card bg-brand-surface border border-brand-border shadow-soft overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          role="listbox"
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-brand-raised/40 border-b border-brand-border/60 text-[11px] font-bold tracking-wider text-brand-text-secondary uppercase">
            <span>Suggestions as you type</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-surface border border-brand-border">
              ESC
            </span>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectSuggestion(item);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-brand-raised/60 transition-colors group min-h-[44px]"
                role="option"
                aria-selected="false"
              >
                <div className="flex items-center gap-3 truncate min-w-0">
                  {item.type === 'track' ? (
                    <div className="w-7 h-7 rounded-lg bg-brand-action/20 flex items-center justify-center shrink-0 text-brand-accent">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-brand-raised flex items-center justify-center shrink-0 text-brand-text-secondary">
                      <SearchIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="truncate">
                    <p className="text-sm font-semibold text-brand-text-primary group-hover:text-brand-accent truncate transition-colors">
                      {item.title || item.name}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-brand-text-secondary truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-medium text-brand-text-secondary/70 shrink-0 ml-3">
                  {item.type === 'track' ? 'Track' : 'Search term'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
