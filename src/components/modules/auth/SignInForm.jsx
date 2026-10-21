import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import RoleSwitcher from './RoleSwitcher';
import { useAuth } from '../../../context/AuthContext';

export default function SignInForm({ onSuccess, onForgotPassword }) {
  const { login } = useAuth();

  const [role, setRole] = useState('student');
  const [identifier, setIdentifier] = useState('20230894');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({
        identifier: identifier.trim(),
        password,
        role
      });
      if (onSuccess) onSuccess();
    } catch {
      // Handled by context toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      
      {/* Role Toggle Switcher */}
      <RoleSwitcher activeRole={role} onRoleChange={setRole} />

      {/* Identifier Input */}
      <Input
        label={role === 'leader' ? 'كود ممثل الدفعة / البريد الرسمي' : 'الرقم الجامعي / كود الطالب الأكاديمي'}
        type="text"
        required
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        icon={User}
        placeholder={role === 'leader' ? 'leader@tech.edu.eg' : 'مثال: 20230894'}
      />

      {/* Password Input */}
      <Input
        label="كلمة المرور"
        type={showPassword ? 'text' : 'password'}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={Lock}
        placeholder="أدخل كلمة المرور الخاصة بك"
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#9d9797] hover:text-white p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      {/* Options Row */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-[#d1cece]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-[#1b1728] border-[#3e3a46] accent-[#fd8925]"
          />
          <span>تذكرني على هذا الجهاز</span>
        </label>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[#fd8925] hover:underline cursor-pointer"
        >
          نسيت كلمة المرور؟
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="ember"
          size="md"
          loading={loading}
          icon={LogIn}
          className="w-full"
        >
          {role === 'leader' ? 'دخول لوحة ممثل الدفعة' : 'تسجيل الدخول للنظام'}
        </Button>
      </div>

    </form>
  );
}
