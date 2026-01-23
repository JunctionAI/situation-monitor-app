'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { getImagesByDistance, type JWSTImage } from '@/data/jwstImages';

interface SpaceExplorerProps {
  onBackToEarth: () => void;
}

export function SpaceExplorer({ onBackToEarth }: SpaceExplorerProps) {
  const [selectedImage, setSelectedImage] = useState<JWSTImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sortedImages = getImagesByDistance();

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.floor(scrollTop / clientHeight);
    setCurrentIndex(Math.min(index, sortedImages.length - 1));
  }, [sortedImages.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const currentImage = sortedImages[currentIndex];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Back button - larger touch target on mobile */}
      <button
        onClick={onBackToEarth}
        className="absolute top-4 left-4 z-50 p-3 md:p-2 bg-black/50 hover:bg-black/70 active:bg-black/80 rounded-full text-white transition-all backdrop-blur-sm border border-white/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
      </button>

      {/* Distance indicator - responsive positioning */}
      <div className="absolute top-4 right-4 z-50 text-right">
        <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest">Distance</div>
        <div className="text-lg md:text-2xl font-light text-cyan-400 font-mono">
          {currentImage?.distance || '—'}
        </div>
      </div>

      {/* Progress dots - hidden on mobile, shown on desktop */}
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-2">
        {sortedImages.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'bg-cyan-400 scale-125'
                : i < currentIndex
                ? 'bg-white/50'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden absolute bottom-4 left-4 right-4 z-40">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / sortedImages.length) * 100}%` }}
          />
        </div>
        <div className="text-center text-white/50 text-xs mt-2">
          {currentIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Scrollable images */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {sortedImages.map((image, index) => (
          <div
            key={image.id}
            className="h-full w-full snap-start relative flex items-center justify-center cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            {/* Full-screen image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 md:group-hover:scale-105"
              style={{
                backgroundImage: `url(${image.imageUrl})`,
              }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
            <div className="absolute inset-0 bg-black/30 md:bg-black/20 md:group-hover:bg-black/10 transition-colors duration-500" />

            {/* Minimal label - responsive positioning */}
            <div className="absolute bottom-20 md:bottom-8 left-4 md:left-8 right-4 md:right-24 z-10">
              <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${
                  image.type === 'nebula' ? 'bg-purple-500/80' :
                  image.type === 'galaxy' ? 'bg-blue-500/80' :
                  image.type === 'deep-field' ? 'bg-cyan-500/80' :
                  image.type === 'star' ? 'bg-yellow-500/80 text-black' :
                  image.type === 'cluster' ? 'bg-pink-500/80' :
                  'bg-green-500/80'
                }`}>
                  {image.type}
                </span>
                {image.constellation && (
                  <span className="text-white/50 text-xs md:text-sm">{image.constellation}</span>
                )}
              </div>
              <h2 className="text-2xl md:text-4xl font-light text-white mb-2 drop-shadow-lg">
                {image.title}
              </h2>
              <p className="text-white/60 text-xs md:text-sm flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                Tap to explore
              </p>
            </div>

            {/* Index number - smaller on mobile */}
            <div className="absolute top-16 md:top-8 left-4 md:left-8 text-white/5 md:text-white/10 text-5xl md:text-8xl font-bold">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        ))}

        {/* End card */}
        <div className="h-full w-full snap-start relative flex items-center justify-center bg-gradient-to-b from-black to-purple-950/30 px-6">
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6 opacity-50">✧</div>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-2 md:mb-3">Edge of Observable Universe</h2>
            <p className="text-white/50 text-base md:text-lg mb-6 md:mb-8">13.8 billion light-years from home</p>
            <button
              onClick={onBackToEarth}
              className="px-6 md:px-8 py-3 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/30 text-white rounded-full transition-all text-sm md:text-base"
            >
              Return to Earth
            </button>
          </div>
        </div>
      </div>

      {/* Detail panel - Bottom sheet on mobile, side panel on desktop */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col md:flex-row"
          onClick={() => setSelectedImage(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          {/* Content */}
          <div
            className="relative flex flex-col md:flex-row w-full h-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Image - full width on mobile, flex-1 on desktop */}
            <div className="flex-1 relative min-h-[40vh] md:min-h-0">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
              {/* Close button - top right */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-3 md:p-2 bg-black/50 hover:bg-black/70 active:bg-black/80 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Info panel - Bottom sheet on mobile, side panel on desktop */}
            <div className="w-full md:w-96 max-h-[60vh] md:max-h-none bg-gray-900/95 md:border-l border-t md:border-t-0 border-white/10 overflow-y-auto rounded-t-3xl md:rounded-none">
              {/* Drag handle on mobile */}
              <div className="md:hidden flex justify-center py-3">
                <div className="w-12 h-1 bg-white/30 rounded-full" />
              </div>

              <div className="p-4 md:p-6 md:pt-6">
                {/* Type badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-3 md:mb-4 ${
                  selectedImage.type === 'nebula' ? 'bg-purple-500/80' :
                  selectedImage.type === 'galaxy' ? 'bg-blue-500/80' :
                  selectedImage.type === 'deep-field' ? 'bg-cyan-500/80' :
                  selectedImage.type === 'star' ? 'bg-yellow-500/80 text-black' :
                  selectedImage.type === 'cluster' ? 'bg-pink-500/80' :
                  'bg-green-500/80'
                }`}>
                  {selectedImage.type}
                </span>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-light text-white mb-3 md:mb-4">
                  {selectedImage.title}
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
                  {selectedImage.description}
                </p>

                {/* Stats - grid on mobile for better layout */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <div className="border-t border-white/10 pt-3 md:pt-4">
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide mb-1">Distance</div>
                    <div className="text-lg md:text-xl text-cyan-400 font-mono">{selectedImage.distance}</div>
                  </div>

                  {selectedImage.constellation && (
                    <div className="border-t border-white/10 pt-3 md:pt-4">
                      <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide mb-1">Constellation</div>
                      <div className="text-base md:text-lg text-white">{selectedImage.constellation}</div>
                    </div>
                  )}

                  {selectedImage.coordinates && (
                    <div className="col-span-2 md:col-span-1">
                      <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide mb-1">Coordinates</div>
                      <div className="text-xs md:text-sm text-gray-300 font-mono">
                        RA: {selectedImage.coordinates.ra} • Dec: {selectedImage.coordinates.dec}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-3 md:pt-4">
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide mb-1">Released</div>
                    <div className="text-xs md:text-sm text-gray-300">
                      {new Date(selectedImage.releaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* JWST credit */}
                <div className="mt-6 md:mt-8 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <span className="text-xl md:text-2xl">🔭</span>
                    <span>James Webb Space Telescope<br/>NASA / ESA / CSA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
