'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  criticalCount?: number;
  lastUpdate?: string;
}

export function Header({ criticalCount = 0, lastUpdate }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('--:--:--');
  const [utcTime, setUtcTime] = useState<string>('--:--:--');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
      setUtcTime(now.toISOString().slice(11, 19));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-surface border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-tactical-green rounded-full animate-pulse" />
            <h1 className="text-xl font-bold tracking-wider text-foreground">
              SITUATION MONITOR
            </h1>
          </div>
          <span className="text-xs text-text-muted px-2 py-1 bg-surface-light rounded border border-border">
            v1.0
          </span>
        </div>

        {/* Center: Alert Status */}
        <div className="flex items-center gap-6">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-risk-critical/10 border border-risk-critical/30 rounded">
              <div className="w-2 h-2 bg-risk-critical rounded-full pulse-critical" />
              <span className="text-sm text-risk-critical font-medium">
                {criticalCount} CRITICAL ZONE{criticalCount !== 1 ? 'S' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Right: Time & Status */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-lg font-mono text-foreground tracking-wider">
              {currentTime}
            </div>
            <div className="text-xs text-text-muted">
              UTC {utcTime}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-xs text-text-muted">STATUS</span>
              <span className="text-xs text-tactical-green font-medium">OPERATIONAL</span>
            </div>
            <div className="w-3 h-3 bg-tactical-green rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
