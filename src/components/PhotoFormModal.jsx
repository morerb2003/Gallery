import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../data/photos';
import { uploadToCloudinary } from '../services/api';

const COLOR_PALETTES = [
  { name: 'Warm Amber', hex: '#f97316' },
  { name: 'Sunset Rose', hex: '#f43f5e' },
  { name: 'Emerald Forest', hex: '#10b981' },
  { name: 'Ocean Blue', hex: '#3b82f6' },
  { name: 'Violet Cyber', hex: '#8b5cf6' },
  { name: 'Monochrome Dark', hex: '#27272a' },
];

const PhotoFormModal = ({ isOpen, onClose, onSave, initialPhoto = null }) => {
  const isEdit = !!initialPhoto;

  const [formData, setFormData] = useState({
    title: '',
    category: 'personal',
    description: '',
    location: '',
    camera: '',
    date: new Date().toISOString().split('T')[0],
    featured: false,
    src: '',
    tags: '',
    color: '#f97316',
  });

  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [previewSrc, setPreviewSrc] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingCloud, setIsUploadingCloud] = useState(false);
  const [useCloudinary, setUseCloudinary] = useState(false);
  const [cloudName, setCloudName] = useState('');
  const [cloudPreset, setCloudPreset] = useState('ml_default');

  // Detected EXIF / Technical Specs
  const [extractedMeta, setExtractedMeta] = useState({
    width: 0,
    height: 0,
    fileSize: '',
    aspectRatio: '',
    megapixels: '',
  });

  const fileInputRef = useRef(null);

  // Populate form on edit
  useEffect(() => {
    if (initialPhoto) {
      setFormData({
        title: initialPhoto.title || '',
        category: initialPhoto.category || 'personal',
        description: initialPhoto.description || '',
        location: initialPhoto.location || '',
        camera: initialPhoto.camera || '',
        date: initialPhoto.date || new Date().toISOString().split('T')[0],
        featured: !!initialPhoto.featured,
        src: initialPhoto.src || '',
        tags: Array.isArray(initialPhoto.tags) ? initialPhoto.tags.join(', ') : '',
        color: initialPhoto.color || '#f97316',
      });
      setPreviewSrc(initialPhoto.src || '');
      setImageMode(initialPhoto.src?.startsWith('data:') ? 'upload' : 'url');
      setExtractedMeta({
        width: initialPhoto.width || 1920,
        height: initialPhoto.height || 1080,
        fileSize: initialPhoto.fileSize || '2.4 MB',
        aspectRatio: initialPhoto.width && initialPhoto.height ? `${(initialPhoto.width / initialPhoto.height).toFixed(2)}:1` : '16:9',
        megapixels: initialPhoto.width && initialPhoto.height ? `${((initialPhoto.width * initialPhoto.height) / 1000000).toFixed(1)} MP` : '2.1 MP',
      });
    } else {
      setFormData({
        title: '',
        category: 'personal',
        description: '',
        location: '',
        camera: 'Sony Alpha • 35mm f/1.8',
        date: new Date().toISOString().split('T')[0],
        featured: false,
        src: '',
        tags: '',
        color: '#f97316',
      });
      setPreviewSrc('');
      setImageMode('upload');
      setExtractedMeta({
        width: 0,
        height: 0,
        fileSize: '',
        aspectRatio: '',
        megapixels: '',
      });
    }
    setError('');
  }, [initialPhoto, isOpen]);

  if (!isOpen) return null;

  // Extract metadata and dominant color from File/Image
  const processImageFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, AVIF).');
      return;
    }

    // Format file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = `${sizeInMB} MB`;

    // Read Data URL for preview & local fallback
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreviewSrc(dataUrl);

      // Create Image element to inspect dimensions & extract color
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const mp = ((width * height) / 1000000).toFixed(1);
        const ratio = (width / height).toFixed(2);

        setExtractedMeta({
          width,
          height,
          fileSize: formattedSize,
          aspectRatio: `${ratio}:1`,
          megapixels: `${mp} MP`,
        });

        // Sample dominant color from center pixels using canvas
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          setFormData((prev) => ({ ...prev, color: hex }));
        } catch {
          // ignore canvas cross-origin errors if any
        }
      };
      img.src = dataUrl;

      if (!useCloudinary) {
        setFormData((prev) => ({ ...prev, src: dataUrl }));
      }
    };
    reader.readAsDataURL(file);

    // Optional Cloudinary direct upload
    if (useCloudinary && cloudName) {
      setIsUploadingCloud(true);
      try {
        const cloudResult = await uploadToCloudinary(file, {
          cloudName,
          uploadPreset: cloudPreset,
        });
        setFormData((prev) => ({ ...prev, src: cloudResult.url }));
        setError('');
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        setError('Cloudinary upload failed. Storing image locally via DataURL.');
      } finally {
        setIsUploadingCloud(false);
      }
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, src: url }));
    setPreviewSrc(url);

    if (url) {
      const img = new Image();
      img.onload = () => {
        setExtractedMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          fileSize: 'Remote Stream',
          aspectRatio: `${(img.naturalWidth / img.naturalHeight).toFixed(2)}:1`,
          megapixels: `${((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(1)} MP`,
        });
      };
      img.src = url;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a title for this photograph.');
      return;
    }
    if (!formData.src && !previewSrc) {
      setError('Please upload an image or provide a valid image URL.');
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const finalPhoto = {
      id: isEdit ? initialPhoto.id : Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      location: formData.location.trim() || 'Undisclosed Location',
      camera: formData.camera.trim() || 'Custom Optics',
      date: formData.date,
      featured: formData.featured,
      src: formData.src || previewSrc,
      tags: tagsArray.length > 0 ? tagsArray : ['Original', 'Portfolio'],
      color: formData.color,
      width: extractedMeta.width || 1920,
      height: extractedMeta.height || 1080,
      orientation:
        extractedMeta.width && extractedMeta.height
          ? extractedMeta.width > extractedMeta.height
            ? 'landscape'
            : extractedMeta.width < extractedMeta.height
            ? 'portrait'
            : 'square'
          : 'landscape',
      views: initialPhoto?.views || Math.floor(Math.random() * 500) + 50,
      downloads: initialPhoto?.downloads || Math.floor(Math.random() * 80) + 10,
      likesCount: initialPhoto?.likesCount || 0,
      exif: {
        make: formData.camera.split(' ')[0] || 'Sony',
        model: formData.camera,
        exposureTime: '1/250s',
        aperture: 'f/2.8',
        focalLength: '35mm',
        iso: 100,
      },
    };

    onSave(finalPhoto);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-modal-enter"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl glass-panel-elevated border-zinc-700/80 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <span>{isEdit ? 'Update Metadata' : 'New Capture Upload'}</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {isEdit ? 'Edit Photograph' : 'Add Photo To Gallery'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Mode Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Image Source
              </label>
              <div className="flex items-center gap-1 p-1 rounded-xl glass-toolbar text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-orange-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  📁 File Drag & Drop
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    imageMode === 'url'
                      ? 'bg-orange-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🔗 Image URL
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] ${
                  isDragging
                    ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
                    : previewSrc
                    ? 'border-zinc-700 bg-zinc-950/60'
                    : 'border-zinc-800 hover:border-orange-500/60 bg-zinc-900/40 hover:bg-zinc-900/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {previewSrc ? (
                  <div className="relative w-full max-h-56 rounded-xl overflow-hidden group">
                    <img
                      src={previewSrc}
                      alt="Upload Preview"
                      className="w-full h-52 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-orange-500 text-black text-xs font-bold uppercase">
                        Change File
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 mx-auto flex items-center justify-center text-2xl animate-pulse">
                      ☁️
                    </div>
                    <p className="text-sm font-bold text-white">
                      Drag & Drop your photo here, or <span className="text-orange-400 underline">Browse</span>
                    </p>
                    <p className="text-xs text-zinc-400">
                      Supports JPG, PNG, WebP, AVIF (Auto extracts EXIF & Dimensions)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="url"
                  value={formData.src}
                  onChange={handleUrlChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
                {previewSrc && (
                  <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-zinc-800">
                    <img
                      src={previewSrc}
                      alt="URL Preview"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Cloudinary Direct Upload Option */}
            <div className="p-3.5 rounded-2xl glass-toolbar border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">☁️</span>
                  <span className="text-xs font-bold text-white">Direct Cloudinary CDN Upload</span>
                </div>
                <input
                  type="checkbox"
                  checked={useCloudinary}
                  onChange={(e) => setUseCloudinary(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>
              {useCloudinary && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <input
                    type="text"
                    value={cloudName}
                    onChange={(e) => setCloudName(e.target.value)}
                    placeholder="Cloud Name"
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={cloudPreset}
                    onChange={(e) => setCloudPreset(e.target.value)}
                    placeholder="Upload Preset"
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Detected EXIF Metadata Bar */}
            {extractedMeta.width > 0 && (
              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Dimensions</p>
                  <p className="text-zinc-200 font-medium">{extractedMeta.width} × {extractedMeta.height}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Resolution</p>
                  <p className="text-zinc-200 font-medium">{extractedMeta.megapixels}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Ratio</p>
                  <p className="text-zinc-200 font-medium">{extractedMeta.aspectRatio}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Size</p>
                  <p className="text-orange-400 font-bold">{extractedMeta.fileSize}</p>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Photo Title <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Neon Streets of Shinjuku"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Category Album <span className="text-orange-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Story & Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Atmosphere, lighting conditions, or the creative context behind this shot..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country or landmark"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Camera Gear / Optics
              </label>
              <input
                type="text"
                value={formData.camera}
                onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                placeholder="Sony A7 IV • 85mm f/1.4"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Dominant Color & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Dominant Color Mood
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: palette.hex })}
                    style={{ backgroundColor: palette.hex }}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer shadow ${
                      formData.color === palette.hex ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-80'
                    }`}
                    title={palette.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Portrait, Sunset, 4K, Cyberpunk"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <input
              type="checkbox"
              id="featured-photo-check"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-orange-500 cursor-pointer"
            />
            <label htmlFor="featured-photo-check" className="text-xs font-bold text-white cursor-pointer select-none">
              ★ Pin to Featured Highlights Carousel on Homepage
            </label>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl glass-card text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingCloud}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer active:scale-95"
            >
              {isUploadingCloud ? 'Uploading to Cloud...' : isEdit ? 'Save Changes' : 'Publish To Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoFormModal;
