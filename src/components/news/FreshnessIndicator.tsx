'use client';

import { useEffect, useState } from 'react';

interface FreshnessIndicatorProps {
  lastUpdated: string;
  sources?: string[];
}

export function FreshnessIndicator({ lastUpdated, sources }: FreshnessIndicatorProps) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const age = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
      setSecondsAgo(age);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const isFresh = secondsAgo < 120; // Less than 2 minutes old

  const formatTime = () => {
    if (secondsAgo < 60) {
      return `${secondsAgo}s ago`;
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)}m ago`;
    } else {
      return `${Math.floor(secondsAgo / 3600)}h ago`;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${
          isFresh ? 'bg-tactical-green animate-pulse' : 'bg-amber-500'
        }`}
      />
      <span className="text-xs text-text-muted">
        {formatTime()}
      </span>
      {sources && sources.length > 0 && (
        <span className="text-xs text-text-muted opacity-60">
          • {sources.length} source{sources.length !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
