'use client';

import { useMemo, useState } from 'react';
import { TimelineMilestone, HistoricalEvent } from '@/types/historical';
import { yearToSliderPosition, formatYear } from '@/lib/historical/yearUtils';
import { useTimelineStore } from '@/store/timelineStore';

interface EventMarkersProps {
  milestones: TimelineMilestone[];
  events?: HistoricalEvent[];
  onEventClick?: (event: HistoricalEvent) => void;
}

export function EventMarkers({ milestones, events = [], onEventClick }: EventMarkersProps) {
  const { jumpToYear } = useTimelineStore();
  const [hoveredMilestone, setHoveredMilestone] = useState<TimelineMilestone | null>(null);

  // Group milestones that are very close together
  const groupedMilestones = useMemo(() => {
    const sorted = [...milestones].sort((a, b) => a.year - b.year);
    const groups: { milestones: TimelineMilestone[]; position: number }[] = [];

    for (const milestone of sorted) {
      const position = yearToSliderPosition(milestone.year);
      const existingGroup = groups.find(g => Math.abs(g.position - position) < 0.015);

      if (existingGroup) {
        existingGroup.milestones.push(milestone);
      } else {
        groups.push({ milestones: [milestone], position });
      }
    }

    return groups;
  }, [milestones]);

  return (
    <>
      {groupedMilestones.map((group, idx) => {
        const primary = group.milestones[0];
        const count = group.milestones.length;
        const isHovered = group.milestones.some(m => m === hoveredMilestone);

        return (
          <div
            key={`milestone-${idx}`}
            className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
            style={{ left: `${group.position * 100}%` }}
          >
            {/* Marker dot */}
            <button
              onClick={() => jumpToYear(primary.year)}
              onMouseEnter={() => setHoveredMilestone(primary)}
              onMouseLeave={() => setHoveredMilestone(null)}
              className={`
                w-2 h-2 rounded-full transition-all z-10 relative
                ${primary.significance === 'PIVOTAL'
                  ? 'bg-risk-critical'
                  : primary.significance === 'MAJOR'
                  ? 'bg-risk-high'
                  : 'bg-risk-medium'}
                ${isHovered ? 'scale-150 ring-2 ring-white/50' : ''}
              `}
              title={`${formatYear(primary.year)}: ${primary.label}`}
            >
              {count > 1 && (
                <span className="absolute -top-3 -right-2 text-[8px] bg-surface-light rounded-full w-3.5 h-3.5 flex items-center justify-center border border-border">
                  {count}
                </span>
              )}
            </button>

            {/* Tooltip on hover */}
            {isHovered && (
              <div className="absolute bottom-full mb-2 px-2 py-1 bg-surface border border-border rounded shadow-lg text-xs whitespace-nowrap z-20 max-w-[200px]">
                <div className="font-medium text-foreground truncate">{primary.label}</div>
                <div className="text-text-muted">{formatYear(primary.year)}</div>
                {count > 1 && (
                  <div className="text-text-muted text-[10px] mt-0.5">
                    +{count - 1} more events
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// Separate component for showing event details in a panel
interface EventListProps {
  events: HistoricalEvent[];
  year: number;
  onClose?: () => void;
}

export function EventList({ events, year, onClose }: EventListProps) {
  if (events.length === 0) return null;

  const getEventIcon = (type: HistoricalEvent['type']) => {
    switch (type) {
      case 'WAR': return '⚔️';
      case 'TREATY': return '📜';
      case 'COLLAPSE': return '💥';
      case 'FOUNDING': return '🏛️';
      case 'CONQUEST': return '🗡️';
      case 'REVOLUTION': return '✊';
      case 'DISASTER': return '💀';
      case 'ALLIANCE': return '🤝';
      case 'INDEPENDENCE': return '🗽';
      case 'UNIFICATION': return '🔗';
      case 'TENSION': return '⚡';
      default: return '📌';
    }
  };

  return (
    <div className="bg-surface-light border border-border rounded-lg p-3 max-h-[300px] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-foreground">
          Events in {formatYear(year)}
        </h4>
        {onClose && (
          <button onClick={onClose} className="text-text-muted hover:text-foreground">
            ✕
          </button>
        )}
      </div>
      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-2 bg-surface rounded border border-border hover:border-tactical-blue/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{getEventIcon(event.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{event.title}</div>
                <p className="text-xs text-text-muted line-clamp-2 mt-0.5">
                  {event.description}
                </p>
                {event.involvedEntities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.involvedEntities.slice(0, 4).map((entity) => (
                      <span
                        key={entity}
                        className="text-[10px] px-1.5 py-0.5 bg-tactical-blue/10 text-tactical-blue rounded"
                      >
                        {entity}
                      </span>
                    ))}
                    {event.involvedEntities.length > 4 && (
                      <span className="text-[10px] text-text-muted">
                        +{event.involvedEntities.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
