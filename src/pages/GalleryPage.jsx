import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import GalleryGrid from '../components/GalleryGrid';

const GalleryPage = ({
  photos,
  selectedCategory,
  onSelectCategory,
  onSelectPhoto,
  onEditPhoto,
  onDeletePhoto,
  onOpenAddModal,
  onOpenExportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = photo.title?.toLowerCase().includes(q);
      const matchDesc = photo.description?.toLowerCase().includes(q);
      const matchLoc = photo.location?.toLowerCase().includes(q);
      const matchCam = photo.camera?.toLowerCase().includes(q);
      const matchTags = photo.tags?.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchLoc || matchCam || matchTags;
    });
  }, [photos, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-orange-400 text-xs font-bold uppercase tracking-widest">
          <span>Manage & Browse Albums</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Visual <span className="text-gradient-orange">Gallery</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Filter by album theme, search shot details, or upload new photographs.
        </p>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center gap-2"
          >
            <span>➕ Upload Photo</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-5 py-2.5 rounded-2xl glass-card hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider border-zinc-700 transition cursor-pointer flex items-center gap-2"
          >
            <span>💾 Backup / Export</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={photos.length}
        filteredCount={filteredPhotos.length}
      />

      {/* Category Pills */}
      <div className="mb-10">
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          getCategoryCount={getCategoryCount}
        />
      </div>

      {/* Gallery Grid */}
      <GalleryGrid
        photos={filteredPhotos}
        onSelectPhoto={onSelectPhoto}
        onResetFilters={handleResetFilters}
        onEditPhoto={onEditPhoto}
        onDeletePhoto={onDeletePhoto}
        onOpenAddModal={onOpenAddModal}
        showAddCard={selectedCategory === 'all' && !searchQuery}
      />
    </div>
  );
};

export default GalleryPage;
