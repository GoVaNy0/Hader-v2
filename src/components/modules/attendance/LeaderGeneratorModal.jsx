import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Users, Printer, ShieldCheck, Lock, Calendar } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { useAttendance } from '../../../context/AttendanceContext';
import { scheduleData } from '../../../data/scheduleData';
import SessionPrintView from './SessionPrintView';

export default function LeaderGeneratorModal({
  isOpen,
  onClose,
  initialCourseId = 'sat-2'
}) {
  const { qrCountdown, qrToken, leaderSalt } = useAttendance();

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedWeek, setSelectedWeek] = useState(8);
  const [attendeesCount, setAttendeesCount] = useState(38);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Flatten all courses
  const allCourses = useMemo(() => {
    const list = [];
    Object.keys(scheduleData).forEach((dayKey) => {
      (scheduleData[dayKey] || []).forEach((c) => {
        list.push({ ...c, dayKey });
      });
    });
    return list;
  }, []);

  const activeCourse = useMemo(() => {
    return allCourses.find((c) => c.id === selectedCourseId) || allCourses[0];
  }, [allCourses, selectedCourseId]);

  // Construct crypto-like payload string
  const dynamicPayload = useMemo(() => {
    return JSON.stringify({
      app: "HADER-PLATFORM",
      version: "2.4-SECURE",
      courseId: activeCourse?.id,
      courseTitle: activeCourse?.title,
      hall: activeCourse?.location,
      week: selectedWeek,
      salt: leaderSalt,
      expiresInSeconds: qrCountdown
    });
  }, [activeCourse, selectedWeek, leaderSalt, qrCountdown]);

  return (
    <>
      <Modal
        isOpen={isOpen && !isPrintOpen}
        onClose={onClose}
        title="توليد كود الحضور الذكي (لوحة ممثل الدفعة)"
        subtitle="رمز استجابة ديناميكي مشفر يتغير تلقائياً لمنع الغش ومشاركة الشاشة"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-right">
          
          {/* Controls: Course & Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#d1cece] mb-1">
                المقرر الدراسي
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-[#1b1728] border border-[#3e3a46] rounded-lg text-xs text-white p-2 outline-none focus:border-[#fd8925]"
              >
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#1b1728]">
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d1cece] mb-1">
                الأسبوع الأكاديمي
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="w-full bg-[#1b1728] border border-[#3e3a46] rounded-lg text-xs text-white p-2 outline-none focus:border-[#fd8925]"
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w} className="bg-[#1b1728]">
                    الأسبوع {w} (الفصل الدراسي الثاني)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* QR Display Card */}
          <div className="flex flex-col items-center justify-center p-5 bg-[#0e0918] rounded-2xl border border-[#3e3a46] space-y-3">
            
            <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-[#2c2834]">
              <QRCodeSVG
                value={dynamicPayload}
                size={190}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Countdown Bar */}
            <div className="w-full flex items-center justify-between text-xs px-2">
              <span className="text-[#9d9797] flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                <span>صلاحية الكود الحالي:</span>
              </span>
              <span className="font-mono font-bold text-[#fd8925] bg-[#2c2834] px-2.5 py-0.5 rounded border border-white/10">
                {qrCountdown} ثانية
              </span>
            </div>

          </div>

          {/* Attendees Telemetry & Print Action */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1b1728] border border-[#3e3a46]/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {attendeesCount} طالب حاضر حتى الآن
                </span>
                <span className="text-[10px] text-emerald-400">
                  تم توثيق البصمة الجغرافية بنجاح
                </span>
              </div>
            </div>

            <Button
              variant="frosted-ghost"
              size="sm"
              icon={Printer}
              onClick={() => setIsPrintOpen(true)}
            >
              طباعة الكشف
            </Button>
          </div>

        </div>
      </Modal>

      {/* Session Print View */}
      {isPrintOpen && (
        <SessionPrintView
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          course={activeCourse}
          week={selectedWeek}
          attendeesCount={attendeesCount}
        />
      )}
    </>
  );
}
