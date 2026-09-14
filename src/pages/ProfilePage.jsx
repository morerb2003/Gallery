import React, { useState } from 'react';
import GalleryGrid from '../components/GalleryGrid';
import { useGallery } from '../context/GalleryContext';

const ProfilePage = ({ onOpenAddModal, onNavigate }) => {
  const {
    photos,
    likes,
    collections,
    albums,
    toggleLike,
    toggleCollection,
    downloadPhoto,
    userProfile,
  } = useGallery();

  const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' | 'collections' | 'liked'

  const userUploads = photos.filter((p) => !String(p.id).startsWith('unsplash-'));
  const likedPhotos = photos.filter((p) => !!likes[p.id]);

  const totalViews = photos.reduce((acc, curr) => acc + (curr.views || 1200), 0);
  const totalDownloads = photos.reduce((acc, curr) => acc + (curr.downloads || 320), 0);
  const totalLikes = Object.values(likes).filter(Boolean).length;

  return (
    <div className="min-h-screen pb-16">
      {/* Cover Photo Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900">
        <img
          src={userProfile.cover || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"}
          alt="Profile Cover"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-8">
        {/* Profile Card & Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 sm:p-8 rounded-3xl glass-panel-elevated border-zinc-700/80 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-400 p-1 shadow-2xl flex-shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center overflow-hidden">
                <img
                  src={userProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bio Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{userProfile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Featured Creator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">{userProfile.handle} • {userProfile.location}</p>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                {userProfile.bio}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-zinc-400">
                <span>📷 {userProfile.gear}</span>
                <span>🌐 {userProfile.website}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-3 flex-shrink-0">
            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer active:scale-95"
            >
              + Upload Shot
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-xl glass-card hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider border-zinc-700 transition cursor-pointer"
            >
              📊 Analytics Hub
            </button>
          </div>
        </div>

        {/* Creator Metrics Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl glass-card text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-white">{totalViews.toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Views</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl glass-card text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-orange-400">{totalDownloads.toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Downloads</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl glass-card text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-rose-400">{totalLikes + 180}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Applauds & Likes</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl glass-card text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{userUploads.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Contributions</p>
          </div>
        </div>

        {/* Content Tabs Switcher */}
        <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('uploads')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'uploads'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <span>📷 Contributions</span>
            <span className="text-[11px] opacity-80 font-black">({userUploads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'collections'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <span>📁 Albums & Folders</span>
            <span className="text-[11px] opacity-80 font-black">({albums.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('liked')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'liked'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <span>❤️ Liked / Saved</span>
            <span className="text-[11px] opacity-80 font-black">({likedPhotos.length})</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <GalleryGrid
              photos={userUploads}
              likes={likes}
              collections={collections}
              onToggleLike={toggleLike}
              onToggleCollection={toggleCollection}
              onDownloadPhoto={downloadPhoto}
              onSelectPhoto={(p) => onNavigate('photo', p.id)}
              layoutMode="grid"
            />
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => {
              const albumPhotos = photos.filter((p) => p.album === album.name);
              const coverPhoto = albumPhotos[0] || photos[0];

              return (
                <div
                  key={album.id}
                  onClick={() => onNavigate('collections')}
                  className="group rounded-3xl overflow-hidden glass-panel-elevated border-zinc-800 hover:border-orange-500/50 p-5 space-y-4 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 relative">
                    <img
                      src={coverPhoto?.src}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white border border-white/10">
                      {album.photoCount || albumPhotos.length} Items
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {album.description || "Curated collection of captures."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            {likedPhotos.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <span className="text-4xl">🤍</span>
                <h3 className="text-xl font-bold text-white">No Liked Photographs Yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Click the heart icon on any photo in the Discover Feed or Gallery to bookmark your favorite shots.
                </p>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 text-black font-bold text-xs uppercase cursor-pointer"
                >
                  Explore Feed
                </button>
              </div>
            ) : (
              <GalleryGrid
                photos={likedPhotos}
                likes={likes}
                collections={collections}
                onToggleLike={toggleLike}
                onToggleCollection={toggleCollection}
                onDownloadPhoto={downloadPhoto}
                onSelectPhoto={(p) => onNavigate('photo', p.id)}
                layoutMode="grid"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
