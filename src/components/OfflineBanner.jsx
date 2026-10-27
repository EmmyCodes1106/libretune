import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div 
      className="w-full bg-[#241F35] border-b border-brand-accent/30 px-4 md:px-8 py-3 select-none"
      role="alert"
    >
      <div className="max-w-[1440px] mx-auto flex items-center gap-3">
        <div className="w-8 h-8 rounded-control bg-brand-action/20 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4 text-brand-accent" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-text-primary">
            You&apos;re offline
          </h4>
          <p className="text-xs text-brand-text-secondary">
            Reconnect to stream. Your favorites and playlists are safe on this device.
          </p>
        </div>
      </div>
    </div>
  );
}
