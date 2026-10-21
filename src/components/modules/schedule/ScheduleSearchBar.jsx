import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function ScheduleSearchBar({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  totalResults
}) {
  const filterOptions = [
    { key: 'all', label: 'الكل' },
    { key: 'practical', label: 'تطبيقات ومعامل 💻' },
    { key: 'theory', label: 'محاضرات عامة 📚' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
      
      {/* Search Input Box */}
      <div className="relative flex-1">
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9d9797] pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم المادة، الأستاذ، أو رقم المدرج والمعمل..."
          className="w-full bg-[#1a1624] border border-[#3e3a46]/70 focus:border-[#fd8925] rounded-xl text-xs text-white placeholder-[#9d9797] py-2.5 pr-10 pl-9 outline-none transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d9797] hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1a1624] border border-[#3e3a46]/60 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
        {filterOptions.map((opt) => {
          const isActive = filterType === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onFilterChange(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#2c2834] text-white border border-white/10 shadow-sm font-bold'
                  : 'text-[#9d9797] hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

    </div>
  );
}
