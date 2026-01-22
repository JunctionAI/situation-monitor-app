'use client';

export type MapLayer = 'conflicts' | 'tensions' | 'strategic' | 'labels' | 'heatmap';

interface LayerControlsProps {
  activeLayers: MapLayer[];
  onToggleLayer: (layer: MapLayer) => void;
}

const LAYERS: { id: MapLayer; label: string; color: string }[] = [
  { id: 'conflicts', label: 'CONFLICTS', color: '#ef4444' },
  { id: 'tensions', label: 'TENSIONS', color: '#f97316' },
  { id: 'strategic', label: 'STRATEGIC', color: '#3b82f6' },
  { id: 'labels', label: 'LABELS', color: '#22c55e' },
  { id: 'heatmap', label: 'HEATMAP', color: '#8b5cf6' },
];

export function LayerControls({ activeLayers, onToggleLayer }: LayerControlsProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-1">
      {LAYERS.map((layer) => {
        const isActive = activeLayers.includes(layer.id);
        return (
          <button
            key={layer.id}
            onClick={() => onToggleLayer(layer.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
              isActive
                ? 'text-background'
                : 'text-text-secondary hover:text-foreground hover:bg-surface-light'
            }`}
            style={isActive ? { backgroundColor: layer.color } : undefined}
          >
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}
