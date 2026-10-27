import React from 'react';

export function TrackCardSkeleton() {
  return (
    <div 
      className="p-3.5 rounded-card bg-brand-surface border border-brand-border/60 animate-pulse flex flex-col justify-between"
      aria-hidden="true"
    >
      <div className="w-full aspect-square bg-brand-raised rounded-control mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-brand-raised rounded w-3/4" />
        <div className="h-3 bg-brand-raised rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 bg-brand-raised rounded w-1/4" />
          <div className="h-3 bg-brand-raised rounded w-1/5" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-brand-border/30">
        <div className="w-7 h-7 bg-brand-raised rounded-control" />
        <div className="w-7 h-7 bg-brand-raised rounded-control" />
      </div>
    </div>
  );
}

export function TrackRowSkeleton() {
  return (
    <div 
      className="p-3 rounded-control bg-brand-surface border border-brand-border/60 flex items-center justify-between gap-3 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 bg-brand-raised rounded-control shrink-0" />
        <div className="w-10 h-10 bg-brand-raised rounded-lg shrink-0" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="h-3.5 bg-brand-raised rounded w-2/3" />
          <div className="h-3 bg-brand-raised rounded w-1/3" />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-3 bg-brand-raised rounded w-8 hidden sm:block" />
        <div className="w-7 h-7 bg-brand-raised rounded-control" />
        <div className="w-7 h-7 bg-brand-raised rounded-control" />
      </div>
    </div>
  );
}
