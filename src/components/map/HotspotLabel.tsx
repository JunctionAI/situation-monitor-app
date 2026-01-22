'use client';

import { Marker } from 'react-simple-maps';
import { Hotspot } from '@/data/hotspots';
import { tierToColor } from '@/data/riskZones';

interface HotspotLabelProps {
  hotspot: Hotspot;
  onClick: (hotspot: Hotspot) => void;
}

export function HotspotLabel({ hotspot, onClick }: HotspotLabelProps) {
  const color = tierToColor(hotspot.tier);
  const bgColor = hotspot.tier === 'CRITICAL' ? 'rgba(239, 68, 68, 0.85)'
    : hotspot.tier === 'HIGH' ? 'rgba(249, 115, 22, 0.85)'
    : 'rgba(42, 53, 68, 0.9)';

  // Offset label slightly from marker
  const labelCoords: [number, number] = [
    hotspot.coordinates[0] + 2,
    hotspot.coordinates[1] - 1.5
  ];

  return (
    <Marker coordinates={labelCoords}>
      <g
        onClick={() => onClick(hotspot)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={0}
          y={-8}
          width={hotspot.label.length * 6 + 12}
          height={16}
          rx={2}
          fill={bgColor}
          stroke={color}
          strokeWidth={1}
        />
        <text
          x={6}
          y={3}
          fontSize={9}
          fontWeight="bold"
          fontFamily="monospace"
          fill="#fff"
          style={{ letterSpacing: '0.5px' }}
        >
          {hotspot.label}
        </text>
      </g>
    </Marker>
  );
}
