import React, { Suspense, lazy, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import PhotoFormModal from './components/PhotoFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ExportModal from './components/ExportModal';
import CustomizationModal from './components/CustomizationModal';
import SplitViewPhotoModal from './components/SplitViewPhotoModal';
import { GalleryProvider, useGallery } from './context/GalleryContext';
import { useHashRouter } from './hooks/useHashRouter';

// Route-Based Code Splitting via React.lazy
const HomePage = lazy(() => import('./pages/HomePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PhotoDetailPage = lazy(() => import('./pages/PhotoDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Sleek glassmorphic suspense loader
const PageLoadingFallback = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 p-8">
    <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl animate-pulse">
      ✨
    </div>
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
      <span>Loading Page Module...</span>
    </div>
  </div>
);

// Inner Content Component consuming Context & Router Hook
const AppContent = () => {
  const {
    photos,
    likes,
    collections,
    toastMessage,
    layoutPreferences,
    savePhoto,
    deletePhoto,
    resetToDefaults,
  } = useGallery();

  const { page, photoId, queryParams, navigate, updateQueryParams, goBack } = useHashRouter();

  // Modals state
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState(null);
  const [selectedSplitPhoto, setSelectedSplitPhoto] = useState(null);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync direct URL hash parameter navigation for split photo modal
  useEffect(() => {
    if (page === 'photo' && photoId) {
      const found = photos.find((p) => String(p.id) === String(photoId));
      if (found) {
        setSelectedSplitPhoto(found);
      }
    }
  }, [page, photoId, photos]);

  const handleSelectPhoto = (photo) => {
    if (layoutPreferences?.detailViewMode === 'lightbox') {
      setSelectedLightboxPhoto(photo);
    } else {
      setSelectedSplitPhoto(photo);
      window.location.hash = `#/photo/${photo.id}`;
    }
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
        activePage={page}
        onNavigate={navigate}
        totalPhotos={photos.length}
        onOpenAddModal={() => {
          setEditingPhoto(null);
          setIsFormModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCustomizationModal={() => setIsCustomizationModalOpen(true)}
      />

      {/* Main Multi-Page Route Switching with Suspense Code-Splitting */}
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          {page === 'home' && (
            <HomePage
              photos={photos}
              likes={likes}
              collections={collections}
              onNavigate={navigate}
              onTagClick={(tag) => navigate('gallery', { category: 'all', search: tag })}
              onSelectPhoto={handleSelectPhoto}
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

          {page === 'gallery' && (
            <GalleryPage
              queryParams={queryParams}
              updateQueryParams={updateQueryParams}
              onNavigate={navigate}
              onSelectPhoto={handleSelectPhoto}
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
            />
          )}

          {page === 'photo' && (
            <PhotoDetailPage
              photoId={photoId}
              onNavigate={navigate}
              onGoBack={goBack}
            />
          )}

          {page === 'profile' && (
            <ProfilePage
              onNavigate={navigate}
              onOpenAddModal={() => {
                setEditingPhoto(null);
                setIsFormModalOpen(true);
              }}
            />
          )}

          {page === 'collections' && (
            <CollectionsPage onNavigate={navigate} />
          )}

          {page === 'dashboard' && (
            <DashboardPage onNavigate={navigate} />
          )}
        </Suspense>
      </main>

      {/* Seamless Split-View Photo Modal (High-Res visuals on left, Sticky EXIF on right) */}
      <SplitViewPhotoModal
        isOpen={!!selectedSplitPhoto}
        photo={selectedSplitPhoto}
        photosList={photos}
        onClose={() => {
          setSelectedSplitPhoto(null);
          if (window.location.hash.includes('/photo/')) {
            goBack();
          }
        }}
        onNavigatePhoto={(nextPhoto) => {
          setSelectedSplitPhoto(nextPhoto);
          window.location.hash = `#/photo/${nextPhoto.id}`;
        }}
      />

      {/* Fullscreen Lightbox Modal (optional quick preview) */}
      {selectedLightboxPhoto && (
        <Lightbox
          photo={selectedLightboxPhoto}
          photosList={photos}
          onClose={() => setSelectedLightboxPhoto(null)}
          onNavigate={setSelectedLightboxPhoto}
        />
      )}

      {/* LensCraft Customization Studio Modal */}
      <CustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
      />

      {/* Add / Edit Photo Modal */}
      <PhotoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPhoto(null);
        }}
        onSave={savePhoto}
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
        onConfirm={deletePhoto}
      />

      {/* Export / Backup Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        photos={photos}
        onResetToDefaults={resetToDefaults}
      />

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
};

// Root App with Context Provider wrapper
const App = () => {
  return (
    <GalleryProvider>
      <AppContent />
    </GalleryProvider>
  );
};

export default App;
