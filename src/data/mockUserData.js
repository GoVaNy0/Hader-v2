/**
 * Mock Users & Academic Profiles Data
 */

export const DEFAULT_STUDENT = {
  id: "std-20230894",
  code: "20230894",
  name: "جوفاني أيمن",
  email: "giovani.ayman@tech.edu.eg",
  role: "student",
  division: "الفرقة الثانية - تكنولوجيا تعليم (عام)",
  divisionKey: "sec2_tech_general",
  streakDays: 12,
  treePoints: 425,
  treeLevel: 4,
  levelTitle: "شجرة مثمرة 🌱",
  attendanceRate: "96.4%",
  totalPresent: 27,
  totalAbsent: 1,
  deviceBound: {
    deviceId: "DEV-HW-8842-IOS",
    model: "iPhone 15 Pro",
    trusted: true,
    lastVerified: "اليوم 08:15 ص"
  }
};

export const DEFAULT_LEADER = {
  id: "ldr-20230894",
  code: "20230894",
  name: "جوفاني أيمن (ممثل الدفعة)",
  email: "giovani.ayman.leader@tech.edu.eg",
  role: "leader",
  division: "الفرقة الثانية - تكنولوجيا تعليم (عام)",
  divisionKey: "sec2_tech_general",
  streakDays: 15,
  treePoints: 540,
  treeLevel: 5,
  levelTitle: "شجرة وارفة وشهادة تميز 🌿",
  attendanceRate: "100%",
  totalPresent: 30,
  totalAbsent: 0,
  activeSessionsGenerated: 14,
  deviceBound: {
    deviceId: "DEV-HW-8842-IOS",
    model: "iPhone 15 Pro (Authorized Leader)",
    trusted: true,
    lastVerified: "اليوم 08:00 ص"
  }
};

export const TREE_LEVELS = [
  { level: 1, title: "بذرة البداية", min: 0, max: 100, icon: "🌱" },
  { level: 2, title: "شتلة واعدة", min: 101, max: 250, icon: "🌿" },
  { level: 3, title: "شجرة شابة", min: 251, max: 400, icon: "🪴" },
  { level: 4, title: "شجرة مثمرة", min: 401, max: 500, icon: "🌳" },
  { level: 5, title: "شجرة وارفة وشهادة تميز", min: 501, max: 9999, icon: "🌲" }
];
