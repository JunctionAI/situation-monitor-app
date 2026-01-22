'use client';

import { memo, useState, useCallback, useMemo, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { MapTooltip } from './MapTooltip';
import { MapLegend } from './MapLegend';
import { HotspotMarker } from './HotspotMarker';
import { HotspotLabel } from './HotspotLabel';
import { HotspotDetail } from './HotspotDetail';
import { CountryDetail } from './CountryDetail';
import { LayerControls, MapLayer } from './LayerControls';
import { getRiskConfig, scoreToTier, tierToColor } from '@/data/riskZones';
import { HOTSPOTS, Hotspot } from '@/data/hotspots';
import { getCountryInfo, CountryInfo, numericToIso } from '@/data/countries';
import { TooltipData, MapPosition, NewsArticle, RiskScore } from '@/types';
import { useTimelineStore } from '@/store/timelineStore';
import { calculateHistoricalRisk } from '@/lib/historical/riskCalculation';
import { formatYear } from '@/lib/historical/yearUtils';
import { HistoricalOverlay } from './HistoricalOverlay';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  newsData?: NewsArticle[];
  riskOverrides?: Record<string, RiskScore>;
  onHotspotSelect?: (hotspot: Hotspot | null) => void;
  onCountrySelect?: (country: CountryInfo | null) => void;
  onOpenInquiry?: () => void;
}

