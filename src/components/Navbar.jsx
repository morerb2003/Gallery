import React, { useState } from 'react';
import { useGallery } from '../context/GalleryContext';

const Navbar = ({
  activePage,
  onNavigate,
  totalPhotos,
  onOpenAddModal,
  onOpenExportModal,
  onOpenCustomizationModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { brandConfig, theme } = useGallery();

  const navLinks = [
    { id: 'home', label: 'Discover' },
    { id: 'gallery', label: 'Explore' },
    { id: 'collections', label: 'Collections' },
    { id: 'dashboard', label: 'Contributor Hub' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-[1.5px] shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <span className="text-xl">📸</span>
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-orange-400 transition-colors">
              {brandConfig?.appName || 'LensCraft'}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
              {brandConfig?.appSubtitle || "Rohit's Visual Gallery"}
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activePage === link.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Controls & User Profile Avatar */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Studio / Customization Trigger */}
          <button
            onClick={onOpenCustomizationModal}
            title="Open LensCraft Studio (Theme, Branding & Layout)"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white glass-card hover:bg-zinc-800 rounded-full border-zinc-700/80 shadow-md transition-all cursor-pointer hover:border-orange-500/50"
          >
            <span>✨</span>
            <span className="hidden xl:inline">Studio</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-orange-500 to-amber-400 rounded-full hover:from-orange-400 hover:to-amber-300 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <span>➕ Upload</span>
          </button>

          <button
            onClick={onOpenExportModal}
            title="Backup / Export Gallery Data"
            className="w-9 h-9 rounded-full glass-card hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border-zinc-700/80 transition cursor-pointer"
          >
            💾
          </button>

          {/* Profile Avatar Button */}
          <button
            onClick={() => onNavigate('profile')}
            title="My Profile & Portfolio"
            className={`w-10 h-10 rounded-full p-[1.5px] transition-transform hover:scale-105 cursor-pointer ${
              activePage === 'profile'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 ring-2 ring-orange-500/50'
                : 'bg-zinc-800 hover:bg-zinc-700'
            }`}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-xl bg-orange-500 text-black font-bold text-xs flex items-center gap-1 shadow"
          >
            <span>➕ Upload</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 rounded-full overflow-hidden border border-orange-500/40"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-800 bg-zinc-950/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-modal-enter">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                activePage === link.id
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <span>{link.label}</span>
              {activePage === link.id && <span className="text-xs">Active</span>}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('profile');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-900 flex items-center justify-between"
          >
            <span>👤 My Profile & Portfolio</span>
          </button>
          <button
            onClick={() => {
              onOpenCustomizationModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 flex items-center justify-between"
          >
            <span>✨ LensCraft Studio (Theme & Branding)</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
