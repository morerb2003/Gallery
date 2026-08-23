import React, { useState } from 'react';

const Navbar = ({ activePage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              Rohit's <span className="text-gradient-orange">Gallery</span>
            </span>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Visual Storyteller</p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-full bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md">
          <button
            onClick={() => onNavigate('home')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              activePage === 'home'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              activePage === 'gallery'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            Explore Gallery
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onNavigate('gallery')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full hover:bg-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer"
          >
            <span>20 Photos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-modal-enter">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
              activePage === 'home'
                ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30'
                : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <span>🏠 Home</span>
            {activePage === 'home' && <span className="text-xs">Active</span>}
          </button>
          <button
            onClick={() => {
              onNavigate('gallery');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
              activePage === 'gallery'
                ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30'
                : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <span>🖼️ Explore Gallery</span>
            {activePage === 'gallery' && <span className="text-xs">Active</span>}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
