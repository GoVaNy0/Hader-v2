import React, { useState } from 'react';
import DaySwitcher from '../components/modules/schedule/DaySwitcher';
import ScheduleSearchBar from '../components/modules/schedule/ScheduleSearchBar';
import LectureCard from '../components/modules/schedule/LectureCard';
import StudentScannerModal from '../components/modules/attendance/StudentScannerModal';
import LeaderGeneratorModal from '../components/modules/attendance/LeaderGeneratorModal';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useSchedule } from '../hooks/useSchedule';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, BookOpen, Laptop, Sparkles } from 'lucide-react';

export default function SchedulePage() {
  const {
    selectedDay,
    setSelectedDay,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    lectures,
    daysList,
    todayKey,
    selectToday
  } = useSchedule();

  const { isLeader, triggerToast } = useAuth();

  // Modals state
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLeaderGenOpen, setIsLeaderGenOpen] = useState(false);

  const handleOpenAttendance = (lecture) => {
    setSelectedLecture(lecture);
    if (isLeader) {
      setIsLeaderGenOpen(true);
    } else {
      setIsScannerOpen(true);
    }
  };

  const handleSelectToday = () => {
    const result = selectToday();
    const dayName = daysList.find((d) => d.key === result.dayKey)?.label || '';
    if (result.isHoliday) {
      triggerToast(`اليوم عطلة أكاديمية، تم الانتقال تلقائياً إلى أقرب يوم حضور (${dayName}) 🌿`, 'info');
    } else {
      triggerToast(`تم الانتقال إلى جدول اليوم (${dayName}) 📅`, 'success');
    }
  };

  const activeDayObj = daysList.find((d) => d.key === selectedDay) || daysList[0];

  return (
    <div className="space-y-6 animate-fade-in text-right">
      
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#3e3a46]/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#fd8925]" />
            <span>الجدول الدراسي الأكاديمي</span>
          </h1>
          <p className="text-xs text-[#9d9797] mt-0.5">
            الفرقة الثانية — قسم تكنولوجيا التعليم (السبت، الأحد، الأربعاء)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="ember" size="sm">
            <span>{activeDayObj.tag}</span>
          </Badge>
          <Badge variant="default" size="sm">
            <span>{lectures.length} محاضرات</span>
          </Badge>
        </div>
      </div>

      {/* Day Switcher Component */}
      <DaySwitcher
        daysList={daysList}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onSelectToday={handleSelectToday}
        todayKey={todayKey}
      />

      {/* Search & Filter Bar */}
      <ScheduleSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
        totalResults={lectures.length}
      />

      {/* Timeline Lectures List */}
      {lectures.length === 0 ? (
        <Card variant="deep" className="p-12 text-center text-[#9d9797]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#fd8925]" />
          <h3 className="text-sm font-bold text-white">لا توجد محاضرات تطابق معايير البحث</h3>
          <p className="text-xs mt-1">جرّب تعديل كلمات البحث أو إلغاء فلتر التطبيقات والمعامل.</p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {lectures.map((lecture, index) => (
            <LectureCard
              key={lecture.id || index}
              lecture={lecture}
              index={index}
              onOpenAttendance={handleOpenAttendance}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <StudentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        lecture={selectedLecture}
      />

      <LeaderGeneratorModal
        isOpen={isLeaderGenOpen}
        onClose={() => setIsLeaderGenOpen(false)}
        initialCourseId={selectedLecture?.id}
      />

    </div>
  );
}
