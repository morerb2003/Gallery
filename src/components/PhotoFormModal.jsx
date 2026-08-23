import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../data/photos';

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
  });

  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [previewSrc, setPreviewSrc] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Populate form when initialPhoto changes
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
      });
      setPreviewSrc(initialPhoto.src || '');
      setImageMode(initialPhoto.src?.startsWith('data:') ? 'upload' : 'url');
    } else {
      setFormData({
        title: '',
        category: 'personal',
        description: '',
        location: '',
        camera: '',
        date: new Date().toISOString().split('T')[0],
        featured: false,
        src: '',
        tags: '',
      });
      setPreviewSrc('');
      setImageMode('upload');
    }
    setError('');
  }, [initialPhoto, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Limit to ~8MB for local storage safety
    if (file.size > 8 * 1024 * 1024) {
      setError('Image size exceeds 8MB. Please select a smaller photo or compress it.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setPreviewSrc(result);
      setFormData((prev) => ({ ...prev, src: result }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a photo title.');
      return;
    }
    if (!formData.src.trim() && !previewSrc) {
      setError('Please upload a photo file or enter an image URL.');
      return;
    }

    const parsedTags = formData.tags
      ? formData.tags
          .split(',')
          .map((t) => t.trim().replace(/^#/, ''))
          .filter(Boolean)
      : [];

    const photoPayload = {
      id: initialPhoto ? initialPhoto.id : Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      location: formData.location.trim(),
      camera: formData.camera.trim(),
      date: formData.date,
      featured: formData.featured,
      src: formData.src || previewSrc,
      tags: parsedTags,
    };

    onSave(photoPayload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-modal-enter"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden glass-card border-zinc-800 bg-zinc-950/95 shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-xl text-orange-400">
              {isEdit ? '✏️' : '➕'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? 'Edit Photo Details' : 'Add New Photo'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEdit
                  ? 'Update metadata, category, or replace photo'
                  : 'Upload your photo and organize into albums'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Image Picker & Live Preview */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                Photo Source
              </label>

              {/* Source Switcher (Upload vs URL) */}
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-orange-500 text-black shadow font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  📁 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    imageMode === 'url'
                      ? 'bg-orange-500 text-black shadow font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🔗 Image URL
                </button>
              </div>

              {/* Upload Dropzone */}
              {imageMode === 'upload' ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-zinc-700/80 hover:border-orange-500/50 hover:bg-zinc-900/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl mb-3">
                    📸
                  </div>
                  <p className="text-xs font-semibold text-zinc-200">
                    Click to browse or drag & drop photo
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Supports JPG, PNG, WEBP, GIF (up to 8MB)
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={formData.src}
                    onChange={(e) => {
                      setFormData({ ...formData, src: e.target.value });
                      setPreviewSrc(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              )}

              {/* Preview Box */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Preview Stage
                </p>
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 relative flex items-center justify-center">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      onError={() => setError('Unable to load image from given URL/file.')}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <span className="text-zinc-400 text-3xl">🖼️</span>
                      <p className="text-xs text-zinc-400 mt-1">No image selected</p>
                    </div>
                  )}

                  {formData.featured && previewSrc && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-black shadow">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Metadata Form Fields */}
            <div className="lg:col-span-7 space-y-4">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Photo Title <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Sunset Over Himalayas"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Album / Category <span className="text-orange-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white focus:outline-none focus:border-orange-500 transition bg-zinc-900 cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Camera */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Manali, Himachal Pradesh"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Camera & Lens
                  </label>
                  <input
                    type="text"
                    value={formData.camera}
                    onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                    placeholder="e.g. Sony A7 IV • 24-70mm"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              {/* Date & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Date Captured
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white focus:outline-none focus:border-orange-500 transition bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Mountains, Sunset, Nature"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Story / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the moment, mood, or background story..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-xs text-zinc-200 cursor-pointer select-none">
                  <span className="font-bold text-orange-400">Featured Photograph:</span> Display this photo prominently on the Homepage Hero and Highlights section.
                </label>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer"
            >
              {isEdit ? 'Save Changes' : 'Add To Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoFormModal;
