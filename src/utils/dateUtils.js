/**
 * Date & Academic Schedule Time Utilities
 */

/**
 * Smart Day Selector:
 * Saturday (6) -> 'saturday'
 * Sunday (0) -> 'sunday'
 * Monday (1), Tuesday (2) -> 'wednesday' (upcoming active attendance day)
 * Wednesday (3) -> 'wednesday'
 * Thursday (4), Friday (5) -> 'saturday' (fallback to next weekly cycle)
 */
export function getSmartInitialDay() {
  const day = new Date().getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  if (day === 6) return 'saturday';
  if (day === 0) return 'sunday';
  if (day === 3) return 'wednesday';
  if (day === 1 || day === 2) return 'wednesday';
  return 'saturday'; // Thursday (4) & Friday (5)
}

/**
 * Check if the current system date matches one of the 3 active days
 */
export function getTodayAcademicKey() {
  const day = new Date().getDay();
  if (day === 6) return 'saturday';
  if (day === 0) return 'sunday';
  if (day === 3) return 'wednesday';
  return null;
}

/**
 * Format timestamp in Arabic style
 */
export function formatArabicTime(date = new Date()) {
  const d = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

/**
 * Arabic day labels mapping
 */
export const ARABIC_DAYS = {
  saturday: 'السبت',
  sunday: 'الأحد',
  wednesday: 'الأربعاء'
};