export const WorldMap = memo(function WorldMap({
  newsData = [],
  riskOverrides = {},
  onHotspotSelect,
  onCountrySelect,
  onOpenInquiry
}: WorldMapProps) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<MapPosition>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [activeLayers, setActiveLayers] = useState<MapLayer[]>(['conflicts', 'tensions', 'labels']);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);

  // Get timeline state
  const { mode: timelineMode, selectedYear } = useTimelineStore();
  const isHistoricalMode = timelineMode === 'HISTORICAL';
  const displayYear = selectedYear ?? new Date().getFullYear();


  // Filter hotspots based on active layers
  const visibleHotspots = useMemo(() => {
    return HOTSPOTS.filter(h => {
      if (h.type === 'conflict' && activeLayers.includes('conflicts')) return true;
      if (h.type === 'tension' && activeLayers.includes('tensions')) return true;
      if ((h.type === 'strategic' || h.type === 'nuclear' || h.type === 'economic') && activeLayers.includes('strategic')) return true;
      return false;
    });
  }, [activeLayers]);

  // Get news related to selected hotspot
  const hotspotNews = useMemo(() => {
    if (!selectedHotspot) return [];
    return newsData.filter(article => {
      const text = `${article.title} ${article.description || ''}`.toLowerCase();
      return selectedHotspot.keywords.some(kw => text.includes(kw.toLowerCase()));
    });
  }, [selectedHotspot, newsData]);

  // Get news related to selected country
  const countryNews = useMemo(() => {
    if (!selectedCountry) return [];
    return newsData.filter(article => {
      const text = `${article.title} ${article.description || ''}`.toLowerCase();
      return selectedCountry.keywords.some(kw => text.includes(kw.toLowerCase()));
    });
  }, [selectedCountry, newsData]);

  const handleToggleLayer = useCallback((layer: MapLayer) => {
    setActiveLayers(prev =>
      prev.includes(layer)
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  }, []);

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    const newSelection = selectedHotspot?.id === hotspot.id ? null : hotspot;
    setSelectedHotspot(newSelection);
    setSelectedCountry(null); // Close country panel when opening hotspot
    setTooltipData(null); // Hide country tooltip when selecting hotspot
    onHotspotSelect?.(newSelection);
    onCountrySelect?.(null);
  }, [selectedHotspot, onHotspotSelect, onCountrySelect]);

  const handleCountryClick = useCallback((countryCode: string, countryName: string | undefined, event: React.MouseEvent) => {
    // Skip if no valid country code
    if (!countryCode || countryCode === '-99') {
      return;
    }

    // Get or create country info
    const countryInfo = getCountryInfo(countryCode);
    let newSelection: CountryInfo | null = null;
    const safeName = countryName || countryCode;

    if (countryInfo) {
      newSelection = selectedCountry?.code === countryCode ? null : countryInfo;
    } else {
      // Create basic country info for countries not in our database
      const basicInfo: CountryInfo = {
        code: countryCode,
        name: safeName,
        region: 'Unknown',
        subregion: 'Unknown',
        capital: 'Unknown',
        keywords: [safeName.toLowerCase()]
      };
      newSelection = selectedCountry?.code === countryCode ? null : basicInfo;
    }

    setSelectedCountry(newSelection);
    setSelectedHotspot(null); // Close hotspot panel when opening country
    setTooltipData(null);
    onCountrySelect?.(newSelection);
    onHotspotSelect?.(null);
  }, [selectedCountry, onCountrySelect, onHotspotSelect]);

  const handleMouseEnter = useCallback((
    geo: { id?: string; properties: { NAME?: string; ISO_A3?: string } },
    event: React.MouseEvent
  ) => {
    if (selectedHotspot || selectedCountry) return; // Don't show tooltip if detail panel is open

    // world-atlas uses numeric ID, convert to ISO code
    const numericId = geo.id as string;
    const countryCode = numericToIso(numericId) || geo.properties.ISO_A3 || '';
    const countryName = geo.properties.NAME || countryCode;

    // Skip invalid country codes
    if (!countryCode) return;

    let risk: RiskScore;

    if (isHistoricalMode) {
      // Use historical risk calculation
      const historicalRisk = calculateHistoricalRisk(countryCode, displayYear);
      const tier = scoreToTier(historicalRisk.baseRisk);
      // Convert string factors to RiskFactor objects
      const riskFactors = historicalRisk.factors.map(f => ({
        type: 'CONFLICT' as const,
        severity: historicalRisk.baseRisk,
        description: f
      }));
      risk = {
        countryCode,
        countryName,
        tier,
        score: historicalRisk.baseRisk,
        factors: riskFactors,
        lastUpdated: `${formatYear(displayYear)} (Historical)`,
        trend: 'STABLE',
        summary: historicalRisk.factors.length > 0
          ? `Historical context: ${historicalRisk.factors.join(', ')}`
          : 'Period of relative stability'
      };
    } else {
      const riskConfig = getRiskConfig(countryCode);
      const tier = scoreToTier(riskOverrides[countryCode]?.score ?? riskConfig.baseRisk);
      risk = riskOverrides[countryCode] || {
        countryCode,
        countryName,
        tier,
        score: riskConfig.baseRisk,
        factors: [],
        lastUpdated: new Date().toISOString(),
        trend: 'STABLE',
        summary: riskConfig.notes
      };
    }

    // Only show news in live mode
    const relatedNews = isHistoricalMode ? [] : newsData.filter(article => {
      if (article.relatedCountries?.includes(countryCode)) return true;
      const lowerName = countryName.toLowerCase();
      if (article.title?.toLowerCase().includes(lowerName)) return true;
      if (article.description?.toLowerCase().includes(lowerName)) return true;
      return false;
    }).slice(0, 3);

    setTooltipData({
      country: countryName,
      code: countryCode,
      risk,
      recentNews: relatedNews
    });

    setTooltipPosition({ x: event.clientX, y: event.clientY });
  }, [newsData, riskOverrides, selectedHotspot, selectedCountry, isHistoricalMode, displayYear]);

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  const handleZoomIn = () => {
    if (zoom < 8) setZoom(zoom * 1.5);
  };

  const handleZoomOut = () => {
    if (zoom > 1) setZoom(zoom / 1.5);
  };

  const handleReset = () => {
    setZoom(1);
    setCenter([0, 20]);
    setSelectedHotspot(null);
    setSelectedCountry(null);
  };

  const getCountryColor = useCallback((countryCode: string) => {
    let score: number;

    if (isHistoricalMode) {
      // Use historical risk calculation
      const historicalRisk = calculateHistoricalRisk(countryCode, displayYear);
      score = historicalRisk.baseRisk;
    } else {
      // Use live risk data
      const riskConfig = getRiskConfig(countryCode);
      score = riskOverrides[countryCode]?.score ?? riskConfig.baseRisk;
    }

    const tier = scoreToTier(score);
    const baseColor = tierToColor(tier);

    // Add heatmap effect for high risk countries
    if (activeLayers.includes('heatmap') && score > 50) {
      return baseColor;
    }

    // Slightly muted colors when not in heatmap mode
    return baseColor + (activeLayers.includes('heatmap') ? '' : 'cc');
  }, [riskOverrides, activeLayers, isHistoricalMode, displayYear]);

  return (
    <div className="relative w-full h-full map-container overflow-hidden">
      {/* Layer Controls */}
      <LayerControls
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
      />

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-surface-light border border-border rounded flex items-center justify-center text-foreground hover:bg-border transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-surface-light border border-border rounded flex items-center justify-center text-foreground hover:bg-border transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 bg-surface-light border border-border rounded flex items-center justify-center text-foreground hover:bg-border transition-colors text-xs"
          title="Reset View"
        >
          ⟲
        </button>
      </div>

      {/* Hotspot Detail Panel */}
      {selectedHotspot && (
        <HotspotDetail
          hotspot={selectedHotspot}
          relatedNews={hotspotNews}
          onClose={() => setSelectedHotspot(null)}
          onAskAbout={onOpenInquiry}
        />
      )}

      {/* Country Detail Panel */}
      {selectedCountry && !selectedHotspot && (
        <CountryDetail
            country={selectedCountry}
            riskScore={riskOverrides[selectedCountry.code]}
            relatedNews={countryNews}
            onClose={() => setSelectedCountry(null)}
            onHotspotClick={(hotspot) => {
              setSelectedHotspot(hotspot);
              setSelectedCountry(null);
            }}
            onAskAbout={onOpenInquiry}
            onCountryChange={(code) => {
              const newCountry = getCountryInfo(code);
              if (newCountry) {
                setSelectedCountry(newCountry);
              }
            }}
          />
      )}

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
          center: [0, 20]
        }}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: newZoom }) => {
            setCenter(coordinates as [number, number]);
            setZoom(newZoom);
          }}
        >
          {/* Countries */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // world-atlas uses numeric ID, convert to ISO code
                const numericId = geo.id as string;
                const countryCode = numericToIso(numericId) || geo.properties.ISO_A3 || '';
                const fillColor = getCountryColor(countryCode);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#2a3544"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none',
                        transition: 'fill 0.2s ease'
                      },
                      hover: {
                        outline: 'none',
                        fill: '#3b82f6',
                        cursor: 'pointer',
                        strokeWidth: 1,
                        stroke: '#60a5fa'
                      },
                      pressed: {
                        outline: 'none'
                      },
                    }}
                    onMouseEnter={(event) => handleMouseEnter(geo, event)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(event) => {
                      setTooltipPosition({ x: event.clientX, y: event.clientY });
                    }}
                    onMouseDown={(event) => {
                      mouseDownPosRef.current = { x: event.clientX, y: event.clientY };
                    }}
                    onClick={(event) => {
                      // Check if this was a click (not a drag) - use 10px threshold for more tolerance
                      if (mouseDownPosRef.current) {
                        const dx = Math.abs(event.clientX - mouseDownPosRef.current.x);
                        const dy = Math.abs(event.clientY - mouseDownPosRef.current.y);
                        if (dx > 10 || dy > 10) {
                          mouseDownPosRef.current = null;
                          return;
                        }
                      }
                      handleCountryClick(countryCode, geo.properties?.NAME, event);
                      mouseDownPosRef.current = null;
                    }}
                    tabIndex={-1}
                  />
                );
              })
            }
          </Geographies>

          {/* Hotspot Markers */}
          {visibleHotspots.map((hotspot) => (
            <HotspotMarker
              key={hotspot.id}
              hotspot={hotspot}
              onClick={handleHotspotClick}
              isSelected={selectedHotspot?.id === hotspot.id}
            />
          ))}

          {/* Hotspot Labels */}
          {activeLayers.includes('labels') && visibleHotspots.map((hotspot) => (
            <HotspotLabel
              key={`label-${hotspot.id}`}
              hotspot={hotspot}
              onClick={handleHotspotClick}
            />
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <MapLegend />

      {/* Tooltip */}
      {tooltipData && !selectedHotspot && (
        <MapTooltip data={tooltipData} position={tooltipPosition} />
      )}

      {/* Scan line effect for tactical feel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="scan-line absolute inset-x-0 h-32" />
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-text-muted bg-surface/80 backdrop-blur-sm px-3 py-1.5 rounded border border-border">
        {isHistoricalMode ? (
          <>
            <span className="w-2 h-2 bg-tactical-blue rounded-full" />
            <span>Historical View: {formatYear(displayYear)}</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-tactical-green rounded-full animate-pulse" />
            <span>{visibleHotspots.length} hotspots active</span>
          </>
        )}
      </div>
    </div>
  );
});
