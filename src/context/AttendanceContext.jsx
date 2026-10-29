import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from './AuthContext';

const AttendanceContext = createContext(null);

export function AttendanceProvider({ children }) {
  const { user, triggerToast } = useAuth();

  // QR Dynamic Rotation Timer (30s cycle)
  const [qrCountdown, setQrCountdown] = useState(25);
  const [qrToken, setQrToken] = useState('HADER-20230894-SESSION-8842');
  const [leaderSalt, setLeaderSalt] = useState('a9f2x');

  // Simulation of Student GPS Proximity: 'in_range' | 'out_of_range'
  const [gpsSimStatus, setGpsSimStatus] = useState('in_range');

  // Attendance & Incidents state
  const [incidents, setIncidents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);

  // Dynamic QR countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          const nonce = Math.floor(1000 + Math.random() * 9000);
          setQrToken(`HADER-${user?.code || '20230894'}-SES-${nonce}`);
          setLeaderSalt(Math.random().toString(36).substring(2, 7));
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  // Load initial incidents and history
  const loadTelemetry = useCallback(async () => {
    setLoadingIncidents(true);
    try {
      const [incList, histList] = await Promise.all([
        attendanceService.getSecurityIncidents(),
        attendanceService.getAttendanceHistory()
      ]);
      setIncidents(incList);
      setAttendanceHistory(histList);
    } catch {
      // Fallback
    } finally {
      setLoadingIncidents(false);
    }
  }, []);

  useEffect(() => {
    loadTelemetry();
  }, [loadTelemetry]);

  // Student QR verification handler
  const verifyAttendance = async (courseInfo, scannedPayload) => {
    const isOut = gpsSimStatus === 'out_of_range';
    const result = await attendanceService.verifyStudentScan({
      qrToken: scannedPayload || qrToken,
      studentId: user?.code || "20230894",
      studentName: user?.name || "جوفاني أيمن",
      courseId: courseInfo?.id || "sat-2",
      courseTitle: courseInfo?.title || "تصميم وإنتاج بيئات الوسائط المتكاملة",
      forceOutOfRange: isOut
    });

    if (result.success) {
      triggerToast(result.message, 'success');
      loadTelemetry();
      return true;
    } else {
      triggerToast(result.message, 'error');
      loadTelemetry();
      return false;
    }
  };

  // Submit excuse handler
  const submitExcuse = async (excuseData) => {
    const res = await attendanceService.submitExcuse({
      ...excuseData,
      studentId: user?.code
    });
    triggerToast(res.message, 'success');
    return res;
  };

  const value = {
    qrCountdown,
    qrToken,
    leaderSalt,
    gpsSimStatus,
    setGpsSimStatus,
    incidents,
    attendanceHistory,
    loadingIncidents,
    verifyAttendance,
    submitExcuse,
    refreshTelemetry: loadTelemetry
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
