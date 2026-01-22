'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountryInfo } from '@/data/countries';
import { NewsArticle, RiskScore, CountryProfileResponse } from '@/types';
import { tierToColor, scoreToTier, getRiskConfig } from '@/data/riskZones';
import { Hotspot } from '@/data/hotspots';
import { CountryTabs, TabId } from './CountryTabs';
import { OverviewTab } from './tabs/OverviewTab';
import { EconomyTab } from './tabs/EconomyTab';
import { PoliticsTab } from './tabs/PoliticsTab';
import { HistoryTab } from './tabs/HistoryTab';
import { NewsTab } from './tabs/NewsTab';
import { TabSkeleton } from './components/TabSkeleton';

interface CountryDetailProps {
  country: CountryInfo;
  riskScore?: RiskScore;
  relatedNews: NewsArticle[];
  onClose: () => void;
  onHotspotClick?: (hotspot: Hotspot) => void;
  onAskAbout?: () => void;
  onCountryChange?: (code: string) => void;
}

async function fetchCountryProfile(code: string): Promise<CountryProfileResponse> {
  const response = await fetch(`/api/country/${code}`);
  if (!response.ok) throw new Error('Failed to fetch country data');
  return response.json();
}

export function CountryDetail({
  country,
  riskScore,
  relatedNews,
  onClose,
  onHotspotClick,
  onAskAbout,
  onCountryChange,
}: CountryDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const riskConfig = getRiskConfig(country.code);
  const score = riskScore?.score ?? riskConfig.baseRisk;
  const tier = scoreToTier(score);
  const color = tierToColor(tier);

  // Fetch extended country data
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['country-profile', country.code],
    queryFn: () => fetchCountryProfile(country.code),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });

  const handleBorderClick = (borderCode: string) => {
    onCountryChange?.(borderCode);
  };

  const renderTabContent = () => {
    if (activeTab === 'news') {
      return (
        <NewsTab
          countryCode={country.code}
          countryName={country.name}
          relatedNews={relatedNews}
          riskScore={riskScore}
          onHotspotClick={onHotspotClick}
          onAskAbout={onAskAbout}
        />
      );
    }

    if (isLoading) {
      return <TabSkeleton />;
    }

    if (error || !profileData) {
      return (
        <div className="p-4 text-center text-text-muted">
          <span className="text-2xl mb-2 block">⚠️</span>
          <p className="text-sm">Failed to load country data.</p>
          <p className="text-xs mt-1">Using basic information only.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={profileData} onBorderClick={handleBorderClick} />;
      case 'economy':
        return <EconomyTab data={profileData} />;
      case 'politics':
        return <PoliticsTab data={profileData} />;
      case 'history':
        return <HistoryTab data={profileData} />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-4 left-4 w-[440px] max-h-[calc(100%-2rem)] bg-surface/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col">
      {/* Header */}
      <div
        className="flex-shrink-0 p-4 border-b border-border"
        style={{ borderLeftWidth: 4, borderLeftColor: color }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-text-muted uppercase tracking-wider">
                {country.region} • {country.subregion}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              {profileData?.basic?.flags?.svg && (
                <img
                  src={profileData.basic.flags.svg}
                  alt=""
                  className="w-6 h-4 object-cover rounded-sm border border-border"
                />
              )}
              {country.name}
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {profileData?.basic?.capital?.[0] || country.capital}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-foreground transition-colors text-xl leading-none p-1 ml-2"
          >
            ×
          </button>
        </div>

        {/* Risk Badge */}
        <div className="mt-2 flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded font-medium"
            style={{
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {tier} RISK • {score}/100
          </span>
          {riskScore?.trend && (
            <span className={`text-xs ${
              riskScore.trend === 'IMPROVING' ? 'text-risk-low' :
              riskScore.trend === 'DETERIORATING' ? 'text-risk-critical' :
              'text-text-muted'
            }`}>
              {riskScore.trend === 'IMPROVING' ? '↓' :
               riskScore.trend === 'DETERIORATING' ? '↑' : '→'}
            </span>
          )}
          {profileData?.cached && (
            <span className="text-xs text-text-muted">• Cached</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <CountryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        newsBadge={relatedNews.length > 0 ? relatedNews.length : undefined}
      />

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-2 border-t border-border bg-surface-light/50">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="font-mono">{country.code}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-tactical-green rounded-full animate-pulse" />
              LIVE
            </span>
            {profileData && (
              <>
                <span className="text-border">|</span>
                <span>
                  {new Date(profileData.lastUpdated).toLocaleTimeString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
