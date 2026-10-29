import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  Bell,
  LogIn,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Home as HomeIcon,
  QrCode,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onOpenNotifications }) {
  const { user, isLeader, toggleRole, triggerToast } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'الرئيسية', icon: HomeIcon },
    { to: '/schedule', label: 'الجدول الأكاديمي', icon: Calendar },
    { to: '/attendance', label: 'محرك الحضور', icon: QrCode },
    { to: '/attendance?tab=incidents', label: 'سجل الأمان', icon: ShieldAlert }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0e0918]/90 backdrop-blur-md border-b border-[#3e3a46] h-[66px] flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* Brand & Monogram */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#fd8925] to-[#ff0c00] flex items-center justify-center text-white font-bold text-lg shadow-[0_2px_10px_rgba(253,137,37,0.3)] transition-transform group-hover:scale-105">
              <span>ح</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                حاضر <span className="text-xs px-1.5 py-0.5 rounded bg-[#2c2834] text-[#fd8925] font-mono border border-white/10">v2.0</span>
              </span>
              <span className="text-[10px] text-[#9d9797] -mt-0.5">قسم تكنولوجيا التعليم</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="القائمة الرئيسية" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || (link.to.includes('?') && location.search === link.to.split('?')[1]);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2c2834] text-white border border-white/10 shadow-sm'
                      : 'text-[#d1cece] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#9d9797]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Dev Role Switcher, Streak, Notifications, Auth */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Role Switcher for Testing (Dev Mode) */}
          <button
            type="button"
            onClick={toggleRole}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isLeader
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
            title="اضغط للتبديل الفوري بين وضع الطالب ووضع ممثل الدفعة"
            aria-label={isLeader ? 'التبديل إلى وضع الطالب' : 'التبديل إلى وضع ممثل الدفعة'}
          >
            {isLeader ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>ممثل الدفعة 🛡️</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>وضع الطالب 🎓</span>
              </>
            )}
          </button>

          {/* Attendance Streak Badge */}
          <button
            type="button"
            onClick={() => triggerToast(`سلسلة الالتزام الحالية: ${user.streakDays || 12} يوماً متتالياً بدون غياب 🔥`)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1624] border border-[#3e3a46] text-amber-400 text-xs font-bold cursor-pointer hover:border-amber-500/40 transition-colors"
            title="أيام الالتزام المتتالية بالحضور"
            aria-label={`سلسلة الالتزام: ${user?.streakDays || 12} يوماً متتالياً`}
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{user.streakDays || 12} يوم</span>
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-[#1a1624] hover:bg-[#2c2834] text-[#d1cece] hover:text-white border border-[#3e3a46] transition-colors cursor-pointer"
            aria-label="الإشعارات والتنبيهات"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fd8925]"></span>
          </button>

          {/* Auth Link */}
          <Link
            to="/auth"
            className="p-2 rounded-lg bg-[#1a1624] hover:bg-[#2c2834] text-[#d1cece] hover:text-white border border-[#3e3a46] transition-colors flex items-center justify-center"
            title="تسجيل الدخول / الملف الشخصي"
            aria-label="تسجيل الدخول"
          >
            <LogIn className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}
