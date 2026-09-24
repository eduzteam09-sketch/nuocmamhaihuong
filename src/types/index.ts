export type CustomerType = 'B2C' | 'B2B' | 'NPP' | 'DAI_LY' | 'HORECA';

export type ChurnRiskLevel = 'Low' | 'Medium' | 'High';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam' | 'Tây Nguyên' | 'Miền Tây';
  type: CustomerType;
  subType?: 'Gia đình' | 'Mua lần đầu' | 'Thường xuyên' | 'Làm quà' | 'Cao cấp' | 'Nhạy cảm giá' | 'Nhà hàng' | 'Khách sạn' | 'Quán ăn' | 'Bếp ăn' | 'NPP Độc Quyền' | 'Đại lý Cấp 1';
  favoriteSku: string;
  favoriteVolume: string; // e.g., '500ml', '1L', 'Can 5L'
  avgOrderValue: number; // VND
  totalSpend: number; // VND
  orderCount: number;
  lastPurchaseDate: string; // YYYY-MM-DD
  purchaseCycleDays: number; // e.g., 32 days
  daysSinceLastPurchase: number;
  nextPredictedPurchase: string; // YYYY-MM-DD
  repurchaseProbability: 'Rất cao' | 'Cao' | 'Trung bình' | 'Thấp';
  churnRisk: ChurnRiskLevel;
  churnReason?: string;
  assignedStore?: string;
  assignedSalesStaff?: string;
  rfmSegment: 'Champions (Khách VIP)' | 'Loyal Customers (Trung thành)' | 'Potential (Tiềm năng)' | 'At Risk (Nguy cơ rời bỏ)' | 'Needs Attention (Cần chăm sóc)';
  tastePreference: {
    proteinPreference: string; // e.g. '40N Nhĩ Cá Cơm', '60N Thượng Hạng'
    saltinessLevel: 'Đậm đà truyền thống' | 'Hài hòa thanh dịu' | 'Ít mặn';
    consumptionPurpose: 'Bữa cơm gia đình' | 'Nấu bếp công nghiệp' | 'Chấm tươi sống' | 'Quà biếu Tết';
  };
  feedbackHistory: {
    date: string;
    rating: number; // 1-5
    comment: string;
    sentiment: 'Tích cực' | 'Trung tính' | 'Cần hỗ trợ';
    resolved: boolean;
  }[];
  aiRecommendation?: {
    recommendedCombo: string;
    personalizedReason: string;
    incentiveText: string;
  };
}

export interface StoreNode {
  id: string;
  code: string;
  name: string;
  type: 'NHA_MAY' | 'KHO_TONG' | 'NPP' | 'DAI_LY' | 'CUA_HANG';
  address: string;
  province: string;
  region: string;
  contactPerson: string;
  phone: string;
  parentEntityId?: string; // Nhà máy -> Kho -> NPP -> Đại lý -> Cửa hàng
  revenueMonthly: number; // VND
  revenueGrowthPct: number; // +/- %
  totalStockBottles: number;
  topSellingSku: string;
  slowSellingSku: string;
  stockStatus: 'Đầy đủ' | 'Cảnh báo sắp hết' | 'Tồn cao' | 'Đứt hàng cục bộ';
  supplyCycleDays: number;
  daysSinceLastRestock: number;
  debtAmount: number; // Công nợ VND
  shelfCondition: 'Chuẩn quy cách' | 'Thiếu diện tích trưng bày' | 'Cần POSM mới';
  aiAlert?: string;
}

export interface ProductSKU {
  id: string;
  sku: string;
  name: string;
  productLine: 'Dòng Truyền Thống Cốt Nhĩ' | 'Dòng Thượng Hạng Đặc Biệt' | 'Dòng Gia Đình Tiết Kiệm' | 'Dòng Bếp Chuyên Nghiệp (Horeca)' | 'Bộ Quà Tặng Lễ Tết';
  nitrogenDegree: number; // Độ đạm: 30, 40, 45, 60
  capacity: string; // '500ml', '1000ml', 'Can 2L', 'Can 5L', 'Set 2x500ml'
  packagingSpec: string; // 'Thùng 6 chai thủy tinh', 'Thùng 12 chai pet', 'Hộp gỗ quà tặng'
  priceRetail: number; // Giá bán lẻ niêm yết
  priceAgency: number; // Giá Đại lý
  priceNPP: number; // Giá Nhà phân phối
  costPrice: number; // Giá vốn
  marginPct: number;
  monthlySalesBottles: number;
  status: 'Đang kinh doanh' | 'Cháy hàng' | 'Mới ra mắt' | 'Đặt trước';
  bestPairsWith: string[];
  description: string;
  ingredients: string;
}

