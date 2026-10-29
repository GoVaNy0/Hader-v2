import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroLectureCard from '../components/modules/home/HeroLectureCard';
import GrowthTreeWidget from '../components/modules/home/GrowthTreeWidget';
import DailySummary from '../components/modules/home/DailySummary';
import DeviceVerificationBadge from '../components/modules/security/DeviceVerificationBadge';

const StudentCardModal = React.lazy(() => import('../components/modules/home/StudentCardModal'));
const ExcusesModal = React.lazy(() => import('../components/modules/home/ExcusesModal'));
const StudentScannerModal = React.lazy(() => import('../components/modules/attendance/StudentScannerModal'));
const LeaderGeneratorModal = React.lazy(() => import('../components/modules/attendance/LeaderGeneratorModal'));
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useSchedule } from '../hooks/useSchedule';
import { Calendar, Clock, MapPin, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isLeader } = useAuth();
  const { lectures, selectedDay } = useSchedule();

  // Modals state
  const [isStudentCardOpen, setIsStudentCardOpen] = useState(false);
  const [isExcuseOpen, setIsExcuseOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLeaderGenOpen, setIsLeaderGenOpen] = useState(false);

  // Upcoming lecture
  const upcomingLecture = lectures[1] || lectures[0];

  const handleHeroAction = () => {
    if (isLeader) {
      setIsLeaderGenOpen(true);
    } else {
      setIsScannerOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right">
      
      {/* Welcome Banner / Header Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#3e3a46]/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>مرحباً، {user?.name || 'جوفاني أيمن'}</span>
            <span className="text-lg">👋</span>
          </h1>
          <p className="text-xs text-[#9d9797] mt-0.5">
            {user?.division || 'قسم تكنولوجيا التعليم — الفرقة الثانية'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="pill" size="sm">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Badge>
        </div>
      </div>

      {/* =========================================================================
          BENTO GRID ARCHITECTURE (Desktop >= 1024px Split / Mobile-First Stack)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        
        {/* Main Column (Desktop 7 cols / Mobile Full) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Priority 1: Hero Upcoming Lecture Card */}
          <HeroLectureCard
            lecture={upcomingLecture}
            onActionClick={handleHeroAction}
            onViewSchedule={() => navigate('/schedule')}
          />

          {/* Priority 2: Today's Timeline Highlights Preview */}
          <Card variant="deep" className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2c2834] flex items-center justify-center text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">محاضرات اليوم المتبقية</h3>
              </div>

              <Button
                variant="frosted-ghost"
                size="sm"
                icon={ArrowLeft}
                iconPosition="end"
                onClick={() => navigate('/schedule')}
              >
                الجدول الكامل
              </Button>
            </div>

            <div className="space-y-2.5">
              {lectures.slice(0, 3).map((lec, idx) => (
                <div
                  key={lec.id || idx}
                  className="p-3.5 rounded-xl bg-[#1a1624] border border-[#3e3a46]/50 hover:border-white/10 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-[#2c2834] text-[#d1cece] font-mono text-[11px] flex items-center justify-center font-bold">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white leading-tight">{lec.title}</h4>
                      <span className="text-[11px] text-[#9d9797] mt-0.5 block">{lec.doctor}</span>
                    </div>
                  </div>

                  <div className="text-left font-mono shrink-0">
                    <span className="text-[#fd8925] font-semibold block">{lec.time.split('-')[0]}</span>
                    <span className="text-[10px] text-[#9d9797] font-sans">{lec.location.split('(')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Sidebar Column (Desktop 5 cols / Mobile Full) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Daily Quick Summary Metrics */}
          <DailySummary
            onOpenStudentCard={() => setIsStudentCardOpen(true)}
            onOpenExcuseModal={() => setIsExcuseOpen(true)}
          />

          {/* Academic Tree Growth Widget */}
          <GrowthTreeWidget />

          {/* Hardware Security & Geofence Binding */}
          <DeviceVerificationBadge />

        </div>

      </div>

      {/* Modals */}
      {/* Modals rendered on-demand via Suspense */}
      <React.Suspense fallback={null}>
        {isStudentCardOpen && (
          <StudentCardModal
            isOpen={isStudentCardOpen}
            onClose={() => setIsStudentCardOpen(false)}
          />
        )}

        {isExcuseOpen && (
          <ExcusesModal
            isOpen={isExcuseOpen}
            onClose={() => setIsExcuseOpen(false)}
          />
        )}

        {isScannerOpen && (
          <StudentScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            lecture={upcomingLecture}
          />
        )}

        {isLeaderGenOpen && (
          <LeaderGeneratorModal
            isOpen={isLeaderGenOpen}
            onClose={() => setIsLeaderGenOpen(false)}
            initialCourseId={upcomingLecture?.id}
          />
        )}
      </React.Suspense>

    </div>
  );
}
