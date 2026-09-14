import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { photosData as defaultPhotosData } from '../data/photos';

const STORAGE_KEY = 'rohits_gallery_photos_v1';
const LIKES_KEY = 'rohits_gallery_likes_v1';
const COLLECTIONS_KEY = 'rohits_gallery_collections_v1';
const ALBUMS_KEY = 'rohits_gallery_albums_v1';
const FOLLOWING_KEY = 'rohits_gallery_following_v1';
const PROFILE_KEY = 'rohits_gallery_profile_v1';
const THEME_KEY = 'rohits_gallery_theme_v1';
const BRAND_KEY = 'rohits_gallery_brand_v1';
const LAYOUT_KEY = 'rohits_gallery_layout_v1';

const DEFAULT_ALBUMS = [
  { id: 'album-1', name: 'Nature & Horizons', description: 'Scenic vistas, lakes, and sunsets.', photoCount: 4 },
  { id: 'album-2', name: 'Urban Architecture', description: 'Modern geometry, neon, and city lines.', photoCount: 3 },
  { id: 'album-3', name: 'Portraits & Stories', description: 'Lifestyle, coffee, and acoustic sessions.', photoCount: 3 },
];

const DEFAULT_PROFILE = {
  name: 'Rohit Sharma',
  handle: '@rohit_captures',
  bio: 'Exploring the subtle interplay of light, architectural lines, and urban stillness.',
  location: 'Mumbai, India & Global',
  gear: 'Sony Alpha A7 IV • Leica Q2',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
  website: 'rohit.gallery',
};

const DEFAULT_BRAND = {
  appName: 'LensCraft',
  appSubtitle: "Rohit's Visual Gallery",
  photographerName: 'Rohit Sharma',
  handle: '@rohit_captures',
  tagline: 'High-performance personal photo gallery capturing the subtle interplay of light, architectural lines, and urban stillness.',
};

const DEFAULT_LAYOUT = {
  detailViewMode: 'split-view', // 'split-view' | 'lightbox'
  feedScrollMode: 'infinite', // 'infinite' | 'paginated'
};

const GalleryContext = createContext(null);

