/**
 * Mock Security Incidents & Anti-Fraud Logs
 */

export const INITIAL_INCIDENTS = [
  {
    id: "inc-101",
    timestamp: "10:34 ص - منذ 12 دقيقة",
    studentId: "20230712",
    studentName: "أحمد محمود سالم",
    courseTitle: "تصميم وإنتاج بيئات الوسائط المتكاملة",
    violationType: "اختراق نطاق جغرافي (Geofence Breach)",
    distance: "2,420 متر خارج المعمل",
    device: "iPhone 14 Pro (iOS 18)",
    severity: "HIGH",
    actionTaken: "تم حظر الحضور تلقائياً"
  },
  {
    id: "inc-102",
    timestamp: "10:31 ص - منذ 15 دقيقة",
    studentId: "20230650",
    studentName: "كريم حسام الدين",
    courseTitle: "تصميم وإنتاج بيئات الوسائط المتكاملة",
    violationType: "مشاركة جهاز محظورة (Multi-Account Device)",
    distance: "24 متر داخل القاعة",
    device: "Samsung Galaxy S23 (جهاز مرتبط بطالب آخر)",
    severity: "CRITICAL",
    actionTaken: "إيقاف مؤقت للحساب وتسجيل الواقعة"
  },
  {
    id: "inc-103",
    timestamp: "09:45 ص - منذ ساعة",
    studentId: "20230811",
    studentName: "مريم خالد رضوان",
    courseTitle: "نظريات تربوية وإدارية",
    violationType: "رمز حضور منتهي الصلاحية (Replay Attack)",
    distance: "18 متر داخل القاعة",
    device: "Xiaomi Redmi Note 12",
    severity: "MEDIUM",
    actionTaken: "طلب إعادة المسح بالكود الحي"
  },
  {
    id: "inc-104",
    timestamp: "08:12 ص - منذ ساعتين",
    studentId: "20230903",
    studentName: "يوسف طارق علام",
    courseTitle: "نظريات تربوية وإدارية",
    violationType: "تزييف موقع جغرافي (Mock GPS Detection)",
    distance: "بيانات مشوهة / محاكاة موقع",
    device: "OnePlus 11 (Android 14 Rooted)",
    severity: "CRITICAL",
    actionTaken: "رفض فوري مع إرسال إشعار أمني"
  }
];
