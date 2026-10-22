import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';

// Dynamic lazy imports for route-based code-splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const SchedulePage = lazy(() => import('../pages/SchedulePage'));
const AttendancePage = lazy(() => import('../pages/AttendancePage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// High-craft, dark-liquid-glass loading fallback adhering to front_skill design tokens
function PageLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="جارِ تحميل الصفحة"
      className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-4"
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Subtle ambient ring */}
        <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
        {/* High precision spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-[#fd8925]/20 border-t-[#fd8925] animate-spin" />
      </div>
      <span className="text-xs font-medium text-[#9d9797] tracking-wide animate-pulse">
        جارِ تحميل البيانات الأكاديمية...
      </span>
    </div>
  );
}

export default function AppRouter() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
