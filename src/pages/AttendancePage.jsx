import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Lock,
  Printer,
  Smartphone,
  RefreshCw,
  Calendar,
  History,
  CheckCircle2,
  Users
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StudentScannerModal from '../components/modules/attendance/StudentScannerModal';
import LeaderGeneratorModal from '../components/modules/attendance/LeaderGeneratorModal';
import StudentCardModal from '../components/modules/home/StudentCardModal';
import SessionPrintView from '../components/modules/attendance/SessionPrintView';
import FraudLogsTable from '../components/modules/security/FraudLogsTable';
import DeviceVerificationBadge from '../components/modules/security/DeviceVerificationBadge';
import AttendanceStatusIndicator from '../components/modules/attendance/AttendanceStatusIndicator';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useGeolocation } from '../hooks/useGeolocation';

export default function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLeader, user } = useAuth();
  const { attendanceHistory, qrCountdown, qrToken, gpsSimStatus } = useAttendance();
  const { coords, distance, isInside, campus } = useGeolocation();

  // Active Tab: 'student' | 'leader' | 'incidents'
  const initialTab = searchParams.get('tab') || (searchParams.get('mode') === 'leader' || isLeader ? 'leader' : 'student');
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['student', 'leader', 'incidents'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLeaderGenOpen, setIsLeaderGenOpen] = useState(false);
  const [isStudentCardOpen, setIsStudentCardOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in text-right">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#3e3a46]/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <QrCode className="w-6 h-6 text-[#fd8925]" />
            <span>محرك الحضور والأمان الأكاديمي</span>
          </h1>
          <p className="text-xs text-[#9d9797] mt-0.5">
            توثيق جغرافي مشفر + ربط بصمة العتاد المادي + مكافحة اختراق النطاق
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="pill" size="sm">
            نظام التحقق v2.4
          </Badge>
        </div>
      </div>

      {/* Main 3-Tab Navigator */}
      <div role="tablist" aria-label="أقسام محرك الحضور" className="flex items-center p-1 rounded-2xl bg-[#1a1624] border border-[#3e3a46]/70 w-full overflow-x-auto">
        <button
          role="tab"
          aria-selected={activeTab === 'student'}
          type="button"
          onClick={() => handleTabChange('student')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'student'
              ? 'bg-[#2c2834] text-white border border-white/10 shadow-sm'
              : 'text-[#9d9797] hover:text-white'
          }`}
        >
          <ScanLine className="w-4 h-4 text-emerald-400" />
          <span>بوابة الطلاب (الماسح)</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'leader'}
          type="button"
          onClick={() => handleTabChange('leader')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'leader'
              ? 'bg-[#2c2834] text-white border border-white/10 shadow-sm'
              : 'text-[#9d9797] hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4 text-amber-400" />
          <span>بوابة ممثل الدفعة (التوليد)</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'incidents'}
          type="button"
          onClick={() => handleTabChange('incidents')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'incidents'
              ? 'bg-[#2c2834] text-white border border-white/10 shadow-sm'
              : 'text-[#9d9797] hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>سجل الأمان ومكافحة الانتحال</span>
        </button>
      </div>

      {/* =======================================================================
          TAB 1: STUDENT PORTAL
         ======================================================================= */}
      {activeTab === 'student' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            
            {/* Left Column: Quick Actions & Card */}
            <div className="lg:col-span-7 space-y-5">
              
              <Card variant="feature" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">تسجيل الحضور الإلكتروني</h3>
                    <p className="text-xs text-[#9d9797]">امسح كود المحاضر أو اعرض بطاقتك الرقمية</p>
                  </div>
                  <Badge variant="success" size="sm" icon={ShieldCheck}>
                    جاهز للمسح
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <Button
                    variant="ember"
                    size="md"
                    icon={ScanLine}
                    onClick={() => setIsScannerOpen(true)}
                    className="w-full"
                  >
                    فتح ماسح الكاميرا
                  </Button>

                  <Button
                    variant="frosted-ghost"
                    size="md"
                    icon={QrCode}
                    onClick={() => setIsStudentCardOpen(true)}
                    className="w-full"
                  >
                    عرض بطاقتي المشفرة
                  </Button>
                </div>

                {/* Geofence Proximity Status Banner */}
                <div className="p-4 rounded-xl bg-[#1b1728] border border-[#3e3a46]/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#fd8925]" />
                      <span>النطاق الجغرافي للجامعة (مجمع الدقي):</span>
                    </span>
                    <Badge variant={gpsSimStatus === 'in_range' ? 'success' : 'danger'} size="xs">
                      {gpsSimStatus === 'in_range' ? 'داخل النطاق (18 متر)' : 'خارج النطاق (2,420 متر)'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#9d9797] leading-relaxed">
                    {campus.name} — يُسمح بتسجيل الحضور فقط داخل دائرة قطرها {campus.allowedRadiusMeters} متر من القاعات والمعامل.
                  </p>
                </div>
              </Card>

              {/* Student Attendance History */}
              <Card variant="deep" className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">سجل الحضور الموثق مؤخراً</h3>
                  </div>
                  <span className="text-xs text-[#9d9797] font-mono">{attendanceHistory.length} جلسات</span>
                </div>

                <div className="space-y-2.5">
                  {attendanceHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-xl bg-[#1a1624] border border-[#3e3a46]/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white leading-tight">{rec.courseTitle}</h4>
                          <span className="text-[11px] text-[#9d9797] mt-0.5 block">{rec.timestamp}</span>
                        </div>
                      </div>

                      <div className="text-left font-mono shrink-0">
                        <span className="text-emerald-400 font-bold block">+{rec.pointsEarned} نقطة</span>
                        <span className="text-[10px] text-[#9d9797]">نطاق {rec.distanceMeters}م</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* Right Column: Attendance Status & Hardware Security */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Interactive 60fps Attendance Status Indicator */}
              <Card variant="feature" className="p-5 md:p-6 text-center">
                <div className="flex items-center justify-between mb-4 text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#2c2834] flex items-center justify-center text-[#fd8925]">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">مؤشر الحضور التفاعلي</h4>
                      <span className="text-[10px] text-[#9d9797]">رصد التردد الراداري والتحقق البيومتري (60fps)</span>
                    </div>
                  </div>
                  <Badge variant="pill" size="xs">
                    تفاعلي SVG
                  </Badge>
                </div>

                <div className="py-2 flex justify-center">
                  <AttendanceStatusIndicator size={200} interactive={true} />
                </div>
              </Card>

              <DeviceVerificationBadge />
            </div>

          </div>
        </div>
      )}

      {/* =======================================================================
          TAB 2: LEADER PORTAL
         ======================================================================= */}
      {activeTab === 'leader' && (
        <div className="space-y-6">
          <Card variant="feature" className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>لوحة تحكم ممثل الدفعة (Leader Session Controller)</span>
                  <Badge variant="warning" size="xs">
                    صلاحيات ممثل الدفعة
                  </Badge>
                </h3>
                <p className="text-xs text-[#9d9797] mt-0.5">
                  توليد الجلسات الديناميكية وإصدار كشوف الحضور الرسمية المعتمدة
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ember"
                  size="md"
                  icon={QrCode}
                  onClick={() => setIsLeaderGenOpen(true)}
                >
                  فتح نافذة العرض الكبرى
                </Button>

                <Button
                  variant="frosted-ghost"
                  size="md"
                  icon={Printer}
                  onClick={() => setIsPrintOpen(true)}
                >
                  طباعة الكشف
                </Button>
              </div>
            </div>

            {/* Embedded Live Session Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0e0918] border border-[#3e3a46] flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-xs text-[#9d9797]">الجلسة النشطة حالياً للمدرج:</span>
                <span className="font-mono text-xs text-[#fd8925] font-bold bg-[#1a1624] px-3 py-1 rounded-md border border-white/10">
                  {qrToken}
                </span>
                <span className="text-[11px] text-[#9d9797]">
                  صلاحية الرمز: <strong className="text-white font-mono">{qrCountdown} ثانية</strong>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e0918] border border-[#3e3a46] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-mono">38 طالب</h4>
                    <span className="text-[11px] text-[#9d9797]">حضور موثق بالجغرافيا</span>
                  </div>
                </div>

                <Badge variant="success" size="sm">
                  جلسة نشطة
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* =======================================================================
          TAB 3: INCIDENTS & ANTI-FRAUD
         ======================================================================= */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <FraudLogsTable />
          <DeviceVerificationBadge />
        </div>
      )}

      {/* Modals */}
      <StudentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <StudentCardModal
        isOpen={isStudentCardOpen}
        onClose={() => setIsStudentCardOpen(false)}
      />

      <LeaderGeneratorModal
        isOpen={isLeaderGenOpen}
        onClose={() => setIsLeaderGenOpen(false)}
      />

      <SessionPrintView
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />

    </div>
  );
}
