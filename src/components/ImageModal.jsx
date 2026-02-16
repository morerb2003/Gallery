import React from 'react';

const ImageModal = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full h-full p-3 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="h-full flex items-center justify-center p-3 md:p-5">
              <img
                src={selectedImage.download_url}
                alt={selectedImage.author}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
          </div>

          <div className="xl:col-span-2 rounded-2xl bg-linear-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl p-5 md:p-6 overflow-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-400">Photo Details</p>
                <h2 className="text-2xl font-semibold text-white mt-1">{selectedImage.author}</h2>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                aria-label="Close image popup"
              >
                X
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-400">Image ID</p>
                <p className="text-sm font-medium text-zinc-100">{selectedImage.id}</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-400">Resolution</p>
                <p className="text-sm font-medium text-zinc-100">{selectedImage.width} x {selectedImage.height}</p>
              </div>
            </div>

            <a
              href={selectedImage.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-5 items-center justify-center bg-orange-500 hover:bg-orange-400 text-black font-medium px-4 py-2 rounded-lg transition"
            >
              Open Source Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

