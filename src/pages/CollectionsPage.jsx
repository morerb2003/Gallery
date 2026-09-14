import React, { useState } from 'react';
import GalleryGrid from '../components/GalleryGrid';
import AlbumModal from '../components/AlbumModal';
import { useGallery } from '../context/GalleryContext';

const CollectionsPage = ({ onNavigate }) => {
  const {
    albums,
    photos,
    likes,
    collections,
    createAlbum,
    assignToAlbum,
    toggleLike,
    toggleCollection,
    downloadPhoto,
  } = useGallery();

  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  // If a collection is clicked, show its photos
  if (selectedAlbumFilter) {
    const albumPhotos = photos.filter((p) => p.album === selectedAlbumFilter.name || p.category === selectedAlbumFilter.category);

    return (
      <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => setSelectedAlbumFilter(null)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-orange-400 transition cursor-pointer"
        >
          <span>← Back to All Collections</span>
        </button>

        <div className="p-8 rounded-3xl glass-panel-elevated border-zinc-700 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <span>Curated Album</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{selectedAlbumFilter.name}</h1>
          <p className="text-sm text-zinc-300 max-w-2xl">{selectedAlbumFilter.description || "Curated photography collection."}</p>
          <p className="text-xs font-bold text-orange-400 pt-2">{albumPhotos.length} Photographs in Chapter</p>
        </div>

        <GalleryGrid
          photos={albumPhotos}
          likes={likes}
          collections={collections}
          onToggleLike={toggleLike}
          onToggleCollection={toggleCollection}
          onDownloadPhoto={downloadPhoto}
          onSelectPhoto={(p) => onNavigate('photo', p.id)}
          layoutMode="masonry"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-orange-400 text-xs font-bold uppercase tracking-widest">
            <span>Curated Chapters</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Collections & <span className="text-gradient-orange">Albums</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Explore thematic stories grouped by moods, travel expeditions, architecture, and visual aesthetics.
          </p>
        </div>

        <button
          onClick={() => setIsAlbumModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:scale-105 transition cursor-pointer flex-shrink-0"
        >
          + Create New Album
        </button>
      </div>

      {/* Primary Collections Grid with Multi-Thumbnail Collages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => {
          const albumPhotos = photos.filter((p) => p.album === album.name);
          const p1 = albumPhotos[0] || photos[0];
          const p2 = albumPhotos[1] || photos[1];
          const p3 = albumPhotos[2] || photos[2];

          return (
            <div
              key={album.id}
              onClick={() => setSelectedAlbumFilter(album)}
              className="group rounded-3xl overflow-hidden glass-panel-elevated border-zinc-800 hover:border-orange-500/60 p-4 space-y-4 cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Multi-Thumbnail Collage (1 big left + 2 stacked right) */}
              <div className="grid grid-cols-3 gap-2 aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950">
                <div className="col-span-2 h-full overflow-hidden relative">
                  <img
                    src={p1?.src}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
                  <div className="overflow-hidden relative bg-zinc-900">
                    <img src={p2?.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden relative bg-zinc-900">
                    <img src={p3?.src} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Album Metadata */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {album.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                    {album.description || "Curated photographic chapter."}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-900 border border-zinc-700 text-orange-400 flex-shrink-0">
                  {album.photoCount || albumPhotos.length} Shots
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Curated Seasonal Showcase */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border-orange-500/20 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Editorial Spotlight</span>
        <h2 className="text-3xl font-black text-white">Autumn & Golden Hour Vistas</h2>
        <p className="text-zinc-300 text-sm max-w-xl">
          A showcase of amber leaves, atmospheric dusk light, and warm tones captured across mountain ranges and urban parks.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('gallery', { category: 'nature' })}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Explore Autumn Collection →
          </button>
        </div>
      </div>

      <AlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        albums={albums}
        onCreateAlbum={createAlbum}
        onAssignToAlbum={assignToAlbum}
      />
    </div>
  );
};

export default CollectionsPage;
