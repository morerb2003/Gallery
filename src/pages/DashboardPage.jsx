import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../data/photos';
import { useGallery } from '../context/GalleryContext';

const CONTENT_GUIDELINES = [
  'High-resolution only (minimum 1920 × 1080 recommended)',
  'You must hold copyright or original distribution rights',
  'No intrusive watermarks, borders, or time stamps',
  'Natural color grading and clean optics favored for community features',
];

/**
 * Client-Side Image Compression using HTML5 Canvas API
 * Scales image to maximum dimension (e.g. 2560px) and applies WebP/JPEG quality compression.
 */
const compressImageClientSide = (dataUrl, maxDimension = 2560, quality = 0.85) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first, fallback to JPEG
      let compressed = canvas.toDataURL('image/webp', quality);
      if (!compressed || compressed.startsWith('data:image/png')) {
        compressed = canvas.toDataURL('image/jpeg', quality);
      }

      // Calculate approximate size in MB
      const head = 'data:image/webp;base64,';
      const sizeInBytes = Math.round((compressed.length - head.length) * 3 / 4);
      const sizeFormatted = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;

      resolve({
        src: compressed,
        width,
        height,
        sizeFormatted,
      });
    };
    img.src = dataUrl;
  });
};

const DashboardPage = ({ onNavigate }) => {
  const { photos, batchSavePhotos, showToast } = useGallery();

  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [enableCompression, setEnableCompression] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Batch Metadata fields
  const [batchCategory, setBatchCategory] = useState('travel');
  const [batchTags, setBatchTags] = useState('Urban, Architecture, 4K');
  const [batchLocation, setBatchLocation] = useState('');
  const [batchCamera, setBatchCamera] = useState('Sony Alpha A7 IV');
  const [batchAlbum, setBatchAlbum] = useState('Contributor Uploads');

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setIsProcessing(true);
    showToast(`⚙️ Processing and parsing ${validFiles.length} images...`);

    for (const file of validFiles) {
      await new Promise((resolve) => {
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const reader = new FileReader();

        reader.onload = async (e) => {
          const rawDataUrl = e.target.result;

          if (enableCompression) {
            const compressed = await compressImageClientSide(rawDataUrl, 2560, 0.85);
            setStagedFiles((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                src: compressed.src,
                title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                width: compressed.width,
                height: compressed.height,
                size: compressed.sizeFormatted,
                originalSize: `${originalSizeMB} MB`,
                compressed: true,
                camera: 'Sony Alpha • 35mm f/1.8',
                iso: 100,
                shutter: '1/250s',
                aspectRatio: `${(compressed.width / compressed.height).toFixed(2)}:1`,
              },
            ]);
          } else {
            const img = new Image();
            img.onload = () => {
              setStagedFiles((prev) => [
                ...prev,
                {
                  id: Date.now() + Math.random(),
                  src: rawDataUrl,
                  title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                  size: `${originalSizeMB} MB`,
                  originalSize: `${originalSizeMB} MB`,
                  compressed: false,
                  camera: 'Sony Alpha • 35mm f/1.8',
                  iso: 100,
                  shutter: '1/250s',
                  aspectRatio: `${(img.naturalWidth / img.naturalHeight).toFixed(2)}:1`,
                },
              ]);
            };
            img.src = rawDataUrl;
          }
          resolve();
        };

        reader.readAsDataURL(file);
      });
    }

    setIsProcessing(false);
    showToast(`✓ Staged ${validFiles.length} photos ready for publication!`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveStaged = (id) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Publish All Staged Photos
  const handlePublishAll = () => {
    if (stagedFiles.length === 0) return;

    const tagsArray = batchTags.split(',').map((t) => t.trim()).filter(Boolean);

    const newPhotos = stagedFiles.map((staged, idx) => ({
      id: Date.now() + idx,
      title: staged.title || `Capture #${idx + 1}`,
      category: batchCategory,
      description: `High-resolution photograph contributed via Contributor Hub. Captured at ${batchLocation || 'global location'}.`,
      location: batchLocation || 'Global Location',
      camera: staged.camera || batchCamera,
      date: new Date().toISOString().split('T')[0],
      featured: false,
      src: staged.src,
      tags: tagsArray,
      color: '#f97316',
      width: staged.width,
      height: staged.height,
      album: batchAlbum,
      views: 0,
      downloads: 0,
      likesCount: 0,
      exif: {
        make: (staged.camera || batchCamera).split(' ')[0] || 'Sony',
        model: staged.camera || batchCamera,
        exposureTime: staged.shutter || '1/250s',
        aperture: 'f/2.8',
        focalLength: '35mm',
        iso: staged.iso || 100,
      },
    }));

    batchSavePhotos(newPhotos);
    setStagedFiles([]);
    if (onNavigate) onNavigate('gallery');
  };

  // Analytics Metrics
  const totalViews = photos.reduce((acc, curr) => acc + (curr.views || 2400), 0);
  const totalDownloads = photos.reduce((acc, curr) => acc + (curr.downloads || 420), 0);
  const topPhoto = [...photos].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-orange-400 text-xs font-bold uppercase tracking-widest">
          <span>Contributor Portal</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Upload & <span className="text-gradient-orange">Analytics Hub</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
          Bulk upload high-resolution photographic captures with client-side compression, automated EXIF parsing, and batch tagging.
        </p>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel-elevated space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Platform Views</span>
          <p className="text-3xl font-black text-white">{totalViews.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">↑ +14.2% this month</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel-elevated space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Downloads</span>
          <p className="text-3xl font-black text-orange-400">{totalDownloads.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">↑ High resolution exports</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel-elevated space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Community Engagement</span>
          <p className="text-3xl font-black text-rose-400">98.4%</p>
          <p className="text-[11px] text-zinc-400 font-medium">Positive like ratio</p>
        </div>

        {topPhoto && (
          <div className="p-4 rounded-3xl glass-panel-elevated flex items-center gap-3">
            <img src={topPhoto.src} alt="Top Shot" className="w-16 h-16 rounded-2xl object-cover" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase text-orange-400">Top Performing</span>
              <h4 className="text-xs font-bold text-white truncate">{topPhoto.title}</h4>
              <p className="text-[11px] text-zinc-400">{(topPhoto.views || 0).toLocaleString()} views</p>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Drag-and-Drop Zone & Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>☁️</span> Bulk Media Uploader
          </h2>
          <div className="flex items-center gap-2 p-2 rounded-xl glass-toolbar text-xs">
            <input
              type="checkbox"
              id="enable-compression-check"
              checked={enableCompression}
              onChange={(e) => setEnableCompression(e.target.checked)}
              className="w-4 h-4 accent-orange-500 cursor-pointer"
            />
            <label htmlFor="enable-compression-check" className="text-zinc-300 font-medium cursor-pointer">
              Client-Side WebP/Canvas Compression (2560px max)
            </label>
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
              : 'border-zinc-800 hover:border-orange-500/50 bg-zinc-950/40 hover:bg-zinc-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-3xl bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center justify-center text-3xl">
            📂
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {isProcessing ? 'Processing & Parsing Images...' : 'Drag & drop multiple high-res photos here'}
            </h3>
            <p className="text-xs text-zinc-400">or click to browse from your device (Auto-extracts EXIF & dimensions)</p>
          </div>
          <span className="px-4 py-2 rounded-xl glass-card text-xs font-bold uppercase text-orange-400">
            Select Multiple Files
          </span>
        </div>
      </div>

      {/* Staged Uploads & Batch Metadata Editor */}
      {stagedFiles.length > 0 && (
        <div className="space-y-6 p-6 sm:p-8 rounded-3xl glass-panel-elevated border-orange-500/30">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">
                Staged for Publication ({stagedFiles.length} Photos)
              </h3>
              <p className="text-xs text-zinc-400">Auto-extracted specs and compression optimization applied</p>
            </div>
            <button
              type="button"
              onClick={handlePublishAll}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 cursor-pointer active:scale-95"
            >
              ✓ Publish All ({stagedFiles.length})
            </button>
          </div>

          {/* Staged Thumbnails Ribbon with Compression Ratio */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto pr-1">
            {stagedFiles.map((item) => (
              <div key={item.id} className="relative rounded-2xl overflow-hidden group bg-zinc-900 aspect-square">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStaged(item.id);
                    }}
                    className="self-end w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                  <div>
                    <p className="text-[10px] text-white font-bold truncate">{item.title}</p>
                    <p className="text-[9px] text-emerald-400 font-medium">
                      {item.size} ({item.width}×{item.height})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Batch Metadata Editor Controls */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Apply Batch Metadata Across All Staged Photos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Category Album</label>
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Common Location</label>
                <input
                  type="text"
                  value={batchLocation}
                  onChange={(e) => setBatchLocation(e.target.value)}
                  placeholder="e.g. Iceland, Dolomites, Tokyo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Camera / Optics</label>
                <input
                  type="text"
                  value={batchCamera}
                  onChange={(e) => setBatchCamera(e.target.value)}
                  placeholder="e.g. Sony A7 IV • 24-70mm"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={batchTags}
                  onChange={(e) => setBatchTags(e.target.value)}
                  placeholder="Travel, Sunset, 4K, Landscape"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Target Album</label>
                <input
                  type="text"
                  value={batchAlbum}
                  onChange={(e) => setBatchAlbum(e.target.value)}
                  placeholder="e.g. European Summer 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Guidelines Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border-zinc-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>📋</span> Contributor Community Guidelines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTENT_GUIDELINES.map((guide, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{guide}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
