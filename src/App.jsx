import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import PhotoFormModal from './components/PhotoFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ExportModal from './components/ExportModal';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import { photosData as defaultPhotosData } from './data/photos';

const STORAGE_KEY = 'rohits_gallery_photos_v1';
const LIKES_KEY = 'rohits_gallery_likes_v1';
const COLLECTIONS_KEY = 'rohits_gallery_collections_v1';
const ALBUMS_KEY = 'rohits_gallery_albums_v1';

const DEFAULT_ALBUMS = [
  { id: 'album-1', name: 'Nature & Horizons', description: 'Scenic vistas, lakes, and sunsets.', photoCount: 4 },
  { id: 'album-2', name: 'Urban Architecture', description: 'Modern geometry, neon, and city lines.', photoCount: 3 },
  { id: 'album-3', name: 'Portraits & Stories', description: 'Lifestyle, coffee, and acoustic sessions.', photoCount: 3 },
];

const App = () => {
  // Load photos from localStorage or fallback to default dataset
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading localStorage photos:', e);
    }
    return defaultPhotosData;
  });

  // Likes state: map of photoId -> boolean
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Collections / Saved state: map of photoId -> boolean
  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Custom User Albums
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem(ALBUMS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ALBUMS;
    } catch {
      return DEFAULT_ALBUMS;
    }
  });

  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-sync photos with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [photos]);

  // Auto-sync likes
  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    } catch (e) {
      console.error('Failed to save likes:', e);
    }
  }, [likes]);

  // Auto-sync collections
  useEffect(() => {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (e) {
      console.error('Failed to save collections:', e);
    }
  }, [collections]);

  // Auto-sync albums
  useEffect(() => {
    try {
      localStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));
    } catch (e) {
      console.error('Failed to save albums:', e);
    }
  }, [albums]);

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('gallery')) {
        setActivePage('gallery');
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const cat = params.get('category');
        const search = params.get('search');
        if (cat) setSelectedCategory(cat);
        if (search) setSearchQuery(search);
      } else {
        setActivePage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  const handleNavigate = (page, category = null, search = '') => {
    setActivePage(page);
    if (category) {
      setSelectedCategory(category);
    }
    if (search !== undefined) {
      setSearchQuery(search);
    }
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('search', search);

    const queryString = params.toString();
    window.location.hash = queryString ? `${page}?${queryString}` : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag) => {
    handleNavigate('gallery', 'all', tag);
  };

  // Inspect photo & increment view count
  const handleSelectPhoto = (photo) => {
    if (!photo) {
      setSelectedPhoto(null);
      return;
    }
    const updated = {
      ...photo,
      views: (photo.views || 2400) + 1,
    };
    setSelectedPhoto(updated);
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? updated : p)));
  };

  // Like Toggle
  const handleToggleLike = (photoId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setLikes((prev) => {
      const nextState = !prev[photoId];
      if (nextState) {
        showToast('❤️ Added to Liked Photos');
      } else {
        showToast('🤍 Removed from Liked Photos');
      }
      return { ...prev, [photoId]: nextState };
    });
  };

  // Collection Toggle
  const handleToggleCollection = (photoId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCollections((prev) => {
      const nextState = !prev[photoId];
      if (nextState) {
        showToast('🔖 Saved to Private Collection');
      } else {
        showToast('Removed from Collection');
      }
      return { ...prev, [photoId]: nextState };
    });
  };

  // Download Trigger & increment download count
  const handleDownloadPhoto = async (photo, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      showToast(`⏳ Preparing download for "${photo.title}"...`);
      // Increment downloads counter
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, downloads: (p.downloads || 420) + 1 } : p))
      );

      const response = await fetch(photo.src, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast(`✓ Download started: ${photo.title}`);
    } catch {
      const link = document.createElement('a');
      link.href = photo.src;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = `${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✓ Opened image in high-res: ${photo.title}`);
    }
  };

  // Album Management Handlers
  const handleCreateAlbum = (newAlbum, photoIds = []) => {
    setAlbums((prev) => [newAlbum, ...prev]);
    if (photoIds.length > 0) {
      setPhotos((prev) =>
        prev.map((p) => (photoIds.includes(p.id) ? { ...p, album: newAlbum.name } : p))
      );
    }
    showToast(`📁 Created Album "${newAlbum.name}"!`);
  };

  const handleAssignToAlbum = (albumId, photoIds = []) => {
    const targetAlbum = albums.find((a) => a.id === albumId);
    if (!targetAlbum) return;

    setPhotos((prev) =>
      prev.map((p) => (photoIds.includes(p.id) ? { ...p, album: targetAlbum.name } : p))
    );
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, photoCount: (a.photoCount || 0) + photoIds.length } : a))
    );
    showToast(`✓ Assigned ${photoIds.length} photos to "${targetAlbum.name}"!`);
  };

  const handleBatchDeletePhotos = (photoIds = []) => {
    setPhotos((prev) => prev.filter((p) => !photoIds.includes(p.id)));
    showToast(`🗑️ Removed ${photoIds.length} photos.`);
  };

  // Photo CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingPhoto(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (photo) => {
    setEditingPhoto(photo);
    setIsFormModalOpen(true);
  };

  const handleSavePhoto = (photoData) => {
    if (editingPhoto) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoData.id ? photoData : p))
      );
      if (selectedPhoto && selectedPhoto.id === photoData.id) {
        setSelectedPhoto(photoData);
      }
      showToast(`✓ Updated "${photoData.title}" successfully!`);
    } else {
      setPhotos((prev) => [photoData, ...prev]);
      showToast(`✓ Added "${photoData.title}" to gallery!`);
    }
    setIsFormModalOpen(false);
    setEditingPhoto(null);
  };

  const handleOpenDeleteModal = (photo) => {
    setPhotoToDelete(photo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(null);
    }
    showToast('🗑️ Photo deleted.');
    setIsDeleteModalOpen(false);
    setPhotoToDelete(null);
  };

  const handleResetToDefaults = () => {
    setPhotos(defaultPhotosData);
    setAlbums(DEFAULT_ALBUMS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPhotosData));
      localStorage.setItem(ALBUMS_KEY, JSON.stringify(DEFAULT_ALBUMS));
    } catch (e) {
      console.error(e);
    }
    if (selectedPhoto) setSelectedPhoto(null);
    showToast('🔄 Restored default preset gallery!');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl glass-panel-elevated border-orange-500/40 text-white text-xs font-semibold shadow-2xl glow-orange animate-modal-enter flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Glass Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        totalPhotos={photos.length}
        onOpenAddModal={handleOpenAddModal}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' ? (
          <HomePage
            photos={photos}
            likes={likes}
            collections={collections}
            onToggleLike={handleToggleLike}
            onToggleCollection={handleToggleCollection}
            onDownloadPhoto={handleDownloadPhoto}
            onNavigate={handleNavigate}
            onTagClick={handleTagClick}
            onSelectPhoto={handleSelectPhoto}
            onEditPhoto={handleOpenEditModal}
            onDeletePhoto={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
          />
        ) : (
          <GalleryPage
            photos={photos}
            likes={likes}
            collections={collections}
            albums={albums}
            onCreateAlbum={handleCreateAlbum}
            onAssignToAlbum={handleAssignToAlbum}
            onBatchDeletePhotos={handleBatchDeletePhotos}
            onToggleLike={handleToggleLike}
            onToggleCollection={handleToggleCollection}
            onDownloadPhoto={handleDownloadPhoto}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectPhoto={handleSelectPhoto}
            onEditPhoto={handleOpenEditModal}
            onDeletePhoto={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          photosList={photos}
          isLiked={!!likes[selectedPhoto.id]}
          isCollected={!!collections[selectedPhoto.id]}
          onToggleLike={(e) => handleToggleLike(selectedPhoto.id, e)}
          onToggleCollection={(e) => handleToggleCollection(selectedPhoto.id, e)}
          onDownloadPhoto={(e) => handleDownloadPhoto(selectedPhoto, e)}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={handleSelectPhoto}
          onEditPhoto={handleOpenEditModal}
          onDeletePhoto={handleOpenDeleteModal}
          onShowToast={showToast}
        />
      )}

      {/* Add / Edit Photo Modal */}
      <PhotoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPhoto(null);
        }}
        onSave={handleSavePhoto}
        initialPhoto={editingPhoto}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        photo={photoToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPhotoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Export / Backup Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        photos={photos}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
