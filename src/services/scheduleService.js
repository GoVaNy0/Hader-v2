/**
 * Mock Academic Schedule Service
 * Provides schedule queries, search, filter, and upcoming lecture calculations
 */

import { scheduleData } from '../data/scheduleData';
import { getSmartInitialDay } from '../utils/dateUtils';

export const scheduleService = {
  /**
   * Get courses for a specific academic day ('saturday', 'sunday', 'wednesday')
   */
  async getDaySchedule(dayKey) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return scheduleData[dayKey] || [];
  },

  /**
   * Get all courses flattened across all 3 days
   */
  async getAllCourses() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const all = [];
    Object.keys(scheduleData).forEach((dayKey) => {
      (scheduleData[dayKey] || []).forEach((c) => {
        all.push({ ...c, dayKey });
      });
    });
    return all;
  },

  /**
   * Calculate next upcoming or active lecture
   */
  async getUpcomingLecture() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const smartDay = getSmartInitialDay();
    const dayLectures = scheduleData[smartDay] || scheduleData.saturday;
    // Default to the featured practical lecture on Saturday/Wednesday
    return dayLectures[1] || dayLectures[0];
  },

  /**
   * Search and filter schedule entries
   */
  async filterSchedule({ dayKey = 'saturday', query = '', filterType = 'all' }) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const lectures = scheduleData[dayKey] || [];

    return lectures.filter((lecture) => {
      const matchesSearch =
        !query.trim() ||
        lecture.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture.doctor.toLowerCase().includes(query.toLowerCase()) ||
        lecture.location.toLowerCase().includes(query.toLowerCase());

      const matchesType =
        filterType === 'all' ||
        (filterType === 'practical' && (lecture.isLab || lecture.status === 'معمل')) ||
        (filterType === 'theory' && (!lecture.isLab && lecture.status !== 'معمل'));

      return matchesSearch && matchesType;
    });
  }
};
