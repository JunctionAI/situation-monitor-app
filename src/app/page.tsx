'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { WorldMap } from '@/components/map/WorldMap';
import { Globe3D } from '@/components/globe/Globe3D';
import { NewsFeed } from '@/components/news/NewsFeed';
import { VideoFeed } from '@/components/video/VideoFeed';
import { SpaceExplorer } from '@/components/space/SpaceExplorer';
import { RiskScore, NewsResponse } from '@/types';
import { Hotspot } from '@/data/hotspots';
import { CountryInfo } from '@/data/countries';

type MapView = '2d' | '3d' | 'space';
type SidePanel = 'news' | 'video';
type MobileTab = 'map' | 'feed';

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
  const [mobileTab, setMobileTab] = useState<MobileTab>('map');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: riskData } = useQuery({
    queryKey: ['risks'],
    queryFn: fetchRisks,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  const { data: newsData, dataUpdatedAt } = useQuery({
    queryKey: ['news-for-map'],
    queryFn: fetchNews,
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdate(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  const criticalCount = riskData
    ? Object.values(riskData.risks).filter(r => r.tier === 'CRITICAL').length
    : 0;

  // Render map content based on view
  const renderMapContent = () => {
    if (mapView === '2d') {
      return (
        <WorldMap
          newsData={newsData?.articles || []}
          riskOverrides={riskData?.risks || {}}
          onHotspotSelect={setSelectedHotspot}
          onCountrySelect={setSelectedCountry}
          onOpenInquiry={() => {}}
        />
      );
    } else if (mapView === '3d') {
      return <Globe3D onHotspotSelect={setSelectedHotspot} autoRotate={true} />;
    } else {
      return <SpaceExplorer onBackToEarth={() => setMapView('3d')} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - Hidden on mobile when in space view */}
      <div className={mapView === 'space' ? 'hidden md:block' : ''}>
        <Header criticalCount={criticalCount} />
      </div>

      {/* DESKTOP LAYOUT */}
      <main className="flex-1 hidden md:flex overflow-hidden">
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
            <button
              onClick={() => setMapView('space')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                mapView === 'space'
                  ? 'bg-purple-600 text-white'
                  : 'bg-background text-text-muted hover:text-foreground border border-border'
              }`}
            >
              🔭 Deep Space
            </button>
          </div>

          {/* Map/Globe Content */}
          <div className="flex-1 p-4 overflow-hidden">
            {renderMapContent()}
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

      {/* MOBILE LAYOUT */}
      <main className="flex-1 flex flex-col md:hidden overflow-hidden">
        {/* Mobile content area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Map View */}
          {mobileTab === 'map' && (
            <div className="absolute inset-0 flex flex-col">
              {/* Mobile view toggle - horizontal scroll */}
              <div className="flex-shrink-0 p-2 bg-surface border-b border-border flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setMapView('2d')}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    mapView === '2d'
                      ? 'bg-tactical-green text-background'
                      : 'bg-background text-text-muted border border-border'
                  }`}
                >
                  🗺️ Map
                </button>
                <button
                  onClick={() => setMapView('3d')}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    mapView === '3d'
                      ? 'bg-tactical-green text-background'
                      : 'bg-background text-text-muted border border-border'
                  }`}
                >
                  🌐 Globe
                </button>
                <button
                  onClick={() => setMapView('space')}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    mapView === 'space'
                      ? 'bg-purple-600 text-white'
                      : 'bg-background text-text-muted border border-border'
                  }`}
                >
                  🔭 Space
                </button>
              </div>

              {/* Map content - full height on mobile */}
              <div className="flex-1 overflow-hidden">
                {renderMapContent()}
              </div>
            </div>
          )}

          {/* Feed View */}
          {mobileTab === 'feed' && (
            <div className="absolute inset-0 flex flex-col">
              {/* Mobile feed toggle */}
              <div className="flex-shrink-0 p-2 bg-surface border-b border-border flex gap-2">
                <button
                  onClick={() => setSidePanel('news')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    sidePanel === 'news'
                      ? 'bg-tactical-blue text-white'
                      : 'bg-background text-text-muted border border-border'
                  }`}
                >
                  📰 News
                </button>
                <button
                  onClick={() => setSidePanel('video')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    sidePanel === 'video'
                      ? 'bg-red-600 text-white'
                      : 'bg-background text-text-muted border border-border'
                  }`}
                >
                  📺 Video
                </button>
              </div>

              {/* Feed content */}
              <div className="flex-1 overflow-hidden">
                {sidePanel === 'news' ? <NewsFeed /> : <VideoFeed />}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="flex-shrink-0 bg-surface border-t border-border safe-area-bottom">
          <div className="flex">
            <button
              onClick={() => setMobileTab('map')}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                mobileTab === 'map'
                  ? 'text-tactical-green'
                  : 'text-text-muted'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium">Map</span>
            </button>
            <button
              onClick={() => setMobileTab('feed')}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                mobileTab === 'feed'
                  ? 'text-tactical-blue'
                  : 'text-text-muted'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="text-xs font-medium">Feed</span>
            </button>
          </div>
        </nav>
      </main>

      {/* Status Bar - Desktop only */}
      <footer className="hidden md:block bg-surface border-t border-border px-6 py-2">
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
