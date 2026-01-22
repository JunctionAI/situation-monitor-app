'use client';

import { useState } from 'react';
import { VIDEO_SOURCES, TWITTER_EMBEDS, VideoSource, TwitterEmbed } from '@/data/videoSources';
import { HOTSPOTS } from '@/data/hotspots';

type ViewMode = 'live' | 'social' | 'all';

export function VideoFeed() {
  const [viewMode, setViewMode] = useState<ViewMode>('live');
  const [selectedHotspot, setSelectedHotspot] = useState<string>('all');
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const criticalHotspots = HOTSPOTS.filter(h => h.tier === 'CRITICAL' && h.active);

  const filteredVideos = selectedHotspot === 'all'
    ? VIDEO_SOURCES
    : VIDEO_SOURCES.filter(v => v.hotspotId === selectedHotspot || v.hotspotId === 'all');

  const filteredTweets = selectedHotspot === 'all'
    ? TWITTER_EMBEDS
    : TWITTER_EMBEDS.filter(t => t.hotspotId === selectedHotspot);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold text-foreground tracking-wide">
              LIVE VIDEO FEED
            </h2>
          </div>
          <span className="text-xs text-text-muted">
            {filteredVideos.length + filteredTweets.length} sources
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 mb-3">
          {(['live', 'social', 'all'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === mode
                  ? 'bg-tactical-green text-background'
                  : 'bg-surface text-text-muted hover:text-foreground'
              }`}
            >
              {mode === 'live' ? '📺 Live Streams' : mode === 'social' ? '𝕏 Social' : '🌐 All'}
            </button>
          ))}
        </div>

        {/* Hotspot Filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedHotspot('all')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedHotspot === 'all'
                ? 'bg-foreground text-background'
                : 'bg-surface text-text-muted hover:text-foreground'
            }`}
          >
            All Zones
          </button>
          {criticalHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => setSelectedHotspot(hotspot.id)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedHotspot === hotspot.id
                  ? 'bg-risk-critical text-white'
                  : 'bg-surface text-text-muted hover:text-foreground'
              }`}
            >
              {hotspot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Live Streams */}
        {(viewMode === 'live' || viewMode === 'all') && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live News Streams
            </h3>
            <div className="grid gap-3">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isExpanded={expandedVideo === video.id}
                  onToggle={() => setExpandedVideo(
                    expandedVideo === video.id ? null : video.id
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Social Media Feed */}
        {(viewMode === 'social' || viewMode === 'all') && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="text-blue-400">𝕏</span>
              Social Media Updates
            </h3>
            <div className="space-y-2">
              {filteredTweets.length > 0 ? (
                filteredTweets.map((tweet) => (
                  <TwitterCard key={tweet.id} tweet={tweet} />
                ))
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">
                  No social posts for this zone
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3 border-t border-border bg-surface/50">
        <div className="text-xs text-text-muted text-center">
          Curated from verified news sources • Updates every 5 min
        </div>
      </div>
    </div>
  );
}

function VideoCard({
  video,
  isExpanded,
  onToggle
}: {
  video: VideoSource;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-border">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white text-xs">▶</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-foreground">{video.title}</div>
            <div className="text-xs text-text-muted">{video.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {video.verified && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
              ✓ Verified
            </span>
          )}
          <span className="text-text-muted">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {isExpanded && (
        <div className="aspect-video">
          <iframe
            src={video.embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

function TwitterCard({ tweet }: { tweet: TwitterEmbed }) {
  return (
    <div className="bg-surface rounded-lg p-3 border border-border hover:border-blue-500/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-400 text-lg">𝕏</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{tweet.account}</span>
            {tweet.accountVerified && (
              <span className="text-blue-400 text-xs">✓</span>
            )}
            <span className="text-xs text-text-muted">• {tweet.region}</span>
          </div>
          <p className="text-sm text-text-muted mt-1">{tweet.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              tweet.type === 'video'
                ? 'bg-red-500/20 text-red-400'
                : tweet.type === 'thread'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-green-500/20 text-green-400'
            }`}>
              {tweet.type === 'video' ? '📹 Video' : tweet.type === 'thread' ? '🧵 Thread' : '📢 Update'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
