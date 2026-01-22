'use client';

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  icon?: string;
  subValue?: string;
  className?: string;
  highlight?: 'positive' | 'negative';
}

export function StatCard({ label, value, icon, subValue, className = '', highlight }: StatCardProps) {
  if (!value && value !== 0) return null;

  const highlightClass = highlight === 'positive'
    ? 'border-risk-low/50 bg-risk-low/5'
    : highlight === 'negative'
    ? 'border-risk-high/50 bg-risk-high/5'
    : '';

  const valueClass = highlight === 'positive'
    ? 'text-risk-low'
    : highlight === 'negative'
    ? 'text-risk-high'
    : 'text-foreground';

  return (
    <div className={`bg-surface rounded p-2.5 border border-border ${highlightClass} ${className}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-sm">{icon}</span>}
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className={`text-sm font-semibold ${valueClass}`}>
        {typeof value === 'number' ? formatNumber(value) : value}
      </div>
      {subValue && (
        <div className="text-xs text-text-muted mt-0.5">{subValue}</div>
      )}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function StatGrid({ children, columns = 2 }: StatGridProps) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {children}
    </div>
  );
}
