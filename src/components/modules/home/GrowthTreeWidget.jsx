import React, { useState } from 'react';
import { Sparkles, Info, Trophy, ChevronLeft } from 'lucide-react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import { useAuth } from '../../../context/AuthContext';
import { TREE_LEVELS } from '../../../data/mockUserData';

export default function GrowthTreeWidget() {
  const { user } = useAuth();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const points = user?.treePoints || 425;
  const currentLevel = user?.treeLevel || 4;
  const levelTitle = user?.levelTitle || "شجرة مثمرة 🌱";

  // Progress to level 5 (max 500 in stage 4)
  const currentMax = 500;
  const currentMin = 401;
  const progressPercent = Math.min(
    100,
    Math.max(10, Math.round(((points - currentMin) / (currentMax - currentMin)) * 100))
  );

  return (
    <>
      <Card variant="feature" className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2c2834] border border-[#3e3a46] flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">شجرة النمو الأكاديمي</h3>
              <span className="text-[11px] text-[#9d9797]">مؤشر الالتزام بالحضور</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="p-1.5 rounded-lg bg-[#2c2834] hover:bg-[#3e3a46] text-[#9d9797] hover:text-white transition-colors cursor-pointer"
            title="دليل مستويات شجرة النمو"
            aria-label="دليل المستويات"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Tree Status & Points */}
        <div className="p-4 rounded-xl bg-[#1b1728] border border-[#3e3a46]/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white">{levelTitle}</span>
            <span className="font-mono text-xs font-bold text-[#fd8925]">{points} نقطة</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#0e0918] overflow-hidden p-0.5 border border-[#3e3a46]/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#fd8925] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#9d9797] mt-2 font-mono">
            <span>المستوى {currentLevel}</span>
            <span>باقي {500 - points} نقطة للمستوى التالي 🌲</span>
          </div>
        </div>

        {/* Info Footer */}
        <div className="flex items-center justify-between text-xs text-[#9d9797] pt-1">
          <span>+25 نقطة نمو لكل حضور مؤكد</span>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-[#fd8925] hover:underline flex items-center gap-1 font-medium text-[11px]"
          >
            <span>شرح المستويات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>

      {/* Tree Stages Modal */}
      <Modal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="نظام شجرة الحضور الأكاديمي"
        subtitle="كل حضور موثق يمنحك +25 نقطة ترقية"
      >
        <div className="space-y-2.5 text-xs">
          {TREE_LEVELS.map((lvl) => {
            const isCurrent = lvl.level === currentLevel;
            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  isCurrent
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white font-bold'
                    : 'bg-[#1b1728] border-[#3e3a46]/50 text-[#d1cece]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lvl.icon}</span>
                  <div>
                    <span className="block font-medium">
                      المستوى {lvl.level}: {lvl.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-emerald-400 font-normal">
                        (مستواك الحالي)
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[#9d9797] text-[11px]">
                  {lvl.min} - {lvl.max === 9999 ? '+500' : lvl.max} نقطة
                </span>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
