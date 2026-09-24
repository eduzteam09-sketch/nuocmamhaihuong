import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Customer, StoreNode, ProductSKU, AIBusinessAlert, OrderRecord } from '../types';

export interface MonthlyTrendData {
  monthKey: string;
  monthLabel: string;
  fullMonthName: string;
  revenueInBillion: number;
  targetInBillion: number;
  growthRate: number;
  rawRevenue: number;
  orderCount: number;
  achievementRate: number;
  nppShare: number;
}

export interface ReportContextData {
  orders: OrderRecord[];
  monthlyData: MonthlyTrendData[];
  customers: Customer[];
  stores: StoreNode[];
  products: ProductSKU[];
  alerts: AIBusinessAlert[];
  latestMonthRevenue: number;
  totalYtdRevenue: number;
  revenueGrowth: number;
}

/**
 * Format currency to Vietnamese Dong string
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/**
 * Export Business Metrics & Order Summaries to a multi-sheet Microsoft Excel (.xlsx) file
 */
export const exportToExcel = (context: ReportContextData) => {
  const { orders, monthlyData, customers, stores, latestMonthRevenue, totalYtdRevenue, revenueGrowth } = context;

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // Sheet 1: Tổng Quan Chỉ Số Kinh Doanh (Key Business Metrics)
  // -------------------------------------------------------------
  const kpiRows = [
    ['BÁO CÁO TỔNG HỢP CHỈ SỐ KINH DOANH - NƯỚC MẮM CỐT NHĨ HẢI HƯƠNG'],
    ['Kỳ báo cáo:', 'Tháng 09/2026', 'Thời điểm xuất:', new Date().toLocaleString('vi-VN')],
    ['Hệ thống phân phối:', 'Toàn quốc (Bắc - Trung - Nam & Chuỗi Cửa Hàng)'],
    [],
    ['STT', 'CHỈ SỐ KPI ĐIỀU HÀNH', 'GIÁ TRỊ THỰC TẾ', 'SO VỚI KẾ HOẠCH / THÁNG TRƯỚC', 'ĐÁNH GIÁ CỦA AI COPILOT'],
    [
      1,
      'Doanh Thu Tháng 9 (Hiện tại)',
      `${(latestMonthRevenue / 1_000_000_000).toFixed(2)} Tỷ VNĐ (${formatVND(latestMonthRevenue)})`,
      `+${revenueGrowth}% so với T8`,
      'Vượt 108.7% kế hoạch tháng; Đạt đỉnh tăng trưởng nhờ đơn hàng xuất thu đông'
    ],
    [
      2,
      'Doanh Thu Lũy Kế 9 Tháng (YTD 2026)',
      `${(totalYtdRevenue / 1_000_000_000).toFixed(2)} Tỷ VNĐ (${formatVND(totalYtdRevenue)})`,
      'Đạt 75.4% kế hoạch năm (55 Tỷ)',
      'Tiến độ xuất sắc, dự kiến vượt kế hoạch năm vào giữa Tháng 11'
    ],
    [
      3,
      'Mạng Lưới Điểm Bán / Showroom',
      `${stores.length} Điểm Bán Hoạt Động`,
      '+3 điểm mới trong Quý 3',
      'Hiệu quả vận hành 96.5%; Miền Trung mở rộng chuỗi nhà hàng đặc sản'
    ],
    [
      4,
      'Chỉ Số Thấu Cảm & Giữ Chân Khách',
      '84.5% Tỷ lệ giữ chân',
      'Chu kỳ tiêu thụ TB: 32 ngày/chai',
      'Mô hình AI nhận diện chính xác thời điểm cạn mắm để gợi ý mua lại'
    ],
    [
      5,
      'Tổng Số Khách Hàng Quản Lý (CRM 360)',
      `${customers.length} Khách hàng & Đại lý`,
      'Phân tầng RFM tự động',
      'Tập trung chăm sóc nhóm Champions & can thiệp nhóm có nguy cơ rời bỏ'
    ],
    [
      6,
      'Cảnh Báo Kinh Doanh AI Cần Xử Lý',
      `${context.alerts.length} Cảnh báo kích hoạt`,
      'Ưu tiên: Dự báo cạn chai & Kho đạm cao',
      'Đã tự động gửi thông báo đến các trưởng nhóm phụ trách kinh doanh'
    ]
  ];

  const wsKPI = XLSX.utils.aoa_to_sheet(kpiRows);
  wsKPI['!cols'] = [
    { wch: 6 },
    { wch: 38 },
    { wch: 32 },
    { wch: 30 },
    { wch: 55 }
  ];
  XLSX.utils.book_append_sheet(wb, wsKPI, 'Chi_So_Tong_Quan');

  // -------------------------------------------------------------
  // Sheet 2: Doanh Thu & Tăng Trưởng 9 Tháng (Monthly Trends)
  // -------------------------------------------------------------
  const monthlyRows = [
    ['BẢNG THEO DÕI DOANH THU & TĂNG TRƯỞNG THEO THÁNG NĂM 2026'],
    ['Đơn vị tiền tệ:', 'VNĐ và Tỷ VNĐ'],
    [],
    [
      'Mã Tháng',
      'Tên Kỳ Báo Cáo',
      'Doanh Thu Thực Tế (VNĐ)',
      'Doanh Thu (Tỷ đ)',
      'Kế Hoạch Mục Tiêu (Tỷ đ)',
      'Chênh Lệch So Với KH (Tỷ đ)',
      'Tỷ Lệ Đạt KH (%)',
      'Tăng Trưởng MoM (%)',
      'Số Đơn Phân Phối',
      'Tỷ Trọng NPP/Bán Buôn (%)'
    ],
    ...monthlyData.map((m) => {
      const diff = Number((m.revenueInBillion - m.targetInBillion).toFixed(2));
      return [
        m.monthKey,
        m.fullMonthName,
        m.rawRevenue,
        m.revenueInBillion,
        m.targetInBillion,
        diff > 0 ? `+${diff}` : `${diff}`,
        `${m.achievementRate}%`,
        m.growthRate >= 0 ? `+${m.growthRate}%` : `${m.growthRate}%`,
        m.orderCount,
        `${m.nppShare}%`
      ];
    })
  ];

  const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyRows);
  wsMonthly['!cols'] = [
    { wch: 12 },
    { wch: 18 },
    { wch: 24 },
    { wch: 18 },
    { wch: 22 },
    { wch: 24 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 24 }
  ];
  XLSX.utils.book_append_sheet(wb, wsMonthly, 'Doanh_Thu_Theo_Thang');

  // -------------------------------------------------------------
  // Sheet 3: Danh Sách Chi Tiết Đơn Hàng (Order Summaries)
  // -------------------------------------------------------------
  const orderRows = [
    ['BẢNG KÊ CHI TIẾT ĐƠN HÀNG & PHÂN PHỐI NƯỚC MẮM HẢI HƯƠNG'],
    ['Tổng số đơn hàng kết xuất:', orders.length],
    [],
    [
      'STT',
      'Mã Đơn Hàng',
      'Thời Gian Đặt',
      'Tên Khách Hàng / Đối Tác',
      'Phân Loại',
      'Kênh Phân Phối',
      'Chi Tiết Sản Phẩm Đặt Mua',
      'Tổng Tiền Hàng (VNĐ)',
      'Chiết Khấu (VNĐ)',
      'Thành Tiền Thực Thu (VNĐ)',
      'Trạng Thái',
      'Địa Chỉ Giao Hàng',
      'Ghi Chú Thấu Cảm Khách Hàng (AI)'
    ],
    ...orders.map((ord, idx) => {
      const itemsSummary = (ord.items || [])
        .map(i => `${i.productName} (SL: ${i.quantity})`)
        .join('; ');

      return [
        idx + 1,
        ord.orderCode,
        ord.createdAt,
        ord.customerName,
        ord.customerType,
        ord.channel,
        itemsSummary,
        ord.totalAmount,
        ord.discount || 0,
        ord.finalAmount,
        ord.status,
        ord.deliveryAddress || 'Tại showroom',
        ord.empathyNote || 'Khách hàng thân thiết định kỳ'
      ];
    })
  ];

  const wsOrders = XLSX.utils.aoa_to_sheet(orderRows);
  wsOrders['!cols'] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 18 },
    { wch: 26 },
    { wch: 14 },
    { wch: 20 },
    { wch: 45 },
    { wch: 20 },
    { wch: 16 },
    { wch: 22 },
    { wch: 18 },
    { wch: 35 },
    { wch: 45 }
  ];
  XLSX.utils.book_append_sheet(wb, wsOrders, 'Danh_Sach_Don_Hang');

  // Write file and trigger browser download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `HaiHuong_Bao_Cao_Kinh_Doanh_${dateStr}.xlsx`);
};

/**
 * Capture an element and export as high-quality formatted PDF
 */
export const exportElementToPDF = async (elementId: string, filename: string): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export.`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x scale for high DPI sharpness
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
