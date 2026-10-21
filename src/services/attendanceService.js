/**
 * Mock Attendance Service
 * Implements decoupled Geofence check, QR token validation, Excuses, and Incident Logs
 */

import { CAMPUS_COORDINATES, calculateHaversineDistance } from '../utils/geoUtils';
import { INITIAL_INCIDENTS } from '../data/mockIncidentsData';

const ATTENDANCE_HISTORY_KEY = 'hader_attendance_history';
const INCIDENTS_KEY = 'hader_incidents';
const EXCUSES_KEY = 'hader_excuses';

export const attendanceService = {
  /**
   * Verify and record student attendance via QR scan
   */
  async verifyStudentScan({
    qrToken,
    userCoords = { latitude: 30.0384, longitude: 31.2125 }, // Defaults to inside Dokki campus
    studentId = "20230894",
    studentName = "جوفاني أيمن",
    courseId = "sat-2",
    courseTitle = "تصميم وإنتاج بيئات الوسائط المتكاملة",
    forceOutOfRange = false
  }) {
    await new Promise((resolve) => setTimeout(resolve, 380));

    // Calculate actual distance from campus
    let distance = calculateHaversineDistance(
      userCoords.latitude,
      userCoords.longitude,
      CAMPUS_COORDINATES.latitude,
      CAMPUS_COORDINATES.longitude
    );

    if (forceOutOfRange) {
      distance = 2420; // 2.42 km outside campus
    }

    const isGeofenceValid = distance <= CAMPUS_COORDINATES.allowedRadiusMeters;

    // If geofence failed, log an incident and reject
    if (!isGeofenceValid) {
      const incident = {
        id: `inc-${Date.now()}`,
        timestamp: "الآن",
        studentId,
        studentName,
        courseTitle,
        violationType: "اختراق نطاق جغرافي (Geofence Breach)",
        distance: `${distance.toLocaleString()} متر خارج النطاق المسموح`,
        device: "الهاتف المسجل للطالب",
        severity: "HIGH",
        actionTaken: "تم حظر الحضور تلقائياً"
      };
      await this.reportIncident(incident);

      return {
        success: false,
        reason: 'GEOFENCE_BREACH',
        distanceMeters: distance,
        message: `فشل التحقق: أنت خارج النطاق الجغرافي للمحاضرة (${distance.toLocaleString()}م)!`
      };
    }

    // Attendance record
    const attendanceRecord = {
      id: `att-${Date.now()}`,
      studentId,
      studentName,
      courseId,
      courseTitle,
      timestamp: new Date().toISOString(),
      distanceMeters: distance,
      verifiedLocation: CAMPUS_COORDINATES.name,
      pointsEarned: 25,
      status: 'CONFIRMED'
    };

    // Save to history
    try {
      const existing = JSON.parse(localStorage.getItem(ATTENDANCE_HISTORY_KEY) || '[]');
      existing.unshift(attendanceRecord);
      localStorage.setItem(ATTENDANCE_HISTORY_KEY, JSON.stringify(existing.slice(0, 50)));
    } catch {
      // Ignore storage error
    }

    return {
      success: true,
      record: attendanceRecord,
      pointsEarned: 25,
      message: `تم التحقق الجغرافي بنجاح (داخل النطاق: ${distance}م) وتأكيد حضورك! ✅`
    };
  },

  /**
   * Submit an official medical or academic excuse
   */
  async submitExcuse({ studentId, lectureId, reason, note, attachmentName }) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const excuse = {
      id: `exc-${Date.now()}`,
      studentId: studentId || "20230894",
      lectureId,
      reason,
      note,
      attachmentName: attachmentName || null,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW'
    };

    try {
      const existing = JSON.parse(localStorage.getItem(EXCUSES_KEY) || '[]');
      existing.unshift(excuse);
      localStorage.setItem(EXCUSES_KEY, JSON.stringify(existing));
    } catch {
      // Storage fallback
    }

    return {
      success: true,
      excuse,
      message: 'تم تشفير وإرسال طلب العذر بنجاح إلى رئيس القسم وأستاذ المادة ✅'
    };
  },

  /**
   * Generate Leader attendance cryptographic session
   */
  async generateLeaderSession({ courseId, courseTitle, hall, week = 8, expiresInSeconds = 30 }) {
    await new Promise((resolve) => setTimeout(resolve, 120));

    const salt = Math.random().toString(36).substring(2, 7).toUpperCase();
    const nonce = Math.floor(1000 + Math.random() * 9000);
    const sessionToken = `HADER-SES-${courseId}-W${week}-${salt}-${nonce}`;

    const payload = {
      app: "HADER-PLATFORM",
      version: "2.4-SECURE",
      courseId,
      courseTitle,
      hall,
      week,
      salt,
      sessionToken,
      timestamp: Date.now(),
      expiresInSeconds,
      geo: {
        lat: CAMPUS_COORDINATES.latitude,
        lng: CAMPUS_COORDINATES.longitude,
        allowedRadius: CAMPUS_COORDINATES.allowedRadiusMeters
      }
    };

    return {
      token: sessionToken,
      payload: JSON.stringify(payload),
      generatedAt: Date.now(),
      expiresInSeconds
    };
  },

  /**
   * Fetch all security incident logs
   */
  async getSecurityIncidents() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    try {
      const stored = localStorage.getItem(INCIDENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_INCIDENTS;
  },

  /**
   * Report and persist a security incident
   */
  async reportIncident(incident) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const current = await this.getSecurityIncidents();
      const updated = [incident, ...current];
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(updated.slice(0, 40)));
      return updated;
    } catch {
      return [incident, ...INITIAL_INCIDENTS];
    }
  },

  /**
   * Fetch student's verified attendance history
   */
  async getAttendanceHistory() {
    await new Promise((resolve) => setTimeout(resolve, 120));
    try {
      const stored = localStorage.getItem(ATTENDANCE_HISTORY_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return [
      {
        id: "att-init-1",
        studentId: "20230894",
        courseId: "sat-2",
        courseTitle: "تصميم وإنتاج بيئات الوسائط المتكاملة (تطبيقات)",
        timestamp: "اليوم 10:02 ص",
        distanceMeters: 18,
        status: "CONFIRMED",
        pointsEarned: 25
      },
      {
        id: "att-init-2",
        studentId: "20230894",
        courseId: "sat-1",
        courseTitle: "نظريات تربوية وإدارية",
        timestamp: "اليوم 08:05 ص",
        distanceMeters: 22,
        status: "CONFIRMED",
        pointsEarned: 25
      }
    ];
  }
};
