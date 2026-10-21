import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center border border-red-500/30">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">404</h1>
        <h2 className="text-base font-semibold text-[#d1cece]">الصفحة غير موجودة</h2>
        <p className="text-xs text-[#9d9797] max-w-sm">
          عذراً، المسار الذي تحاول الوصول إليه غير متاح في منصة حاضر.
        </p>
      </div>

      <Link to="/">
        <Button variant="ember" size="md" icon={HomeIcon}>
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
}
