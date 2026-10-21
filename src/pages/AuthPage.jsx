import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInForm from '../components/modules/auth/SignInForm';
import SignUpForm from '../components/modules/auth/SignUpForm';
import ResetModal from '../components/modules/auth/ResetModal';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Icon & Welcome */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fd8925] to-[#ff0c00] flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-[0_4px_20px_rgba(253,137,37,0.35)]">
            <span>ح</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            منظومة حاضر الإلكترونية
          </h1>
          <p className="text-xs text-[#9d9797]">
            بوابة تسجيل الدخول الذكية لطلاب وأعضاء قسم تكنولوجيا التعليم
          </p>
        </div>

        {/* Auth Card */}
        <Card variant="feature" className="p-6 md:p-8">
          
          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex items-center p-1 rounded-xl bg-[#1b1728] border border-[#3e3a46]/70 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#2c2834] text-white border border-white/10 shadow-sm'
                  : 'text-[#9d9797] hover:text-white'
              }`}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#2c2834] text-white border border-white/10 shadow-sm'
                  : 'text-[#9d9797] hover:text-white'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'login' ? (
            <SignInForm
              onSuccess={handleAuthSuccess}
              onForgotPassword={() => setIsResetOpen(true)}
            />
          ) : (
            <SignUpForm onSuccess={handleAuthSuccess} />
          )}

        </Card>

        {/* Security Notice */}
        <div className="text-center text-[11px] text-[#9d9797]">
          <span>نظام موثق برقم جامعي وبصمة جهاز مادي • إصدار 2.0</span>
        </div>

      </div>

      {/* Password Reset Modal */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
    </div>
  );
}
