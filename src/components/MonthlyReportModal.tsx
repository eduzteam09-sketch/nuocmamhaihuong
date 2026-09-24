import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  X, 
  Download, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Calendar,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  Users
} from 'lucide-react';
import { ReportContextData, exportToExcel, exportElementToPDF, formatVND } from '../utils/exportReports';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';
import { HaiHuongLogo } from './brand/HaiHuongLogo';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ReportContextData;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const {
    orders,
    monthlyData,
    customers,
    stores,
    latestMonthRevenue,
    totalYtdRevenue,
    revenueGrowth,
  } = context;

  const handleExportExcel = () => {
    try {
      exportToExcel(context);
      setExportSuccess('Đã xuất file Excel (.xlsx) thành công!');
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const success = await exportElementToPDF(
        'hai-huong-monthly-report-printable',
        `HaiHuong_BaoCao_KinhDoanh_T09_2026`
      );
      if (success) {
        setExportSuccess('Đã xuất file PDF (.pdf) thành công!');
        setTimeout(() => setExportSuccess(null), 4000);
      }
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="monthly-report-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-amber-900/20 w-full max-w-5xl my-auto flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-amber-900/10 bg-[#3D1B00] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#FFA31A]/40 text-[#FFA31A]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-50">
                Xuất Báo Cáo Kinh Doanh & Điều Hành
              </h2>
              <p className="text-xs text-amber-200/80">
                Kỳ báo cáo: Tháng 09/2026 • Nước Mắm Cốt Nhĩ Hải Hương
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Export Excel */}
            <button
              id="modal-btn-export-excel"
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Tải File Excel (.xlsx)</span>
              <span className="sm:hidden">Excel</span>
            </button>

            {/* Quick Export PDF */}
            <button
              id="modal-btn-export-pdf"
              type="button"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="px-3.5 py-2 rounded-xl bg-[#FFA31A] hover:bg-[#E68A00] text-[#3D1B00] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isExportingPDF ? 'Đang tạo PDF...' : 'Tải File PDF (.pdf)'}
              </span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Close Button */}
            <button
              id="modal-btn-close"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {exportSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportSuccess}</span>
          </div>
        )}

        {/* Document Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-100">
          <div className="max-w-4xl mx-auto shadow-lg rounded-xl overflow-hidden">
            {/* The printable document container (A4-proportioned paper) */}
            <div 
              id="hai-huong-monthly-report-printable" 
              className="bg-white p-6 sm:p-10 text-stone-800 space-y-6 min-h-[1050px]"
            >
              {/* Document Header */}
              <div className="border-b-2 border-[#8A3E00] pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#8A3E00] uppercase">
                    <Building2 className="w-4 h-4" />
                    <span>Công Ty Cổ Phần Nước Mắm Cốt Nhĩ Hải Hương</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#3D1B00] tracking-tight">
                    BÁO CÁO KINH DOANH & ĐIỀU HÀNH CHUỖI
                  </h1>
                  <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-stone-700">
                      <Calendar className="w-3.5 h-3.5 text-[#8A3E00]" />
                      Kỳ báo cáo: Tháng 09/2026
                    </span>
                    <span>•</span>
                    <span>Hệ thống: Toàn quốc (Bắc - Trung - Nam & Chuỗi Cửa Hàng)</span>
                    <span>•</span>
                    <span>Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start">
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-[#8A3E00] uppercase tracking-wider">Hải Hương 1982</div>
                    <div className="text-[10px] text-stone-500">Chuẩn Độ Đạm Tự Nhiên</div>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl p-1 border border-amber-200 flex items-center justify-center">
                    <HuongGiotBienMascot pose="thumbs-up" size="sm" />
                  </div>
                </div>
              </div>

              {/* Section 1: Executive KPI Overview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A3E00]" />
                  <h2 className="text-sm font-extrabold text-[#3D1B00] uppercase tracking-wide">
                    I. Chỉ Số Kinh Doanh Trọng Yếu (Executive KPIs)
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
                    <span className="text-[11px] text-stone-600 font-medium">Doanh thu Tháng 9</span>
                    <div className="text-lg font-black text-[#8A3E00] mt-0.5">
                      {(latestMonthRevenue / 1_000_000_000).toFixed(2)} Tỷ đ
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      +{revenueGrowth}% MoM (Đạt 108.7% KH)
                    </span>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-600 font-medium">Lũy kế YTD (9 tháng)</span>
                    <div className="text-lg font-black text-[#3D1B00] mt-0.5">
                      {(totalYtdRevenue / 1_000_000_000).toFixed(2)} Tỷ đ
                    </div>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      Đạt 75.4% kế hoạch năm
                    </span>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-600 font-medium">Mạng lưới điểm bán</span>
                    <div className="text-lg font-black text-[#3D1B00] mt-0.5">
                      {stores.length} Điểm
                    </div>
                    <span className="text-[10px] text-blue-700 font-bold">
                      96.5% điểm bán chuẩn hóa
                    </span>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-600 font-medium">Tỷ lệ giữ chân khách</span>
                    <div className="text-lg font-black text-emerald-800 mt-0.5">
                      84.5%
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Chu kỳ 32 ngày/chai
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Monthly Trends Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8A3E00]" />
                    <h2 className="text-sm font-extrabold text-[#3D1B00] uppercase tracking-wide">
                      II. Diễn Biến Doanh Thu & Mục Tiêu Kế Hoạch 2026
                    </h2>
                  </div>
                  <span className="text-xs text-stone-500 italic">Đơn vị: Tỷ VNĐ</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100/60 text-stone-800 font-bold border-b border-amber-200">
                        <th className="p-2.5">Kỳ Báo Cáo</th>
                        <th className="p-2.5 text-right">Thực Tế</th>
                        <th className="p-2.5 text-right">Mục Tiêu</th>
                        <th className="p-2.5 text-right">Chênh Lệch</th>
                        <th className="p-2.5 text-right">Tỷ Lệ Đạt</th>
                        <th className="p-2.5 text-right">Tăng Trưởng MoM</th>
                        <th className="p-2.5 text-center">Số Đơn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-700">
                      {monthlyData.map((row) => {
                        const diff = Number((row.revenueInBillion - row.targetInBillion).toFixed(2));
                        return (
                          <tr 
                            key={row.monthKey} 
                            className={row.monthKey === '2026-09' ? 'bg-amber-50/80 font-bold text-stone-900' : 'hover:bg-stone-50/60'}
                          >
                            <td className="p-2.5">
                              {row.fullMonthName}
                              {row.monthKey === '2026-09' && (
                                <span className="ml-1.5 text-[9px] bg-[#8A3E00] text-white px-1.5 py-0.2 rounded font-bold">
                                  Hiện tại
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-extrabold text-[#8A3E00]">
                              {row.revenueInBillion.toFixed(2)} Tỷ
                            </td>
                            <td className="p-2.5 text-right text-stone-600">
                              {row.targetInBillion.toFixed(2)} Tỷ
                            </td>
                            <td className={`p-2.5 text-right font-semibold ${diff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {diff >= 0 ? `+${diff}` : diff} Tỷ
                            </td>
                            <td className="p-2.5 text-right font-bold text-stone-800">
                              {row.achievementRate}%
                            </td>
                            <td className="p-2.5 text-right font-bold">
                              <span className={row.growthRate >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                                {row.growthRate >= 0 ? `+${row.growthRate}%` : `${row.growthRate}%`}
                              </span>
                            </td>
                            <td className="p-2.5 text-center text-stone-600">
                              {row.orderCount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-stone-100 font-extrabold text-stone-900 border-t-2 border-stone-300">
                        <td className="p-2.5">Tổng Lũy Kế 9 Tháng</td>
                        <td className="p-2.5 text-right text-[#8A3E00]">{totalYtdRevenue} Tỷ</td>
                        <td className="p-2.5 text-right">39.60 Tỷ</td>
                        <td className="p-2.5 text-right text-emerald-700">+1.88 Tỷ</td>
                        <td className="p-2.5 text-right">104.7%</td>
                        <td className="p-2.5 text-right text-emerald-700">+16.8% (T9)</td>
                        <td className="p-2.5 text-center">
                          {monthlyData.reduce((acc, c) => acc + c.orderCount, 0)} đơn
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Section 3: Recent Major Dispatch & Orders Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A3E00]" />
                  <h2 className="text-sm font-extrabold text-[#3D1B00] uppercase tracking-wide">
                    III. Bảng Kê Đơn Hàng Phân Phối Trọng Điểm (Tháng 9)
                  </h2>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                        <th className="p-2.5">Mã Đơn</th>
                        <th className="p-2.5">Khách Hàng / Đối Tác</th>
                        <th className="p-2.5">Kênh</th>
                        <th className="p-2.5">Ngày Đặt</th>
                        <th className="p-2.5 text-right">Thành Tiền Thực Thu</th>
                        <th className="p-2.5">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-600">
                      {orders.slice(0, 6).map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/50">
                          <td className="p-2.5 font-mono font-bold text-stone-800">{ord.orderCode}</td>
                          <td className="p-2.5 font-medium text-stone-900">{ord.customerName}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold text-[10px]">
                              {ord.channel}
                            </span>
                          </td>
                          <td className="p-2.5 text-stone-500">{ord.createdAt}</td>
                          <td className="p-2.5 text-right font-bold text-[#8A3E00]">
                            {formatVND(ord.finalAmount)}
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: AI Copilot Executive Recommendations */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#8A3E00]">
                  <Sparkles className="w-4 h-4 text-[#FFA31A]" />
                  <span>Khuyến Nghị Điều Hành & Dự Báo Từ AI Copilot</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li>
                    <strong>Tăng trưởng miền Bắc:</strong> Lô hàng thu đông từ NPP Bắc Việt đạt 2.80 Tỷ VNĐ, tăng 32% so với cùng kỳ năm 2025. Cần chuẩn bị kế hoạch đóng thùng mắm thượng hạng 45°N cho Tết 2027 sớm trước 45 ngày.
                  </li>
                  <li>
                    <strong>Thấu cảm khách hàng:</strong> Nhóm 35 đại lý và 142 khách hàng lẻ bước vào chu kỳ dùng cạn chai mắm (TB 32 ngày). Hệ thống đã tự động gửi tin nhắn tri ân và gợi ý tái đặt hàng kèm chính sách ưu đãi ngày hội truyền thống.
                  </li>
                  <li>
                    <strong>Chất lượng cốt nhĩ:</strong> 100% các mẻ mắm xuất kho đều đạt chuẩn kiểm định độ đạm thực phẩm an toàn, giữ trọn sắc hổ phách cánh gián và hậu vị ngọt sâu từ đạm cá cơm nguyên chất.
                  </li>
                </ul>
              </div>

              {/* Document Signatures */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-center text-xs text-stone-600">
                <div className="space-y-12">
                  <div className="font-bold text-stone-800">Người Lập Báo Cáo</div>
                  <div className="font-semibold text-stone-900">Ban Thư Ký & BI</div>
                </div>
                <div className="space-y-12">
                  <div className="font-bold text-stone-800">Kế Toán Trưởng</div>
                  <div className="font-semibold text-stone-900">Trần Thùy Linh</div>
                </div>
                <div className="space-y-12">
                  <div className="font-bold text-stone-800">Tổng Giám Đốc Phê Duyệt</div>
                  <div className="font-semibold text-[#8A3E00]">Nguyễn Hải Hương</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-7 py-3.5 border-t border-stone-200 bg-white">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dữ liệu báo cáo được mã hóa và xác thực từ cơ sở dữ liệu chuỗi.</span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Văn Bản</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tải Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="px-4 py-2 rounded-xl bg-[#8A3E00] hover:bg-[#5C2700] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPDF ? 'Đang xuất PDF...' : 'Tải File PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
