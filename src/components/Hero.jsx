import React from 'react';

const Hero = ({ onExplore, featuredPhotos, onSelectPhoto }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-20 right-1/4 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-yellow-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span>Personal Portfolio & Archive</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
                Moments Captured <br className="hidden sm:inline" />
                <span className="text-gradient-orange">In Light & Time</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Welcome to Rohit's curated photography gallery. Explore a visual journey across landscapes, portraits, urban stories, and abstract captures.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-bold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 group"
              >
                <span>Explore Full Gallery</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href="#featured"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-card text-zinc-200 font-semibold text-base hover:text-white hover:border-zinc-600 hover:bg-zinc-800/60 transition-all text-center"
              >
                View Highlights
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">20+</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Curated Shots</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">5</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Albums</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">4K</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Resolution</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Visual Cards Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Back Card Decoration */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-orange-500/20 transform -rotate-3 scale-95 pointer-events-none"></div>

              {/* Main Featured Photo Card */}
              {featuredPhotos.length > 0 && (
                <div
                  onClick={() => onSelectPhoto(featuredPhotos[0])}
                  className="relative group rounded-3xl overflow-hidden glass-card border-zinc-700/60 shadow-2xl cursor-pointer hover:border-orange-500/50 transition-all duration-500"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={featuredPhotos[0].src}
                      alt={featuredPhotos[0].title}
                      onError={(e) => {
                        if (featuredPhotos[0].fallbackSrc && e.target.src !== featuredPhotos[0].fallbackSrc) {
                          e.target.src = featuredPhotos[0].fallbackSrc;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                  {/* Content Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500 text-black shadow-lg">
                      Featured
                    </span>
                  </div>

                  {/* Bottom details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                    <span className="text-xs font-medium uppercase tracking-widest text-orange-400">
                      {featuredPhotos[0].category} • {featuredPhotos[0].location}
                    </span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      {featuredPhotos[0].title}
                    </h3>
                    <p className="text-xs text-zinc-300 line-clamp-2">
                      {featuredPhotos[0].description}
                    </p>
                  </div>
                </div>
              )}

              {/* Floating Mini Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-4 sm:-left-8 glass-card border-zinc-700 p-4 rounded-2xl shadow-xl flex items-center gap-3.5 backdrop-blur-xl animate-float">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-lg">
                  ✨
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Full Screen Lightbox</p>
                  <p className="text-[11px] text-zinc-400">Click any photo to expand</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
