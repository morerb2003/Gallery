import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import GalleryGrid from '../components/GalleryGrid';

const GalleryPage = ({
  photos,
  likes = {},
  collections = {},
  onToggleLike,
  onToggleCollection,
  onDownloadPhoto,
  selectedCategory,
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  onSelectPhoto,
  onEditPhoto,
  onDeletePhoto,
  onOpenAddModal,
  onOpenExportModal,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'compact' | 'masonry'

  // Keep search in sync if prop changes
  const activeSearch = onSearchChange ? searchQuery : localSearchQuery;
  const setActiveSearch = onSearchChange || setLocalSearchQuery;

  // Calculate count per category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return photos.length;
    return photos.filter((p) => p.category === categoryId).length;
  };

  // Filter photos based on category and search query
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesCategory =
        selectedCategory === 'all' || photo.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!activeSearch.trim()) return true;

      const q = activeSearch.toLowerCase();
      const matchTitle = photo.title?.toLowerCase().includes(q);
      const matchDesc = photo.description?.toLowerCase().includes(q);
      const matchLoc = photo.location?.toLowerCase().includes(q);
      const matchCam = photo.camera?.toLowerCase().includes(q);
      const matchTags = photo.tags?.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchLoc || matchCam || matchTags;
    });
  }, [photos, selectedCategory, activeSearch]);

  const handleResetFilters = () => {
    onSelectCategory('all');
    setActiveSearch('');
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-orange-400 text-xs font-bold uppercase tracking-widest shadow-sm">
          <span>Manage & Browse Archives</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Visual <span className="text-gradient-orange">Gallery</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Filter by album theme, toggle view modes, or upload high-resolution captures.
        </p>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>➕ Upload Photo</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-5 py-2.5 rounded-2xl glass-card hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider border-zinc-700 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>💾 Backup / Export</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <SearchBar
        searchQuery={activeSearch}
        onSearchChange={setActiveSearch}
        totalCount={photos.length}
        filteredCount={filteredPhotos.length}
      />

      {/* Category Pills & Layout Mode Switcher Toolbar */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto overflow-x-auto">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            getCategoryCount={getCategoryCount}
          />
        </div>

        {/* Layout Mode Switcher */}
        <div className="flex items-center p-1 rounded-2xl glass-toolbar border-white/10 shadow-lg flex-shrink-0">
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            title="Standard Grid View"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              layoutMode === 'grid'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('compact')}
            title="Compact Micro-Grid View"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              layoutMode === 'compact'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM2 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zM8 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1v-2zM14 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM2 16a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zM8 16a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1v-2zM14 16a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
            </svg>
            <span>Compact</span>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('masonry')}
            title="Masonry Natural Flow View"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              layoutMode === 'masonry'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span>Masonry</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid with Framer Motion & Layout Switching */}
      <GalleryGrid
        photos={filteredPhotos}
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
        showAddCard={selectedCategory === 'all' && !activeSearch}
        layoutMode={layoutMode}
      />
    </div>
  );
};

export default GalleryPage;
