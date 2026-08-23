import React from 'react';
import Hero from '../components/Hero';
import GalleryGrid from '../components/GalleryGrid';
import { CATEGORIES } from '../data/photos';

const HomePage = ({ photos, onNavigate, onSelectPhoto }) => {
  const featuredPhotos = photos.filter((p) => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        onExplore={() => onNavigate('gallery')}
        featuredPhotos={featuredPhotos}
        onSelectPhoto={onSelectPhoto}
      />

      {/* Categories Preview Showcase */}
      <section className="py-16 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Browse By Theme
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Curated Albums & Chapters
            </h2>
            <p className="text-sm text-zinc-400">
              Select any collection to dive into specific themes and visual stories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
              const catPhotos = photos.filter((p) => p.category === cat.id);
              const previewPhoto = catPhotos[0];

              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('gallery', cat.id)}
                  className="group relative rounded-2xl overflow-hidden glass-card glass-card-hover border-zinc-800/80 p-5 text-left flex flex-col justify-between h-48 cursor-pointer"
                >
                  {/* Background Image Preview with Blur */}
                  {previewPhoto && (
                    <img
                      src={previewPhoto.src}
                      alt={cat.label}
                      onError={(e) => {
                        if (previewPhoto.fallbackSrc && e.target.src !== previewPhoto.fallbackSrc) {
                          e.target.src = previewPhoto.fallbackSrc;
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>

                  {/* Icon */}
                  <div className="relative z-10 w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-700/60 flex items-center justify-center text-xl shadow-lg">
                    {cat.icon}
                  </div>

                  {/* Label & Count */}
                  <div className="relative z-10">
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {catPhotos.length} Photos
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Photos Highlights */}
      <section id="featured" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Featured Photographs
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              A curated selection of standout shots and memorable frames.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl glass-card hover:bg-orange-500 hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>View All ({photos.length})</span>
            <span>→</span>
          </button>
        </div>

        <GalleryGrid photos={featuredPhotos} onSelectPhoto={onSelectPhoto} />
      </section>

      {/* Artist / Story Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-card border-orange-500/20 p-8 sm:p-12 lg:p-16">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
              About This Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Behind The Viewfinder
            </h2>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              Photography is about preserving the fleeting emotion of a split second — whether it's golden sun rays dancing across the Himalayas, quiet reflections in ancient alleyways, or the vivid lights of metropolitan nights.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('gallery')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition cursor-pointer"
              >
                Browse Complete Archive
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
