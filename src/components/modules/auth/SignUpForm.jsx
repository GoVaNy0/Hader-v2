import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Sparkles, School, Hash, Check } from 'lucide-react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useAuth } from '../../../context/AuthContext';

export default function SignUpForm({ onSuccess }) {
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [academicDivision, setAcademicDivision] = useState('sec2_tech_general');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const divisionOptions = [
    { value: 'sec1_tech', label: 'الفرقة الأولى - تكنولوجيا تعليم' },
    { value: 'sec2_tech_general', label: 'الفرقة الثانية - تكنولوجيا تعليم (عام)' },
    { value: 'sec2_tech_teacher', label: 'الفرقة الثانية - إعداد معلم حاسب آلي' },
    { value: 'sec3_tech_instructional', label: 'الفرقة الثالثة - تكنولوجيا وتصميم تعليمي' },
    { value: 'sec4_tech_graduation', label: 'الفرقة الرابعة - تكنولوجيا ومشاريع التخرج' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('يرجى الموافقة على ميثاق الأمان واللوائح الجامعية');
      return;
    }

    setLoading(true);
    try {
      const selectedDivisionObj = divisionOptions.find(d => d.value === academicDivision);
      await signup({
        fullName,
        studentCode,
        academicDivision,
        academicDivisionLabel: selectedDivisionObj ? selectedDivisionObj.label : 'الفرقة الثانية',
        email,
        password
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-right">
      
      {/* Full Name */}
      <Input
        label="الاسم الرباعي الرسمي (كما بالبطاقة الجامعية)"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        icon={User}
        placeholder="مثال: جوفاني أيمن جورج"
      />

      {/* Student Code & Email in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="الرقم الجامعي / كود الطالب"
          required
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
          icon={Hash}
          placeholder="مثال: 20230894"
        />

        <Input
          label="البريد الجامعي أو الشخصي"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          placeholder="student@tech.edu.eg"
        />
      </div>

      {/* Division Selector */}
      <div className="space-y-1.5">
        <label htmlFor="signup-division" className="block text-xs font-semibold text-[#d1cece]">الشعبة والفرقة الدراسية</label>
        <select
          id="signup-division"
          value={academicDivision}
          onChange={(e) => setAcademicDivision(e.target.value)}
          className="w-full bg-[#1b1728] border border-[#3e3a46] rounded-lg text-xs text-white p-2.5 outline-none focus:border-[#fd8925]"
        >
          {divisionOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1b1728]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="كلمة المرور"
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          placeholder="8 أحرف على الأقل"
        />

        <Input
          label="تأكيد كلمة المرور"
          type={showPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={Lock}
          placeholder="أعد إدخال كلمة المرور"
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#9d9797] hover:text-white p-1"
              aria-label={showPassword ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
      </div>

      {/* Terms Checkbox */}
      <div className="pt-1">
        <label htmlFor="agree-terms-checkbox" className="flex items-start gap-2 cursor-pointer text-xs text-[#d1cece]">
          <input
            id="agree-terms-checkbox"
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded bg-[#1b1728] border-[#3e3a46] accent-[#fd8925]"
          />
          <span className="leading-relaxed">
            أقر بصحة البيانات وأوافق على ربط الحساب بجهاز الهاتف الشخصي وفقاً للائحة الحضور الإلكتروني لقسم تكنولوجيا التعليم.
          </span>
        </label>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="ember"
          size="md"
          loading={loading}
          icon={Sparkles}
          className="w-full"
        >
          إنشاء الحساب وتفعيل البطاقة الرقمية
        </Button>
      </div>

    </form>
  );
}
