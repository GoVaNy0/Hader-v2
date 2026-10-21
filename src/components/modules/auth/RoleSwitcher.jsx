import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function RoleSwitcher({ activeRole, onRoleChange }) {
  return (
    <div className="flex items-center p-1 rounded-xl bg-[#1b1728] border border-[#3e3a46]/70 w-full mb-5">
      <button
        type="button"
        onClick={() => onRoleChange('student')}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          activeRole === 'student'
            ? 'bg-gradient-to-r from-[#fd8925] to-[#ff0c00] text-white shadow-md'
            : 'text-[#9d9797] hover:text-white'
        }`}
      >
        <GraduationCap className="w-4 h-4" />
        <span>طالب جامعي 🎓</span>
      </button>

      <button
        type="button"
        onClick={() => onRoleChange('leader')}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          activeRole === 'leader'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
            : 'text-[#9d9797] hover:text-white'
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-amber-400" />
        <span>ممثل الدفعة (ليدر) 🛡️</span>
      </button>
    </div>
  );
}
