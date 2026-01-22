'use client';

import { CountryProfileResponse } from '@/types';
import { StatCard, StatGrid } from '../components/StatCard';

interface EconomyTabProps {
  data: CountryProfileResponse;
}

export function EconomyTab({ data }: EconomyTabProps) {
  const { economic, basic } = data;

  const formatGDP = (value: number | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(2)} Trillion`;
    }
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(0)} Billion`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatGDPPerCapita = (value: number | undefined) => {
    if (!value) return 'N/A';
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="p-3 space-y-4 overflow-y-auto">
      {/* GDP Stats */}
      <div>
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
          Economic Indicators
        </h4>
        <StatGrid columns={2}>
          <StatCard
            label="GDP (Nominal)"
            value={formatGDP(economic.gdp?.nominal)}
            icon="💰"
          />
          <StatCard
            label="GDP Per Capita"
            value={formatGDPPerCapita(economic.gdp?.perCapita)}
            icon="👤"
          />
        </StatGrid>
      </div>

      {/* Additional Economic Indicators from World Bank */}
      {(economic.gdpGrowth !== undefined || economic.inflation !== undefined || economic.unemployment !== undefined) && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Key Indicators
          </h4>
          <StatGrid columns={3}>
            {economic.gdpGrowth !== undefined && (
              <StatCard
                label="GDP Growth"
                value={`${economic.gdpGrowth >= 0 ? '+' : ''}${economic.gdpGrowth.toFixed(1)}%`}
                icon={economic.gdpGrowth >= 0 ? '📈' : '📉'}
                highlight={economic.gdpGrowth >= 3 ? 'positive' : economic.gdpGrowth < 0 ? 'negative' : undefined}
              />
            )}
            {economic.inflation !== undefined && (
              <StatCard
                label="Inflation"
                value={`${economic.inflation.toFixed(1)}%`}
                icon="💹"
                highlight={economic.inflation > 10 ? 'negative' : economic.inflation < 3 ? 'positive' : undefined}
              />
            )}
            {economic.unemployment !== undefined && (
              <StatCard
                label="Unemployment"
                value={`${economic.unemployment.toFixed(1)}%`}
                icon="👷"
                highlight={economic.unemployment > 10 ? 'negative' : economic.unemployment < 5 ? 'positive' : undefined}
              />
            )}
          </StatGrid>
        </div>
      )}

      {/* Currencies */}
      <div>
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Currencies</h4>
        <div className="space-y-2">
          {Object.entries(economic.currencies || basic.currencies || {}).map(([code, currency]) => (
            <div
              key={code}
              className="flex items-center justify-between p-2.5 bg-surface-light border border-border rounded"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-tactical-green">{currency.symbol}</span>
                <div>
                  <div className="text-sm font-medium text-foreground">{currency.name}</div>
                  <div className="text-xs text-text-muted">{code}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Major Exports */}
      {economic.majorExports && economic.majorExports.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Major Exports
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {economic.majorExports.map((exp) => (
              <span
                key={exp}
                className="text-xs px-2 py-1 bg-tactical-green/10 border border-tactical-green/30 text-tactical-green rounded"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Economic Blocs */}
      {economic.economicBlocs && economic.economicBlocs.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Economic Blocs & Trade Agreements
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {economic.economicBlocs.map((bloc) => (
              <span
                key={bloc}
                className="text-xs px-2 py-1 bg-tactical-blue/10 border border-tactical-blue/30 text-tactical-blue rounded"
              >
                {bloc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Economic Outlook */}
      {economic.economicOutlook && (
        <div className="p-3 bg-surface-light/50 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span>🤖</span>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              AI Economic Analysis
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {economic.economicOutlook}
          </p>
        </div>
      )}

      {/* Fallback if no data */}
      {!economic.gdp?.nominal && !economic.majorExports?.length && (
        <div className="text-center py-6 text-text-muted">
          <span className="text-2xl mb-2 block">📊</span>
          <p className="text-sm">Detailed economic data not available for this country.</p>
          <p className="text-xs mt-1">Currency information shown above.</p>
        </div>
      )}
    </div>
  );
}
