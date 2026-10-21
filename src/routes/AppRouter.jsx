import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import HomePage from '../pages/HomePage';
import SchedulePage from '../pages/SchedulePage';
import AttendancePage from '../pages/AttendancePage';
import AuthPage from '../pages/AuthPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
