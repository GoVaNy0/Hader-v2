import React from 'react';
import { Clock, MapPin, User, QrCode, ScanLine, Laptop, BookOpen } from 'lucide-react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { useAuth } from '../../../context/AuthContext';

export default function LectureCard({
  lecture,
  index,
  onOpenAttendance
}) {
  const { isLeader } = useAuth();
  const isLab = lecture.isLab || lecture.status === 'معمل';

  return (
    <Card
      variant="feature"
      className="p-4 md:p-5 hover:border-white/15 transition-all group text-right"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left / Info Section */}
        <div className="space-y-2 flex-1">
          
          {/* Header Row: Index + Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-6 h-6 rounded-md bg-[#2c2834] text-white text-xs font-mono font-bold flex items-center justify-center border border-white/10">
              {index + 1}
            </span>

            <Badge variant={isLab ? 'electric' : 'default'} size="xs" icon={isLab ? Laptop : BookOpen}>
              {lecture.type}
            </Badge>

            <Badge variant={isLab ? 'warning' : 'success'} size="xs">
              {lecture.status}
            </Badge>
          </div>

          {/* Lecture Title */}
          <h3 className="text-base font-bold text-white group-hover:text-[#fd8925] transition-colors leading-snug">
            {lecture.title}
          </h3>

          {/* Meta Details: Doctor, Location, Time */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#9d9797]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#d1cece]" />
              <span className="text-[#d1cece]">{lecture.doctor}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d1cece]" />
              <span>{lecture.location}</span>
            </span>

            <span className="flex items-center gap-1.5 font-mono text-white">
              <Clock className="w-3.5 h-3.5 text-[#fd8925]" />
              <span>{lecture.time}</span>
            </span>
          </div>

        </div>

        {/* Right / Attendance Action */}
        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#3e3a46]/40">
          <Button
            variant="frosted-ghost"
            size="sm"
            icon={isLeader ? QrCode : ScanLine}
            onClick={() => onOpenAttendance(lecture)}
            className="w-full md:w-auto"
          >
            {isLeader ? 'توليد الكود' : 'تسجيل الحضور'}
          </Button>
        </div>

      </div>
    </Card>
  );
}
