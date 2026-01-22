'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { WorldMap } from '@/components/map/WorldMap';
import { Globe3D } from '@/components/globe/Globe3D';
import { NewsFeed } from '@/components/news/NewsFeed';
import { VideoFeed } from '@/components/video/VideoFeed';
import { RiskScore, NewsResponse } from '@/types';
import { Hotspot } from '@/data/hotspots';
import { CountryInfo } from '@/data/countries';

type MapView = '2d' | '3d';
type SidePanel = 'news' | 'video';

async function fetchRisks(): Promise<{ risks: Record<string, RiskScore> }> {
  const response = await fetch('/api/risk');
  if (!response.ok) throw new Error('Failed to fetch risks');
  return response.json();
}

async function fetchNews(): Promise<NewsResponse> {
  const response = await fetch('/api/news');
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
}

export default function Dashboard() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [mapView, setMapView] = useState<MapView>('2d');
  const [sidePanel, setSidePanel] = useState<SidePanel>('news');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: riskData } = useQuery({
    queryKey: ['risks'],
    queryFn: fetchRisks,
    refetchInterval: 5 * 60 * 1000, // 5 minutes for faster updates
    staleTime: 2 * 60 * 1000,
  });

  const { data: newsData, dataUpdatedAt } = useQuery({
    queryKey: ['news-for-map'],
    queryFn: fetchNews,
    refetchInterval: 60 * 1000, // 60 seconds for real-time feel
    staleTime: 30 * 1000,
    refetchIntervalInBackground: true,
  });

  // Update last update timestamp when news refreshes
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdate(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  // Count critical zones
  const criticalCount = riskData
    ? Object.values(riskData.risks).filter(r => r.tier === 'CRITICAL').length
    : 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Header criticalCount={criticalCount} />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Map/Globe Section - 70% */}
        <div className="flex-[7] flex flex-col overflow-hidden">
          {/* View Toggle */}
          <div className="flex-shrink-0 p-2 bg-surface border-b border-border flex items-center gap-2">
            <span className="text-xs text-text-muted mr-2">VIEW:</span>
            <button
              onClick={() => setMapView('2d')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                mapView === '2d'
                  ? 'bg-tactical-green text-background'
                  : 'bg-background text-text-muted hover:text-foreground border border-border'
              }`}
            >
              🗺️ 2D Map
            </button>
            <button
              onClick={() => setMapView('3d')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                mapView === '3d'
                  ? 'bg-tactical-green text-background'
                  : 'bg-background text-text-muted hover:text-foreground border border-border'
              }`}
            >
              🌐 3D Globe
            </button>
          </div>

          {/* Map/Globe Content */}
          <div className="flex-1 p-4 overflow-hidden">
            {mapView === '2d' ? (
              <WorldMap
                newsData={newsData?.articles || []}
                riskOverrides={riskData?.risks || {}}
                onHotspotSelect={setSelectedHotspot}
                onCountrySelect={setSelectedCountry}
                onOpenInquiry={() => {}}
              />
            ) : (
              <Globe3D
                onHotspotSelect={setSelectedHotspot}
                autoRotate={true}
              />
            )}
          </div>
        </div>

        {/* Side Panel - 30% */}
        <div className="flex-[3] flex flex-col border-l border-border bg-surface overflow-hidden">
          {/* Panel Toggle */}
          <div className="flex-shrink-0 p-2 bg-background border-b border-border flex items-center gap-2">
            <button
              onClick={() => setSidePanel('news')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                sidePanel === 'news'
                  ? 'bg-tactical-blue text-white'
                  : 'bg-surface text-text-muted hover:text-foreground'
              }`}
            >
              📰 News Feed
            </button>
            <button
              onClick={() => setSidePanel('video')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                sidePanel === 'video'
                  ? 'bg-red-600 text-white'
                  : 'bg-surface text-text-muted hover:text-foreground'
              }`}
            >
              📺 Live Video
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {sidePanel === 'news' ? <NewsFeed /> : <VideoFeed />}
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="bg-surface border-t border-border px-6 py-2">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 font-medium">LIVE</span>
            </div>
            <span className="text-border">|</span>
            <span>
              {newsData?.articles?.length || 0} articles from {newsData?.sources?.length || 0} sources
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
            <span className="text-border">|</span>
            <span>
              {Object.keys(riskData?.risks || {}).length} zones monitored
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
