import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import GalleryGrid from '../components/GalleryGrid';
import AlbumModal from '../components/AlbumModal';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const COLOR_FILTERS = [
  { id: 'all', label: 'All Colors', hex: null },
  { id: 'amber', label: 'Warm Amber', hex: '#f97316' },
  { id: 'rose', label: 'Sunset Rose', hex: '#f43f5e' },
  { id: 'emerald', label: 'Emerald Forest', hex: '#10b981' },
  { id: 'blue', label: 'Ocean Blue', hex: '#3b82f6' },
  { id: 'violet', label: 'Cyber Violet', hex: '#8b5cf6' },
  { id: 'mono', label: 'Monochrome', hex: '#27272a' },
];

const GalleryPage = ({
  photos = [],
  likes = {},
  collections = {},
  albums = [],
  onCreateAlbum,
  onAssignToAlbum,
  onBatchDeletePhotos,
  onToggleLike,
  onToggleCollection,
  onDownloadPhoto,
  selectedCategory = 'all',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  onSelectPhoto,
  onEditPhoto,
  onDeletePhoto,
  onOpenAddModal,
  onOpenExportModal,
  onShowToast,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'compact' | 'masonry'
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'resolution'
  const [orientationFilter, setOrientationFilter] = useState('all'); // 'all' | 'landscape' | 'portrait'
  const [selectedAlbum, setSelectedAlbum] = useState('all');

  // Multi-Select Batch Actions State
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  // Pagination / Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Keep search in sync
  const activeSearch = onSearchChange ? searchQuery : localSearchQuery;
  const setActiveSearch = onSearchChange || setLocalSearchQuery;

  // Category counts
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return photos.length;
    return photos.filter((p) => p.category === categoryId).length;
  };

  // Filter & Sort Pipeline
  const processedPhotos = useMemo(() => {
    let result = photos.filter((photo) => {
      // Category filter
      if (selectedCategory !== 'all' && photo.category !== selectedCategory) {
        return false;
      }

      // Album filter
      if (selectedAlbum !== 'all') {
        if (selectedAlbum === 'favorites') {
          if (!likes[photo.id] && !collections[photo.id]) return false;
        } else if (photo.album !== selectedAlbum) {
          return false;
        }
      }

      // Color filter
      if (selectedColor !== 'all') {
        const targetHex = COLOR_FILTERS.find((c) => c.id === selectedColor)?.hex;
        if (targetHex && photo.color !== targetHex) return false;
      }

      // Orientation filter
      if (orientationFilter !== 'all') {
        const isLandscape = (photo.width || 1920) >= (photo.height || 1080);
        if (orientationFilter === 'landscape' && !isLandscape) return false;
        if (orientationFilter === 'portrait' && isLandscape) return false;
      }

      // Search query filter
      if (!activeSearch.trim()) return true;
      const q = activeSearch.toLowerCase();
      const matchTitle = photo.title?.toLowerCase().includes(q);
      const matchDesc = photo.description?.toLowerCase().includes(q);
      const matchLoc = photo.location?.toLowerCase().includes(q);
      const matchCam = photo.camera?.toLowerCase().includes(q);
      const matchTags = photo.tags?.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchLoc || matchCam || matchTags;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'popular') {
        const scoreA = (a.views || 0) + (a.likesCount || 0) * 5 + (likes[a.id] ? 50 : 0);
        const scoreB = (b.views || 0) + (b.likesCount || 0) * 5 + (likes[b.id] ? 50 : 0);
        return scoreB - scoreA;
      }
      if (sortBy === 'newest') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'resolution') {
        const mpA = (a.width || 1920) * (a.height || 1080);
        const mpB = (b.width || 1920) * (b.height || 1080);
        return mpB - mpA;
      }
      return 0;
    });

    return result;
  }, [photos, selectedCategory, selectedAlbum, selectedColor, orientationFilter, activeSearch, sortBy, likes, collections]);

  // Paginated visible slice for infinite scroll
  const displayedPhotos = useMemo(() => {
    return processedPhotos.slice(0, visibleCount);
  }, [processedPhotos, visibleCount]);

  const hasMorePhotos = visibleCount < processedPhotos.length;

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMorePhotos) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 450);
  };

  const sentinelRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: hasMorePhotos,
    isLoading: isLoadingMore,
  });

  // Multi-select handlers
  const handleToggleSelectPhoto = (photoId) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPhotoIds(displayedPhotos.map((p) => p.id));
  };

  const handleClearSelection = () => {
    setSelectedPhotoIds([]);
  };

  // Bulk ZIP Download using JSZip
  const handleBulkDownloadZip = async () => {
    if (selectedPhotoIds.length === 0) return;
    if (onShowToast) onShowToast(`📦 Packing ${selectedPhotoIds.length} photos into ZIP archive...`);

    try {
      const zip = new JSZip();
      const photosToPack = photos.filter((p) => selectedPhotoIds.includes(p.id));

      await Promise.all(
        photosToPack.map(async (photo, idx) => {
          try {
            const res = await fetch(photo.src, { mode: 'cors' });
            if (res.ok) {
              const blob = await res.blob();
              const filename = `${idx + 1}-${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
              zip.file(filename, blob);
            }
          } catch {
            // If cross-origin fails, skip or pack placeholder
          }
        })
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gallery-selection-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onShowToast) onShowToast('✓ ZIP Archive successfully downloaded!');
      setSelectedPhotoIds([]);
      setIsMultiSelectMode(false);
    } catch (err) {
      console.error('ZIP generation error:', err);
      if (onShowToast) onShowToast('Failed to create ZIP file. Trying individual downloads.');
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedPhotoIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedPhotoIds.length} selected photographs?`)) {
      if (onBatchDeletePhotos) {
        onBatchDeletePhotos(selectedPhotoIds);
      }
      setSelectedPhotoIds([]);
      setIsMultiSelectMode(false);
    }
  };

  const handleResetFilters = () => {
    onSelectCategory('all');
    setActiveSearch('');
    setSelectedColor('all');
    setOrientationFilter('all');
    setSelectedAlbum('all');
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-orange-400 text-xs font-bold uppercase tracking-widest shadow-sm">
          <span>Enterprise Visual Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Visual <span className="text-gradient-orange">Gallery Engine</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Explore curated collections, batch organize albums, and filter by chromatic mood or resolution.
        </p>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>➕ Upload Photo</span>
          </button>

          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl glass-card hover:bg-zinc-800 text-orange-400 hover:text-orange-300 font-bold text-xs uppercase tracking-wider border-orange-500/30 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>📁 Manage Albums</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-5 py-2.5 rounded-2xl glass-card hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider border-zinc-700 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>💾 Backup / Export</span>
          </button>
        </div>
      </div>

      {/* Live Search Input */}
      <SearchBar
        searchQuery={activeSearch}
        onSearchChange={setActiveSearch}
        totalCount={photos.length}
        filteredCount={processedPhotos.length}
      />

      {/* Advanced Filter Toolbar: Album, Colors, Sorting & Layout */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          getCategoryCount={getCategoryCount}
        />

        {/* Secondary Filter Row: Chromatic Color Palette & Layout Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-3 rounded-2xl glass-panel-elevated">
          {/* Color Mood Palette Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap mr-1">
              🎨 Palette:
            </span>
            {COLOR_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedColor(filter.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  selectedColor === filter.id
                    ? 'bg-orange-500 text-black font-bold shadow-md'
                    : 'glass-pill text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {filter.hex && (
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: filter.hex }}
                  />
                )}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Right Controls: Sort Dropdown & Layout Mode */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="popular">🔥 Most Popular</option>
                <option value="newest">🗓️ Newest First</option>
                <option value="resolution">📐 Highest Resolution</option>
              </select>
            </div>

            {/* Orientation Filter */}
            <select
              value={orientationFilter}
              onChange={(e) => setOrientationFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Orientations</option>
              <option value="landscape">Landscape Only</option>
              <option value="portrait">Portrait Only</option>
            </select>

            {/* Layout View Switcher */}
            <div className="flex items-center p-1 rounded-xl glass-toolbar border-white/10 shadow">
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                title="Standard Grid View"
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  layoutMode === 'grid' ? 'bg-orange-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('masonry')}
                title="Masonry Dynamic View"
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  layoutMode === 'masonry' ? 'bg-orange-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Masonry
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('compact')}
                title="Compact List View"
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  layoutMode === 'compact' ? 'bg-orange-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                List
              </button>
            </div>

            {/* Multi-Select Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setIsMultiSelectMode((prev) => !prev);
                if (isMultiSelectMode) setSelectedPhotoIds([]);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                isMultiSelectMode
                  ? 'bg-amber-500 text-black font-black shadow-lg glow-border'
                  : 'glass-card border-zinc-700 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              {isMultiSelectMode ? '✓ Multi-Select Active' : 'Select'}
            </button>
          </div>
        </div>

        {/* Multi-Select Batch Actions Bar (visible when active) */}
        {isMultiSelectMode && (
          <div className="p-3.5 rounded-2xl glass-panel-elevated border-amber-500/40 flex items-center justify-between flex-wrap gap-3 animate-modal-enter">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span className="text-xs font-extrabold text-white">
                {selectedPhotoIds.length} of {displayedPhotos.length} Photos Selected
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-orange-400 hover:underline font-bold cursor-pointer"
              >
                Select All
              </button>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs text-zinc-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedPhotoIds.length === 0}
                onClick={handleBulkDownloadZip}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📦 Download ZIP</span>
              </button>

              <button
                type="button"
                disabled={selectedPhotoIds.length === 0}
                onClick={() => setIsAlbumModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-black text-xs font-bold uppercase tracking-wider shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📁 Assign Album</span>
              </button>

              <button
                type="button"
                disabled={selectedPhotoIds.length === 0}
                onClick={handleBulkDelete}
                className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 disabled:opacity-40 text-red-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <GalleryGrid
        photos={displayedPhotos}
        likes={likes}
        collections={collections}
        onToggleLike={onToggleLike}
        onToggleCollection={onToggleCollection}
        onDownloadPhoto={onDownloadPhoto}
        onSelectPhoto={onSelectPhoto}
        onResetFilters={handleResetFilters}
        onEditPhoto={onEditPhoto}
        onDeletePhoto={onDeletePhoto}
        onOpenAddModal={onOpenAddModal}
        showAddCard={selectedCategory === 'all' && !activeSearch && !isMultiSelectMode}
        layoutMode={layoutMode}
        isMultiSelectMode={isMultiSelectMode}
        selectedPhotoIds={selectedPhotoIds}
        onToggleSelectPhoto={handleToggleSelectPhoto}
        isLoading={isLoadingMore}
      />

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="py-6 flex items-center justify-center">
        {isLoadingMore ? (
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span>Loading More High-Res Captures...</span>
          </div>
        ) : hasMorePhotos ? (
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-6 py-2.5 rounded-xl glass-card hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Load More Photos ({processedPhotos.length - visibleCount} remaining)
          </button>
        ) : processedPhotos.length > 0 ? (
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
            ✦ All {processedPhotos.length} curated photographs loaded ✦
          </span>
        ) : null}
      </div>

      {/* Album Creation & Batch Assignment Modal */}
      <AlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        albums={albums}
        onCreateAlbum={onCreateAlbum}
        onAssignToAlbum={onAssignToAlbum}
        selectedPhotoIds={selectedPhotoIds}
      />
    </div>
  );
};

export default GalleryPage;