export interface BatchLot {
  id: string;
  batchCode: string;
  factoryName: string; // e.g. Nhà thùng Phú Quốc #02
  barrelId: string; // Thùng gỗ bời lời #48
  fishOrigin: string; // Cá cơm than đảo Thổ Chu - Kiên Giang
  saltOrigin: string; // Muối Bà Rịa lưu kho 12 tháng khử chát
  fermentationStartDate: string; // Ngày ủ chượp
  fermentationDurationMonths: number; // 12-18 tháng
  extractionDate: string; // Ngày rút cốt nhĩ
  bottlingDate: string; // Ngày đóng chai
  expiryDate: string; // Hạn sử dụng
  nitrogenDegreeTested: number; // Kiểm nghiệm độ đạm thực tế (e.g. 42.5°N)
  totalBottlesProduced: number;
  distributedBottles: number;
  currentWarehouseBottles: number;
  qualityCertificateNo: string;
  status: 'Đã kiểm định ISO/HACCP' | 'Đang phân phối chuỗi' | 'Sắp hết hạn' | 'Lưu kho đối chứng';
  traceChain: {
    nodeType: string;
    nodeName: string;
    date: string;
    quantity: number;
  }[];
  dispatches?: BatchDispatchRecord[];
}

export interface BatchDispatchRecord {
  id: string;
  dispatchCode: string;
  date: string;
  destinationStoreId?: string;
  destinationName: string;
  destinationType: 'CUA_HANG' | 'DAI_LY' | 'NPP' | 'KHO_TONG' | 'DON_HANG_B2B';
  quantityBottles: number;
  receiverContact?: string;
  dispatchedBy: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  code: string;
  name: string;
  role: 'Sales B2B' | 'Sales Thị Trường Chuỗi' | 'Chuyên Viên R&D / QC' | 'Quản Lý Kho Vận' | 'Chăm Sóc Khách Hàng';
  phone: string;
  email: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam' | 'Toàn quốc';
  status: 'Đang làm việc' | 'Nghỉ phép';
  avatar?: string;
  joinedDate?: string;
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  customerName: string;
  customerType: CustomerType;
  channel: 'Cửa hàng chuỗi' | 'Đại lý' | 'NPP' | 'Zalo OA / Hotline' | 'Website' | 'Shopee / TikTok Shop';
  items: {
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  status: 'Đã hoàn thành' | 'Đang vận chuyển' | 'Chờ xuất kho' | 'Đã hủy';
  deliveryAddress: string;
  empathyNote?: string;
}

export interface AIBusinessAlert {
  id: string;
  type: 'ALERT' | 'OPPORTUNITY' | 'RISK' | 'SALES_LEAD';
  title: string;
  description: string;
  entityName: string;
  severity: 'high' | 'medium' | 'low';
  metricHighlight?: string;
  suggestedAction: string;
  actionPayload?: any;
  createdTime: string;
}

export interface LeadRecord {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  type: 'Đại lý mới' | 'Nhà hàng Chuỗi' | 'Bếp ăn công nghiệp' | 'Quà tết doanh nghiệp';
  expectedMonthlyBottles: number;
  estimatedValue: number;
  stage: 'Tiếp cận' | 'Gửi mẫu thử nước mắm' | 'Báo giá chính sách' | 'Đàm phán hợp đồng' | 'Ký kết thành công';
  assignedTo: string;
  notes: string;
  empathyProfile: string;
  lastInteraction?: string;
}

export interface AppNotification {
  id: string;
  type: 'AI_ALERT' | 'ORDER' | 'STOCK' | 'DEBT' | 'SYSTEM' | 'BATCH' | 'LEAD';
  title: string;
  description: string;
  time: string;
  severity: 'high' | 'medium' | 'info';
  isRead: boolean;
  targetTab?: string;
  targetEntityId?: string;
  actionLabel?: string;
}

export interface AITaskExecution {
  taskId: string;
  status: 'in_progress' | 'completed';
  resultNote: string;
  assignee: string;
  updatedAt: string;
  channel?: string;
  specificDetail?: string;
  targetDestination?: string;
}

