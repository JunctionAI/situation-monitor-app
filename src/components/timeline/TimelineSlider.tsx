'use client';

import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { useTimelineStore, MIN_YEAR, MAX_YEAR } from '@/store/timelineStore';
import {
  formatYear,
  yearToSliderPosition,
  sliderPositionToYear,
  getEraDefinition,
  ERAS,
} from '@/lib/historical/yearUtils';
import { EventMarkers, EventList } from './EventMarkers';
import { CONTEMPORARY_MILESTONES, getEventsForYear } from '@/data/historical/contemporary-events';

interface TimelineSliderProps {
  className?: string;
}

export function TimelineSlider({ className = '' }: TimelineSliderProps) {
  const {
    mode,
    selectedYear,
    isPlaying,
    playSpeed,
    playDirection,
    setYear,
    toggleMode,
    togglePlay,
    stepYear,
    jumpToEra,
    goToLive,
    setPlaySpeed,
  } = useTimelineStore();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Current display year (use current year when in live mode)
  const displayYear = mode === 'LIVE' ? MAX_YEAR : (selectedYear ?? MAX_YEAR);
  const currentEra = getEraDefinition(displayYear);

  // Get events for current year
  const currentYearEvents = useMemo(() => {
    return getEventsForYear(displayYear);
  }, [displayYear]);

  // Handle playback
  useEffect(() => {
    if (isPlaying && mode === 'HISTORICAL') {
      const step = playDirection === 'forward' ? 1 : -1;
      const interval = 1000 / playSpeed; // ms between steps

      playIntervalRef.current = setInterval(() => {
        stepYear(step);
      }, interval);

      return () => {
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
        }
      };
    }
  }, [isPlaying, mode, playSpeed, playDirection, stepYear]);

  // Convert mouse position to year
  const getYearFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return displayYear;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    return sliderPositionToYear(position);
  }, [displayYear]);

  // Mouse/touch handlers
  const handleSliderInteraction = useCallback((clientX: number) => {
    const year = getYearFromPosition(clientX);
    setYear(year);
  }, [getYearFromPosition, setYear]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode === 'LIVE') {
      toggleMode(); // Enter historical mode on first interaction
    }
    setIsDragging(true);
    handleSliderInteraction(e.clientX);
  }, [mode, toggleMode, handleSliderInteraction]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleSliderInteraction(e.clientX);
    }
  }, [isDragging, handleSliderInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse move/up handlers
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'HISTORICAL') return;

      switch (e.key) {
        case 'ArrowLeft':
          stepYear(-1);
          break;
        case 'ArrowRight':
          stepYear(1);
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          goToLive();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, stepYear, togglePlay, goToLive]);

  // Calculate slider position
  const sliderPosition = yearToSliderPosition(displayYear);

  return (
    <div className={`relative bg-surface/95 backdrop-blur-sm border-t border-border ${className}`}>
      {/* Event List Panel (when expanded) */}
      {showEvents && currentYearEvents.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[400px] z-30">
          <EventList
            events={currentYearEvents}
            year={displayYear}
            onClose={() => setShowEvents(false)}
          />
        </div>
      )}

      {/* Main Controls Row */}
      <div className="px-4 py-2 flex items-center gap-4">
        {/* Mode Toggle */}
        <button
          onClick={toggleMode}
          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
            mode === 'LIVE'
              ? 'bg-tactical-green/20 border-tactical-green/50 text-tactical-green'
              : 'bg-tactical-blue/20 border-tactical-blue/50 text-tactical-blue'
          }`}
        >
          {mode === 'LIVE' ? 'LIVE' : 'HISTORICAL'}
        </button>

        {/* Era Quick-Jump Buttons */}
        <div className="flex gap-1">
          {ERAS.map((era) => (
            <button
              key={era.id}
              onClick={() => jumpToEra(era.id)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                currentEra.id === era.id && mode === 'HISTORICAL'
                  ? 'bg-white/20 text-white'
                  : 'text-text-muted hover:text-foreground hover:bg-white/10'
              }`}
              style={{
                borderBottom: currentEra.id === era.id && mode === 'HISTORICAL'
                  ? `2px solid ${era.color}`
                  : 'none',
              }}
              title={era.description}
            >
              {era.name}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Year Display */}
        <div className="text-center min-w-[120px]">
          <div className="text-lg font-bold text-foreground">
            {mode === 'LIVE' ? 'Present' : formatYear(displayYear)}
          </div>
          <div className="text-xs text-text-muted" style={{ color: currentEra.color }}>
            {currentEra.name} Era
          </div>
          {currentYearEvents.length > 0 && mode === 'HISTORICAL' && (
            <button
              onClick={() => setShowEvents(!showEvents)}
              className="text-[10px] text-tactical-blue hover:underline mt-0.5"
            >
              {currentYearEvents.length} event{currentYearEvents.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Playback Controls */}
        {mode === 'HISTORICAL' && (
          <div className="flex items-center gap-2">
            {/* Rewind */}
            <button
              onClick={() => stepYear(-10)}
              className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-foreground transition-colors"
              title="Back 10 years"
            >
              ⏪
            </button>

            {/* Step Back */}
            <button
              onClick={() => stepYear(-1)}
              className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-foreground transition-colors"
              title="Back 1 year"
            >
              ◀
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                isPlaying
                  ? 'bg-tactical-blue text-white'
                  : 'bg-white/10 text-foreground hover:bg-white/20'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Step Forward */}
            <button
              onClick={() => stepYear(1)}
              className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-foreground transition-colors"
              title="Forward 1 year"
            >
              ▶
            </button>

            {/* Fast Forward */}
            <button
              onClick={() => stepYear(10)}
              className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-foreground transition-colors"
              title="Forward 10 years"
            >
              ⏩
            </button>

            {/* Speed Control */}
            <select
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
              className="bg-surface border border-border rounded px-2 py-1 text-xs text-foreground"
              title="Playback speed (years/sec)"
            >
              <option value={1}>1x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
              <option value={50}>50x</option>
              <option value={100}>100x</option>
            </select>
          </div>
        )}

        {/* Go to Live Button */}
        {mode === 'HISTORICAL' && (
          <button
            onClick={goToLive}
            className="px-3 py-1.5 text-xs font-medium rounded bg-tactical-green/20 border border-tactical-green/50 text-tactical-green hover:bg-tactical-green/30 transition-colors"
          >
            Go Live
          </button>
        )}
      </div>

      {/* Timeline Slider Track */}
      <div className="px-4 pb-3">
        <div
          ref={sliderRef}
          className="relative h-8 bg-surface-light rounded-full cursor-pointer overflow-hidden"
          onMouseDown={handleMouseDown}
        >
          {/* Era Background Segments */}
          {ERAS.map((era) => {
            const startPos = yearToSliderPosition(era.startYear) * 100;
            const endPos = yearToSliderPosition(era.endYear) * 100;
            const width = endPos - startPos;

            return (
              <div
                key={era.id}
                className="absolute top-0 bottom-0 opacity-30"
                style={{
                  left: `${startPos}%`,
                  width: `${width}%`,
                  backgroundColor: era.color,
                }}
              />
            );
          })}

          {/* Progress Fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-tactical-blue/50 to-tactical-blue/80"
            style={{ width: `${sliderPosition * 100}%` }}
          />

          {/* Era Dividers */}
          {ERAS.slice(1).map((era) => {
            const pos = yearToSliderPosition(era.startYear) * 100;
            return (
              <div
                key={`divider-${era.id}`}
                className="absolute top-0 bottom-0 w-px bg-border/50"
                style={{ left: `${pos}%` }}
              />
            );
          })}

          {/* Event Markers */}
          <EventMarkers milestones={CONTEMPORARY_MILESTONES} />

          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full shadow-lg border-2 border-tactical-blue transition-all"
            style={{
              left: `calc(${sliderPosition * 100}% - 8px)`,
              transform: `translateY(-50%) ${isDragging ? 'scale(1.2)' : 'scale(1)'}`,
            }}
          />

          {/* Year Labels */}
          <div className="absolute bottom-full mb-1 left-0 text-xs text-text-muted">
            1000 BCE
          </div>
          <div className="absolute bottom-full mb-1 right-0 text-xs text-text-muted">
            Present
          </div>
        </div>

        {/* Era Labels Below */}
        <div className="relative h-4 mt-1">
          {ERAS.map((era) => {
            const startPos = yearToSliderPosition(era.startYear) * 100;
            const endPos = yearToSliderPosition(era.endYear) * 100;
            const centerPos = (startPos + endPos) / 2;

            return (
              <div
                key={`label-${era.id}`}
                className="absolute text-[10px] text-text-muted whitespace-nowrap transform -translate-x-1/2"
                style={{ left: `${centerPos}%` }}
              >
                {era.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
