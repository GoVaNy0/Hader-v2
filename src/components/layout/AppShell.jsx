import React, { useState } from 'react';
import Header from './Header';
import MobileDock from './MobileDock';
import Toast from '../common/Toast';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { Bell, Check, AlertTriangle, Sparkles, X, QrCode, ScanLine, ShieldCheck } from 'lucide-react';
import StudentScannerModal from '../modules/attendance/StudentScannerModal';
import LeaderGeneratorModal from '../modules/attendance/LeaderGeneratorModal';

export default function AppShell({ children }) {
  const { toastMessage, triggerToast, isLeader } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const notificationsList = [
    {
      id: 1,
      title: 'تم تأكيد حضور المحاضرة',
      description: 'تم تسجيل حضورك بمحاضرة الوسائط المتكاملة بنجاح.',
      time: 'منذ 15 دقيقة',
      type: 'success'
    },
    {
      id: 2,
      title: 'تغيير قاعة المحاضرة',
      description: 'محاضرة علم النفس ستعقد بمدرج 18 ج اليوم.',
      time: 'منذ ساعة',
      type: 'warning'
    },
    {
      id: 3,
      title: 'ترقية في شجرة النمو 🌱',
      description: 'وصلت إلى 425 نقطة وأوشكت على بلوغ المستوى الخامس!',
      time: 'أمس',
      type: 'info'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0918] text-[#d1cece] flex flex-col font-sans selection:bg-[#fd8925] selection:text-white">
      {/* Toast Notification */}
      <Toast toast={toastMessage} />

      {/* Sticky Header */}
      <Header onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Content Area: max-width 1200px centered */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Footer per design.md */}
      <footer className="w-full border-t border-[#3e3a46]/50 py-8 bg-[#0e0918] text-xs text-[#9d9797]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fd8925]"></span>
            <span className="font-semibold text-white">منصة حاضر (Hader-V2)</span>
            <span>—</span>
            <span>كلية التربية النوعية، قسم تكنولوجيا التعليم</span>
          </div>
          <div>
            <span>نظام الحضور الأكاديمي الموثق بالجغرافيا • الفرقة الثانية</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Dock (<768px) */}
      <MobileDock onQuickScan={() => setIsQuickActionOpen(true)} />

      {/* Notifications Drawer Modal */}
      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="إشعارات وتنبيهات القسم"
        subtitle="3 تنبيهات جديدة هذا الأسبوع"
      >
        <div className="space-y-3">
          {notificationsList.map((notif) => (
            <div
              key={notif.id}
              className="p-3.5 rounded-xl bg-[#1b1728] border border-[#3e3a46]/60 flex items-start gap-3 text-right"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  notif.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : notif.type === 'warning'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-[#077ac7]/15 text-sky-400 border border-[#077ac7]/30'
                }`}
              >
                {notif.type === 'success' && <Check className="w-4 h-4" />}
                {notif.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                {notif.type === 'info' && <Sparkles className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                <p className="text-[11px] text-[#9d9797] mt-0.5 leading-relaxed">{notif.description}</p>
                <span className="text-[10px] text-[#9d9797]/70 mt-1 block">{notif.time}</span>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(false);
              triggerToast('تم تحديد جميع التنبيهات كمقروءة');
            }}
            className="w-full mt-2 py-2 text-xs font-semibold text-[#fd8925] hover:text-[#ff492c] transition-colors"
          >
            تحديد الكل كمقروء
          </button>
        </div>
      </Modal>

      {/* Quick Action Modal (Center button from Mobile Dock) */}
      {isLeader ? (
        <LeaderGeneratorModal
          isOpen={isQuickActionOpen}
          onClose={() => setIsQuickActionOpen(false)}
        />
      ) : (
        <StudentScannerModal
          isOpen={isQuickActionOpen}
          onClose={() => setIsQuickActionOpen(false)}
        />
      )}
    </div>
  );
}
