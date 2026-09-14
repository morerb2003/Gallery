import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import PhotoFormModal from './components/PhotoFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ExportModal from './components/ExportModal';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import ProfilePage from './pages/ProfilePage';
import CollectionsPage from './pages/CollectionsPage';
import DashboardPage from './pages/DashboardPage';
import { photosData as defaultPhotosData } from './data/photos';

const STORAGE_KEY = 'rohits_gallery_photos_v1';
const LIKES_KEY = 'rohits_gallery_likes_v1';
const COLLECTIONS_KEY = 'rohits_gallery_collections_v1';
const ALBUMS_KEY = 'rohits_gallery_albums_v1';
const FOLLOWING_KEY = 'rohits_gallery_following_v1';

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

  // Likes map: photoId -> boolean
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Collections map: photoId -> boolean
  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // User albums
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem(ALBUMS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ALBUMS;
    } catch {
      return DEFAULT_ALBUMS;
    }
  });

  // Followed creators map: creatorHandle -> boolean
  const [followingCreators, setFollowingCreators] = useState(() => {
    try {
      const saved = localStorage.getItem(FOLLOWING_KEY);
      return saved ? JSON.parse(saved) : { '@elena_light': true };
    } catch {
      return { '@elena_light': true };
    }
  });

  // Routing State
  const [activePage, setActivePage] = useState('home'); // 'home' | 'gallery' | 'collections' | 'dashboard' | 'profile' | 'photo'
  const [activePhotoId, setActivePhotoId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-sync localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error(e);
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    } catch (e) {
      console.error(e);
    }
  }, [likes]);

  useEffect(() => {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (e) {
      console.error(e);
    }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));
    } catch (e) {
      console.error(e);
    }
  }, [albums]);

  useEffect(() => {
    try {
      localStorage.setItem(FOLLOWING_KEY, JSON.stringify(followingCreators));
    } catch (e) {
      console.error(e);
    }
  }, [followingCreators]);

  // Deep-Linking Hash Router
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').replace(/^\//, '');
      if (!rawHash || rawHash === 'home') {
        setActivePage('home');
        setActivePhotoId(null);
      } else if (rawHash.startsWith('photo/')) {
        const id = rawHash.replace('photo/', '');
        setActivePage('photo');
        setActivePhotoId(id);
      } else if (rawHash.startsWith('gallery')) {
        setActivePage('gallery');
        setActivePhotoId(null);
        const params = new URLSearchParams(rawHash.split('?')[1] || '');
        const cat = params.get('category');
        const search = params.get('search');
        if (cat) setSelectedCategory(cat);
        if (search) setSearchQuery(search);
      } else if (rawHash.startsWith('collections')) {
        setActivePage('collections');
        setActivePhotoId(null);
      } else if (rawHash.startsWith('dashboard')) {
        setActivePage('dashboard');
        setActivePhotoId(null);
      } else if (rawHash.startsWith('profile')) {
        setActivePage('profile');
        setActivePhotoId(null);
      } else {
        setActivePage('home');
        setActivePhotoId(null);
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
    if (category) setSelectedCategory(category);
    if (search !== undefined) setSearchQuery(search);

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

  const handleToggleFollow = (creatorHandle) => {
    setFollowingCreators((prev) => {
      const next = !prev[creatorHandle];
      showToast(next ? `✓ Following ${creatorHandle}` : `Unfollowed ${creatorHandle}`);
      return { ...prev, [creatorHandle]: next };
    });
  };

  const handleToggleLike = (photoId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setLikes((prev) => {
      const nextState = !prev[photoId];
      showToast(nextState ? '❤️ Added to Liked Photos' : '🤍 Removed from Liked Photos');
      return { ...prev, [photoId]: nextState };
    });
  };

  const handleToggleCollection = (photoId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCollections((prev) => {
      const nextState = !prev[photoId];
      showToast(nextState ? '🔖 Saved to Private Collection' : 'Removed from Collection');
      return { ...prev, [photoId]: nextState };
    });
  };

  const handleDownloadPhoto = async (photo, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      showToast(`⏳ Preparing download for "${photo.title}"...`);
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
      showToast(`✓ Download completed: ${photo.title}`);
    } catch {
      const link = document.createElement('a');
      link.href = photo.src;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = `${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✓ Opened image in HD: ${photo.title}`);
    }
  };

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

  const handleBatchSavePhotos = (newPhotos = []) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
  };

  const handleSavePhoto = (photoData) => {
    if (editingPhoto) {
      setPhotos((prev) => prev.map((p) => (p.id === photoData.id ? photoData : p)));
      showToast(`✓ Updated "${photoData.title}"!`);
    } else {
      setPhotos((prev) => [photoData, ...prev]);
      showToast(`✓ Added "${photoData.title}" to gallery!`);
    }
    setIsFormModalOpen(false);
    setEditingPhoto(null);
  };

  const handleConfirmDelete = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
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
    showToast('🔄 Restored default preset platform!');
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
        onOpenAddModal={() => {
          setEditingPhoto(null);
          setIsFormModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Multi-Page Content Switching */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            photos={photos}
            likes={likes}
            collections={collections}
            followingCreators={followingCreators}
            onToggleLike={handleToggleLike}
            onToggleCollection={handleToggleCollection}
            onToggleFollow={handleToggleFollow}
            onDownloadPhoto={handleDownloadPhoto}
            onNavigate={handleNavigate}
            onTagClick={handleTagClick}
            onSelectPhoto={(p) => (window.location.hash = `photo/${p.id}`)}
            onEditPhoto={(p) => {
              setEditingPhoto(p);
              setIsFormModalOpen(true);
            }}
            onDeletePhoto={(p) => {
              setPhotoToDelete(p);
              setIsDeleteModalOpen(true);
            }}
            onOpenAddModal={() => {
              setEditingPhoto(null);
              setIsFormModalOpen(true);
            }}
          />
        )}

        {activePage === 'gallery' && (
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
            onSelectPhoto={(p) => (window.location.hash = `photo/${p.id}`)}
            onEditPhoto={(p) => {
              setEditingPhoto(p);
              setIsFormModalOpen(true);
            }}
            onDeletePhoto={(p) => {
              setPhotoToDelete(p);
              setIsDeleteModalOpen(true);
            }}
            onOpenAddModal={() => {
              setEditingPhoto(null);
              setIsFormModalOpen(true);
            }}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {activePage === 'photo' && (
          <PhotoDetailPage
            photoId={activePhotoId}
            photos={photos}
            likes={likes}
            collections={collections}
            followingCreators={followingCreators}
            onToggleLike={handleToggleLike}
            onToggleCollection={handleToggleCollection}
            onToggleFollow={handleToggleFollow}
            onDownloadPhoto={handleDownloadPhoto}
            onNavigate={handleNavigate}
            onSelectPhoto={(p) => (window.location.hash = `photo/${p.id}`)}
            onShowToast={showToast}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            photos={photos}
            likes={likes}
            collections={collections}
            albums={albums}
            onToggleLike={handleToggleLike}
            onToggleCollection={handleToggleCollection}
            onDownloadPhoto={handleDownloadPhoto}
            onSelectPhoto={(p) => (window.location.hash = `photo/${p.id}`)}
            onOpenAddModal={() => {
              setEditingPhoto(null);
              setIsFormModalOpen(true);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'collections' && (
          <CollectionsPage
            albums={albums}
            photos={photos}
            likes={likes}
            collections={collections}
            onCreateAlbum={handleCreateAlbum}
            onAssignToAlbum={handleAssignToAlbum}
            onToggleLike={handleToggleLike}
            onToggleCollection={handleToggleCollection}
            onDownloadPhoto={handleDownloadPhoto}
            onSelectPhoto={(p) => (window.location.hash = `photo/${p.id}`)}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            photos={photos}
            onBatchSavePhotos={handleBatchSavePhotos}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Fullscreen Lightbox Modal (optional quick view) */}
      {selectedLightboxPhoto && (
        <Lightbox
          photo={selectedLightboxPhoto}
          photosList={photos}
          isLiked={!!likes[selectedLightboxPhoto.id]}
          isCollected={!!collections[selectedLightboxPhoto.id]}
          onToggleLike={(e) => handleToggleLike(selectedLightboxPhoto.id, e)}
          onToggleCollection={(e) => handleToggleCollection(selectedLightboxPhoto.id, e)}
          onDownloadPhoto={(e) => handleDownloadPhoto(selectedLightboxPhoto, e)}
          onClose={() => setSelectedLightboxPhoto(null)}
          onNavigate={setSelectedLightboxPhoto}
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
