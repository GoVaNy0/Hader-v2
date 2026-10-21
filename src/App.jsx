import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AttendanceProvider>
          <AppRouter />
        </AttendanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
