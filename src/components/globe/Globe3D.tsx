'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { HOTSPOTS, Hotspot } from '@/data/hotspots';

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="text-tactical-green animate-pulse">Loading Globe...</div>
    </div>
  ),
});

interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  hotspot: Hotspot;
}

interface Globe3DProps {
  onHotspotSelect?: (hotspot: Hotspot | null) => void;
  autoRotate?: boolean;
}

export function Globe3D({ onHotspotSelect, autoRotate = true }: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<GlobePoint | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [globeReady, setGlobeReady] = useState(false);

  // Convert hotspots to globe points
  const points: GlobePoint[] = HOTSPOTS.filter(h => h.active).map(hotspot => ({
    lat: hotspot.coordinates[1],
    lng: hotspot.coordinates[0],
    size: hotspot.tier === 'CRITICAL' ? 1.5 : hotspot.tier === 'HIGH' ? 1.0 : 0.6,
    color: hotspot.tier === 'CRITICAL' ? '#ff4444'
         : hotspot.tier === 'HIGH' ? '#ff8800'
         : hotspot.tier === 'MEDIUM' ? '#ffcc00'
         : '#44ff44',
    label: hotspot.label,
    hotspot,
  }));

  // Globe settings
  useEffect(() => {
    if (globeRef.current && globeReady) {
      // Set initial view
      globeRef.current.pointOfView({ lat: 30, lng: 0, altitude: 2.5 }, 0);

      // Auto-rotate
      if (isRotating) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.5;
      } else {
        globeRef.current.controls().autoRotate = false;
      }
    }
  }, [globeReady, isRotating]);

  const handlePointClick = useCallback((point: any) => {
    const globePoint = point as GlobePoint;
    setSelectedPoint(globePoint);
    onHotspotSelect?.(globePoint.hotspot);

    // Stop rotation and zoom to point
    setIsRotating(false);
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: globePoint.lat, lng: globePoint.lng, altitude: 1.5 },
        1000
      );
    }
  }, [onHotspotSelect]);

  const handleGlobeClick = useCallback(() => {
    // Clear selection when clicking globe background
    if (selectedPoint) {
      setSelectedPoint(null);
      onHotspotSelect?.(null);
    }
  }, [selectedPoint, onHotspotSelect]);

  const resetView = useCallback(() => {
    setSelectedPoint(null);
    onHotspotSelect?.(null);
    setIsRotating(true);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 30, lng: 0, altitude: 2.5 }, 1000);
    }
  }, [onHotspotSelect]);

  return (
    <div className="relative w-full h-full bg-background">
      <Globe
        ref={globeRef}
        onGlobeReady={() => setGlobeReady(true)}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        // Points (hotspots)
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointLabel={(d: any) => `
          <div style="background: rgba(0,0,0,0.8); padding: 8px 12px; border-radius: 4px; border: 1px solid ${d.color};">
            <div style="font-weight: bold; color: ${d.color};">${d.label}</div>
            <div style="font-size: 11px; color: #999;">${d.hotspot.tier} • ${d.hotspot.type}</div>
          </div>
        `}
        onPointClick={handlePointClick}

        // Rings (pulsing effect for critical)
        ringsData={points.filter(p => p.hotspot.tier === 'CRITICAL')}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => (t: number) => `rgba(255, 68, 68, ${1 - t})`}
        ringMaxRadius={4}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}

        // Atmosphere
        atmosphereColor="#4488ff"
        atmosphereAltitude={0.15}

        // Globe click
        onGlobeClick={handleGlobeClick}

        // Size
        width={typeof window !== 'undefined' ? window.innerWidth : 800}
        height={typeof window !== 'undefined' ? window.innerHeight - 100 : 600}
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
            isRotating
              ? 'bg-tactical-green text-background'
              : 'bg-surface text-foreground border border-border'
          }`}
        >
          {isRotating ? '⏸ Auto-Rotate' : '▶ Auto-Rotate'}
        </button>
        <button
          onClick={resetView}
          className="px-3 py-2 rounded text-xs font-medium bg-surface text-foreground border border-border hover:bg-surface-hover transition-colors"
        >
          ↻ Reset View
        </button>
      </div>

      {/* Selected Hotspot Info */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 right-4 max-w-md bg-surface/95 backdrop-blur border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedPoint.color }}
                />
                <h3 className="font-bold text-foreground">{selectedPoint.hotspot.name}</h3>
              </div>
              <p className="text-sm text-text-muted mt-1">
                {selectedPoint.hotspot.description}
              </p>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  selectedPoint.hotspot.tier === 'CRITICAL' ? 'bg-risk-critical text-white' :
                  selectedPoint.hotspot.tier === 'HIGH' ? 'bg-risk-high text-white' :
                  'bg-risk-medium text-black'
                }`}>
                  {selectedPoint.hotspot.tier}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-surface-hover text-foreground">
                  {selectedPoint.hotspot.type}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedPoint(null);
                onHotspotSelect?.(null);
              }}
              className="text-text-muted hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur border border-border rounded-lg p-3">
        <div className="text-xs font-semibold text-foreground mb-2">THREAT LEVELS</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-risk-critical" />
            <span className="text-text-muted">Critical</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-risk-high" />
            <span className="text-text-muted">High</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-risk-medium" />
            <span className="text-text-muted">Medium</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-tactical-green" />
            <span className="text-text-muted">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
