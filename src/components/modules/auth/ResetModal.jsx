import React, { useState } from 'react';
import { Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';

export default function ResetModal({ isOpen, onClose }) {
  const { triggerToast } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
      triggerToast('تم إرسال رابط استعادة كلمة المرور إلى بريدك الأكاديمي ✅', 'success');
    } catch (err) {
      triggerToast(err.message || 'تعذر إرسال الرابط', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="استعادة كلمة المرور"
      subtitle="أدخل بريدك الأكاديمي المسجل لاستلام رمز التحقق"
      maxWidth="max-w-sm"
    >
      {sent ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">تم إرسال الرابط بنجاح</h4>
            <p className="text-xs text-[#9d9797] mt-1 leading-relaxed">
              يرجى مراجعة صندوق الوارد في بريدك الأكاديمي <span className="text-white font-mono">{email}</span> لتعيين كلمة مرور جديدة.
            </p>
          </div>
          <Button variant="frosted-ghost" size="sm" onClick={handleClose} className="w-full">
            تم، إغلاق النافذة
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <Input
            label="البريد الإلكتروني الأكاديمي"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            placeholder="student@tech.edu.eg"
          />

          <Button
            type="submit"
            variant="ember"
            size="md"
            loading={loading}
            icon={KeyRound}
            className="w-full"
          >
            إرسال رابط الاستعادة
          </Button>
        </form>
      )}
    </Modal>
  );
}
