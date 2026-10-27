import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div 
      className="p-8 md:p-10 rounded-card bg-brand-surface border border-brand-border/80 flex flex-col items-center justify-center text-center space-y-4 my-4"
      role="alert"
    >
      <div className="w-12 h-12 rounded-control bg-brand-action/10 flex items-center justify-center text-brand-accent">
        <RefreshCw className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg md:text-xl font-bold text-brand-text-primary">
          {message || "Couldn't load tracks. Try again."}
        </h3>
        <p className="text-xs text-brand-text-secondary">
          We&apos;ll keep your place.
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold flex items-center gap-2 shadow-soft transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try again</span>
        </button>
      )}
    </div>
  );
}
