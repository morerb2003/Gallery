import React from 'react';

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="bg-zinc-900 px-6 py-4 rounded-lg text-center">
        <p className="text-lg font-semibold">Loading...</p>
        <p className="text-sm text-zinc-300 mt-1">Please wait, images are loading.</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

