import React from 'react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📸</span>
              <span className="text-xl font-black text-white">
                Rohit's <span className="text-gradient-orange">Gallery</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm">
              A personal photography collection celebrating nature, travel adventures, cityscapes, and visual arts. Built with React & Tailwind CSS.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Explore Full Gallery
                </button>
              </li>
              <li>
                <a href="#featured" onClick={() => onNavigate('home')} className="hover:text-orange-400 transition-colors">
                  Featured Highlights
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Albums</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><span className="text-zinc-500">📷</span> Personal Portraits</li>
              <li><span className="text-zinc-500">🏞️</span> Travel & Expeditions</li>
              <li><span className="text-zinc-500">🌄</span> Mountain & Nature</li>
              <li><span className="text-zinc-500">🏙️</span> Urban & Architecture</li>
              <li><span className="text-zinc-500">🎨</span> Abstract & Creative</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Rohit's Gallery. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-orange-500">♥</span> for visual storytellers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
