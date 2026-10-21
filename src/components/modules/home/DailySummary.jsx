import React from 'react';
import { Activity, CheckCircle2, Flame, QrCode, FileText, Smartphone } from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import { useAuth } from '../../../context/AuthContext';

export default function DailySummary({ onOpenStudentCard, onOpenExcuseModal }) {
  const { user } = useAuth();

  const metrics = [
    {
      label: 'نسبة الحضور',
      value: user?.attendanceRate || '96.4%',
      sub: 'ممتاز فوق المتوسط',
      icon: Activity,
      color: 'text-emerald-400'
    },
    {
      label: 'المحاضرات المكتملة',
      value: `${user?.totalPresent || 27} / 28`,
      sub: 'غياب واحد فقط',
      icon: CheckCircle2,
      color: 'text-[#fd8925]'
    },
    {
      label: 'سلسلة الالتزام',
      value: `${user?.streakDays || 12} يوم`,
      sub: 'بدون أي انقطاع',
      icon: Flame,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} variant="feature" padding="p-4" className="text-right">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-[#9d9797] font-medium leading-tight">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-lg md:text-xl font-bold text-white font-mono">{m.value}</div>
              <div className="text-[10px] text-[#9d9797] mt-0.5">{m.sub}</div>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenStudentCard}
          className="p-4 rounded-2xl bg-[#1a1624] hover:bg-[#2c2834] border border-white/[0.07] hover:border-white/[0.15] text-right transition-all group flex items-start gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#2c2834] group-hover:bg-[#3e3a46] flex items-center justify-center text-[#fd8925] shrink-0 transition-colors">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-[#fd8925] transition-colors">
              البطاقة الرقمية (QR)
            </h4>
            <p className="text-[11px] text-[#9d9797] mt-0.5 leading-snug">
              كود مشفر يجدد تلقائياً كل 30 ثانية
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenExcuseModal}
          className="p-4 rounded-2xl bg-[#1a1624] hover:bg-[#2c2834] border border-white/[0.07] hover:border-white/[0.15] text-right transition-all group flex items-start gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#2c2834] group-hover:bg-[#3e3a46] flex items-center justify-center text-sky-400 shrink-0 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
              تقديم عذر غياب
            </h4>
            <p className="text-[11px] text-[#9d9797] mt-0.5 leading-snug">
              إرسال تقرير رسمي لأستاذ المادة
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
