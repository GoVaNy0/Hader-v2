import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  MapPin,
  Smartphone,
  CheckCircle2,
  Filter,
  History,
  Info
} from 'lucide-react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { useAttendance } from '../../../context/AttendanceContext';

export default function FraudLogsTable() {
  const { incidents, loadingIncidents } = useAttendance();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  return (
    <Card variant="deep" className="p-5 md:p-6 text-right">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>سجل الحماية ومكافحة الانتحال (Anti-Fraud Telemetry)</span>
              <Lock className="w-4 h-4 text-[#fd8925]" />
            </h3>
            <p className="text-xs text-[#9d9797]">
              رصد حي لمحاولات اختراق النطاق الجغرافي وتزييف الموقع ومشاركة الأجهزة
            </p>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1a1624] border border-[#3e3a46]/60 text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-[#2c2834] text-white font-bold border border-white/10'
                  : 'text-[#9d9797] hover:text-white'
              }`}
            >
              {sev === 'ALL' ? 'الكل' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="space-y-3">
        {loadingIncidents ? (
          <div className="p-8 text-center text-xs text-[#9d9797]">
            <span>جارِ تحميل سجلات الحماية...</span>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#9d9797] bg-[#1a1624] rounded-xl border border-[#3e3a46]/40">
            <span>لا توجد وقائع مسجلة تطابق التصفية الحالية</span>
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="p-4 rounded-xl bg-[#1a1624] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Incident Details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      inc.severity === 'CRITICAL'
                        ? 'danger'
                        : inc.severity === 'HIGH'
                        ? 'ember'
                        : 'warning'
                    }
                    size="xs"
                    icon={AlertTriangle}
                  >
                    {inc.severity}
                  </Badge>

                  <span className="font-bold text-white text-xs">{inc.studentName}</span>
                  <span className="font-mono text-[11px] text-[#9d9797]">({inc.studentId})</span>
                  <span className="text-xs text-[#9d9797]">•</span>
                  <span className="text-xs text-[#d1cece]">{inc.courseTitle}</span>
                </div>

                <div className="text-xs font-semibold text-red-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{inc.violationType}</span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-[#9d9797]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d1cece]" />
                    <span>{inc.distance}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-[#d1cece]" />
                    <span>{inc.device}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <History className="w-3 h-3 text-[#d1cece]" />
                    <span>{inc.timestamp}</span>
                  </span>
                </div>
              </div>

              {/* Action Taken Badge */}
              <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-[#3e3a46]/40">
                <span className="text-[10px] text-[#9d9797] md:mb-1">الإجراء المتخذ:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>{inc.actionTaken}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </Card>
  );
}
