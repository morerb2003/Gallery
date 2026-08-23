import React from 'react';

const GalleryGrid = ({
  photos,
  onSelectPhoto,
  onResetFilters,
  onEditPhoto,
  onDeletePhoto,
  onOpenAddModal,
  showAddCard = false,
}) => {
  if (photos.length === 0 && !showAddCard) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl">
          🔍
        </div>
        <h3 className="text-xl font-bold text-white">No photos found</h3>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          We couldn't find any photos matching your current search or category filter.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow"
            >
              Reset Filters
            </button>
          )}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 rounded-xl glass-card hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer border-zinc-700"
            >
              + Add New Photo
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Quick Add Photo Card (if enabled) */}
      {showAddCard && onOpenAddModal && (
        <div
          onClick={onOpenAddModal}
          className="group relative rounded-3xl overflow-hidden border-2 border-dashed border-zinc-800 hover:border-orange-500/60 bg-zinc-950/40 hover:bg-orange-500/5 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[260px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-500/15 group-hover:bg-orange-500/25 border border-orange-500/30 flex items-center justify-center text-2xl text-orange-400 group-hover:scale-110 transition-transform mb-3">
            ➕
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
            Add New Photo
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-[180px]">
            Upload from device or enter image URL
          </p>
        </div>
      )}

      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer border border-zinc-800/80 hover:border-orange-500/50"
        >
          {/* Image Container */}
          <div
            onClick={() => onSelectPhoto(photo)}
            className="aspect-[4/3] w-full overflow-hidden bg-zinc-900 relative"
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
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>

            {/* Badges on top */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900/80 text-zinc-300 backdrop-blur-md border border-zinc-700/60">
                {photo.category}
              </span>
              {photo.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
                  ★ Featured
                </span>
              )}
            </div>

            {/* Hover Center Expand Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-orange-500/90 text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Card Content & Quick Action Buttons */}
          <div className="p-4 bg-zinc-950/90 flex items-center justify-between gap-2">
            <div
              onClick={() => onSelectPhoto(photo)}
              className="flex-1 min-w-0 space-y-1 cursor-pointer"
            >
              <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                {photo.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="truncate max-w-[130px]">{photo.location || photo.date}</span>
              </div>
            </div>

            {/* Quick Card Controls (Edit & Delete) */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              {onEditPhoto && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPhoto(photo);
                  }}
                  title="Edit Photo"
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-orange-400 border border-zinc-800 flex items-center justify-center text-xs transition cursor-pointer"
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
                  className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 flex items-center justify-center text-xs transition cursor-pointer"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
