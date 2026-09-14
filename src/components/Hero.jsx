import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRENDING_TAGS = [
  'Portrait',
  'Sunset',
  'Architecture',
  'Nature',
  'Cyberpunk',
  'Coffee',
  'Minimal',
  'Street',
];

const Hero = ({
  onExplore,
  featuredPhotos = [],
  onSelectPhoto,
  allPhotos = [],
  onTagClick,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter live suggestions based on hero search query
  const suggestions = React.useMemo(() => {
    if (!heroSearch.trim()) return [];
    const q = heroSearch.toLowerCase();
    return allPhotos
      .filter((photo) => {
        const matchTitle = photo.title?.toLowerCase().includes(q);
        const matchDesc = photo.description?.toLowerCase().includes(q);
        const matchLoc = photo.location?.toLowerCase().includes(q);
        const matchCat = photo.category?.toLowerCase().includes(q);
        const matchTags = photo.tags?.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchLoc || matchCat || matchTags;
      })
      .slice(0, 5);
  }, [heroSearch, allPhotos]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onTagClick && heroSearch.trim()) {
      onTagClick(heroSearch.trim());
    } else if (onExplore) {
      onExplore();
    }
    setIsDropdownOpen(false);
  };

  const handleSelectSuggestion = (photo) => {
    setIsDropdownOpen(false);
    onSelectPhoto(photo);
  };

  const handleTagPillClick = (tag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const mainFeatured = featuredPhotos.length > 0 ? featuredPhotos[0] : allPhotos[0];
  const secondaryFeatured = featuredPhotos.length > 1 ? featuredPhotos[1] : allPhotos[1];

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Dynamic Ambient Background Glows & Floating Glass Tiles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-orange-600/15 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-28 right-1/4 w-[500px] h-[500px] bg-amber-500/12 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-2xl"></div>

        {/* Ambient Floating Mini Glass Geometry */}
        <div className="hidden lg:block absolute top-24 left-10 w-24 h-24 rounded-2xl glass-card border-white/5 rotate-12 animate-float opacity-30"></div>
        <div className="hidden lg:block absolute bottom-20 right-12 w-28 h-28 rounded-3xl glass-card border-white/5 -rotate-6 animate-float-slow opacity-25"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Live Search Hero & Tag Pills */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-500/5"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span>Next-Gen Visual Archive</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
                Capturing Light, <br className="hidden sm:inline" />
                <span className="text-gradient-orange">Framing Stories</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover curated high-definition photography across travel, urban landscapes, portraits, and abstract visions with fluid motion and instant search.
              </p>
            </motion.div>

            {/* Live Search Hero Bar with Suggestions Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              ref={searchContainerRef}
              className="relative max-w-xl mx-auto lg:mx-0 z-30"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <div className="absolute left-4.5 text-zinc-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => {
                      setHeroSearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search shots by title, city, camera, or mood..."
                    className="w-full pl-12 pr-28 py-4 rounded-2xl glass-panel-elevated text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/25 transition-all shadow-2xl"
                  />
                  {heroSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setHeroSearch('');
                        setIsDropdownOpen(false);
                      }}
                      className="absolute right-24 text-zinc-400 hover:text-white p-1 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-orange-500/30 transition-all cursor-pointer active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Live Search Suggestions Drop-down */}
              <AnimatePresence>
                {isDropdownOpen && heroSearch.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2.5 rounded-2xl glass-panel-elevated border-zinc-700/80 p-3 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      <span>Matching Photographs ({suggestions.length})</span>
                      <span className="text-orange-400">Click to view</span>
                    </div>

                    {suggestions.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-400">
                        No immediate matches. Press <span className="text-white font-bold">Search</span> to query the full gallery.
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-800/60 mt-1 max-h-72 overflow-y-auto">
                        {suggestions.map((photo) => (
                          <div
                            key={photo.id}
                            onClick={() => handleSelectSuggestion(photo)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              onError={(e) => {
                                if (photo.fallbackSrc && e.target.src !== photo.fallbackSrc) {
                                  e.target.src = photo.fallbackSrc;
                                }
                              }}
                              className="w-12 h-12 rounded-lg object-cover bg-zinc-900 flex-shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                                {photo.title}
                              </h5>
                              <p className="text-xs text-zinc-400 truncate">
                                <span className="capitalize text-orange-400/90">{photo.category}</span>
                                {photo.location && ` • ${photo.location}`}
                              </p>
                            </div>
                            <span className="text-xs text-zinc-400 group-hover:text-orange-400 transition-colors font-bold pr-1">
                              →
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full mt-2 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-orange-400 hover:text-orange-300 text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer"
                    >
                      View All Search Results in Gallery
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Trending Tag Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-2 pt-1"
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <span>🔥 Trending Themes:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagPillClick(tag)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium glass-pill text-zinc-300 hover:text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-bold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 group"
              >
                <span>Explore Full Gallery</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href="#featured"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-card text-zinc-200 font-semibold text-base hover:text-white hover:border-zinc-600 hover:bg-zinc-800/60 transition-all text-center"
              >
                View Highlights
              </a>
            </motion.div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{allPhotos.length || '20'}+</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">High-Res Shots</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">5</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Thematic Albums</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">4K</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Ultra Quality</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Interactive Visual Cards Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Back Card Decoration with Subtle Rotation */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-orange-500/20 transform -rotate-3 scale-95 pointer-events-none"></div>

              {/* Main Featured Photo Card */}
              {mainFeatured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  onClick={() => onSelectPhoto(mainFeatured)}
                  className="relative group rounded-3xl overflow-hidden glass-panel-elevated border-zinc-700/60 shadow-2xl cursor-pointer hover:border-orange-500/60 transition-all duration-500 shine-overlay"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={mainFeatured.src}
                      alt={mainFeatured.title}
                      onError={(e) => {
                        if (mainFeatured.fallbackSrc && e.target.src !== mainFeatured.fallbackSrc) {
                          e.target.src = mainFeatured.fallbackSrc;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider glass-pill text-zinc-200">
                      {mainFeatured.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg">
                      ★ Featured
                    </span>
                  </div>

                  {/* Bottom details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                      {mainFeatured.location || "Curated Location"}
                    </span>
                    <h3 className="text-2xl font-black text-white group-hover:text-orange-300 transition-colors">
                      {mainFeatured.title}
                    </h3>
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {mainFeatured.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Floating Mini Companion Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-4 sm:-left-8 glass-panel-elevated border-zinc-700 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-float">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-lg shadow-inner">
                  ✨
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Full-Screen Cinema Lightbox</p>
                  <p className="text-[11px] text-zinc-400">Click photo or press 'F' in viewer</p>
                </div>
              </div>

              {/* Secondary Floating Thumbnail preview */}
              {secondaryFeatured && (
                <div
                  onClick={() => onSelectPhoto(secondaryFeatured)}
                  className="hidden sm:flex absolute -top-8 -right-6 glass-panel-elevated p-2 rounded-2xl shadow-2xl items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform group animate-float-slow"
                >
                  <img
                    src={secondaryFeatured.src}
                    alt={secondaryFeatured.title}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="pr-2">
                    <p className="text-[10px] text-orange-400 font-bold uppercase">Trending</p>
                    <p className="text-xs font-bold text-white group-hover:text-orange-300 truncate max-w-[100px]">
                      {secondaryFeatured.title}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
