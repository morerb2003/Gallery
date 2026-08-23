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

  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('gallery')) {
        setActivePage('gallery');
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const cat = params.get('category');
        if (cat) setSelectedCategory(cat);
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
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleNavigate = (page, category = null) => {
    setActivePage(page);
    if (category) {
      setSelectedCategory(category);
      window.location.hash = `gallery?category=${category}`;
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Photo Management Handlers
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
      // Update existing photo
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoData.id ? photoData : p))
      );
      if (selectedPhoto && selectedPhoto.id === photoData.id) {
        setSelectedPhoto(photoData);
      }
      showToast(`✓ Updated "${photoData.title}" successfully!`);
    } else {
      // Add new photo (prepend)
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPhotosData));
    } catch (e) {
      console.error(e);
    }
    if (selectedPhoto) setSelectedPhoto(null);
    showToast('🔄 Restored default preset photos!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-zinc-900 border border-orange-500/50 text-white text-xs font-semibold shadow-2xl shadow-orange-500/20 animate-modal-enter flex items-center gap-2">
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
            onNavigate={handleNavigate}
            onSelectPhoto={setSelectedPhoto}
            onEditPhoto={handleOpenEditModal}
            onDeletePhoto={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
          />
        ) : (
          <GalleryPage
            photos={photos}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectPhoto={setSelectedPhoto}
            onEditPhoto={handleOpenEditModal}
            onDeletePhoto={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          photosList={photos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={setSelectedPhoto}
          onEditPhoto={handleOpenEditModal}
          onDeletePhoto={handleOpenDeleteModal}
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
