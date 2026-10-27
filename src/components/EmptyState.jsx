import React from 'react';
import { Music } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Music, 
  title = "No tracks found", 
  description = "Explore other genres or search for new releases.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="p-8 md:p-12 rounded-card bg-brand-surface border border-brand-border/60 flex flex-col items-center justify-center text-center space-y-4 my-4">
      <div className="w-14 h-14 rounded-card bg-brand-raised flex items-center justify-center text-brand-accent shadow-sm">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-lg font-bold text-brand-text-primary">
          {title}
        </h3>
        <p className="text-xs text-brand-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold shadow-soft transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
