import React from 'react';

const GalleryGrid = ({ data, onSelectImage }) => {
  if (data.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((item) => (
        <div key={item.id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 hover:border-orange-400/40 transition">
          <img
            src={item.download_url}
            alt={item.author}
            onClick={() => onSelectImage(item)}
            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 hover:scale-[1.01] transition"
          />
          <p className="mt-2 text-sm text-zinc-200">{item.author}</p>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;

