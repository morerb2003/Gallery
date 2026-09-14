import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.2 },
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
  isMultiSelectMode = false,
  selectedPhotoIds = [],
  onToggleSelectPhoto,
  isLoading = false,
}) => {
  if (photos.length === 0 && !showAddCard && !isLoading) {
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
          We couldn't find any shots matching your current search criteria, dominant color, or category filter.
        </p>
        <div className="flex items-center justify-center gap-3 pt-3">
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-orange-500/20 active:scale-95"
            >
              Reset Filters
            </button>
          )}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-6 py-3 rounded-xl glass-card hover:bg-zinc-800/80 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer border-zinc-700 active:scale-95"
            >
              + Upload Photo
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Determine grid container wrapper class
  let wrapperClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
  if (layoutMode === 'compact') {
    wrapperClass = 'space-y-3'; // Compact List view
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
      {/* Quick Add Photo Card */}
      {showAddCard && onOpenAddModal && layoutMode !== 'compact' && (
        <motion.div
          variants={cardVariants}
          layout
          onClick={onOpenAddModal}
          className={`group relative rounded-3xl overflow-hidden border-2 border-dashed border-zinc-800 hover:border-orange-500/60 bg-zinc-950/40 hover:bg-orange-500/5 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
            layoutMode === 'masonry' ? 'masonry-item min-h-[280px]' : 'min-h-[260px]'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 group-hover:bg-orange-500/25 border border-orange-500/30 flex items-center justify-center text-xl text-orange-400 group-hover:scale-110 transition-transform mb-3">
            ➕
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
            Upload Photo
          </h4>
          <p className="text-[11px] text-zinc-400 mt-1 max-w-[160px]">
            Drag & drop or Cloudinary
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {photos.map((photo, index) => {
          const isLiked = !!likes[photo.id];
          const isCollected = !!collections[photo.id];
          const isSelected = selectedPhotoIds.includes(photo.id);

          // Render Compact List Item View
          if (layoutMode === 'compact') {
            return (
              <motion.div
                key={photo.id}
                variants={cardVariants}
                layout
                onClick={() => {
                  if (isMultiSelectMode && onToggleSelectPhoto) {
                    onToggleSelectPhoto(photo.id);
                  } else {
                    onSelectPhoto(photo);
                  }
                }}
                className={`group rounded-2xl overflow-hidden glass-card p-3 flex items-center justify-between gap-4 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/10 shadow-lg glow-border'
                    : 'border-zinc-800/80 hover:border-orange-500/50 hover:bg-zinc-900/60'
                }`}
              >
                {/* Left: Checkbox + Thumbnail + Title */}
                <div className="flex items-center gap-3 min-w-0">
                  {isMultiSelectMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (onToggleSelectPhoto) onToggleSelectPhoto(photo.id);
                      }}
                      className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                  )}

                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 relative">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {photo.color && (
                      <span
                        className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white/30"
                        style={{ backgroundColor: photo.color }}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                      <span className="capitalize text-orange-400/90 font-medium">{photo.category}</span>
                      <span>•</span>
                      <span>{photo.location || photo.date}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Stats & Quick Actions */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400 font-medium">
                    <span>👁️ {(photo.views || 1800).toLocaleString()}</span>
                    <span>⬇️ {(photo.downloads || 320).toLocaleString()}</span>
                    {isLiked && <span className="text-rose-500 font-bold">❤️ Liked</span>}
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => onToggleLike && onToggleLike(photo.id, e)}
                      title="Like"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition cursor-pointer ${
                        isLiked ? 'bg-rose-500 text-white' : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {isLiked ? '❤️' : '🤍'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => onDownloadPhoto && onDownloadPhoto(photo, e)}
                      title="Download"
                      className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-emerald-600 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          }

          // Render Grid / Masonry View Card
          return (
            <motion.div
              key={photo.id}
              variants={cardVariants}
              layout
              className={`group relative rounded-3xl overflow-hidden glass-card glass-card-hover border transition-all shine-overlay ${
                isSelected
                  ? 'border-orange-500 shadow-2xl glow-border scale-[1.01]'
                  : 'border-zinc-800/80 hover:border-orange-500/50'
              } ${layoutMode === 'masonry' ? 'masonry-item' : ''}`}
            >
              {/* Image Container */}
              <div
                onClick={() => {
                  if (isMultiSelectMode && onToggleSelectPhoto) {
                    onToggleSelectPhoto(photo.id);
                  } else {
                    onSelectPhoto(photo);
                  }
                }}
                className={`w-full overflow-hidden bg-zinc-950 relative cursor-pointer ${
                  layoutMode === 'masonry'
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

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/35 opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"></div>

                {/* Top Badges & Select Checkbox */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    {isMultiSelectMode ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleSelectPhoto) onToggleSelectPhoto(photo.id);
                        }}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center cursor-pointer transition ${
                          isSelected
                            ? 'bg-orange-500 border-orange-400 text-black font-bold text-xs shadow-md'
                            : 'bg-black/60 backdrop-blur-md border-white/30 text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900/85 text-zinc-300 backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-1.5">
                        {photo.color && (
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: photo.color }}
                          />
                        )}
                        <span>{photo.category}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pointer-events-none">
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

                {/* Hover Action Overlay Toolbar */}
                {!isMultiSelectMode && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-toolbar border-white/15 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPhoto(photo);
                        }}
                        title="Quick View Lightbox"
                        className="w-9 h-9 rounded-xl bg-zinc-800/80 hover:bg-orange-500 text-zinc-200 hover:text-black flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shadow active:scale-90"
                      >
                        🔍
                      </button>

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
                        {isLiked ? '❤️' : '🤍'}
                      </button>

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
                        {isCollected ? '🔖' : '📑'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => onDownloadPhoto && onDownloadPhoto(photo, e)}
                        title="Download Image"
                        className="w-9 h-9 rounded-xl bg-zinc-800/80 hover:bg-emerald-500 text-zinc-300 hover:text-black flex items-center justify-center text-sm transition-all duration-200 cursor-pointer shadow active:scale-90"
                      >
                        ⬇️
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Content Info Bar */}
              <div className="p-4 bg-zinc-950/90 flex items-center justify-between gap-2 border-t border-zinc-800/60">
                <div
                  onClick={() => {
                    if (isMultiSelectMode && onToggleSelectPhoto) {
                      onToggleSelectPhoto(photo.id);
                    } else {
                      onSelectPhoto(photo);
                    }
                  }}
                  className="flex-1 min-w-0 space-y-0.5 cursor-pointer"
                >
                  <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate text-sm sm:text-base">
                    {photo.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="truncate max-w-[140px]">{photo.location || photo.date}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[11px] text-zinc-500">{(photo.views || 2400).toLocaleString()} views</span>
                  </div>
                </div>

                {/* Edit & Delete Controls */}
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

      {/* Skeleton Loading Cards (shown when fetching infinite pages) */}
      {isLoading && (
        <>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-3xl overflow-hidden glass-card border border-zinc-800/60 p-4 space-y-3 animate-pulse"
            >
              <div className="w-full aspect-[4/3] rounded-2xl bg-zinc-900/90"></div>
              <div className="h-4 bg-zinc-800/80 rounded-md w-3/4"></div>
              <div className="h-3 bg-zinc-900 rounded-md w-1/2"></div>
            </div>
          ))}
        </>
      )}
    </motion.div>
  );
};

export default GalleryGrid;
