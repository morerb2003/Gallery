import axios from 'axios';
import { photosData as defaultPhotos } from '../data/photos';

// In-memory cache for API queries
const apiCache = new Map();

/**
 * Normalizes Unsplash photo objects to match the Gallery schema
 */
export const normalizeUnsplashPhoto = (item) => {
  const width = item.width || 1920;
  const height = item.height || 1080;
  const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';

  return {
    id: `unsplash-${item.id}`,
    title: item.description || item.alt_description || 'Unsplash Capture',
    category: item.tags?.[0]?.title || 'travel',
    description: item.alt_description || item.description || 'High-resolution photograph from Unsplash.',
    date: item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    location: item.location?.name || item.location?.city || item.user?.location || 'Global Location',
    camera: item.exif?.model ? `${item.exif.make || ''} ${item.exif.model}`.trim() : 'Professional DSLR',
    exif: {
      make: item.exif?.make || 'Sony',
      model: item.exif?.model || 'Alpha 7',
      exposureTime: item.exif?.exposure_time || '1/250s',
      aperture: item.exif?.aperture ? `f/${item.exif.aperture}` : 'f/2.8',
      focalLength: item.exif?.focal_length ? `${item.exif.focal_length}mm` : '50mm',
      iso: item.exif?.iso || 100,
    },
    featured: (item.likes || 0) > 50,
    src: item.urls?.regular || item.urls?.full,
    downloadSrc: item.urls?.full || item.urls?.raw || item.urls?.regular,
    fallbackSrc: item.urls?.small,
    color: item.color || '#f97316',
    width,
    height,
    orientation,
    views: item.views || Math.floor(Math.random() * 8000) + 1200,
    downloads: item.downloads || Math.floor(Math.random() * 2500) + 300,
    likesCount: item.likes || Math.floor(Math.random() * 400) + 20,
    author: {
      name: item.user?.name || 'Curated Photographer',
      username: item.user?.username || 'artist',
      portfolio: item.user?.links?.html,
      avatar: item.user?.profile_image?.medium,
    },
    tags: item.tags?.map((t) => (typeof t === 'string' ? t : t.title)) || ['Photography', 'HD', 'Curated'],
    album: 'Curated Web',
  };
};

/**
 * Hybrid Data Engine:
 * Attempts to fetch live high-res photos from Unsplash API (if client provides key or public endpoint),
 * otherwise gracefully falls back to local photos enriched with stats.
 */
export const fetchHybridPhotos = async ({
  page = 1,
  perPage = 12,
  category = 'all',
  query = '',
  accessKey = null,
} = {}) => {
  const cacheKey = `${category}-${query}-${page}-${perPage}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  // If user has provided an Unsplash Access Key, fetch live data
  if (accessKey) {
    try {
      const endpoint = query
        ? 'https://api.unsplash.com/search/photos'
        : 'https://api.unsplash.com/photos';

      const response = await axios.get(endpoint, {
        params: {
          page,
          per_page: perPage,
          query: query || (category !== 'all' ? category : 'nature,architecture,portrait'),
          client_id: accessKey,
        },
        timeout: 6000,
      });

      const rawItems = query ? response.data.results : response.data;
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const normalized = rawItems.map(normalizeUnsplashPhoto);
        const result = {
          data: normalized,
          source: 'unsplash',
          total: query ? response.data.total : 1000,
          page,
        };
        apiCache.set(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn('Unsplash API request failed or timed out. Falling back to local dataset.', err);
    }
  }

  // Fallback: Enrich local seed dataset with metadata if not present
  const enrichedLocal = defaultPhotos.map((photo, idx) => ({
    ...photo,
    width: photo.width || (idx % 2 === 0 ? 3840 : 2560),
    height: photo.height || (idx % 3 === 0 ? 3840 : 1707),
    orientation: photo.orientation || (idx % 3 === 0 ? 'portrait' : 'landscape'),
    color: photo.color || (idx % 4 === 0 ? '#f97316' : idx % 3 === 0 ? '#3b82f6' : idx % 2 === 0 ? '#10b981' : '#a855f7'),
    views: photo.views || 3420 + idx * 280,
    downloads: photo.downloads || 890 + idx * 95,
    likesCount: photo.likesCount || 140 + idx * 25,
    exif: photo.exif || {
      make: photo.camera?.split(' ')[0] || 'Sony',
      model: photo.camera || 'Alpha A7 IV',
      exposureTime: '1/320s',
      aperture: 'f/2.8',
      focalLength: '35mm',
      iso: 200,
    },
    album: photo.album || 'Portfolio Archive',
  }));

  let filtered = [...enrichedLocal];
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Pagination slice
  const startIndex = (page - 1) * perPage;
  const paginatedData = filtered.slice(startIndex, startIndex + perPage);

  const fallbackResult = {
    data: paginatedData,
    source: 'local-seed',
    total: filtered.length,
    page,
  };

  apiCache.set(cacheKey, fallbackResult);
  return fallbackResult;
};

/**
 * Cloudinary direct upload utility
 */
export const uploadToCloudinary = async (file, { cloudName, uploadPreset = 'ml_default' }) => {
  if (!cloudName) {
    throw new Error('Cloudinary Cloud Name is required.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return {
    url: response.data.secure_url || response.data.url,
    width: response.data.width,
    height: response.data.height,
    format: response.data.format,
    bytes: response.data.bytes,
  };
};
