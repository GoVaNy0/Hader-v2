/**
 * Mock Authentication Service
 * Decoupled Promise-based architecture with micro-latencies
 */

import { DEFAULT_STUDENT, DEFAULT_LEADER } from '../data/mockUserData';

const USER_STORAGE_KEY = 'hader_current_user';

export const authService = {
  /**
   * Simulate user login with academic ID/email and password
   */
  async login({ identifier, password, role = 'student' }) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!identifier || !password) {
      throw new Error('يرجى ملء جميع الحقول المطلوبة');
    }

    const baseUser = role === 'leader' ? DEFAULT_LEADER : DEFAULT_STUDENT;
    const user = {
      ...baseUser,
      id: identifier.includes('@') ? `usr-${Date.now()}` : `usr-${identifier}`,
      code: identifier.replace(/[^0-9]/g, '') || baseUser.code,
      role
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Simulate new student registration
   */
  async signup(signupData) {
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (!signupData.fullName || !signupData.studentCode || !signupData.email) {
      throw new Error('يرجى استكمال البيانات الأكاديمية الأساسية');
    }

    const newUser = {
      ...DEFAULT_STUDENT,
      id: `std-${signupData.studentCode}`,
      code: signupData.studentCode,
      name: signupData.fullName,
      email: signupData.email,
      division: signupData.academicDivisionLabel || DEFAULT_STUDENT.division,
      divisionKey: signupData.academicDivision || 'sec2_tech_general',
      role: 'student',
      treePoints: 50,
      treeLevel: 1,
      levelTitle: "بذرة البداية 🌱",
      streakDays: 1,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    await new Promise((resolve) => setTimeout(resolve, 80));
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STUDENT;
  },

  /**
   * Switch between Student and Leader roles (Development / Testing)
   */
  async switchRole(currentRole) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const targetRole = currentRole === 'student' ? 'leader' : 'student';
    const profile = targetRole === 'leader' ? DEFAULT_LEADER : DEFAULT_STUDENT;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  },

  /**
   * Request password reset simulation
   */
  async requestPasswordReset(email) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!email || !email.includes('@')) {
      throw new Error('يرجى إدخال بريد إلكتروني أكاديمي صالح');
    }
    return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الأكاديمي' };
  },

  /**
   * Terminate active session
   */
  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    localStorage.removeItem(USER_STORAGE_KEY);
    return true;
  }
};
