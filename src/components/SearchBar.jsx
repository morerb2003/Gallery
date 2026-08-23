import React from 'react';

const SearchBar = ({ searchQuery, onSearchChange, totalCount, filteredCount }) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, location, camera, or description..."
          className="w-full pl-11 pr-24 py-3.5 rounded-2xl glass-card text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
        />

        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors cursor-pointer"
          >
            Clear
          </button>
        ) : (
          <span className="absolute right-4 text-xs font-medium text-zinc-400">
            {filteredCount} / {totalCount}
          </span>
        )}
      </div>

      {searchQuery && (
        <p className="text-xs text-zinc-400 mt-2 text-center">
          Showing <span className="text-orange-400 font-semibold">{filteredCount}</span> results matching "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default SearchBar;
