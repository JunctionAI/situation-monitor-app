'use client';

import { Hotspot } from '@/data/hotspots';
import { NewsArticle } from '@/types';
import { tierToColor, tierToLabel } from '@/data/riskZones';
import { timeAgo } from '@/lib/utils/timeAgo';

interface HotspotDetailProps {
  hotspot: Hotspot;
  relatedNews: NewsArticle[];
  onClose: () => void;
  onAskAbout?: () => void;
}

function TrendIndicator({ trend }: { trend?: 'up' | 'down' | 'stable' }) {
  if (!trend) return null;

  const config = {
    up: { icon: '↑', color: '#ef4444', label: 'Worsening' },
    down: { icon: '↓', color: '#22c55e', label: 'Improving' },
    stable: { icon: '→', color: '#6b7280', label: 'Stable' },
  };

  const { icon, color } = config[trend];
  return (
    <span style={{ color }} className="ml-1 font-bold">
      {icon}
    </span>
  );
}

function getDurationDays(startDate?: string): number | null {
  if (!startDate) return null;
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function HotspotDetail({ hotspot, relatedNews, onClose, onAskAbout }: HotspotDetailProps) {
  const color = tierToColor(hotspot.tier);
  const durationDays = getDurationDays(hotspot.startDate);

  return (
    <div className="absolute top-4 left-4 w-[420px] max-h-[calc(100%-2rem)] bg-surface/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl overflow-hidden z-20 flex flex-col">
      {/* Header */}
      <div
        className="flex-shrink-0 p-4 border-b border-border"
        style={{ borderLeftWidth: 4, borderLeftColor: color }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-text-muted uppercase tracking-wider">
                {hotspot.type} • {hotspot.tier}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {hotspot.name}
            </h2>
            {hotspot.status && (
              <p className="text-sm text-tactical-green mt-1 font-medium">
                {hotspot.status}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-foreground transition-colors text-xl leading-none p-1 ml-2"
          >
            ×
          </button>
        </div>

        {/* Duration badge */}
        {durationDays && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 bg-surface-light rounded border border-border">
            <span className="text-text-muted">Duration:</span>
            <span className="text-foreground font-medium">{durationDays} days</span>
            {hotspot.startDate && (
              <span className="text-text-muted">
                (since {new Date(hotspot.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      {hotspot.keyFacts && hotspot.keyFacts.length > 0 && (
        <div className="flex-shrink-0 p-3 border-b border-border bg-surface-light/30">
          <div className="grid grid-cols-2 gap-2">
            {hotspot.keyFacts.map((fact, index) => (
              <div key={index} className="bg-surface rounded p-2 border border-border">
                <div className="text-xs text-text-muted mb-0.5">{fact.label}</div>
                <div className="text-sm font-semibold text-foreground flex items-center">
                  {fact.value}
                  <TrendIndicator trend={fact.trend} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {hotspot.stats && (
        <div className="flex-shrink-0 p-3 border-b border-border">
          <h3 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Situation Overview
          </h3>
          <div className="space-y-1.5 text-sm">
            {hotspot.stats.casualties && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Casualties:</span>
                <span className="text-risk-critical font-medium">{hotspot.stats.casualties}</span>
              </div>
            )}
            {hotspot.stats.displaced && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Displaced:</span>
                <span className="text-risk-high font-medium">{hotspot.stats.displaced}</span>
              </div>
            )}
            {hotspot.stats.territory && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Territory:</span>
                <span className="text-foreground">{hotspot.stats.territory}</span>
              </div>
            )}
            {hotspot.stats.economic && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Economic Impact:</span>
                <span className="text-foreground">{hotspot.stats.economic}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parties Involved */}
      {hotspot.parties && hotspot.parties.length > 0 && (
        <div className="flex-shrink-0 px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted">Parties:</span>
            {hotspot.parties.map((party, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 bg-surface-light rounded border border-border"
              >
                {party}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="flex-shrink-0 p-3 border-b border-border">
        <p className="text-sm text-text-secondary leading-relaxed">
          {hotspot.description}
        </p>
      </div>

      {/* Related News */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        <h3 className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2 sticky top-0 bg-surface/95 py-1">
          <span className="w-2 h-2 bg-tactical-green rounded-full animate-pulse" />
          Live Intel Feed ({relatedNews.length} articles)
        </h3>

        {relatedNews.length === 0 ? (
          <p className="text-sm text-text-muted italic py-4 text-center">
            No recent articles matching this situation.
            <br />
            <span className="text-xs">Try refreshing the news feed.</span>
          </p>
        ) : (
          <div className="space-y-2">
            {relatedNews.slice(0, 8).map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded border border-transparent hover:bg-surface-light hover:border-border transition-colors"
              >
                <p className="text-sm text-foreground line-clamp-2 leading-tight">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-tactical-green font-medium">
                    {article.source}
                  </span>
                  <span className="text-xs text-text-muted">
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Ask AI Button */}
      {onAskAbout && (
        <div className="flex-shrink-0 p-3 border-t border-border">
          <button
            onClick={onAskAbout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-tactical-blue/20 hover:bg-tactical-blue/30 border border-tactical-blue/50 text-tactical-blue rounded-lg transition-colors"
          >
            <span>🧠</span>
            <span className="font-medium">Ask Intel Analyst about this</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex-shrink-0 p-2 border-t border-border bg-surface-light/50">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            {hotspot.coordinates[1].toFixed(2)}°N, {hotspot.coordinates[0].toFixed(2)}°E
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-tactical-green rounded-full animate-pulse" />
              LIVE
            </span>
            <span className="text-border">|</span>
            <span>{hotspot.countries.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
