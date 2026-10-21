import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Lock, ShieldCheck, GraduationCap, Smartphone } from 'lucide-react';
import Modal from '../../common/Modal';
import Badge from '../../common/Badge';
import { useAuth } from '../../../context/AuthContext';
import { useAttendance } from '../../../context/AttendanceContext';

export default function StudentCardModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { qrToken, qrCountdown } = useAttendance();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="بطاقة الحضور الأكاديمية الرقمية"
      subtitle="رمز الاستجابة السريعة الديناميكي المؤقت"
      maxWidth="max-w-sm"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* Student Meta Header */}
        <div className="w-full p-3.5 rounded-2xl bg-[#1b1728] border border-[#3e3a46]/60 flex items-center gap-3 text-right">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fd8925] to-[#ff0c00] flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user?.name ? user.name.charAt(0) : 'ج'}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white leading-tight">{user?.name || 'جوفاني أيمن'}</h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#9d9797]">
              <span className="font-mono">{user?.code || '20230894'}</span>
              <span>•</span>
              <span>الفرقة الثانية</span>
            </div>
          </div>
          <Badge variant="success" size="xs" icon={ShieldCheck}>
            موثق
          </Badge>
        </div>

        {/* Dynamic QR Code Surface */}
        <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-[#2c2834] relative">
          <QRCodeSVG
            value={qrToken}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Countdown & Rotation Telemetry */}
        <div className="w-full flex items-center justify-between px-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#9d9797]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>يتجدد خلال:</span>
          </div>
          <span className="font-mono font-bold text-[#fd8925] bg-[#2c2834] px-2.5 py-0.5 rounded-md border border-white/10">
            {qrCountdown} ثانية
          </span>
        </div>

        {/* Device Binding Safeguard */}
        <div className="w-full p-3 rounded-xl bg-[#0e0918] border border-[#3e3a46]/50 text-right space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9d9797] flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-[#d1cece]" />
              <span>الجهاز المربوط:</span>
            </span>
            <span className="text-white font-mono text-[10px]">{user?.deviceBound?.model || 'iPhone 15 Pro'}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Lock className="w-3 h-3" />
            <span>محمي بخوارزمية مكافحة التمرير والالتقاط (Anti-Screenshot Token)</span>
          </div>
        </div>

      </div>
    </Modal>
  );
}
