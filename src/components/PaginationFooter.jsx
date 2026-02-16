import React from 'react';

const PaginationFooter = ({ loading, page, onPrevious, onNext }) => {
  return (
    <footer className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-center gap-3">
      <button
        onClick={onPrevious}
        disabled={page === 1 || loading}
        className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-md"
      >
        {loading ? 'Loading...' : 'Next'}
      </button>
    </footer>
  );
};

export default PaginationFooter;

