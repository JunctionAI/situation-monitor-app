'use client';

import { Hotspot } from '@/data/hotspots';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface ZoneDetailProps {
  hotspot: Hotspot;
  onClose: () => void;
}

const tierColors = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-500',
};

const typeIcons = {
  conflict: '⚔️',
  tension: '⚠️',
  strategic: '🎯',
  nuclear: '☢️',
  economic: '📊',
};

export function ZoneDetail({ hotspot, onClose }: ZoneDetailProps) {
  const { isPro, openUpgradeModal } = useSubscription();

  const handleBriefingClick = () => {
    if (!isPro) {
      openUpgradeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel - Bottom sheet on mobile, centered modal on desktop */}
      <div className="relative w-full max-w-2xl max-h-[85vh] md:max-h-[80vh] bg-surface border border-border rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl">
        {/* Drag handle on mobile */}
        <div className="md:hidden flex justify-center py-3">
          <div className="w-12 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="relative px-4 md:px-6 pb-4 md:pt-6">
          <button
            onClick={onClose}
            className="absolute top-0 right-4 md:top-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-3">
            <span className="text-3xl">{typeIcons[hotspot.type]}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${tierColors[hotspot.tier]}`}>
                  {hotspot.tier}
                </span>
                <span className="text-xs text-text-muted uppercase tracking-wide">
                  {hotspot.type}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {hotspot.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-4 md:px-6 pb-6 overflow-y-auto max-h-[60vh] md:max-h-[50vh]">
          {/* Status banner */}
          {hotspot.status && (
            <div className="bg-background border border-border rounded-lg p-3 mb-4">
              <div className="text-xs text-text-muted uppercase tracking-wide mb-1">Current Status</div>
              <div className="text-sm text-foreground font-medium">{hotspot.status}</div>
            </div>
          )}

          {/* Description */}
          <p className="text-text-muted text-sm leading-relaxed mb-4">
            {hotspot.description}
          </p>

          {/* Key Facts Grid */}
          {hotspot.keyFacts && hotspot.keyFacts.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs text-text-muted uppercase tracking-wide mb-2">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-2">
                {hotspot.keyFacts.map((fact) => (
                  <div key={fact.label} className="bg-background border border-border rounded-lg p-3">
                    <div className="text-xs text-text-muted mb-1">{fact.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{fact.value}</span>
                      {fact.trend && (
                        <span className={`text-xs ${
                          fact.trend === 'up' ? 'text-red-400' :
                          fact.trend === 'down' ? 'text-green-400' :
                          'text-text-muted'
                        }`}>
                          {fact.trend === 'up' ? '↑' : fact.trend === 'down' ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {hotspot.stats && (
            <div className="mb-4">
              <h3 className="text-xs text-text-muted uppercase tracking-wide mb-2">Impact Statistics</h3>
              <div className="space-y-2">
                {hotspot.stats.casualties && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Casualties</span>
                    <span className="text-red-400 font-medium">{hotspot.stats.casualties}</span>
                  </div>
                )}
                {hotspot.stats.displaced && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Displaced</span>
                    <span className="text-orange-400 font-medium">{hotspot.stats.displaced}</span>
                  </div>
                )}
                {hotspot.stats.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Duration</span>
                    <span className="text-foreground">{hotspot.stats.duration}</span>
                  </div>
                )}
                {hotspot.stats.territory && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Territory</span>
                    <span className="text-foreground">{hotspot.stats.territory}</span>
                  </div>
                )}
                {hotspot.stats.economic && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Economic Impact</span>
                    <span className="text-yellow-400 font-medium">{hotspot.stats.economic}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Parties Involved */}
          {hotspot.parties && hotspot.parties.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs text-text-muted uppercase tracking-wide mb-2">Parties Involved</h3>
              <div className="flex flex-wrap gap-2">
                {hotspot.parties.map((party) => (
                  <span
                    key={party}
                    className="px-2 py-1 bg-background border border-border rounded text-xs text-foreground"
                  >
                    {party}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Start Date */}
          {hotspot.startDate && (
            <div className="text-xs text-text-muted">
              Conflict began: {new Date(hotspot.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>

        {/* Footer - Pro features CTA */}
        <div className="px-4 md:px-6 py-4 border-t border-border bg-background">
          {isPro ? (
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-tactical-blue hover:bg-tactical-blue/90 text-white text-sm font-medium rounded-lg transition-colors">
                View Full Briefing
              </button>
              <button className="px-4 py-2.5 bg-surface border border-border hover:border-tactical-green text-foreground text-sm font-medium rounded-lg transition-colors">
                Set Alert
              </button>
            </div>
          ) : (
            <button
              onClick={handleBriefingClick}
              className="w-full py-2.5 bg-gradient-to-r from-tactical-green to-emerald-600 hover:from-tactical-green/90 hover:to-emerald-600/90 text-background text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span>🔒</span>
              <span>Unlock Full Crisis Briefings - PRO</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
