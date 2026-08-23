import React, { useState } from 'react';

const ExportModal = ({ isOpen, onClose, photos, onResetToDefaults }) => {
  const [copied, setCopied] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(photos, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rohits-gallery-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-modal-enter"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl overflow-hidden glass-card border-zinc-800 bg-zinc-950/95 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-xl">
              💾
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Gallery Data & Backup</h3>
              <p className="text-xs text-zinc-400">Total photos stored: {photos.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Export Photos Dataset
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Download or copy your photos metadata to paste directly into <code className="text-orange-400">src/data/photos.js</code>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{copied ? '✓ Copied to Clipboard!' : '📋 Copy JSON'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl glass-card hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer border-zinc-700"
              >
                <span>📥 Download .JSON File</span>
              </button>
            </div>
          </div>

          {/* Reset To Factory Preset */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Restore Default Photos
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Reset your gallery back to the initial 20 curated preset photos.
              </p>
            </div>

            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetToDefaults();
                    setResetConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer border border-zinc-700/60"
              >
                🔄 Reset to Preset Photos
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
