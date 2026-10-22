import React from 'react';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';
import Button from '../../common/Button';

export default function SessionPrintView({
  isOpen,
  onClose,
  course,
  week = 8,
  attendeesCount = 38
}) {
  if (!isOpen) return null;

  const mockAttendees = [
    { no: 1, id: "20230894", name: "جوفاني أيمن", time: "10:02 ص", verified: true },
    { no: 2, id: "20230895", name: "أحمد محمد كمال", time: "10:04 ص", verified: true },
    { no: 3, id: "20230896", name: "سارة محمود خالد", time: "10:05 ص", verified: true },
    { no: 4, id: "20230897", name: "محمود حسن علي", time: "10:06 ص", verified: true },
    { no: 5, id: "20230898", name: "روان إبراهيم سالم", time: "10:07 ص", verified: true },
    { no: 6, id: "20230899", name: "عمر شريف فهمي", time: "10:09 ص", verified: true },
    { no: 7, id: "20230900", name: "مريم طارق عبد الله", time: "10:11 ص", verified: true },
    { no: 8, id: "20230901", name: "خالد سعيد فوزي", time: "10:12 ص", verified: true }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-[#1a1624] text-white flex items-center justify-between border-b border-[#3e3a46]">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#fd8925]" />
            <h3 className="text-sm font-bold">معاينة كشف الحضور الرسمي للطباعة</h3>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ember" size="sm" icon={Printer} onClick={handlePrint}>
              طباعة فورية
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="إغلاق معاينة الطباعة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 md:p-10 space-y-6 text-right font-sans" dir="rtl">
          
          {/* University Official Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="space-y-1 text-xs font-bold text-slate-700">
              <p>جامعة حلوان</p>
              <p>كلية التربية النوعية</p>
              <p>قسم تكنولوجيا التعليم — الفرقة الثانية</p>
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-lg font-extrabold text-slate-900">كشف إثبات حضور المحاضرات</h2>
              <span className="text-xs bg-slate-100 px-3 py-1 rounded font-bold border border-slate-300">
                منظومة حاضر الإلكترونية (Hader-V2)
              </span>
            </div>
            <div className="text-left text-xs font-mono text-slate-600 space-y-1">
              <p>تاريخ اليوم: {new Date().toLocaleDateString('ar-EG')}</p>
              <p>الأسبوع: {week}</p>
              <p>كود الجلسة: HADER-SES-8842</p>
            </div>
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
            <div>
              <span className="text-slate-500 block">المقرر:</span>
              <strong className="text-slate-900">{course?.title || 'الوسائط المتكاملة'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">أستاذ المادة:</span>
              <strong className="text-slate-900">{course?.doctor || 'د. إنجي إبراهيم'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">القاعة / المعمل:</span>
              <strong className="text-slate-900">{course?.location || 'معمل 274'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">عدد الحاضرين:</span>
              <strong className="text-emerald-700">{attendeesCount} طالب موثق</strong>
            </div>
          </div>

          {/* Student Attendees Table */}
          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                  <th className="p-2.5 border-l border-slate-300 w-12 text-center">م</th>
                  <th className="p-2.5 border-l border-slate-300 w-28">الرقم الجامعي</th>
                  <th className="p-2.5 border-l border-slate-300">اسم الطالب</th>
                  <th className="p-2.5 border-l border-slate-300 w-24">وقت التوثيق</th>
                  <th className="p-2.5 border-l border-slate-300 w-24 text-center">النطاق الجغرافي</th>
                  <th className="p-2.5 w-24 text-center">التوقيع</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendees.map((att) => (
                  <tr key={att.no} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 border-l border-slate-200 text-center font-mono">{att.no}</td>
                    <td className="p-2.5 border-l border-slate-200 font-mono font-bold">{att.id}</td>
                    <td className="p-2.5 border-l border-slate-200 font-semibold">{att.name}</td>
                    <td className="p-2.5 border-l border-slate-200 font-mono">{att.time}</td>
                    <td className="p-2.5 border-l border-slate-200 text-center text-emerald-700 font-bold">
                      داخل القاعة (18م)
                    </td>
                    <td className="p-2.5 text-center text-slate-400 font-serif">موقع إلكترونيًا</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures Row */}
          <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-xs text-slate-700 font-bold">
            <div className="text-center space-y-8">
              <span>توقيع ممثل الدفعة (الراصد):</span>
              <p className="font-mono text-slate-500">جوفاني أيمن</p>
            </div>
            <div className="text-center space-y-8">
              <span>اعتماد أستاذ المادة:</span>
              <p className="text-slate-400">..............................</p>
            </div>
            <div className="text-center space-y-8">
              <span>ختم رئيس قسم تكنولوجيا التعليم:</span>
              <p className="text-slate-400">..............................</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
