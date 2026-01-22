'use client';

import { NewsArticle, RiskScore } from '@/types';
import { tierToColor, scoreToTier } from '@/data/riskZones';
import { timeAgo } from '@/lib/utils/timeAgo';
import { HOTSPOTS, Hotspot } from '@/data/hotspots';
import { useMemo } from 'react';

interface NewsTabProps {
  countryCode: string;
  countryName: string;
  relatedNews: NewsArticle[];
  riskScore?: RiskScore;
  onHotspotClick?: (hotspot: Hotspot) => void;
  onAskAbout?: () => void;
}

export function NewsTab({
  countryCode,
  countryName,
  relatedNews,
  riskScore,
  onHotspotClick,
  onAskAbout,
}: NewsTabProps) {
  // Find hotspots in this country
  const countryHotspots = useMemo(() => {
    return HOTSPOTS.filter(h => h.countries.includes(countryCode));
  }, [countryCode]);

  const score = riskScore?.score ?? 0;
  const tier = scoreToTier(score);

  return (
    <div className="flex flex-col h-full">
      {/* Risk Summary */}
      {riskScore && (
        <div className="flex-shrink-0 p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tierToColor(tier) }}
              />
              <span className="text-sm font-medium" style={{ color: tierToColor(tier) }}>
                {tier} Risk
              </span>
              <span className="text-xs text-text-muted">({score}/100)</span>
            </div>
            {riskScore.trend && (
              <span className={`text-xs ${
                riskScore.trend === 'IMPROVING' ? 'text-risk-low' :
                riskScore.trend === 'DETERIORATING' ? 'text-risk-critical' :
                'text-text-muted'
              }`}>
                {riskScore.trend === 'IMPROVING' ? '↓ Improving' :
                 riskScore.trend === 'DETERIORATING' ? '↑ Worsening' :
                 '→ Stable'}
              </span>
            )}
          </div>
          {riskScore.summary && (
            <p className="text-xs text-text-secondary mt-2">{riskScore.summary}</p>
          )}
        </div>
      )}

      {/* Active Hotspots */}
      {countryHotspots.length > 0 && (
        <div className="flex-shrink-0 p-3 border-b border-border">
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-risk-critical rounded-full animate-pulse" />
            Active Situations ({countryHotspots.length})
          </h4>
          <div className="space-y-1.5">
            {countryHotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => onHotspotClick?.(hotspot)}
                className="w-full text-left p-2 rounded border border-border hover:border-tactical-green hover:bg-surface-light transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tierToColor(hotspot.tier) }}
                  />
                  <span className="text-sm font-medium text-foreground flex-1">
                    {hotspot.name}
                  </span>
                  <span className="text-xs text-text-muted capitalize">
                    {hotspot.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* News Feed */}
      <div className="flex-1 overflow-y-auto p-3">
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2 sticky top-0 bg-surface/95 py-1 -mt-1">
          <span className="w-2 h-2 bg-tactical-green rounded-full animate-pulse" />
          Live News ({relatedNews.length})
        </h4>

        {relatedNews.length === 0 ? (
          <div className="text-center py-6 text-text-muted">
            <span className="text-2xl mb-2 block">📰</span>
            <p className="text-sm">No recent news about {countryName}.</p>
            <p className="text-xs mt-1">News updates every 90 seconds.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {relatedNews.slice(0, 15).map((article) => (
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
            <span className="font-medium text-sm">Ask Intel Analyst</span>
          </button>
        </div>
      )}
    </div>
  );
}
