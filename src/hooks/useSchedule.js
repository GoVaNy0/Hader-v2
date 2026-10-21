import { useState, useMemo, useCallback } from 'react';
import { scheduleData, activeDaysList } from '../data/scheduleData';
import { getSmartInitialDay, getTodayAcademicKey } from '../utils/dateUtils';

export function useSchedule() {
  const [selectedDay, setSelectedDay] = useState(getSmartInitialDay);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'practical' | 'theory'

  const todayKey = getTodayAcademicKey();
  const isSelectedDayToday = todayKey === selectedDay;

  // Flatten all courses
  const allCourses = useMemo(() => {
    const list = [];
    Object.keys(scheduleData).forEach((dayKey) => {
      (scheduleData[dayKey] || []).forEach((c) => {
        list.push({ ...c, dayKey });
      });
    });
    return list;
  }, []);

  // Filter lectures for selected day
  const filteredLectures = useMemo(() => {
    const dayLectures = scheduleData[selectedDay] || [];
    return dayLectures.filter((lecture) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lecture.title.toLowerCase().includes(q) ||
        lecture.doctor.toLowerCase().includes(q) ||
        lecture.location.toLowerCase().includes(q);

      const matchesType =
        filterType === 'all' ||
        (filterType === 'practical' && (lecture.isLab || lecture.status === 'معمل')) ||
        (filterType === 'theory' && (!lecture.isLab && lecture.status !== 'معمل'));

      return matchesSearch && matchesType;
    });
  }, [selectedDay, searchQuery, filterType]);

  const selectToday = useCallback(() => {
    const today = getTodayAcademicKey();
    if (today) {
      setSelectedDay(today);
      return { isHoliday: false, dayKey: today };
    } else {
      const nextDay = getSmartInitialDay();
      setSelectedDay(nextDay);
      return { isHoliday: true, dayKey: nextDay };
    }
  }, []);

  return {
    selectedDay,
    setSelectedDay,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    lectures: filteredLectures,
    allCourses,
    daysList: activeDaysList,
    todayKey,
    isSelectedDayToday,
    selectToday
  };
}

export default useSchedule;
