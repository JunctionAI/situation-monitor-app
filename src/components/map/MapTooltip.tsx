'use client';

import { TooltipData, MapPosition } from '@/types';
import { tierToColor, tierToLabel } from '@/data/riskZones';
import { timeAgo } from '@/lib/utils/timeAgo';

interface MapTooltipProps {
  data: TooltipData;
  position: MapPosition;
}

export function MapTooltip({ data, position }: MapTooltipProps) {
  const { country, risk, recentNews } = data;

  // Position tooltip to avoid going off screen
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x + 15,
    top: position.y - 10,
    zIndex: 1000,
    maxWidth: '320px',
    pointerEvents: 'none'
  };

  // Adjust if too close to right edge
  if (position.x > window.innerWidth - 350) {
    tooltipStyle.left = position.x - 335;
  }

  // Adjust if too close to bottom edge
  if (position.y > window.innerHeight - 300) {
    tooltipStyle.top = position.y - 200;
  }

  return (
    <div
      style={tooltipStyle}
      className="bg-surface border border-border rounded-lg shadow-xl p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">{country}</h3>
        {risk && (
          <span
            className="risk-badge"
            style={{
              backgroundColor: `${tierToColor(risk.tier)}20`,
              color: tierToColor(risk.tier),
              borderColor: tierToColor(risk.tier)
            }}
          >
            {risk.tier}
          </span>
        )}
      </div>

      {/* Risk Info */}
      {risk && (
        <div className="mb-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-text-secondary text-sm">Risk Level:</span>
            <span className="text-foreground font-medium">{tierToLabel(risk.tier)}</span>
            <span className="text-text-muted text-sm">({risk.score}/100)</span>
          </div>
          {risk.summary && (
            <p className="text-text-secondary text-sm leading-relaxed">
              {risk.summary}
            </p>
          )}
          {risk.trend && risk.trend !== 'STABLE' && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-xs ${risk.trend === 'DETERIORATING' ? 'text-risk-critical' : 'text-risk-low'}`}>
                {risk.trend === 'DETERIORATING' ? '↗ Deteriorating' : '↘ Improving'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Recent News */}
      {recentNews.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Recent Headlines
          </h4>
          <div className="space-y-2">
            {recentNews.map((article, index) => (
              <div key={index} className="text-sm">
                <p className="text-foreground line-clamp-2 leading-tight">
                  {article.title}
                </p>
                <p className="text-text-muted text-xs mt-1">
                  {article.source} • {timeAgo(article.publishedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data message */}
      {!risk && recentNews.length === 0 && (
        <p className="text-text-secondary text-sm">
          No significant alerts for this region.
        </p>
      )}
    </div>
  );
}
