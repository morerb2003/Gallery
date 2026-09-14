import React from 'react';
import Hero from '../components/Hero';
import GalleryGrid from '../components/GalleryGrid';
import { CATEGORIES } from '../data/photos';

const FEATURED_CREATORS = [
  {
    id: 'c1',
    name: 'Elena Rostova',
    handle: '@elena_light',
    location: 'Berlin, Germany',
    followers: '14.2k',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    topShot: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    badge: 'Pro Landscape',
  },
  {
    id: 'c2',
    name: 'Marcus Vance',
    handle: '@vance_street',
    location: 'Tokyo, Japan',
    followers: '28.9k',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    topShot: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
    badge: 'Cyberpunk & Night',
  },
  {
    id: 'c3',
    name: 'Aria Montgomery',
    handle: '@aria_nature',
    location: 'Vancouver, Canada',
    followers: '19.5k',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    topShot: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
    badge: 'Alpine Wilderness',
  },
  {
    id: 'c4',
    name: 'Kenji Sato',
    handle: '@kenji_arch',
    location: 'Kyoto, Japan',
    followers: '34.1k',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    topShot: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    badge: 'Architecture',
  },
];

const HomePage = ({
  photos = [],
  likes = {},
  collections = {},
  followingCreators = {},
  onToggleLike,
  onToggleCollection,
  onToggleFollow,
  onDownloadPhoto,
  onNavigate,
  onTagClick,
  onSelectPhoto,
  onEditPhoto,
  onDeletePhoto,
  onOpenAddModal,
}) => {
  const featuredPhotos = photos.filter((p) => p.featured);

  return (
    <div className="min-h-screen space-y-16">
      {/* 1. Hero / Search Banner */}
      <Hero
        onExplore={() => onNavigate('gallery')}
        featuredPhotos={featuredPhotos}
        allPhotos={photos}
        onSelectPhoto={(p) => {
          window.location.hash = `photo/${p.id}`;
        }}
        onTagClick={onTagClick}
      />

      {/* 2. Horizontal Carousel: Featured Creators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Community Spotlight</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Featured Creators & Curators</h2>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-xs font-bold uppercase text-orange-400 hover:underline cursor-pointer"
          >
            My Profile & Hub →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_CREATORS.map((creator) => {
            const isFollowing = !!followingCreators[creator.handle];

            return (
              <div
                key={creator.id}
                className="group rounded-3xl overflow-hidden glass-panel-elevated border-zinc-800 p-5 space-y-4 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {creator.name}
                      </h4>
                      <p className="text-xs text-zinc-400">{creator.handle}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-zinc-800 text-zinc-300">
                    {creator.badge}
                  </span>
                </div>

                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-900">
                  <img
                    src={creator.topShot}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-400 font-medium">{creator.followers} Followers</span>
                  <button
                    type="button"
                    onClick={() => onToggleFollow && onToggleFollow(creator.handle)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isFollowing
                        ? 'bg-zinc-800 text-orange-400 border border-orange-500/40'
                        : 'bg-orange-500 hover:bg-orange-600 text-black font-black'
                    }`}
                  >
                    {isFollowing ? '✓ Following' : '+ Follow'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Horizontal Section: Trending Themes & Collections Preview */}
      <section className="py-12 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Curated Chapters</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Trending Collections</h2>
            </div>
            <button
              onClick={() => onNavigate('collections')}
              className="text-xs font-bold uppercase text-orange-400 hover:underline cursor-pointer"
            >
              Browse All Chapters →
            </button>
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
                  {previewPhoto && (
                    <img
                      src={previewPhoto.src}
                      alt={cat.label}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-110 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>

                  <div className="relative z-10 w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-700/60 flex items-center justify-center text-xl shadow-lg">
                    {cat.icon}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {catPhotos.length} Curated Photos
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Core Infinite Feed Masonry Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Live Global Stream</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Infinite Community Feed</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Newest photographic uploads and standout moments from creators worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                + Contribute Shot
              </button>
            )}
            <button
              onClick={() => onNavigate('gallery')}
              className="px-5 py-2.5 rounded-xl glass-card hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition"
            >
              Filter & Explore →
            </button>
          </div>
        </div>

        <GalleryGrid
          photos={photos}
          likes={likes}
          collections={collections}
          onToggleLike={onToggleLike}
          onToggleCollection={onToggleCollection}
          onDownloadPhoto={onDownloadPhoto}
          onSelectPhoto={(p) => {
            window.location.hash = `photo/${p.id}`;
          }}
          onEditPhoto={onEditPhoto}
          onDeletePhoto={onDeletePhoto}
          onOpenAddModal={onOpenAddModal}
          layoutMode="masonry"
        />
      </section>
    </div>
  );
};

export default HomePage;
