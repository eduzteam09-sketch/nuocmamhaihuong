import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  FileText, 
  Send, 
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  PhoneCall,
  MessageSquare,
  Truck
} from 'lucide-react';
import { DynamicAITask } from '../utils/aiBusinessTasks';
import { AITaskExecution } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface AITaskExecutionModalProps {
  task: DynamicAITask | null;
  existingExecution?: AITaskExecution;
  onClose: () => void;
  onSaveExecution: (execution: AITaskExecution) => void;
  onOpenCustomerProfile?: (customer: any) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AITaskExecutionModal: React.FC<AITaskExecutionModalProps> = ({
  task,
  existingExecution,
  onClose,
  onSaveExecution,
  onOpenCustomerProfile,
  onNavigateTab,
}) => {
  if (!task) return null;

  const [status, setStatus] = useState<'in_progress' | 'completed'>(
    existingExecution?.status || 'completed'
  );
  const [resultNote, setResultNote] = useState<string>(
    existingExecution?.resultNote || task.defaultResultNote || ''
  );
  const [assignee, setAssignee] = useState<string>(
    existingExecution?.assignee || task.defaultAssignee || 'Nguyễn Hoàng Nam (Phụ trách Kênh Đại lý & B2B)'
  );
  const [channel, setChannel] = useState<string>(
    existingExecution?.channel || task.defaultChannel || 'Gặp trực tiếp & Biên bản thỏa thuận'
  );

  const nowFormatted = new Date().toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleSave = (finalStatus: 'in_progress' | 'completed') => {
    const executionData: AITaskExecution = {
      taskId: task.id,
      status: finalStatus,
      resultNote: resultNote.trim() || task.defaultResultNote,
      assignee: assignee.trim() || 'Ban Điều Hành Hải Hương',
      updatedAt: nowFormatted,
      channel: channel,
      targetDestination: task.targetDestination
    };

    onSaveExecution(executionData);
    onClose();
  };

  const channelOptions = [
    'Gặp trực tiếp & Biên bản thỏa thuận',
    'Zalo Doanh Nghiệp OA & Hotline',
    'Hệ thống Kho Vận & Lệnh Điều Chuyển Số',
    'Kế toán đối soát & Chữ ký số',
    'Hệ thống Điều độ Sản xuất Nhà máy'
  ];

  const staffOptions = [
    'Nguyễn Hoàng Nam (Phụ trách Kênh Đại lý & B2B)',
    'Trần Thu Hà (Chuyên viên CSKH & Khẩu vị VIP)',
    'Lê Quốc Bảo (Quản đốc Kho Vận & Chuỗi Cung Ứng)',
    'Phạm Minh Tuấn (Kế toán Trưởng Chuỗi)',
    'Nguyễn Văn Nghĩa (Quản đốc Nhà máy Phú Quốc)',
    'Hải Hương (Ban Giám Đốc Điều Hành)'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-900/20 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#3D1B00] via-[#5C2700] to-[#2E1200] text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9ED] p-1 shrink-0 flex items-center justify-center border border-[#FFA31A] shadow-md">
              <HuongGiotBienMascot pose="tip-card" size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${task.tagColor}`}>
                  {task.type}
                </span>
                <span className="text-[11px] text-amber-200 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-[#FFC407]" />
                  <span>Xác nhận & Cập nhật kết quả thực thi</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                {task.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm">
          {/* Target Entity & Impact Summary */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="text-[#3D1B00] text-xs">
                <span className="text-stone-500">Đối tượng liên quan: </span>
                <strong className="text-[#3D1B00] font-bold">
                  {task.linkedCustomer?.name || task.linkedStore?.name || task.entityName || 'Hệ thống chuỗi kinh doanh'}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#8A3E00] font-bold bg-[#FFA31A]/20 px-2 py-0.5 rounded">
                  {task.impact}
                </span>
              </div>
            </div>

            <p className="text-stone-600 text-xs leading-relaxed">
              {task.desc}
            </p>

            {/* Quick Link to Customer 360 or Chain */}
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs flex-wrap gap-2">
              <span className="text-stone-500 text-[11px]">Nơi lưu trữ kết quả:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#8A3E00] bg-white px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  📍 {task.targetDestination || 'Hồ sơ 360° & Hệ thống quản lý chuỗi'}
                </span>
                {task.linkedCustomer && onOpenCustomerProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCustomerProfile(task.linkedCustomer);
                      onClose();
                    }}
                    className="text-[11px] font-bold text-[#8A3E00] hover:text-[#3D1B00] flex items-center gap-1 cursor-pointer underline"
                  >
                    <span>Xem Hồ Sơ 360°</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                {task.linkedStore && onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('chain');
                      onClose();
                    }}
                    className="text-[11px] font-bold text-[#8A3E00] hover:text-[#3D1B00] flex items-center gap-1 cursor-pointer underline"
                  >
                    <span>Xem Điểm Bán</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status Chooser: Đang xử lý vs Đã hoàn thành */}
          <div>
            <label className="block text-xs font-bold text-[#3D1B00] uppercase tracking-wider mb-2">
              Chọn Trạng Thái Nhiệm Vụ:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('in_progress')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  status === 'in_progress'
                    ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400/30'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  status === 'in_progress' ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[#3D1B00] text-xs sm:text-sm">⏳ Đang xử lý</div>
                  <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                    Đang triển khai / theo dõi tiến độ. Nhiệm vụ sẽ chuyển sang mục "Đang xử lý".
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  status === 'completed'
                    ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-400/30'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[#3D1B00] text-xs sm:text-sm">✓ Đã hoàn thành</div>
                  <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                    Đã thực hiện xong và lưu biên bản kết quả. Trừ 1 số cảnh báo trên menu.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Result Note Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="execution-result-note" className="text-xs font-bold text-[#3D1B00] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#8A3E00]" />
                <span>Nội Dung / Biên Bản Kết Quả Thực Thi:</span>
              </label>
              <button
                type="button"
                onClick={() => setResultNote(task.defaultResultNote)}
                className="text-[11px] text-[#8A3E00] hover:text-[#3D1B00] font-semibold underline cursor-pointer"
              >
                Khôi phục gợi ý mẫu
              </button>
            </div>
            <textarea
              id="execution-result-note"
              rows={4}
              value={resultNote}
              onChange={(e) => setResultNote(e.target.value)}
              placeholder="Nhập chi tiết biên bản làm việc, số lượng đổi trả, mã phiếu hoặc thỏa thuận với khách hàng..."
              className="w-full p-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl text-[#3D1B00] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FFA31A] focus:border-[#FFA31A] transition-all leading-relaxed"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              💡 Ghi chú này sẽ được lưu cố định vào lịch sử thực thi và hiển thị trên thẻ nhiệm vụ cũng như hồ sơ của đối tác.
            </p>
          </div>

          {/* Metadata Grid: Assignee & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Assignee */}
            <div>
              <label htmlFor="execution-assignee" className="block text-xs font-bold text-[#3D1B00] mb-1.5">
                Nhân Sự Phụ Trách / Thực Hiện:
              </label>
              <select
                id="execution-assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-[#3D1B00] focus:outline-hidden focus:ring-2 focus:ring-[#FFA31A]"
              >
                {staffOptions.map(staff => (
                  <option key={staff} value={staff}>{staff}</option>
                ))}
              </select>
            </div>

            {/* Channel / Method */}
            <div>
              <label htmlFor="execution-channel" className="block text-xs font-bold text-[#3D1B00] mb-1.5">
                Kênh Triển Khai / Phương Thức:
              </label>
              <select
                id="execution-channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-[#3D1B00] focus:outline-hidden focus:ring-2 focus:ring-[#FFA31A]"
              >
                {channelOptions.map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-amber-900/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng / Bỏ qua
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('in_progress')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Lưu: Đang xử lý</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('completed')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-105 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-100" />
              <span>Xác nhận & Hoàn tất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
