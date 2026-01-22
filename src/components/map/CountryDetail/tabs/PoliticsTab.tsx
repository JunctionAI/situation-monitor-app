'use client';

import { CountryProfileResponse } from '@/types';

interface PoliticsTabProps {
  data: CountryProfileResponse;
}

export function PoliticsTab({ data }: PoliticsTabProps) {
  const { political, strategic } = data;

  return (
    <div className="p-3 space-y-4 overflow-y-auto">
      {/* Government Type */}
      <div>
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
          Government
        </h4>
        <div className="p-3 bg-surface-light border border-border rounded">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <span className="text-sm font-medium text-foreground">
              {political.government || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Leadership */}
      {(political.headOfState || political.headOfGovernment) && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Leadership
          </h4>
          <div className="space-y-2">
            {political.headOfState && (
              <div className="p-3 bg-surface-light border border-border rounded">
                <div className="text-xs text-text-muted mb-1">
                  {political.headOfState.title}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {political.headOfState.name}
                </div>
                {political.headOfState.since && (
                  <div className="text-xs text-text-muted mt-0.5">
                    Since {political.headOfState.since}
                  </div>
                )}
              </div>
            )}
            {political.headOfGovernment &&
             political.headOfGovernment.name !== political.headOfState?.name && (
              <div className="p-3 bg-surface-light border border-border rounded">
                <div className="text-xs text-text-muted mb-1">
                  {political.headOfGovernment.title}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {political.headOfGovernment.name}
                </div>
                {political.headOfGovernment.since && (
                  <div className="text-xs text-text-muted mt-0.5">
                    Since {political.headOfGovernment.since}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* International Organizations */}
      {political.internationalOrganizations && political.internationalOrganizations.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            International Organizations
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {political.internationalOrganizations.map((org) => (
              <span
                key={org}
                className="text-xs px-2 py-1 bg-surface-light border border-border rounded"
              >
                {org}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Alliances */}
      {strategic?.alliances && strategic.alliances.length > 0 && (
        <div>
          <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Military & Strategic Alliances
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {strategic.alliances.map((alliance) => (
              <span
                key={alliance}
                className="text-xs px-2 py-1 bg-risk-high/10 border border-risk-high/30 text-risk-high rounded"
              >
                {alliance}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Political Analysis */}
      {political.politicalAnalysis && (
        <div className="p-3 bg-surface-light/50 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span>🤖</span>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              AI Political Analysis
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {political.politicalAnalysis}
          </p>
        </div>
      )}

      {/* Fallback if limited data */}
      {!political.headOfState && !political.internationalOrganizations?.length && (
        <div className="text-center py-6 text-text-muted">
          <span className="text-2xl mb-2 block">🏛️</span>
          <p className="text-sm">Detailed political data not available for this country.</p>
          <p className="text-xs mt-1">Use the Intel Analyst for deeper analysis.</p>
        </div>
      )}
    </div>
  );
}
