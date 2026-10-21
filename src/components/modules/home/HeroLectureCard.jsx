import React from 'react';
import { Calendar, Clock, MapPin, User, ScanLine, QrCode, ArrowLeft, Sparkles } from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { useAuth } from '../../../context/AuthContext';

export default function HeroLectureCard({
  lecture,
  onActionClick,
  onViewSchedule
}) {
  const { isLeader } = useAuth();

  const defaultLecture = {
    title: "تصميم وإنتاج بيئات الوسائط المتكاملة (تطبيقات)",
    type: "تطبيقات عملية",
    doctor: "د. إنجي إبراهيم",
    location: "معمل كمبيوتر 274 (الدور الثاني)",
    time: "10:00 ص - 11:29 ص",
    status: "معمل"
  };

  const current = lecture || defaultLecture;

  return (
    <Card variant="feature" className="p-6 md:p-7 group relative">
      {/* Top Meta Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2c2834] border border-[#3e3a46] flex items-center justify-center text-[#fd8925]">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-[#fd8925] tracking-wide">
            المحاضرة القادمة
          </span>
        </div>

        <Badge variant="ember" size="sm">
          <span>تبدأ بعد 25 دقيقة</span>
        </Badge>
      </div>

      {/* Title & Subject */}
      <div className="space-y-1 mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-[#fd8925] transition-colors">
          {current.title}
        </h2>
        <div className="flex items-center gap-2 text-xs text-[#9d9797]">
          <Badge variant={current.status === 'معمل' ? 'electric' : 'default'} size="xs">
            {current.type}
          </Badge>
          <span>•</span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#d1cece]" />
            <span>{current.doctor}</span>
          </span>
        </div>
      </div>

      {/* Hall & Time Details Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-3.5 rounded-xl bg-[#1b1728] border border-[#3e3a46]/50 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2c2834] flex items-center justify-center text-[#d1cece] shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] text-[#9d9797] block">مكان الانعقاد</span>
            <span className="font-semibold text-white">{current.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2c2834] flex items-center justify-center text-[#d1cece] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] text-[#9d9797] block">التوقيت الأكاديمي</span>
            <span className="font-semibold text-white font-mono">{current.time}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          variant="ember"
          size="md"
          icon={isLeader ? QrCode : ScanLine}
          onClick={onActionClick}
          className="flex-1"
        >
          {isLeader ? 'توليد كود الحضور للمحاضرة' : 'تسجيل الحضور بالكاميرا'}
        </Button>

        <Button
          variant="frosted-ghost"
          size="md"
          icon={ArrowLeft}
          iconPosition="end"
          onClick={onViewSchedule}
        >
          استعراض جدول اليوم
        </Button>
      </div>
    </Card>
  );
}
