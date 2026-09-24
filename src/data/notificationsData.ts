import { AppNotification } from '../types';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    type: 'AI_ALERT',
    title: 'Cảnh báo Churn: 2 khách hàng VIP trễ chu kỳ',
    description: 'Bác Trần Văn Hưng & Đại lý Cô Ba đã vượt quá chu kỳ tái đặt hàng 10-20 ngày. Nguy cơ hụt doanh thu 18.5 Triệu đ.',
    time: '5 phút trước',
    severity: 'high',
    isRead: false,
    targetTab: 'ai_business_center',
    actionLabel: 'Xử lý trong AI Center'
  },
  {
    id: 'notif-02',
    type: 'STOCK',
    title: 'Cảnh báo Kho: Cửa hàng Q1 sắp cạn hàng',
    description: 'Tồn chai 500ml 40N tại Cửa Hàng 88 Hai Bà Trưng chỉ còn 450 chai, đủ bán trong 3 ngày. Cần điều chuyển gấp.',
    time: '12 phút trước',
    severity: 'high',
    isRead: false,
    targetTab: 'chain',
    actionLabel: 'Điều phối kho chuỗi'
  },
  {
    id: 'notif-03',
    type: 'DEBT',
    title: 'Nhắc hạn công nợ chuỗi: 37.000.000 đ',
    description: 'Cửa hàng Hà Nội (25 Tr) và Đại lý Cô Ba (12 Tr) đến kỳ đối soát công nợ trước chu kỳ xuất hàng mới.',
    time: '25 phút trước',
    severity: 'medium',
    isRead: false,
    targetTab: 'ai_business_center',
    actionLabel: 'Gửi đối soát qua Zalo'
  },
  {
    id: 'notif-04',
    type: 'AI_ALERT',
    title: 'Cơ hội mở rộng: NPP Hưng Long Phát tăng +14.5%',
    description: 'NPP đề xuất tài trợ thêm 8 điểm kệ gỗ nghệ nhân và ký phụ lục tăng hạn mức phân phối.',
    time: '40 phút trước',
    severity: 'medium',
    isRead: false,
    targetTab: 'ai_business_center',
    actionLabel: 'Xem đề xuất AI'
  },
  {
    id: 'notif-05',
    type: 'ORDER',
    title: 'Đơn hàng mới: DH-2026-0921-01',
    description: 'Khách hàng Nguyễn Thị Mai Lan vừa đặt 2 chai Cốt Nhĩ 40°N (250.000 đ). Trạng thái: Đang vận chuyển.',
    time: '1 giờ trước',
    severity: 'info',
    isRead: false,
    targetTab: 'orders',
    actionLabel: 'Xem đơn hàng'
  },
  {
    id: 'notif-06',
    type: 'BATCH',
    title: 'Kiểm định chất lượng: Thùng gỗ Bời Lời #42',
    description: 'Lô LOT-PQ-2024-C40 đạt 42.5°N đạm tự nhiên, hoàn tất chứng nhận kiểm định ISO/HACCP tại Phú Quốc.',
    time: '2 giờ trước',
    severity: 'info',
    isRead: false,
    targetTab: 'batches',
    actionLabel: 'Xem lô ủ chượp'
  },
  {
    id: 'notif-07',
    type: 'LEAD',
    title: 'Leads B2B mới: Chuỗi Nhà Hàng Cơm Niêu',
    description: 'Đối tác tiềm năng yêu cầu gửi mẫu thử mắm gài nén 45N và báo giá chính sách đại lý cấp 1.',
    time: '3 giờ trước',
    severity: 'medium',
    isRead: false,
    targetTab: 'leads',
    actionLabel: 'Xem phễu Leads'
  }
];
