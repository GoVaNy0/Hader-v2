import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Calendar, QrCode, ShieldAlert, User, ScanLine } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileDock({ onQuickScan }) {
  const location = useLocation();
  const { isLeader } = useAuth();

  const navItems = [
    { to: '/', label: 'الرئيسية', icon: HomeIcon },
    { to: '/schedule', label: 'الجدول', icon: Calendar },
    {
      isCenter: true,
      label: isLeader ? 'توليد' : 'مسح',
      icon: isLeader ? QrCode : ScanLine,
      onClick: onQuickScan
    },
    { to: '/attendance', label: 'الحضور', icon: QrCode },
    { to: '/auth', label: 'الحساب', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e0918]/95 backdrop-blur-xl border-t border-[#3e3a46] px-3 py-2 pb-safe">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <button
                key="center-action"
                type="button"
                onClick={item.onClick}
                className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-[#fd8925] to-[#ff0c00] text-white flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(253,137,37,0.4)] active:scale-95 transition-transform border-2 border-[#0e0918]"
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
              </button>
            );
          }

          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to || index}
              to={item.to}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-[#ffffff]' : 'text-[#9d9797] hover:text-[#d1cece]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#fd8925]' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold text-white' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
