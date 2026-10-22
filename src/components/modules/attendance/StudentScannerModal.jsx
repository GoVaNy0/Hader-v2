import React, { useState, useEffect } from 'react';
import { Camera, MapPin, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import AttendanceStatusIndicator from './AttendanceStatusIndicator';
import { useAttendance } from '../../../context/AttendanceContext';
import { useAuth } from '../../../context/AuthContext';

export default function StudentScannerModal({
  isOpen,
  onClose,
  lecture
}) {
  const { verifyAttendance, gpsSimStatus, setGpsSimStatus } = useAttendance();
  const { user } = useAuth();
  const [scanStatus, setScanStatus] = useState('scanning');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScanStatus('scanning');
      setIsVerifying(false);
    }
  }, [isOpen]);

  const activeLecture = lecture || {
    id: 'sat-2',
    title: 'تصميم وإنتاج بيئات الوسائط المتكاملة (تطبيقات)',
    location: 'معمل كمبيوتر 274 (الدور الثاني)'
  };

  const handleScan = async () => {
    setIsVerifying(true);
    const success = await verifyAttendance(activeLecture);
    if (success) {
      setScanStatus('confirmed');
      setTimeout(() => {
        setIsVerifying(false);
        onClose();
      }, 1300);
    } else {
      setIsVerifying(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ماسح الحضور الذكي بالكاميرا"
      subtitle={activeLecture.title}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* Interactive 60fps SVG Attendance Indicator */}
        <AttendanceStatusIndicator
          status={scanStatus}
          onStatusChange={setScanStatus}
          size={240}
          showLabel={false}
          interactive={false}
        />

        <div className="flex items-center justify-between w-full max-w-[240px] px-1 text-xs">
          <span className="text-[#9d9797]">المعرف النشط:</span>
          <span className="font-mono text-white font-bold">{user?.code || '20230894'}</span>
        </div>

        {/* GPS Geofence Proximity Tester (Dev & Simulation Feature) */}
        <div className="w-full p-3 rounded-xl bg-[#1b1728] border border-[#3e3a46]/60 text-right space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#fd8925]" />
              <span>محاكاة الموقع الجغرافي (Geofence):</span>
            </span>

            <Badge
              variant={gpsSimStatus === 'in_range' ? 'success' : 'danger'}
              size="xs"
              icon={gpsSimStatus === 'in_range' ? ShieldCheck : ShieldAlert}
            >
              {gpsSimStatus === 'in_range' ? 'داخل النطاق (18م)' : 'خارج النطاق (2,420م)'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGpsSimStatus('in_range')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                gpsSimStatus === 'in_range'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#2c2834] text-[#9d9797] border-[#3e3a46]'
              }`}
            >
              داخل الحرم (18 متر)
            </button>

            <button
              type="button"
              onClick={() => setGpsSimStatus('out_of_range')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                gpsSimStatus === 'out_of_range'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-[#2c2834] text-[#9d9797] border-[#3e3a46]'
              }`}
            >
              خارج الحرم (2.4 كم)
            </button>
          </div>

          <p className="text-[10px] text-[#9d9797]">
            النطاق المسموح به رسمياً: 150 متراً من مبنى الكلية بالدقي.
          </p>
        </div>

        {/* Submit Action */}
        <Button
          variant="ember"
          size="md"
          loading={isVerifying}
          onClick={handleScan}
          className="w-full"
        >
          محاكاة المسح وتأكيد الحضور
        </Button>

      </div>
    </Modal>
  );
}
