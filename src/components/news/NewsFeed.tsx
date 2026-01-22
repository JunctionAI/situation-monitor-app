'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NewsCard } from './NewsCard';
import { NewsFilters } from './NewsFilters';
import { FreshnessIndicator } from './FreshnessIndicator';
import { NewsArticle, NewsCategory, NewsResponse } from '@/types';

async function fetchNews(category?: NewsCategory): Promise<NewsResponse> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);

  const response = await fetch(`/api/news?${params}`);
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
}

export function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
  const [newArticleIds, setNewArticleIds] = useState<Set<string>>(new Set());
  const previousArticleIdsRef = useRef<Set<string>>(new Set());

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['news', selectedCategory],
    queryFn: () => fetchNews(selectedCategory || undefined),
    refetchInterval: 90 * 1000, // Refetch every 90 seconds
    staleTime: 60 * 1000, // Consider data stale after 1 minute
    refetchIntervalInBackground: true, // Keep polling when tab is in background
  });

  // Track new articles
  useEffect(() => {
    if (data?.articles) {
      const currentIds = new Set(data.articles.map(a => a.id));
      const previousIds = previousArticleIdsRef.current;

      // Find new articles (not in previous set)
      const newIds = new Set<string>();
      currentIds.forEach(id => {
        if (!previousIds.has(id) && previousIds.size > 0) {
          newIds.add(id);
        }
      });

      if (newIds.size > 0) {
        setNewArticleIds(newIds);
        // Clear "new" status after 30 seconds
        setTimeout(() => setNewArticleIds(new Set()), 30000);
      }

      previousArticleIdsRef.current = currentIds;
    }
  }, [data?.articles]);

  const handleCategoryChange = (category: NewsCategory | null) => {
    setSelectedCategory(category);
    // Reset new article tracking when changing category
    previousArticleIdsRef.current = new Set();
    setNewArticleIds(new Set());
  };

  const articles = data?.articles || [];
  const newCount = newArticleIds.size;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground tracking-wide">
              INCOMING FEED
            </h2>
            {newCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-tactical-green text-background font-bold">
                +{newCount} NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isFetching && (
              <span className="text-xs text-tactical-green animate-pulse">
                UPDATING...
              </span>
            )}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs text-text-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
        <NewsFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-text-muted">
              <div className="animate-pulse">Loading news feed...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-risk-high text-sm">
              Failed to load news. Check your connection.
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-text-muted text-sm">
              No articles found for this category.
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {articles.map((article: NewsArticle) => (
              <NewsCard
                key={article.id}
                article={article}
                isNew={newArticleIds.has(article.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {data && (
        <div className="flex-shrink-0 p-3 border-t border-border bg-surface/50">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{articles.length} articles</span>
            <FreshnessIndicator
              lastUpdated={data.lastUpdated}
              sources={data.sources}
            />
          </div>
        </div>
      )}
    </div>
  );
}
