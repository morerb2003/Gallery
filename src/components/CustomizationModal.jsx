import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGallery } from '../context/GalleryContext';

const THEMES = [
  {
    id: 'slate-amber',
    name: 'Slate & Amber',
    tagline: 'Default LensCraft aesthetic',
    bgPreview: '#09090b',
    accentPreview: '#f97316',
    secondaryPreview: '#f59e0b',
  },
  {
    id: 'emerald-obsidian',
    name: 'Emerald & Obsidian',
    tagline: 'Deep organic greens & night obsidian',
    bgPreview: '#030706',
    accentPreview: '#10b981',
    secondaryPreview: '#34d399',
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    tagline: 'Electric cyan, violet & synthwave',
    bgPreview: '#070414',
    accentPreview: '#06b6d4',
    secondaryPreview: '#a855f7',
  },
  {
    id: 'warm-monochrome',
    name: 'Warm Monochrome',
    tagline: 'Minimalist espresso, bronze & parchment',
    bgPreview: '#141210',
    accentPreview: '#d97706',
    secondaryPreview: '#e7e5e4',
  },
];

const CustomizationModal = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    brandConfig,
    updateBrandConfig,
    layoutPreferences,
    updateLayoutPreferences,
  } = useGallery();

  const [activeTab, setActiveTab] = useState('theme'); // 'theme' | 'branding' | 'layout'

  // Local copy of branding for immediate inputs
  const [localBrand, setLocalBrand] = useState(brandConfig);

  if (!isOpen) return null;

  const handleBrandSubmit = (e) => {
    e.preventDefault();
    updateBrandConfig(localBrand);
  };

  const applyBrandPreset = (appName, appSubtitle) => {
    const updated = { ...localBrand, appName, appSubtitle };
    setLocalBrand(updated);
    updateBrandConfig(updated);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel-elevated border-zinc-700/80 p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  LensCraft <span className="text-gradient-theme">Studio</span>
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Customize themes, personal branding, and interactive layout behaviors.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full glass-card hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'theme'
                  ? 'bg-zinc-800 text-white shadow glow-border'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🎨</span> Theme Engine
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'branding'
                  ? 'bg-zinc-800 text-white shadow glow-border'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🏷️</span> Personal Branding
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'layout'
                  ? 'bg-zinc-800 text-white shadow glow-border'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>📐</span> Layout & UX
            </button>
          </div>

          {/* TAB 1: THEME ENGINE */}
          {activeTab === 'theme' && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Select Theme Palette
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time CSS token switching with custom glassmorphism and accent glows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`text-left p-4 rounded-2xl transition-all cursor-pointer border relative overflow-hidden ${
                        isSelected
                          ? 'border-orange-500/80 bg-zinc-900/90 shadow-xl ring-2 ring-orange-500/30'
                          : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-zinc-700'
                      }`}
                      style={{
                        borderColor: isSelected ? t.accentPreview : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white">{t.name}</span>
                        {isSelected && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-black"
                            style={{ backgroundColor: t.accentPreview }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-3">{t.tagline}</p>
                      {/* Swatch Previews */}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: t.bgPreview }}
                          title="Background"
                        />
                        <div
                          className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                          style={{ backgroundColor: t.accentPreview }}
                          title="Primary Accent"
                        />
                        <div
                          className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                          style={{ backgroundColor: t.secondaryPreview }}
                          title="Secondary Accent"
                        />
                        <span className="text-[10px] text-zinc-400 ml-auto font-mono">
                          {t.accentPreview}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL BRANDING */}
          {activeTab === 'branding' && (
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Personal Identity & Tagline
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update your brand title, photographer handle, and portfolio taglines.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => applyBrandPreset('LensCraft', "Rohit's Visual Gallery")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                    localBrand.appName === 'LensCraft'
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  LensCraft
                </button>
                <button
                  type="button"
                  onClick={() => applyBrandPreset("Rohit's Gallery", 'Fine Art & High-Res Photography')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                    localBrand.appName === "Rohit's Gallery"
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  Rohit's Gallery
                </button>
              </div>

              <form onSubmit={handleBrandSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Gallery Brand Title
                    </label>
                    <input
                      type="text"
                      value={localBrand.appName}
                      onChange={(e) => setLocalBrand({ ...localBrand, appName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                      placeholder="e.g. LensCraft"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Brand Subtitle
                    </label>
                    <input
                      type="text"
                      value={localBrand.appSubtitle}
                      onChange={(e) => setLocalBrand({ ...localBrand, appSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                      placeholder="e.g. Rohit's Visual Gallery"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Photographer Name
                    </label>
                    <input
                      type="text"
                      value={localBrand.photographerName}
                      onChange={(e) => setLocalBrand({ ...localBrand, photographerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Portfolio Handle
                    </label>
                    <input
                      type="text"
                      value={localBrand.handle}
                      onChange={(e) => setLocalBrand({ ...localBrand, handle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                      placeholder="@rohit_captures"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Photographer Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={localBrand.tagline}
                    onChange={(e) => setLocalBrand({ ...localBrand, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition cursor-pointer"
                  >
                    Save Branding
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: LAYOUT & INTERACTION PREFERENCES */}
          {activeTab === 'layout' && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Interaction & Layout Modes
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Configure image clicking action and feed pagination style.
                </p>
              </div>

              {/* Detail View Mode Toggle */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Image Click Action
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateLayoutPreferences({ detailViewMode: 'split-view' })}
                    className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
                      layoutPreferences.detailViewMode === 'split-view'
                        ? 'border-orange-500 bg-zinc-900/90 shadow-lg ring-1 ring-orange-500/40'
                        : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🪟</span>
                      <span className="text-xs font-bold text-white">Split-View Detail Modal</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Opens high-res visuals on the left with sticky verified EXIF specs on the right.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateLayoutPreferences({ detailViewMode: 'lightbox' })}
                    className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
                      layoutPreferences.detailViewMode === 'lightbox'
                        ? 'border-orange-500 bg-zinc-900/90 shadow-lg ring-1 ring-orange-500/40'
                        : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📽️</span>
                      <span className="text-xs font-bold text-white">Fullscreen Lightbox Overlay</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Opens a cinematic dark overlay with floating glass HUD and drawer stats.
                    </p>
                  </button>
                </div>
              </div>

              {/* Feed Scroll Mode Toggle */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Feed Pagination Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateLayoutPreferences({ feedScrollMode: 'infinite' })}
                    className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
                      layoutPreferences.feedScrollMode === 'infinite'
                        ? 'border-orange-500 bg-zinc-900/90 shadow-lg ring-1 ring-orange-500/40'
                        : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">♾️</span>
                      <span className="text-xs font-bold text-white">Infinite Vertical Scroll</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Seamless continuous loading with skeleton placeholders as you scroll.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateLayoutPreferences({ feedScrollMode: 'paginated' })}
                    className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
                      layoutPreferences.feedScrollMode === 'paginated'
                        ? 'border-orange-500 bg-zinc-900/90 shadow-lg ring-1 ring-orange-500/40'
                        : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📄</span>
                      <span className="text-xs font-bold text-white">Grid Pagination</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Standard page-by-page controls with jump-to-page numbers.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">All configurations auto-saved to localStorage.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomizationModal;
