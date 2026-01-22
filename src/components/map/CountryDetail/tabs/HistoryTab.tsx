'use client';

import { CountryProfileResponse } from '@/types';

interface HistoryTabProps {
  data: CountryProfileResponse;
}

export function HistoryTab({ data }: HistoryTabProps) {
  const { historical, basic } = data;

  return (
    <div className="p-3 space-y-4 overflow-y-auto">
      {/* Wikipedia Thumbnail */}
      {historical.thumbnail && (
        <div className="flex justify-center">
          <img
            src={historical.thumbnail.source}
            alt={`${basic.name.common}`}
            className="max-w-full h-auto rounded border border-border shadow-sm"
            style={{ maxHeight: '150px' }}
          />
        </div>
      )}

      {/* Wikipedia Summary */}
      <div>
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>📚</span>
          Overview
        </h4>
        <div className="text-sm text-text-secondary leading-relaxed">
          {historical.summary || 'No historical information available.'}
        </div>
        <a
          href={`https://en.wikipedia.org/wiki/${basic.name.common.replace(/ /g, '_')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-tactical-blue hover:underline mt-2"
        >
          Read more on Wikipedia →
        </a>
      </div>

      {/* Independence */}
      {historical.independence && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Independence
          </h4>
          <div className="p-3 bg-surface-light border border-border rounded">
            {historical.independence.date && (
              <div className="text-sm font-medium text-foreground">
                {formatDate(historical.independence.date)}
              </div>
            )}
            {historical.independence.from && (
              <div className="text-xs text-text-muted mt-0.5">
                from {historical.independence.from}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Historical Events */}
      {historical.keyEvents && historical.keyEvents.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Key Events
          </h4>
          <div className="space-y-2">
            {historical.keyEvents.map((event, index) => (
              <div
                key={index}
                className="flex gap-3 p-2 bg-surface-light border border-border rounded"
              >
                <div className="text-xs font-mono text-tactical-green flex-shrink-0 w-12">
                  {event.year}
                </div>
                <div className="text-sm text-text-secondary flex-1">
                  {event.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Historical Context */}
      {historical.historicalContext && (
        <div className="p-3 bg-surface-light/50 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span>🤖</span>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              AI Historical Analysis
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {historical.historicalContext}
          </p>
        </div>
      )}

      {/* Source Attribution */}
      <div className="text-xs text-text-muted italic border-t border-border pt-3">
        Historical information sourced from Wikipedia. Last updated may vary.
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
