import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GalleryGrid from '../components/GalleryGrid';
import OptimizedImage from '../components/OptimizedImage';
import { useGallery } from '../context/GalleryContext';

const PhotoDetailPage = ({
  photoId,
  onNavigate,
  onGoBack,
}) => {
  const {
    photos,
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Find photo by ID
  const photo = photos.find((p) => String(p.id) === String(photoId)) || photos[0];

  // Dynamic document.title update with cleanup
  useEffect(() => {
    const originalTitle = document.title;
    if (photo) {
      const author = photo.author?.name || 'Rohit Sharma';
      document.title = `${photo.title} by ${author} — Rohit's Gallery`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [photo]);

  // Keyboard navigation: Escape to go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onGoBack) {
          onGoBack();
        } else if (onNavigate) {
          onNavigate('home');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGoBack, onNavigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [photoId]);

  if (!photo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <span className="text-4xl">📷</span>
        <h2 className="text-2xl font-bold text-white">Photograph Not Found</h2>
        <p className="text-sm text-zinc-400">The photograph you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-orange-500 text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const isLiked = !!likes[photo.id];
  const isCollected = !!collections[photo.id];
  const creatorKey = photo.author?.username || 'rohit_captures';
  const isFollowing = !!followingCreators[creatorKey];

  // Related photos: same category or matching tags
  const relatedPhotos = photos
    .filter((p) => String(p.id) !== String(photo.id) && (p.category === photo.category || p.tags?.some((t) => photo.tags?.includes(t))))
    .slice(0, 6);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Direct photo link copied to clipboard!');
  };

  const handleDownloadResolution = (resLabel) => {
    setDownloadDropdownOpen(false);
    downloadPhoto(photo, resLabel);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const megapixels = photo.width && photo.height
    ? ((photo.width * photo.height) / 1000000).toFixed(1)
    : '2.4';

  return (
    <div className="min-h-screen py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <button
          onClick={() => (onGoBack ? onGoBack() : onNavigate('home'))}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-orange-400 transition cursor-pointer"
        >
          <span>← Back (Esc)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl glass-card hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔗</span>
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-xl glass-card hover:bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs font-bold transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Creator Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl glass-panel-elevated">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-[1.5px] shadow-md">
            <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center font-bold text-white overflow-hidden">
              {photo.author?.avatar ? (
                <img src={photo.author.avatar} alt="Author" className="w-full h-full object-cover" />
              ) : (
                <span>📷</span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {photo.author?.name || "Rohit Sharma"}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              @{photo.author?.username || "rohit_captures"} • {photo.location || "Visual Artist"}
            </p>
          </div>
        </div>

        {/* Action Controls: Follow, Like, Bookmark & Download Free */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => toggleFollow(creatorKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              isFollowing
                ? 'bg-zinc-800 text-orange-400 border border-orange-500/40'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-700'
            }`}
          >
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>

          <button
            type="button"
            onClick={(e) => toggleLike(photo.id, e)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              isLiked
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'glass-card hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => toggleCollection(photo.id, e)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              isCollected
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'glass-card hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <span>{isCollected ? '🔖' : '📑'}</span>
            <span className="hidden sm:inline">{isCollected ? 'Saved' : 'Collect'}</span>
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDownloadDropdownOpen((prev) => !prev)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center gap-2"
            >
              <span>⬇️ Download Free</span>
              <span className="text-[10px]">▼</span>
            </button>

            {downloadDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl glass-panel-elevated border-zinc-700 p-2 shadow-2xl z-50 space-y-1">
                <button
                  type="button"
                  onClick={() => handleDownloadResolution('Original-4K')}
                  className="w-full text-left p-2 rounded-xl hover:bg-zinc-800 text-xs text-white transition flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold">Original</span>
                  <span className="text-zinc-400 text-[10px]">4K UHD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadResolution('1080p')}
                  className="w-full text-left p-2 rounded-xl hover:bg-zinc-800 text-xs text-white transition flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold">1080p</span>
                  <span className="text-zinc-400 text-[10px]">Full HD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadResolution('720p')}
                  className="w-full text-left p-2 rounded-xl hover:bg-zinc-800 text-xs text-white transition flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold">720p</span>
                  <span className="text-zinc-400 text-[10px]">Web Optimized</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main High-Resolution Media Hero Display with OptimizedImage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl overflow-hidden glass-panel-elevated border-zinc-800 flex items-center justify-center bg-black/60 min-h-[400px] max-h-[82vh] p-2 sm:p-6"
      >
        <OptimizedImage
          src={photo.src}
          fallbackSrc={photo.fallbackSrc}
          alt={photo.title}
          dominantColor={photo.color || '#18181b'}
          className="max-w-full max-h-[78vh] flex items-center justify-center"
          imgClassName="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl"
        />
      </motion.div>

      {/* Media Details & Analytics EXIF Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Title, Story & Tags */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                {photo.category}
              </span>
              {photo.color && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs text-zinc-300">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: photo.color }} />
                  <span>Palette Mood</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {photo.title}
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {photo.description || "A curated photograph capturing ambient light and composition."}
            </p>
          </div>

          {/* Engagement Metrics Banner */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl glass-card">
            <div className="text-center">
              <p className="text-xl font-black text-white">{(photo.views || 3820).toLocaleString()}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Total Views</p>
            </div>
            <div className="text-center border-x border-zinc-800">
              <p className="text-xl font-black text-orange-400">{(photo.downloads || 940).toLocaleString()}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Downloads</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-rose-400">{(photo.likesCount || 180).toLocaleString()}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Community Likes</p>
            </div>
          </div>

          {/* Clickable Exploration Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Related Exploration Tags</h4>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onNavigate && onNavigate('gallery', { category: 'all', search: tag })}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium glass-pill text-zinc-300 hover:text-orange-400 hover:border-orange-500/50 transition cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Full Technical EXIF Information Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel-elevated border-zinc-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span>📷</span> Technical EXIF Specs
            </h3>
            <span className="text-[10px] font-bold text-emerald-400">Verified Capture</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Camera Body</span>
              <span className="text-zinc-200 font-bold">{photo.camera || "Sony Alpha A7 IV"}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Optics & Focal</span>
              <span className="text-zinc-200 font-bold">{photo.exif?.focalLength || "50mm Prime"}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Aperture</span>
              <span className="text-zinc-200 font-bold">{photo.exif?.aperture || "f/2.8"}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Shutter Speed</span>
              <span className="text-zinc-200 font-bold">{photo.exif?.exposureTime || "1/320s"}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">ISO Sensitivity</span>
              <span className="text-zinc-200 font-bold">ISO {photo.exif?.iso || 100}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Dimensions</span>
              <span className="text-zinc-200 font-bold">{photo.width || 3840} × {photo.height || 2160}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Resolution</span>
              <span className="text-orange-400 font-bold">{megapixels} Megapixels</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-zinc-400">Date Captured</span>
              <span className="text-zinc-200 font-bold">{photo.date}</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={photo.downloadSrc || photo.src}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-orange-400 hover:text-orange-300 font-bold text-xs uppercase tracking-wider text-center border border-zinc-800 transition"
            >
              Open Raw File
            </a>
          </div>
        </div>
      </div>

      {/* "More Like This" Section */}
      {relatedPhotos.length > 0 && (
        <div className="pt-12 border-t border-zinc-900 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Recommendations</span>
              <h2 className="text-2xl font-black text-white mt-0.5">More Like This</h2>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('gallery', { category: photo.category })}
              className="text-xs font-bold uppercase text-orange-400 hover:underline cursor-pointer"
            >
              View More in {photo.category} →
            </button>
          </div>

          <GalleryGrid
            photos={relatedPhotos}
            likes={likes}
            collections={collections}
            onToggleLike={toggleLike}
            onToggleCollection={toggleCollection}
            onDownloadPhoto={downloadPhoto}
            onSelectPhoto={(p) => onNavigate && onNavigate('photo', p.id)}
            layoutMode="grid"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoDetailPage;
