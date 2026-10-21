import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { msg, type = 'info' } = toast;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#fd8925] shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40',
    warning: 'border-amber-500/40',
    error: 'border-red-500/40',
    info: 'border-[#fd8925]/40'
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md pointer-events-none animate-slide-down">
      <div
        className={`pointer-events-auto bg-[#1b1728]/95 backdrop-blur-md border ${
          borders[type] || borders.info
        } text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs md:text-sm font-medium`}
      >
        {icons[type] || icons.info}
        <span className="flex-1 text-right leading-relaxed">{msg}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[#9d9797] hover:text-white p-1 rounded-lg text-xs"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
