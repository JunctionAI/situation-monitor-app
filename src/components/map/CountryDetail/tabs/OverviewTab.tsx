'use client';

import { CountryProfileResponse } from '@/types';
import { StatCard, StatGrid } from '../components/StatCard';

interface OverviewTabProps {
  data: CountryProfileResponse;
  onBorderClick?: (code: string) => void;
}

export function OverviewTab({ data, onBorderClick }: OverviewTabProps) {
  const { basic } = data;

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} km²`;
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(2)}B`;
    if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
    if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)}K`;
    return pop.toLocaleString();
  };

  return (
    <div className="p-3 space-y-4 overflow-y-auto">
      {/* Flag & Basic Info */}
      <div className="flex items-start gap-3">
        {basic.flags?.svg && (
          <img
            src={basic.flags.svg}
            alt={`${basic.name.common} flag`}
            className="w-16 h-auto rounded border border-border shadow-sm"
          />
        )}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-foreground">{basic.name.official}</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {basic.region} • {basic.subregion}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {basic.unMember && (
              <span className="text-[10px] px-1.5 py-0.5 bg-tactical-blue/20 text-tactical-blue rounded">
                UN Member
              </span>
            )}
            {basic.independent && (
              <span className="text-[10px] px-1.5 py-0.5 bg-tactical-green/20 text-tactical-green rounded">
                Independent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Quick Stats</h4>
        <StatGrid columns={2}>
          <StatCard
            label="Population"
            value={formatPopulation(basic.population)}
            icon="👥"
          />
          <StatCard
            label="Area"
            value={formatArea(basic.area)}
            icon="📐"
          />
          <StatCard
            label="Capital"
            value={basic.capital?.[0] || 'N/A'}
            icon="🏛️"
          />
          <StatCard
            label="Timezones"
            value={basic.timezones?.[0] || 'N/A'}
            icon="🕐"
            subValue={basic.timezones?.length > 1 ? `+${basic.timezones.length - 1} more` : undefined}
          />
        </StatGrid>
      </div>

      {/* Languages */}
      {Object.keys(basic.languages || {}).length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Languages</h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(basic.languages).map((lang) => (
              <span
                key={lang}
                className="text-xs px-2 py-1 bg-surface-light border border-border rounded"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Currencies */}
      {Object.keys(basic.currencies || {}).length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Currencies</h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(basic.currencies).map(([code, currency]) => (
              <span
                key={code}
                className="text-xs px-2 py-1 bg-surface-light border border-border rounded flex items-center gap-1"
              >
                <span className="font-medium">{currency.symbol}</span>
                <span className="text-text-muted">{currency.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bordering Countries */}
      {basic.borders && basic.borders.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Bordering Countries ({basic.borders.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {basic.borders.map((code) => (
              <button
                key={code}
                onClick={() => onBorderClick?.(code)}
                className="text-xs px-2 py-1 bg-surface-light border border-border rounded hover:border-tactical-green hover:text-tactical-green transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}

      {basic.landlocked && (
        <div className="text-xs text-text-muted italic">
          🏔️ This country is landlocked (no coastline).
        </div>
      )}

      {/* Calling Code & TLD */}
      <div className="flex items-center gap-4 text-xs text-text-muted border-t border-border pt-3">
        {basic.callingCode && (
          <span>📞 {basic.callingCode}</span>
        )}
        {basic.tld && basic.tld[0] && (
          <span>🌐 {basic.tld[0]}</span>
        )}
        <span>📍 {basic.coordinates?.lat?.toFixed(1)}°, {basic.coordinates?.lng?.toFixed(1)}°</span>
      </div>
    </div>
  );
}
