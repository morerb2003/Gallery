import React from 'react';

const DeleteConfirmModal = ({ isOpen, photo, onClose, onConfirm }) => {
  if (!isOpen || !photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-modal-enter"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden glass-card border-red-900/50 bg-zinc-950/95 shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-2xl text-red-400 mx-auto">
          🗑️
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-white">Delete Photograph?</h3>
          <p className="text-xs text-zinc-400">
            Are you sure you want to remove <span className="text-white font-semibold">"{photo.title}"</span> from your gallery? This action will remove it from your albums and cannot be undone.
          </p>
        </div>

        {/* Mini Preview Thumbnail */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <img
            src={photo.src}
            alt={photo.title}
            onError={(e) => {
              if (photo.fallbackSrc && e.target.src !== photo.fallbackSrc) {
                e.target.src = photo.fallbackSrc;
              }
            }}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="overflow-hidden text-left">
            <p className="text-xs font-bold text-white truncate">{photo.title}</p>
            <p className="text-[11px] text-orange-400 font-medium uppercase">{photo.category}</p>
            <p className="text-[10px] text-zinc-500 truncate">{photo.location || photo.date}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(photo.id);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/25 transition cursor-pointer"
          >
            Yes, Delete Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
