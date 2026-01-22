'use client';

import { Marker } from 'react-simple-maps';
import { Hotspot } from '@/data/hotspots';
import { tierToColor } from '@/data/riskZones';

interface HotspotMarkerProps {
  hotspot: Hotspot;
  onClick: (hotspot: Hotspot) => void;
  isSelected: boolean;
}

export function HotspotMarker({ hotspot, onClick, isSelected }: HotspotMarkerProps) {
  const color = tierToColor(hotspot.tier);
  const size = hotspot.tier === 'CRITICAL' ? 12 : hotspot.tier === 'HIGH' ? 10 : 8;

  return (
    <Marker coordinates={hotspot.coordinates}>
      <g
        onClick={() => onClick(hotspot)}
        style={{ cursor: 'pointer' }}
      >
        {/* Outer pulse ring for critical/high */}
        {(hotspot.tier === 'CRITICAL' || hotspot.tier === 'HIGH') && (
          <>
            <circle
              r={size + 8}
              fill="none"
              stroke={color}
              strokeWidth={1}
              opacity={0.3}
              className="animate-ping"
              style={{ transformOrigin: 'center' }}
            />
            <circle
              r={size + 15}
              fill="none"
              stroke={color}
              strokeWidth={0.5}
              opacity={0.15}
              className="animate-pulse"
            />
          </>
        )}

        {/* Glow effect */}
        <circle
          r={size + 4}
          fill={color}
          opacity={0.2}
          filter="blur(3px)"
        />

        {/* Main marker */}
        <circle
          r={size}
          fill={color}
          stroke={isSelected ? '#fff' : color}
          strokeWidth={isSelected ? 2 : 1}
          opacity={0.9}
        />

        {/* Inner dot */}
        <circle
          r={size * 0.4}
          fill="#fff"
          opacity={0.8}
        />
      </g>
    </Marker>
  );
}
