'use client';

export function TabSkeleton() {
  return (
    <div className="p-3 space-y-3 animate-pulse">
      <div className="h-4 bg-surface-light rounded w-1/3" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 bg-surface-light rounded" />
        <div className="h-16 bg-surface-light rounded" />
        <div className="h-16 bg-surface-light rounded" />
        <div className="h-16 bg-surface-light rounded" />
      </div>
      <div className="h-4 bg-surface-light rounded w-1/4 mt-4" />
      <div className="space-y-2">
        <div className="h-3 bg-surface-light rounded w-full" />
        <div className="h-3 bg-surface-light rounded w-5/6" />
        <div className="h-3 bg-surface-light rounded w-4/6" />
      </div>
    </div>
  );
}
