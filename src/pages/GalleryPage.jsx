import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import GalleryGrid from '../components/GalleryGrid';

const GalleryPage = ({
  photos,
  selectedCategory,
  onSelectCategory,
  onSelectPhoto,
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
          <span>Explore All Collections</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Visual <span className="text-gradient-orange">Gallery</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Filter by theme or search through individual stories, shot locations, and cameras.
        </p>
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
      />
    </div>
  );
};

export default GalleryPage;
