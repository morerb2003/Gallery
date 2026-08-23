import React, { useEffect, useCallback } from 'react';

const Lightbox = ({
  photo,
  photosList,
  onClose,
  onNavigate,
  onEditPhoto,
  onDeletePhoto,
}) => {
  if (!photo) return null;

  const currentIndex = photosList.findIndex((p) => p.id === photo.id);
  const totalPhotos = photosList.length;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(photosList[currentIndex - 1]);
    } else {
      // Loop to end
      onNavigate(photosList[totalPhotos - 1]);
    }
  }, [currentIndex, photosList, totalPhotos, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalPhotos - 1) {
      onNavigate(photosList[currentIndex + 1]);
    } else {
      // Loop to start
      onNavigate(photosList[0]);
    }
  }, [currentIndex, photosList, totalPhotos, onNavigate]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-modal-enter"
      onClick={onClose}
    >
      {/* Lightbox Container */}
      <div
        className="relative w-full max-w-6xl max-h-[95vh] h-full flex flex-col lg:flex-row rounded-3xl overflow-hidden glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar for Close */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 flex items-center justify-center transition-all cursor-pointer shadow-lg"
            aria-label="Close Lightbox"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Left / Center Area: Main Image Stage */}
        <div className="relative flex-1 bg-black/60 flex items-center justify-center p-4 sm:p-8 min-h-[300px] overflow-hidden select-none">
          <img
            key={photo.id}
            src={photo.src}
            alt={photo.title}
            onError={(e) => {
              if (photo.fallbackSrc && e.target.src !== photo.fallbackSrc) {
                e.target.src = photo.fallbackSrc;
              }
            }}
            className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card hover:bg-orange-500 hover:text-black text-white border-zinc-700/80 flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer group"
            aria-label="Previous Photo"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card hover:bg-orange-500 hover:text-black text-white border-zinc-700/80 flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer group"
            aria-label="Next Photo"
          >
            <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Bottom Counter Floating Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-xs text-zinc-300 font-medium">
            Photo <span className="text-orange-400 font-bold">{currentIndex + 1}</span> of {totalPhotos}
          </div>
        </div>

        {/* Right Area: Metadata Sidebar */}
        <div className="w-full lg:w-96 p-6 sm:p-8 bg-zinc-950/95 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                {photo.category}
              </span>
              {photo.featured && (
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  ★ Featured
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                {photo.title}
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {photo.description || 'No description provided.'}
              </p>
            </div>

            {/* EXIF / Info Grid */}
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Location</p>
                  <p className="text-xs font-medium text-zinc-200">{photo.location || "Undisclosed"}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-3">
                <span className="text-lg">📷</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Gear & Lens</p>
                  <p className="text-xs font-medium text-zinc-200">{photo.camera || "Custom Camera"}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-3">
                <span className="text-lg">🗓️</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Date Captured</p>
                  <p className="text-xs font-medium text-zinc-200">{photo.date}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {photo.tags && photo.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {photo.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Links & Photo Management Buttons */}
          <div className="pt-6 border-t border-zinc-900 space-y-2.5">
            <div className="flex items-center gap-2">
              {/* Edit Photo Button */}
              {onEditPhoto && (
                <button
                  onClick={() => onEditPhoto(photo)}
                  className="flex-1 py-2.5 rounded-xl glass-card hover:bg-zinc-800 text-orange-400 hover:text-orange-300 font-bold text-xs uppercase tracking-wider text-center border-orange-500/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>✏️ Edit</span>
                </button>
              )}

              {/* Delete Photo Button */}
              {onDeletePhoto && (
                <button
                  onClick={() => onDeletePhoto(photo)}
                  className="py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-wider text-center border border-red-900/50 transition cursor-pointer flex items-center justify-center gap-1.5"
                  title="Delete this photo"
                >
                  <span>🗑️</span>
                </button>
              )}
            </div>

            <a
              href={photo.src}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              Open Original HD
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
