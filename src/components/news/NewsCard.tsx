'use client';

import { NewsArticle } from '@/types';
import { getCategoryConfig } from '@/data/categories';
import { findMatchingHotspots, Hotspot } from '@/data/hotspots';
import { timeAgo } from '@/lib/utils/timeAgo';

interface NewsCardProps {
  article: NewsArticle;
  onHotspotClick?: (hotspot: Hotspot) => void;
  isNew?: boolean;
}

export function NewsCard({ article, onHotspotClick, isNew }: NewsCardProps) {
  const categoryConfig = getCategoryConfig(article.category);
  const matchingHotspots = findMatchingHotspots(article.title, article.description);

  const handleLocationClick = (e: React.MouseEvent, hotspot: Hotspot) => {
    e.preventDefault();
    e.stopPropagation();
    onHotspotClick?.(hotspot);
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`news-card block p-4 border-l-2 hover:border-l-tactical-green-dim ${
        isNew ? 'animate-highlight-new bg-tactical-green/5' : ''
      }`}
      style={{ borderLeftColor: categoryConfig.color }}
    >
      {/* Category & Time */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {isNew && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-tactical-green text-background font-bold animate-pulse">
            NEW
          </span>
        )}
        <span
          className="text-xs px-2 py-0.5 rounded font-medium"
          style={{
            backgroundColor: `${categoryConfig.color}20`,
            color: categoryConfig.color
          }}
        >
          {categoryConfig.label}
        </span>
        <span className="text-xs text-text-muted">
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-foreground leading-snug mb-2 line-clamp-2">
        {article.title}
      </h3>

      {/* Description */}
      {article.description && (
        <p className="text-xs text-text-secondary line-clamp-2 mb-2">
          {article.description}
        </p>
      )}

      {/* Location tags - clickable to jump to map */}
      {matchingHotspots.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="text-xs text-text-muted">📍</span>
          {matchingHotspots.slice(0, 2).map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={(e) => handleLocationClick(e, hotspot)}
              className="text-xs px-2 py-0.5 rounded bg-surface-light border border-border hover:border-tactical-green hover:text-tactical-green transition-colors"
            >
              {hotspot.name}
            </button>
          ))}
        </div>
      )}

      {/* Source */}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span className="font-medium">{article.source}</span>
        {article.author && (
          <>
            <span>•</span>
            <span className="truncate max-w-[150px]">{article.author}</span>
          </>
        )}
      </div>

      {/* Sentiment indicator if available */}
      {article.sentiment && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={`w-2 h-2 rounded-full ${
              article.sentiment.label === 'negative'
                ? 'bg-risk-critical'
                : article.sentiment.label === 'positive'
                ? 'bg-risk-low'
                : 'bg-text-muted'
            }`}
          />
          <span className="text-xs text-text-muted capitalize">
            {article.sentiment.label} sentiment
          </span>
        </div>
      )}
    </a>
  );
}
