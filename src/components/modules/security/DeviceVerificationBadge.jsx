import React from 'react';
import { Smartphone, ShieldCheck, Lock, RefreshCw } from 'lucide-react';
import Badge from '../../common/Badge';
import { useDeviceBinding } from '../../../hooks/useDeviceBinding';

export default function DeviceVerificationBadge({ className = '' }) {
  const { device, deviceId, model, isTrusted, resetBinding } = useDeviceBinding();

  return (
    <div className={`p-4 rounded-2xl bg-[#1a1624] border border-[#3e3a46]/60 text-right ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2c2834] flex items-center justify-center text-[#fd8925]">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">توثيق الجهاز المادي (Hardware Binding)</h4>
            <span className="text-[10px] text-[#9d9797]">بصمة الأمان الفريدة للطالب</span>
          </div>
        </div>

        <Badge variant={isTrusted ? 'success' : 'warning'} size="xs" icon={ShieldCheck}>
          {isTrusted ? 'جهاز موثق' : 'غير مقترن'}
        </Badge>
      </div>

      <div className="p-2.5 rounded-xl bg-[#1b1728] border border-[#3e3a46]/40 flex items-center justify-between text-xs font-mono">
        <span className="text-[#9d9797] text-[11px] font-sans">معرف الجهاز:</span>
        <span className="text-white font-bold">{deviceId}</span>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-[#9d9797]">
        <span className="flex items-center gap-1 text-emerald-400">
          <Lock className="w-3 h-3" />
          <span>مرتبط بحساب أكاديمي واحد فقط</span>
        </span>

        <button
          type="button"
          onClick={resetBinding}
          className="text-[#fd8925] hover:underline flex items-center gap-1 cursor-pointer"
          aria-label="تجديد بصمة الجهاز"
        >
          <RefreshCw className="w-3 h-3" />
          <span>تجديد البصمة</span>
        </button>
      </div>
    </div>
  );
}
