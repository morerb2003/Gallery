import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Lightbox = ({
  photo,
  photosList = [],
  isLiked = false,
  isCollected = false,
  onToggleLike,
  onToggleCollection,
  onDownloadPhoto,
  onClose,
  onNavigate,
  onEditPhoto,
  onDeletePhoto,
  onShowToast,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [showInfoSidebar, setShowInfoSidebar] = useState(true);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mobile swipe gesture tracking
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const currentIndex = photosList.findIndex((p) => p.id === photo?.id);
  const totalPhotos = photosList.length;

  // Reset zoom on photo change
  useEffect(() => {
    setZoomLevel(1);
  }, [photo?.id]);

  const handlePrev = useCallback(() => {
    if (totalPhotos <= 1) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalPhotos - 1;
    onNavigate(photosList[prevIndex]);
  }, [currentIndex, photosList, totalPhotos, onNavigate]);

  const handleNext = useCallback(() => {
    if (totalPhotos <= 1) return;
    const nextIndex = currentIndex < totalPhotos - 1 ? currentIndex + 1 : 0;
    onNavigate(photosList[nextIndex]);
  }, [currentIndex, photosList, totalPhotos, onNavigate]);

  // Slideshow timer
  useEffect(() => {
    let interval = null;
    if (isPlayingSlideshow) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingSlideshow, handleNext]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  }, []);

  // Listen for native fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    if (onShowToast) {
      onShowToast('🔗 Image link copied to clipboard!');
    }
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes(e.target.tagName?.toLowerCase())) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlayingSlideshow((prev) => !prev);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0' || e.key === 'z' || e.key === 'Z') {
        setZoomLevel((prev) => (prev > 1 ? 1 : 1.75));
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfoSidebar((prev) => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        if (onToggleLike) onToggleLike();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, handlePrev, handleNext, handleToggleFullscreen, onToggleLike]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchEndXRef.current - touchStartXRef.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        // Swiped left -> next
        handleNext();
      } else {
        // Swiped right -> prev
        handlePrev();
      }
    }
  };

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-modal-enter select-none"
      onClick={onClose}
    >
      {/* Top Floating Glass Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between z-30 pointer-events-auto border-b border-white/10 glass-panel-elevated"
      >
        {/* Left: Counter & Title */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-bold text-zinc-300">
            <span className="text-orange-400">{currentIndex + 1}</span> / {totalPhotos}
          </div>
          <span className="hidden sm:inline-block text-sm font-bold text-white truncate max-w-xs">
            {photo.title}
          </span>
          <span className="hidden md:inline-block text-xs uppercase tracking-wider text-orange-400/90 font-semibold px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20">
            {photo.category}
          </span>
        </div>

        {/* Right: Quick Controls & Close */}
        <div className="flex items-center gap-2">
          {/* Shortcuts Info button */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal((prev) => !prev)}
            title="Keyboard Shortcuts"
            className="w-9 h-9 rounded-xl glass-pill hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ⌨️
          </button>

          {/* Toggle Sidebar info */}
          <button
            type="button"
            onClick={() => setShowInfoSidebar((prev) => !prev)}
            title="Toggle Details Sidebar (I)"
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition cursor-pointer ${
              showInfoSidebar
                ? 'bg-orange-500 text-black shadow-md'
                : 'glass-pill hover:bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            ℹ️
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close (Esc)"
            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex-1 flex items-stretch overflow-hidden"
      >
        {/* Left / Center: Interactive Image Stage with Swipe Gestures */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none cursor-default"
        >
          {/* Main Photo with smooth animation & zoom */}
          <AnimatePresence mode="wait">
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{
                opacity: 1,
                scale: zoomLevel,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              className="relative max-w-full max-h-[76vh] flex items-center justify-center"
            >
              <img
                src={photo.src}
                alt={photo.title}
                onError={(e) => {
                  if (photo.fallbackSrc && e.target.src !== photo.fallbackSrc) {
                    e.target.src = photo.fallbackSrc;
                  }
                }}
                className={`max-w-full max-h-[76vh] object-contain rounded-2xl shadow-2xl transition-transform ${
                  zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setZoomLevel((prev) => (prev > 1 ? 1 : 1.8))}
              />
            </motion.div>
          </AnimatePresence>

          {/* Desktop Navigation Floating Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Photo"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl glass-toolbar hover:bg-orange-500 hover:text-black text-white flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Photo"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl glass-toolbar hover:bg-orange-500 hover:text-black text-white flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Zoom Level Indicator (when zoomed) */}
          {zoomLevel > 1 && (
            <div
              onClick={handleResetZoom}
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold text-orange-400 cursor-pointer hover:bg-orange-500 hover:text-black transition"
            >
              Zoom {Math.round(zoomLevel * 100)}% (Click to reset)
            </div>
          )}

          {/* Slideshow Active Badge */}
          {isPlayingSlideshow && (
            <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-orange-500 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              <span>Playing Slideshow (4s)</span>
            </div>
          )}
        </div>

        {/* Right Area: Collapsible Metadata & EXIF Sidebar */}
        <AnimatePresence>
          {showInfoSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex flex-col justify-between p-6 bg-zinc-950/95 border-l border-white/10 overflow-y-auto w-[340px] flex-shrink-0"
            >
              <div className="space-y-6">
                {/* Category & Badge */}
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

                {/* EXIF Data Cards */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Location</p>
                      <p className="text-xs font-medium text-zinc-200">{photo.location || "Undisclosed"}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                    <span className="text-lg">📷</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Camera & Optics</p>
                      <p className="text-xs font-medium text-zinc-200">{photo.camera || "Custom Gear"}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                    <span className="text-lg">🗓️</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Capture Date</p>
                      <p className="text-xs font-medium text-zinc-200">{photo.date}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Keywords & Tags</p>
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

              {/* Sidebar Action Buttons */}
              <div className="pt-6 border-t border-zinc-900 space-y-2.5">
                <div className="flex items-center gap-2">
                  {onEditPhoto && (
                    <button
                      type="button"
                      onClick={() => onEditPhoto(photo)}
                      className="flex-1 py-2.5 rounded-xl glass-card hover:bg-zinc-800 text-orange-400 font-bold text-xs uppercase tracking-wider text-center border-orange-500/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>✏️ Edit</span>
                    </button>
                  )}
                  {onDeletePhoto && (
                    <button
                      type="button"
                      onClick={() => onDeletePhoto(photo)}
                      className="py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold text-xs uppercase tracking-wider text-center border border-red-900/50 transition cursor-pointer"
                      title="Delete photo"
                    >
                      <span>🗑️</span>
                    </button>
                  )}
                </div>

                <a
                  href={photo.src}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  Open Original HD
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Bar at the Bottom */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full p-4 flex items-center justify-center z-30 pointer-events-auto"
      >
        <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 p-2 rounded-2xl glass-panel-elevated border-white/15 shadow-2xl backdrop-blur-2xl">
          {/* Previous / Next for Mobile */}
          <div className="flex items-center sm:hidden gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-orange-500 text-white hover:text-black flex items-center justify-center transition"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-orange-500 text-white hover:text-black flex items-center justify-center transition"
            >
              →
            </button>
          </div>

          {/* Like Button */}
          <button
            type="button"
            onClick={onToggleLike}
            title={isLiked ? "Unlike (L)" : "Like (L)"}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isLiked
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-zinc-900/90 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400'
            }`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
          </button>

          {/* Save to Collection */}
          <button
            type="button"
            onClick={onToggleCollection}
            title={isCollected ? "Saved in Collection" : "Save to Collection"}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isCollected
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-zinc-900/90 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-400'
            }`}
          >
            <span>{isCollected ? '🔖' : '📑'}</span>
            <span className="hidden sm:inline">{isCollected ? 'Saved' : 'Save'}</span>
          </button>

          <div className="hidden sm:block w-[1px] h-6 bg-zinc-700 mx-1"></div>

          {/* Slideshow play/pause */}
          <button
            type="button"
            onClick={() => setIsPlayingSlideshow((prev) => !prev)}
            title="Slideshow Auto-Play (Space)"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isPlayingSlideshow
                ? 'bg-orange-500 text-black font-black'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <span>{isPlayingSlideshow ? '⏸️' : '▶️'}</span>
            <span className="hidden md:inline">{isPlayingSlideshow ? 'Pause' : 'Play'}</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In (+)"
              className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              🔍+
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset Zoom (0)"
              className="px-2 h-8 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
            >
              1x
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out (-)"
              className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              🔍-
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="Full Screen Cinema (F)"
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition cursor-pointer ${
              isFullscreen
                ? 'bg-orange-500 text-black shadow-md'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            ⛶
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={onDownloadPhoto}
            title="Download HD Photo"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-emerald-600 text-zinc-300 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            <span>⬇️</span>
            <span className="hidden md:inline">Download</span>
          </button>

          {/* Share / Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy Share Link"
            className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
          >
            🔗
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal Guide */}
      <AnimatePresence>
        {showShortcutsModal && (
          <div
            onClick={() => setShowShortcutsModal(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full rounded-3xl glass-panel-elevated p-6 border-zinc-700/80 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>⌨️</span> Keyboard Shortcuts
                </h3>
                <button
                  type="button"
                  onClick={() => setShowShortcutsModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Previous Photo</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">←</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Next Photo</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">→</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Full Screen</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">F</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Close Lightbox</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">Esc</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Play / Pause</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">Space</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Zoom In / Out</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">+ / -</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Toggle Details</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">I</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Like Photo</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 font-mono">L</kbd>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lightbox;
