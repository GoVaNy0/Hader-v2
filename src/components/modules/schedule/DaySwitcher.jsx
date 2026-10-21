import React from 'react';
import { Calendar, SunMedium, Sparkles } from 'lucide-react';
import Button from '../../common/Button';
import Badge from '../../common/Badge';

export default function DaySwitcher({
  daysList,
  selectedDay,
  onSelectDay,
  onSelectToday,
  todayKey
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
      
      {/* 3 Day Switcher Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-[#1a1624] border border-[#3e3a46]/60 w-full sm:w-auto">
        {daysList.map((day) => {
          const isSelected = selectedDay === day.key;
          const isToday = todayKey === day.key;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onSelectDay(day.key)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#fd8925] to-[#ff0c00] text-white shadow-md'
                  : 'text-[#9d9797] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{day.label}</span>
              {isToday && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-emerald-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Jump to Today Button */}
      <Button
        variant="frosted-ghost"
        size="sm"
        icon={Calendar}
        onClick={onSelectToday}
        className="w-full sm:w-auto"
      >
        <span>الانتقال لليوم 📅</span>
      </Button>

    </div>
  );
}
