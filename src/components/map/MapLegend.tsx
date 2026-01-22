'use client';

import { RiskTier } from '@/types';
import { tierToColor, tierToLabel } from '@/data/riskZones';

const RISK_TIERS: RiskTier[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-3">
      <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2 font-medium">
        Risk Level
      </h4>
      <div className="space-y-1.5">
        {RISK_TIERS.map((tier) => (
          <div key={tier} className="flex items-center gap-2">
            <div
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: tierToColor(tier) }}
            />
            <span className="text-xs text-text-secondary">
              {tierToLabel(tier)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
