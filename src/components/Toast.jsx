import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';

export default function Toast() {
  const { toastMessage, hideToast } = useLibraryStore();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toastMessage, hideToast]);

  if (!toastMessage) return null;

  return (
    <aside 
      className="fixed bottom-24 md:bottom-28 right-4 md:right-8 z-50 flex items-center justify-between gap-4 px-4 py-3 rounded-card bg-brand-surface border border-brand-border shadow-soft min-w-[280px] max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200"
      aria-live="polite"
      aria-label="Notification"
    >
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0" />
        <span className="text-sm font-medium text-brand-text-primary">
          {toastMessage.message}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {toastMessage.undoAction && (
          <button
            type="button"
            onClick={() => {
              toastMessage.undoAction();
              hideToast();
            }}
            className="text-xs font-semibold text-brand-accent hover:text-brand-text-primary transition-colors px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
          >
            Undo
          </button>
        )}

        <button
          type="button"
          onClick={hideToast}
          className="p-1 text-brand-text-secondary hover:text-brand-text-primary transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