export const GalleryProvider = ({ children }) => {
  // Photos state
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading localStorage photos:', e);
    }
    return defaultPhotosData;
  });

  // Likes state
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Collections / Saved state
  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Albums state
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem(ALBUMS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ALBUMS;
    } catch {
      return DEFAULT_ALBUMS;
    }
  });

  // Following state
  const [followingCreators, setFollowingCreators] = useState(() => {
    try {
      const saved = localStorage.getItem(FOLLOWING_KEY);
      return saved ? JSON.parse(saved) : { '@elena_light': true };
    } catch {
      return { '@elena_light': true };
    }
  });

  // User Profile state
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Theme state: 'slate-amber' | 'emerald-obsidian' | 'neon-cyberpunk' | 'warm-monochrome'
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'slate-amber';
    } catch {
      return 'slate-amber';
    }
  });

  // Personal Branding state
  const [brandConfig, setBrandConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(BRAND_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_BRAND;
    } catch {
      return DEFAULT_BRAND;
    }
  });

  // Layout & Navigation Preferences
  const [layoutPreferences, setLayoutPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(LAYOUT_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    } catch {
      return DEFAULT_LAYOUT;
    }
  });

  const [toastMessage, setToastMessage] = useState('');

  // Apply theme to document root
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Sync Brand Config
  useEffect(() => {
    try {
      localStorage.setItem(BRAND_KEY, JSON.stringify(brandConfig));
    } catch (e) {
      console.error(e);
    }
  }, [brandConfig]);

  // Sync Layout Preferences
  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(layoutPreferences));
    } catch (e) {
      console.error(e);
    }
  }, [layoutPreferences]);

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

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  }, []);

  const toggleLike = useCallback((photoId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setLikes((prev) => {
      const next = !prev[photoId];
      showToast(next ? '❤️ Added to Liked Photos' : '🤍 Removed from Liked Photos');
      return { ...prev, [photoId]: next };
    });
  }, [showToast]);

  const toggleCollection = useCallback((photoId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCollections((prev) => {
      const next = !prev[photoId];
      showToast(next ? '🔖 Saved to Private Collection' : 'Removed from Collection');
      return { ...prev, [photoId]: next };
    });
  }, [showToast]);

  const toggleFollow = useCallback((creatorHandle) => {
    setFollowingCreators((prev) => {
      const next = !prev[creatorHandle];
      showToast(next ? `✓ Following ${creatorHandle}` : `Unfollowed ${creatorHandle}`);
      return { ...prev, [creatorHandle]: next };
    });
  }, [showToast]);

  const downloadPhoto = useCallback(async (photo, resLabel = 'Original', e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      showToast(`⏳ Preparing ${resLabel} download for "${photo.title}"...`);
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, downloads: (p.downloads || 420) + 1 } : p))
      );
      const targetUrl = photo.downloadSrc || photo.src;
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${photo.title.replace(/\s+/g, '-').toLowerCase()}-${resLabel.toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast(`✓ Download completed: ${photo.title}`);
    } catch {
      const link = document.createElement('a');
      link.href = photo.downloadSrc || photo.src;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = `${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✓ Opened image in HD: ${photo.title}`);
    }
  }, [showToast]);

  const createAlbum = useCallback((newAlbum, photoIds = []) => {
    setAlbums((prev) => [newAlbum, ...prev]);
    if (photoIds.length > 0) {
      setPhotos((prev) =>
        prev.map((p) => (photoIds.includes(p.id) ? { ...p, album: newAlbum.name } : p))
      );
    }
    showToast(`📁 Created Album "${newAlbum.name}"!`);
  }, [showToast]);

  const assignToAlbum = useCallback((albumId, photoIds = []) => {
    const targetAlbum = albums.find((a) => a.id === albumId);
    if (!targetAlbum) return;

    setPhotos((prev) =>
      prev.map((p) => (photoIds.includes(p.id) ? { ...p, album: targetAlbum.name } : p))
    );
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, photoCount: (a.photoCount || 0) + photoIds.length } : a))
    );
    showToast(`✓ Assigned ${photoIds.length} photos to "${targetAlbum.name}"!`);
  }, [albums, showToast]);

  const batchDeletePhotos = useCallback((photoIds = []) => {
    setPhotos((prev) => prev.filter((p) => !photoIds.includes(p.id)));
    showToast(`🗑️ Removed ${photoIds.length} photos.`);
  }, [showToast]);

  const batchSavePhotos = useCallback((newPhotos = []) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
    showToast(`✓ Added ${newPhotos.length} photos to library!`);
  }, [showToast]);

  const savePhoto = useCallback((photoData) => {
    setPhotos((prev) => {
      const exists = prev.some((p) => p.id === photoData.id);
      if (exists) {
        showToast(`✓ Updated "${photoData.title}"!`);
        return prev.map((p) => (p.id === photoData.id ? photoData : p));
      } else {
        showToast(`✓ Added "${photoData.title}" to gallery!`);
        return [photoData, ...prev];
      }
    });
  }, [showToast]);

  const deletePhoto = useCallback((photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    showToast('🗑️ Photo deleted.');
  }, [showToast]);

  const resetToDefaults = useCallback(() => {
    setPhotos(defaultPhotosData);
    setAlbums(DEFAULT_ALBUMS);
    setUserProfile(DEFAULT_PROFILE);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPhotosData));
      localStorage.setItem(ALBUMS_KEY, JSON.stringify(DEFAULT_ALBUMS));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
    } catch (e) {
      console.error(e);
    }
    showToast('🔄 Restored default preset platform!');
  }, [showToast]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    showToast(`🎨 Theme changed to ${newTheme.replace('-', ' ').toUpperCase()}`);
  }, [showToast]);

  const updateBrandConfig = useCallback((updates) => {
    setBrandConfig((prev) => {
      const next = { ...prev, ...updates };
      showToast(`✨ Brand updated: ${next.appName}`);
      return next;
    });
  }, [showToast]);

  const updateLayoutPreferences = useCallback((updates) => {
    setLayoutPreferences((prev) => {
      const next = { ...prev, ...updates };
      showToast(`⚙️ Layout preferences updated`);
      return next;
    });
  }, [showToast]);

  const value = {
    photos,
    likes,
    collections,
    albums,
    followingCreators,
    userProfile,
    theme,
    setTheme,
    brandConfig,
    updateBrandConfig,
    layoutPreferences,
    updateLayoutPreferences,
    toastMessage,
    showToast,
    toggleLike,
    toggleCollection,
    toggleFollow,
    downloadPhoto,
    createAlbum,
    assignToAlbum,
    batchDeletePhotos,
    batchSavePhotos,
    savePhoto,
    deletePhoto,
    resetToDefaults,
    setUserProfile,
  };

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export default GalleryContext;
