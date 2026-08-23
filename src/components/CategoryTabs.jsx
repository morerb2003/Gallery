import React from 'react';
import { CATEGORIES } from '../data/photos';

const CategoryTabs = ({ selectedCategory, onSelectCategory, getCategoryCount }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 flex items-center justify-start sm:justify-center gap-2.5 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = getCategoryCount(cat.id);

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                : 'glass-card text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isSelected
                  ? 'bg-black/30 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
