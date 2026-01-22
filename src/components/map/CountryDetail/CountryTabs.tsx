'use client';

export type TabId = 'overview' | 'economy' | 'politics' | 'history' | 'news';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '🌍' },
  { id: 'economy', label: 'Economy', icon: '📊' },
  { id: 'politics', label: 'Politics', icon: '🏛️' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'news', label: 'News', icon: '📰' },
];

interface CountryTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  newsBadge?: number;
}

export function CountryTabs({ activeTab, onTabChange, newsBadge }: CountryTabsProps) {
  return (
    <div className="flex border-b border-border bg-surface-light/30">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-tactical-green border-b-2 border-tactical-green bg-surface'
              : 'text-text-muted hover:text-foreground hover:bg-surface/50'
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </span>
          {tab.id === 'news' && newsBadge && newsBadge > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-tactical-green text-background text-[10px] font-bold rounded-full flex items-center justify-center">
              {newsBadge > 9 ? '9+' : newsBadge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
