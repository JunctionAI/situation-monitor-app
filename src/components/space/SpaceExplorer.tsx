'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { jwstImages, getImagesByDistance, type JWSTImage } from '@/data/jwstImages';

interface SpaceExplorerProps {
  onBackToEarth: () => void;
}

export function SpaceExplorer({ onBackToEarth }: SpaceExplorerProps) {
  const [activeImage, setActiveImage] = useState<JWSTImage | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sortedImages = getImagesByDistance();

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Star field background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
          `,
          opacity: 0.8,
        }}
      />

      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Back to Earth button */}
      <button
        onClick={onBackToEarth}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-500 rounded-lg text-white font-medium transition-all backdrop-blur-sm border border-blue-400/30"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Back to Earth
      </button>

      {/* Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 text-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          James Webb Space Telescope
        </h1>
        <p className="text-cyan-400 text-sm mt-1">Explore the Universe</p>
      </div>

      {/* Journey progress indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2">
        <div className="text-xs text-gray-400 writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Journey Progress
        </div>
        <div className="h-48 w-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 transition-all duration-300"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="text-xs text-cyan-400">
          {Math.round(scrollProgress * 13.8)}B ly
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Initial space - Earth departure zone */}
        <div className="h-[50vh] flex items-center justify-center">
          <div className="text-center animate-bounce">
            <p className="text-gray-400 text-lg">Scroll down to explore the cosmos</p>
            <svg className="w-8 h-8 mx-auto mt-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* JWST Images - sorted by distance */}
        {sortedImages.map((image, index) => (
          <div
            key={image.id}
            className="min-h-screen flex items-center justify-center p-8 relative"
          >
            {/* Distance marker */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-left">
              <div className="text-6xl font-bold text-white/10">{String(index + 1).padStart(2, '0')}</div>
              <div className="text-cyan-400 text-sm font-mono mt-2">{image.distance}</div>
              {image.constellation && (
                <div className="text-gray-500 text-xs mt-1">{image.constellation}</div>
              )}
            </div>

            {/* Image card */}
            <div
              className="relative max-w-4xl w-full cursor-pointer group"
              onClick={() => setActiveImage(image)}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 group-hover:border-cyan-500/50 transition-all duration-300">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                  {/* Type badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                      image.type === 'nebula' ? 'bg-purple-500/80 text-white' :
                      image.type === 'galaxy' ? 'bg-blue-500/80 text-white' :
                      image.type === 'deep-field' ? 'bg-cyan-500/80 text-white' :
                      image.type === 'star' ? 'bg-yellow-500/80 text-black' :
                      image.type === 'cluster' ? 'bg-pink-500/80 text-white' :
                      'bg-green-500/80 text-white'
                    }`}>
                      {image.type}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {image.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {image.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Released: {new Date(image.releaseDate).toLocaleDateString()}</span>
                      {image.coordinates && (
                        <span className="font-mono">RA: {image.coordinates.ra}</span>
                      )}
                    </div>
                    <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors flex items-center gap-1">
                      View Full
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* End of journey */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl px-8">
            <div className="text-6xl mb-6">🌌</div>
            <h2 className="text-3xl font-bold text-white mb-4">Edge of the Observable Universe</h2>
            <p className="text-gray-400 mb-8">
              You've traveled 13.8 billion light-years from Earth, viewing some of the oldest light
              in the universe captured by the James Webb Space Telescope.
            </p>
            <button
              onClick={onBackToEarth}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Return to Earth
            </button>
          </div>
        </div>
      </div>

      {/* Full image modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-7xl w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={activeImage.imageUrl}
              alt={activeImage.title}
              className="w-full h-auto rounded-lg"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <h2 className="text-3xl font-bold text-white mb-2">{activeImage.title}</h2>
              <p className="text-gray-300 mb-4">{activeImage.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span><strong className="text-cyan-400">Distance:</strong> {activeImage.distance}</span>
                {activeImage.constellation && (
                  <span><strong className="text-cyan-400">Constellation:</strong> {activeImage.constellation}</span>
                )}
                <span><strong className="text-cyan-400">Released:</strong> {new Date(activeImage.releaseDate).toLocaleDateString()}</span>
                {activeImage.coordinates && (
                  <>
                    <span><strong className="text-cyan-400">RA:</strong> {activeImage.coordinates.ra}</span>
                    <span><strong className="text-cyan-400">Dec:</strong> {activeImage.coordinates.dec}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
