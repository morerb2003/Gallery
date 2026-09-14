import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { useGallery } from '../context/GalleryContext';

const SplitViewPhotoModal = ({
  photo,
  photosList = [],
  isOpen,
  onClose,
  onNavigatePhoto,
}) => {
  const {
    likes,
    collections,
    followingCreators,
    toggleLike,
    toggleCollection,
    toggleFollow,
    downloadPhoto,
    showToast,
  } = useGallery();

  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Find index for next/prev
  const currentIndex = photosList.findIndex((p) => String(p.id) === String(photo?.id));
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < photosList.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev && onNavigatePhoto) {
      onNavigatePhoto(photosList[currentIndex - 1]);
      setZoomLevel(1);
    }
  }, [hasPrev, onNavigatePhoto, photosList, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext && onNavigatePhoto) {
      onNavigatePhoto(photosList[currentIndex + 1]);
      setZoomLevel(1);
    }
  }, [hasNext, onNavigatePhoto, photosList, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key.toLowerCase() === 'l' && photo) {
        toggleLike(photo.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, toggleLike, photo]);

  // Reset zoom on photo change
  useEffect(() => {
    setZoomLevel(1);
  }, [photo?.id]);

  if (!isOpen || !photo) return null;

  const isLiked = !!likes[photo.id];
  const isCollected = !!collections[photo.id];
  const creatorKey = photo.author?.username || 'rohit_captures';
  const isFollowing = !!followingCreators[creatorKey];

  const handleCopyShareLink = () => {
    const directUrl = `${window.location.origin}${window.location.pathname}#/photo/${photo.id}`;
    navigator.clipboard.writeText(directUrl);
    showToast('🔗 Direct photo link copied to clipboard!');
  };

  const handleDownload = (resLabel) => {
    setDownloadDropdownOpen(false);
    downloadPhoto(photo, resLabel);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-7xl max-h-[94vh] flex flex-col rounded-3xl glass-panel-elevated border-zinc-700/80 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Modal Toolbar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/60">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Split-View Inspection</span>
              </span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                {currentIndex >= 0 ? `${currentIndex + 1} of ${photosList.length}` : 'Detail'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyShareLink}
                title="Share link"
                className="px-3 py-1.5 rounded-xl glass-card hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔗</span>
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full glass-card hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer text-sm font-bold"
                title="Close (ESC)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Split-View Body: Left Visual (60%) + Right Sticky Metadata (40%) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto min-h-0">
            {/* LEFT COLUMN: Visual Showcase */}
            <div className="lg:col-span-7 xl:col-span-8 bg-zinc-950/80 p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[360px] lg:min-h-[580px] border-b lg:border-b-0 lg:border-r border-zinc-800/80 overflow-hidden select-none">
              {/* Floating Next / Prev Buttons */}
              {hasPrev && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass-card hover:bg-zinc-800 text-white flex items-center justify-center shadow-xl hover:scale-110 transition cursor-pointer"
                  title="Previous (Left Arrow)"
                >
                  ‹
                </button>
              )}
              {hasNext && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass-card hover:bg-zinc-800 text-white flex items-center justify-center shadow-xl hover:scale-110 transition cursor-pointer"
                  title="Next (Right Arrow)"
                >
                  ›
                </button>
              )}

              {/* High-Resolution Media with Zoom */}
              <div
                className="relative max-w-full max-h-[72vh] flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <OptimizedImage
                  src={photo.src}
                  fallbackSrc={photo.fallbackSrc}
                  alt={photo.title}
                  dominantColor={photo.color || '#18181b'}
                  className="max-w-full max-h-[70vh] flex items-center justify-center"
                  imgClassName="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Floating Controls Bar at Bottom of Image */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl glass-toolbar shadow-2xl">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="w-8 h-8 rounded-xl hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="text-[10px] text-zinc-400 font-mono px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                  className="w-8 h-8 rounded-xl hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-1 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Verified EXIF Metadata & Creator Hub */}
            <div className="lg:col-span-5 xl:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto bg-zinc-900/40">
              <div className="space-y-6">
                {/* Creator Profile Header */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-[1.5px] shadow-md">
                      <div className="w-full h-full bg-zinc-950 rounded-[14px] overflow-hidden flex items-center justify-center">
                        {photo.author?.avatar ? (
                          <img
                            src={photo.author.avatar}
                            alt="Creator"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">📸</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">
                          {photo.author?.name || 'Rohit Sharma'}
                        </h4>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          PRO
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        @{photo.author?.username || 'rohit_captures'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFollow(creatorKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isFollowing
                        ? 'bg-zinc-800 text-orange-400 border border-orange-500/40'
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    {isFollowing ? '✓ Following' : '+ Follow'}
                  </button>
                </div>

                {/* Photo Story & Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                      {photo.category}
                    </span>
                    {photo.color && (
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-pill text-[10px] text-zinc-300">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: photo.color }}
                        />
                        <span>Dominant Mood</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {photo.description ||
                      'Exquisitely captured with ambient natural light and balanced dynamic range.'}
                  </p>
                </div>

                {/* Engagement Bar: Like, Collect, Download */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => toggleLike(photo.id, e)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isLiked
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                        : 'glass-card hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span>{isLiked ? '❤️' : '🤍'}</span>
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => toggleCollection(photo.id, e)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isCollected
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                        : 'glass-card hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span>{isCollected ? '🔖' : '📑'}</span>
                    <span>{isCollected ? 'Saved' : 'Collect'}</span>
                  </button>

                  {/* Resolution Download Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDownloadDropdownOpen((prev) => !prev)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>⬇️</span>
                      <span className="hidden sm:inline">Download</span>
                      <span className="text-[9px]">▼</span>
                    </button>

                    {downloadDropdownOpen && (
                      <div className="absolute right-0 bottom-full mb-2 w-44 rounded-2xl glass-panel-elevated border-zinc-700 p-2 shadow-2xl z-50 space-y-1">
                        <button
                          type="button"
                          onClick={() => handleDownload('Original-4K')}
                          className="w-full text-left p-2 rounded-xl hover:bg-zinc-800 text-xs text-white transition flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-bold">Original</span>
                          <span className="text-zinc-400 text-[10px]">4K UHD</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload('1080p')}
                          className="w-full text-left p-2 rounded-xl hover:bg-zinc-800 text-xs text-white transition flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-bold">1080p</span>
                          <span className="text-zinc-400 text-[10px]">Full HD</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload('720p')}
                          className="w-full text-left p-2 rounded-xl hover:bg-zinc-800 text-xs text-white transition flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-bold">720p</span>
                          <span className="text-zinc-400 text-[10px]">Optimized</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical EXIF Information Panel */}
                <div className="p-4 rounded-2xl glass-panel-elevated border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span>📷</span> Sticky Technical EXIF
                    </h5>
                    <span className="text-[10px] font-bold text-emerald-400">Verified Capture</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Camera</span>
                      <span className="text-white font-medium truncate block">
                        {photo.camera || 'Sony Alpha A7 IV'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Lens</span>
                      <span className="text-white font-medium truncate block">
                        {photo.exif?.focalLength || '50mm Prime'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Aperture</span>
                      <span className="text-white font-bold block">
                        {photo.exif?.aperture || 'f/2.8'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Shutter</span>
                      <span className="text-white font-bold block">
                        {photo.exif?.shutterSpeed || '1/1000s'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">ISO</span>
                      <span className="text-orange-400 font-bold block">
                        {photo.exif?.iso || 'ISO 100'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Resolution</span>
                      <span className="text-white font-medium block">
                        {photo.resolution || '4000 × 2667'}
                      </span>
                    </div>
                  </div>

                  {photo.location && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                      <span>📍</span>
                      <span>{photo.location}</span>
                    </div>
                  )}
                </div>

                {/* Exploration Tags */}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Related Tags
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {photo.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full text-[10px] font-medium glass-pill text-zinc-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>[ESC] Close</span>
                <span>[← / →] Prev / Next</span>
                <span>[L] Like</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SplitViewPhotoModal;
