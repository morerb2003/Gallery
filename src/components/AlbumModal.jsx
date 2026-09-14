import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AlbumModal = ({
  isOpen,
  onClose,
  albums = [],
  onCreateAlbum,
  onAssignToAlbum,
  selectedPhotoIds = [],
}) => {
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [mode, setMode] = useState('create'); // 'create' | 'assign'

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    const album = {
      id: `album-${Date.now()}`,
      name: newAlbumName.trim(),
      description: newAlbumDesc.trim(),
      createdAt: new Date().toISOString(),
      photoCount: selectedPhotoIds.length,
    };
    onCreateAlbum(album, selectedPhotoIds);
    setNewAlbumName('');
    setNewAlbumDesc('');
    onClose();
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedAlbumId) return;
    onAssignToAlbum(selectedAlbumId, selectedPhotoIds);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-modal-enter"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl glass-panel-elevated border-zinc-700/80 p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Collections & Albums</span>
            </div>
            <h3 className="text-xl font-black text-white">
              {selectedPhotoIds.length > 0
                ? `Organize ${selectedPhotoIds.length} Selected Photos`
                : 'Manage Custom Albums'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher if existing albums exist */}
        {albums.length > 0 && selectedPhotoIds.length > 0 && (
          <div className="flex items-center p-1 rounded-xl glass-toolbar border-white/10">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'create'
                  ? 'bg-orange-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              + Create New Album
            </button>
            <button
              type="button"
              onClick={() => setMode('assign')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'assign'
                  ? 'bg-orange-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Add to Existing ({albums.length})
            </button>
          </div>
        )}

        {mode === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Album Title <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                required
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="e.g. Kyoto Summer 2026, Architectural Lines"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={newAlbumDesc}
                onChange={(e) => setNewAlbumDesc(e.target.value)}
                placeholder="Brief summary or story behind this album collection..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl glass-card text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                Create Album {selectedPhotoIds.length > 0 && `& Assign (${selectedPhotoIds.length})`}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Select Destination Album
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => setSelectedAlbumId(album.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      selectedAlbumId === album.id
                        ? 'bg-orange-500/15 border-orange-500 text-white'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold">{album.name}</h4>
                      {album.description && (
                        <p className="text-xs text-zinc-400 truncate max-w-xs">
                          {album.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-orange-400">
                      {album.photoCount || 0} items
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl glass-card text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedAlbumId}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Add {selectedPhotoIds.length} Photos
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AlbumModal;
