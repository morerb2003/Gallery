import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.25 },
  },
};

const GalleryGrid = ({
  photos = [],
  likes = {},
  collections = {},
  onToggleLike,
  onToggleCollection,
  onDownloadPhoto,
  onSelectPhoto,
  onResetFilters,
  onEditPhoto,
  onDeletePhoto,
  onOpenAddModal,
  showAddCard = false,
  layoutMode = 'grid', // 'grid' | 'compact' | 'masonry'
}) => {
  if (photos.length === 0 && !showAddCard) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="py-24 text-center space-y-4"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-center text-3xl shadow-xl">
          🔍
        </div>
        <h3 className="text-2xl font-extrabold text-white">No photographs found</h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          We couldn't find any shots matching your current search criteria or category filter.
        </p>
        <div className="flex items-center justify-center gap-3 pt-3">
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-orange-500/20 active:scale-95"
            >
              Reset Filters
            </button>
          )}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-6 py-3 rounded-xl glass-card hover:bg-zinc-800/80 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer border-zinc-700 active:scale-95"
            >
              + Upload New Photo
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Determine wrapper class based on active layout
  let wrapperClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
  if (layoutMode === 'compact') {
    wrapperClass = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4';
  } else if (layoutMode === 'masonry') {
    wrapperClass = 'masonry-columns';
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={wrapperClass}
    >
      {/* Quick Add Photo Card (if enabled) */}
      {showAddCard && onOpenAddModal && (
        <motion.div
          variants={cardVariants}
          layout
          onClick={onOpenAddModal}
          className={`group relative rounded-3xl overflow-hidden border-2 border-dashed border-zinc-800 hover:border-orange-500/60 bg-zinc-950/40 hover:bg-orange-500/5 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
            layoutMode === 'masonry' ? 'masonry-item min-h-[280px]' : layoutMode === 'compact' ? 'min-h-[160px]' : 'min-h-[260px]'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 group-hover:bg-orange-500/25 border border-orange-500/30 flex items-center justify-center text-xl text-orange-400 group-hover:scale-110 transition-transform mb-3">
            ➕
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
            Upload Photo
          </h4>
          <p className="text-[11px] text-zinc-400 mt-1 max-w-[160px]">
            Add from URL or device
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {photos.map((photo, index) => {
          const isLiked = !!likes[photo.id];
          const isCollected = !!collections[photo.id];

          return (
            <motion.div
              key={photo.id}
              variants={cardVariants}
              layout
              className={`group relative rounded-3xl overflow-hidden glass-card glass-card-hover border border-zinc-800/80 hover:border-orange-500/50 shine-overlay ${
                layoutMode === 'masonry' ? 'masonry-item' : ''
              }`}
            >
              {/* Image Stage Container */}
              <div
                onClick={() => onSelectPhoto(photo)}
                className={`w-full overflow-hidden bg-zinc-950 relative cursor-pointer ${
                  layoutMode === 'compact'
                    ? 'aspect-square'
                    : layoutMode === 'masonry'
                    ? index % 3 === 0
                      ? 'aspect-[3/4]'
                      : index % 2 === 0
                      ? 'aspect-[4/5]'
                      : 'aspect-[4/3]'
                    : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  onError={(e) => {
                    if (photo.fallbackSrc && e.target.src !== photo.fallbackSrc) {
                      e.target.src = photo.fallbackSrc;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-black/30 opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"></div>

                {/* Top Badges & Status Indicators */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900/80 text-zinc-300 backdrop-blur-md border border-white/10 shadow-sm">
                    {photo.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isLiked && (
                      <span className="w-6 h-6 rounded-full bg-rose-500/90 text-white flex items-center justify-center text-[10px] shadow-lg animate-heart-pop">
                        ❤️
                      </span>
                    )}
                    {isCollected && (
                      <span className="w-6 h-6 rounded-full bg-amber-500/90 text-black flex items-center justify-center text-[10px] shadow-lg">
                        🔖
                      </span>
                    )}
                    {photo.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
                        ★ Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Micro-Interaction Action Toolbar */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                  <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-toolbar border-white/15 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                    {/* Quick View Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPhoto(photo);
                      }}
                      title="Quick View Lightbox"
                      className="w-9 h-9 rounded-xl bg-zinc-800/80 hover:bg-orange-500 text-zinc-200 hover:text-black flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shadow active:scale-90"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* Like Button */}
                    <button
                      type="button"
                      onClick={(e) => onToggleLike && onToggleLike(photo.id, e)}
                      title={isLiked ? "Unlike Photo" : "Like Photo"}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shadow active:scale-90 ${
                        isLiked
                          ? 'bg-rose-500 text-white shadow-rose-500/40 shadow-lg'
                          : 'bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Add to Collection Button */}
                    <button
                      type="button"
                      onClick={(e) => onToggleCollection && onToggleCollection(photo.id, e)}
                      title={isCollected ? "Remove from Collection" : "Save to Collection"}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shadow active:scale-90 ${
                        isCollected
                          ? 'bg-amber-500 text-black shadow-amber-500/40 shadow-lg'
                          : 'bg-zinc-800/80 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={isCollected ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>

                    {/* Download Button */}
                    <button
                      type="button"
                      onClick={(e) => onDownloadPhoto && onDownloadPhoto(photo, e)}
                      title="Download Image"
                      className="w-9 h-9 rounded-xl bg-zinc-800/80 hover:bg-emerald-500 text-zinc-300 hover:text-black flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shadow active:scale-90"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Card Content Info Bar */}
              <div className={`bg-zinc-950/90 flex items-center justify-between gap-2 border-t border-zinc-800/60 ${
                layoutMode === 'compact' ? 'p-2.5' : 'p-4'
              }`}>
                <div
                  onClick={() => onSelectPhoto(photo)}
                  className="flex-1 min-w-0 space-y-0.5 cursor-pointer"
                >
                  <h4 className={`font-bold text-white group-hover:text-orange-400 transition-colors truncate ${
                    layoutMode === 'compact' ? 'text-xs' : 'text-sm sm:text-base'
                  }`}>
                    {photo.title}
                  </h4>
                  {layoutMode !== 'compact' && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="truncate max-w-[140px]">{photo.location || photo.date}</span>
                    </div>
                  )}
                </div>

                {/* Quick Edit & Delete Admin Controls */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {onEditPhoto && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPhoto(photo);
                      }}
                      title="Edit Photo"
                      className="w-7 h-7 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-orange-400 border border-zinc-800 flex items-center justify-center text-xs transition cursor-pointer"
                    >
                      ✏️
                    </button>
                  )}
                  {onDeletePhoto && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePhoto(photo);
                      }}
                      title="Delete Photo"
                      className="w-7 h-7 rounded-lg bg-zinc-900/90 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 flex items-center justify-center text-xs transition cursor-pointer"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryGrid;
