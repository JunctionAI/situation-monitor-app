'use client';

import { useMemo } from 'react';
import { formatYear, getEraDefinition, getCentury } from '@/lib/historical/yearUtils';
import { getEventsForYear, getActiveConflicts } from '@/data/historical/contemporary-events';
import { calculateHistoricalRisk, getHighRiskCountries } from '@/lib/historical/riskCalculation';

interface HistoricalOverlayProps {
  year: number;
  onClose: () => void;
}

export function HistoricalOverlay({ year, onClose }: HistoricalOverlayProps) {
  const era = getEraDefinition(year);
  const events = useMemo(() => getEventsForYear(year), [year]);
  const conflicts = useMemo(() => getActiveConflicts(year), [year]);
  const highRiskCountries = useMemo(() => getHighRiskCountries(year), [year]);

  // Get the top 5 highest risk countries
  const topRiskCountries = useMemo(() => {
    const entries = Array.from(highRiskCountries.entries());
    return entries
      .sort((a, b) => b[1].baseRisk - a[1].baseRisk)
      .slice(0, 5);
  }, [highRiskCountries]);

  return (
    <>
      {/* Large Year Display - Top Center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-surface/95 backdrop-blur-md border border-tactical-blue/50 rounded-lg px-6 py-3 shadow-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground tracking-wide">
              {formatYear(year)}
            </div>
            <div className="text-sm font-medium mt-1" style={{ color: era.color }}>
              {era.name} Era
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {getCentury(year)}
            </div>
          </div>
        </div>
      </div>

      {/* Active Conflicts Panel - Left Side */}
      {(conflicts.length > 0 || events.length > 0) && (
        <div className="absolute top-20 left-4 z-20 w-72">
          <div className="bg-surface/95 backdrop-blur-md border border-border rounded-lg shadow-xl overflow-hidden">
            {/* Active Conflicts */}
            {conflicts.length > 0 && (
              <div className="p-3 border-b border-border">
                <h3 className="text-xs font-semibold text-risk-critical uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-risk-critical rounded-full animate-pulse" />
                  Active Conflicts ({conflicts.length})
                </h3>
                <div className="mt-2 space-y-2">
                  {conflicts.slice(0, 3).map(conflict => (
                    <div key={conflict.id} className="text-sm">
                      <div className="font-medium text-foreground">{conflict.title}</div>
                      <div className="text-xs text-text-muted line-clamp-2">
                        {conflict.description}
                      </div>
                    </div>
                  ))}
                  {conflicts.length > 3 && (
                    <div className="text-xs text-text-muted">
                      +{conflicts.length - 3} more conflicts
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Events This Year */}
            {events.length > 0 && events.filter(e => !e.endYear || e.year === year).length > 0 && (
              <div className="p-3">
                <h3 className="text-xs font-semibold text-tactical-blue uppercase tracking-wider">
                  Events This Year
                </h3>
                <div className="mt-2 space-y-2">
                  {events
                    .filter(e => !e.endYear || e.year === year)
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="text-sm flex items-start gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          event.significance === 'PIVOTAL' ? 'bg-risk-critical/20 text-risk-critical' :
                          event.significance === 'MAJOR' ? 'bg-risk-high/20 text-risk-high' :
                          'bg-risk-medium/20 text-risk-medium'
                        }`}>
                          {event.type}
                        </span>
                        <span className="text-foreground">{event.title}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* High Risk Countries - Right Side */}
      {topRiskCountries.length > 0 && (
        <div className="absolute top-20 right-14 z-20 w-64">
          <div className="bg-surface/95 backdrop-blur-md border border-border rounded-lg shadow-xl p-3">
            <h3 className="text-xs font-semibold text-risk-high uppercase tracking-wider">
              Highest Risk Regions
            </h3>
            <div className="mt-2 space-y-2">
              {topRiskCountries.map(([code, data]) => (
                <div key={code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: data.baseRisk >= 80 ? '#ef4444' :
                                        data.baseRisk >= 60 ? '#f97316' :
                                        data.baseRisk >= 40 ? '#eab308' : '#22c55e'
                      }}
                    />
                    <span className="text-sm text-foreground font-medium">{code}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">{data.baseRisk}</div>
                  </div>
                </div>
              ))}
            </div>
            {topRiskCountries.length > 0 && topRiskCountries[0][1].factors.length > 0 && (
              <div className="mt-3 pt-2 border-t border-border">
                <div className="text-xs text-text-muted">
                  <span className="font-medium text-foreground">{topRiskCountries[0][0]}:</span>{' '}
                  {topRiskCountries[0][1].factors.slice(0, 2).join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Mode Badge - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-tactical-blue/20 backdrop-blur-sm border border-tactical-blue/50 rounded px-3 py-1.5 flex items-center gap-2">
          <span className="text-tactical-blue text-sm font-medium">HISTORICAL MODE</span>
          <button
            onClick={onClose}
            className="text-xs text-tactical-blue hover:text-white transition-colors"
          >
            [Return to Live]
          </button>
        </div>
      </div>

      {/* Sepia/vintage overlay effect for historical feel */}
      <div
        className="absolute inset-0 pointer-events-none z-10 mix-blend-multiply opacity-10"
        style={{ backgroundColor: era.color }}
      />
    </>
  );
}
