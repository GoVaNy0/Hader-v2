import React, { useState } from 'react';
import { Upload, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { useAttendance } from '../../../context/AttendanceContext';
import { scheduleData } from '../../../data/scheduleData';

export default function ExcusesModal({ isOpen, onClose }) {
  const { submitExcuse } = useAttendance();

  const [lectureId, setLectureId] = useState('sat-2');
  const [reason, setReason] = useState('medical');
  const [note, setNote] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // List of lectures
  const allLectures = [
    { id: 'sat-1', title: 'نظريات تربوية وإدارية' },
    { id: 'sat-2', title: 'تصميم وإنتاج بيئات الوسائط المتكاملة (تطبيقات)' },
    { id: 'sat-3', title: 'التمكين الرقمي (تطبيقات)' },
    { id: 'sat-4', title: 'الاتجاهات المعاصرة في علم النفس' },
    { id: 'sun-1', title: 'دمج ذوي الاحتياجات الخاصة' },
    { id: 'sun-2', title: 'محفزات الألعاب التعليمية' },
    { id: 'wed-1', title: 'تصميم الكتاب الإلكتروني' },
    { id: 'wed-3', title: 'التمكين الرقمي' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setSubmitting(true);
    try {
      await submitExcuse({
        lectureId,
        reason,
        note,
        attachmentName: fileName || 'medical_report.pdf'
      });
      setNote('');
      setFileName('');
      onClose();
    } catch {
      // Error handled by context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تقديم عذر غياب أكاديمي"
      subtitle="يتم إرسال الطلب مشفراً إلى أستاذ المادة وإدارة القسم"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        {/* Lecture Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#d1cece]">المحاضرة المراد تقديم العذر لها</label>
          <select
            value={lectureId}
            onChange={(e) => setLectureId(e.target.value)}
            className="w-full bg-[#1b1728] border border-[#3e3a46] rounded-lg text-xs text-white p-2.5 outline-none focus:border-[#fd8925]"
          >
            {allLectures.map((lec) => (
              <option key={lec.id} value={lec.id} className="bg-[#1b1728] text-white">
                {lec.title}
              </option>
            ))}
          </select>
        </div>

        {/* Reason Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#d1cece]">نوع العذر</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-[#1b1728] border border-[#3e3a46] rounded-lg text-xs text-white p-2.5 outline-none focus:border-[#fd8925]"
          >
            <option value="medical" className="bg-[#1b1728]">عذر طبي معتمد من الإدارة الطبية</option>
            <option value="emergency" className="bg-[#1b1728]">ظرف طارئ قاهر</option>
            <option value="official_task" className="bg-[#1b1728]">مهمة رسمية تمثيلية للجامعة</option>
            <option value="other" className="bg-[#1b1728]">أخرى (مع ذكر التفاصيل)</option>
          </select>
        </div>

        {/* Detailed Note */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#d1cece]">تفاصيل وملاحظات العذر</label>
          <textarea
            required
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="اكتب شرحاً موجزاً لأسباب الغياب والظرف الصحي أو الأكاديمي..."
            className="w-full bg-[#1b1728] border border-[#3e3a46] rounded-lg text-xs text-white p-2.5 outline-none focus:border-[#fd8925] resize-none placeholder-[#9d9797]"
          />
        </div>

        {/* Attachment Upload Simulation */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#d1cece]">المستند الطبي أو الإثبات (PDF أو صورة)</label>
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#3e3a46] hover:border-[#fd8925] rounded-xl bg-[#1b1728]/50 cursor-pointer transition-colors group">
            <Upload className="w-5 h-5 text-[#9d9797] group-hover:text-[#fd8925] mb-1" />
            <span className="text-xs text-[#d1cece]">
              {fileName ? fileName : 'انقر لإرفاق التقرير الطبي أو المستند'}
            </span>
            <span className="text-[10px] text-[#9d9797] mt-0.5">الحد الأقصى 5 ميجابايت</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFileName(e.target.files[0].name);
                }
              }}
            />
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="ember"
            size="md"
            loading={submitting}
            className="w-full"
          >
            إرسال العذر رسميًا
          </Button>
        </div>
      </form>
    </Modal>
  );
}
