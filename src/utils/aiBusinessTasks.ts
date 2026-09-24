import { 
  Customer, 
  StoreNode, 
  BatchLot, 
  OrderRecord, 
  LeadRecord, 
  ProductSKU 
} from '../types';

export interface DynamicAITask {
  id: string;
  category: 'urgent' | 'opportunity' | 'churn' | 'chain';
  type: string;
  tagColor: string;
  title: string;
  desc: string;
  impact: string;
  dataSource: string;
  actionLabel: string;
  successText: string;
  iconName: 'Flame' | 'AlertTriangle' | 'ShieldAlert' | 'TrendingUp' | 'ShoppingBag' | 'PlusCircle' | 'UserX' | 'Repeat' | 'BrainCircuit' | 'Package' | 'Layers';
  linkedCustomer?: Customer;
  linkedStore?: StoreNode;
  entityName?: string;
  // Execution defaults for modal
  defaultResultNote: string;
  defaultAssignee: string;
  defaultChannel: string;
  targetDestination: string;
  specificDetail?: string;
}

export function generateAIBusinessTasks(
  customers: Customer[],
  stores: StoreNode[],
  batches: BatchLot[] = [],
  orders: OrderRecord[] = [],
  leads: LeadRecord[] = [],
  products: ProductSKU[] = []
): DynamicAITask[] {
  const items: DynamicAITask[] = [];

  // ============================================
  // 1. CẦN XỬ LÝ NGAY (URGENT - 4 tasks)
  // ============================================

  // 1.1 Khách hàng trễ chu kỳ mua mắm
  const overdueCusts = customers.filter(c => 
    c.daysSinceLastPurchase > c.purchaseCycleDays || c.churnRisk === 'High'
  );
  const totalRiskRevenue = overdueCusts.reduce((acc, c) => acc + (c.avgOrderValue || 350000) * 2, 0);
  const topNames = overdueCusts.slice(0, 2).map(c => {
    const daysOver = c.daysSinceLastPurchase - c.purchaseCycleDays;
    return `${c.name} (${daysOver > 0 ? `trễ ${daysOver} ngày` : 'nguy cơ rời bỏ'})`;
  }).join(', ');
  const extraCount = overdueCusts.length > 2 ? ` và ${overdueCusts.length - 2} khách hàng khác` : '';

  items.push({
    id: 'task-urg-churn-custs',
    category: 'urgent',
    type: 'CẦN XỬ LÝ NGAY',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    title: `${overdueCusts.length || 2} Khách Hàng / Đối Tác Trễ Chu Kỳ Tiêu Thụ Nước Mắm`,
    desc: `AI phân tích chu kỳ tiêu dùng mắm cốt nhĩ: ${topNames || 'Bác Trần Văn Hưng, Đại lý Cô Ba'}${extraCount} đã vượt quá chu kỳ tái đặt hàng thông thường. Cần liên hệ thăm hỏi thấu cảm bữa cơm gia đình và kích hoạt ưu đãi giữ chân.`,
    impact: `Doanh thu nguy cơ: ${(totalRiskRevenue || 18500000).toLocaleString('vi-VN')} đ/tháng`,
    dataSource: `Dữ liệu CRM (${customers.length} khách hàng thực tế)`,
    actionLabel: 'Kích hoạt kịch bản Chăm Sóc Thấu Cảm Zalo/Hotline',
    successText: `Hương Giọt Biển đã tạo chiến dịch Zalo Thấu Cảm gửi tới các khách hàng trễ chu kỳ kèm ưu đãi Freeship và thư ngỏ nghệ nhân!`,
    iconName: 'Flame',
    linkedCustomer: overdueCusts[0] || customers[0],
    defaultResultNote: `Đã kích hoạt tin nhắn Zalo OA thấu cảm bữa cơm gia đình kèm mã FREESHIP tri ân và thư ngỏ từ nghệ nhân Lê Văn Hải tới ${overdueCusts.length || 2} khách hàng trễ chu kỳ. Khách hàng đã nhận và phản hồi tích cực.`,
    defaultAssignee: 'Trần Thu Hà (Chuyên viên CSKH & Khẩu vị VIP)',
    defaultChannel: 'Zalo Doanh Nghiệp OA & Hotline',
    targetDestination: 'Hồ sơ 360° khách hàng & Lịch sử chăm sóc CRM'
  });

  // 1.2 Cửa Hàng Bán Lẻ Q1 Tồn Kho Nguy Cấp
  const storeRetail = stores.find(s => s.code === 'STR-HCM001') || stores.find(s => s.type === 'CUA_HANG');
  items.push({
    id: 'task-urg-store-node-store-01',
    category: 'urgent',
    type: 'CẦN XỬ LÝ NGAY',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    title: `${storeRetail?.name || 'Cửa Hàng 88 Hai Bà Trưng'} Sắp Đứt Hàng (${storeRetail?.totalStockBottles.toLocaleString() || '450'} chai)`,
    desc: `Tồn kho dưới ngưỡng tối thiểu, dòng chủ lực ${storeRetail?.topSellingSku || 'NM-CN40-500'} sắp hết trong khi chu kỳ cấp ${storeRetail?.supplyCycleDays || 7} ngày đã trôi qua ${storeRetail?.daysSinceLastRestock || 6} ngày. Cần lệnh điều phối khẩn từ Kho Dĩ An.`,
    impact: `Nguy cơ đứt hàng tại điểm bán mặt tiền trọng yếu`,
    dataSource: `Dữ liệu chuỗi kho vận (5 điểm mạng lưới)`,
    actionLabel: `Lập lệnh điều chuyển 24 thùng bổ sung cho ${storeRetail?.code || 'STR-HCM001'}`,
    successText: `Lệnh điều chuyển kho khẩn cấp đã được duyệt và bàn giao cho đơn vị vận tải bổ sung 240 chai tới ${storeRetail?.name}!`,
    iconName: 'AlertTriangle',
    linkedStore: storeRetail,
    defaultResultNote: `Đã lập lệnh điều phối số ĐCK-2026-0923 xuất 24 thùng (240 chai Cốt Nhĩ 40°N 500ml) từ Kho Trung Chuyển Dĩ An giao hỏa tốc cho ${storeRetail?.name || 'Cửa Hàng 88 Hai Bà Trưng'} trong 4 giờ. Tồn kho điểm bán đã được phục hồi đầy đủ.`,
    defaultAssignee: 'Lê Quốc Bảo (Quản đốc Kho Vận & Chuỗi Cung Ứng)',
    defaultChannel: 'Hệ thống Kho Vận & Lệnh Điều Chuyển Số',
    targetDestination: `Mạng lưới chuỗi - Điểm bán ${storeRetail?.name || 'Cửa Hàng 88 Hai Bà Trưng'}`
  });

  // 1.3 Tổng Đại Lý & NPP Hưng Long Phát Sắp Đứt Hàng
  const storeNPP = stores.find(s => s.type === 'NPP' || s.code === 'NPP-BD001');
  items.push({
    id: 'task-urg-store-npp',
    category: 'urgent',
    type: 'CẦN XỬ LÝ NGAY',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    title: `Tổng Đại Lý & ${storeNPP?.name || 'NPP Hưng Long Phát'} Cần Bổ Sung Kho (${storeNPP?.totalStockBottles.toLocaleString() || '24.000'} chai)`,
    desc: `Tồn kho tiến sát ngưỡng an toàn trước tốc độ tiêu thụ tăng mạnh của các đại lý cấp dưới. Chu kỳ cấp hàng ${storeNPP?.supplyCycleDays || 14} ngày đã trôi qua ${storeNPP?.daysSinceLastRestock || 12} ngày. Cần kế hoạch xuất kho vận chuyển từ Nhà máy Phú Quốc sang Kho Trung Chuyển Dĩ An.`,
    impact: `Duy trì nguồn cung liên tục cho 25 đại lý thứ cấp vùng Đông Nam Bộ`,
    dataSource: `Dữ liệu tồn kho chuỗi phân phối (${stores.length} điểm mạng lưới)`,
    actionLabel: 'Xác nhận kế hoạch điều phối 500 thùng từ Kho Dĩ An',
    successText: `Kế hoạch điều phối 500 thùng mắm cốt nhĩ cho ${storeNPP?.name} đã được phê duyệt và xếp lịch giao hàng!`,
    iconName: 'AlertTriangle',
    linkedStore: storeNPP,
    defaultResultNote: `Đã phê duyệt xuất 500 thùng (3.000 chai) từ Kho Dĩ An cấp cho ${storeNPP?.name || 'NPP Hưng Long Phát'}, đồng thời lên lệnh vận chuyển đường biển 1 container từ Nhà máy Phú Quốc cập cảng Sài Gòn đầu tuần tới.`,
    defaultAssignee: 'Nguyễn Hoàng Nam (Phụ trách Kênh Đại lý & B2B)',
    defaultChannel: 'Hệ thống Quản lý Bán Buôn B2B',
    targetDestination: `Hồ sơ mạng lưới chuỗi - ${storeNPP?.name || 'NPP Hưng Long Phát'}`
  });

  // 1.4 Đối Soát & Nhắc Hạn Công Nợ Chuỗi Phân Phối
  const debtStores = stores.filter(s => s.debtAmount > 0);
  const totalDebt = debtStores.reduce((acc, s) => acc + s.debtAmount, 0) || 37000000;
  const debtNames = debtStores.map(s => `${s.name} (${(s.debtAmount / 1000000).toFixed(1)} Tr)`).join(', ') || 'Cửa Hàng Hà Nội (25 Tr), Đại Lý Cô Ba (12 Tr)';

  items.push({
    id: 'task-urg-debts',
    category: 'urgent',
    type: 'CẦN XỬ LÝ NGAY',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    title: `Đối Soát & Nhắc Hạn Công Nợ Chuỗi Phân Phối (${(totalDebt / 1000000).toFixed(1)} Triệu đ)`,
    desc: `Hệ thống ghi nhận các điểm phân phối có công nợ đến hạn: ${debtNames}. Cần gửi bảng đối soát tự động trước khi xác nhận đợt xuất hàng mới.`,
    impact: `Thu hồi ${(totalDebt / 1000000).toFixed(1)} triệu đ dòng tiền lưu động cho chuỗi`,
    dataSource: `Dữ liệu tài chính & công nợ chuỗi`,
    actionLabel: 'Gửi bảng đối soát công nợ tự động qua Zalo OA',
    successText: `Đã gửi bảng đối soát công nợ điện tử có chữ ký số tới bộ phận kế toán của các điểm bán!`,
    iconName: 'ShieldAlert',
    defaultResultNote: `Đã đối soát công nợ chi tiết và gửi bảng kê có chữ ký số qua Zalo OA kế toán tới ${debtNames}. Các đơn vị đã phản hồi xác nhận số dư và xếp lịch chuyển khoản trong kỳ hạn 3 ngày tới.`,
    defaultAssignee: 'Phạm Minh Tuấn (Kế toán Trưởng Chuỗi)',
    defaultChannel: 'Kế toán đối soát & Chữ ký số',
    targetDestination: 'Sổ theo dõi công nợ chi nhánh & Tài chính chuỗi'
  });

  // ============================================
  // 2. CƠ HỘI KINH DOANH (OPPORTUNITY - 5 tasks)
  // ============================================

  // 2.1 NPP Hưng Long Phát Tăng Trưởng
  items.push({
    id: 'task-opp-growth-npp',
    category: 'opportunity',
    type: 'CƠ HỘI MỞ RỘNG',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: `${storeNPP?.name || 'NPP Hưng Long Phát'} Tăng Trưởng Sản Lượng +${storeNPP?.revenueGrowthPct || 14.5}% - Đề Xuất Mở Rộng`,
    desc: `Doanh số đạt ${(storeNPP ? storeNPP.revenueMonthly / 1000000 : 2200).toFixed(0)} Triệu đ/tháng với tốc độ tăng trưởng ấn tượng. NPP đề xuất tài trợ thêm 8 điểm kệ gỗ nghệ nhân và mở rộng độ phủ độc quyền.`,
    impact: `Ước tính gia tăng +350 - 500 triệu doanh số/tháng`,
    dataSource: `Dữ liệu doanh thu chuỗi bán buôn`,
    actionLabel: 'Phê duyệt gói chính sách tài trợ kệ gỗ & biển hiệu nghệ nhân',
    successText: `Đã phê duyệt gói tài trợ biển hiệu gỗ nghệ nhân và chiết khấu bậc thang cho ${storeNPP?.name}!`,
    iconName: 'TrendingUp',
    linkedStore: storeNPP,
    defaultResultNote: `Đã ký phê duyệt gói tài trợ 8 kệ trưng bày gỗ gài nén nghệ nhân và áp dụng chiết khấu thưởng vượt chỉ tiêu +2% cho ${storeNPP?.name || 'NPP Hưng Long Phát'} với cam kết doanh số tối thiểu 2.5 Tỷ đ/tháng.`,
    defaultAssignee: 'Hải Hương (Ban Giám Đốc Điều Hành)',
    defaultChannel: 'Gặp trực tiếp & Biên bản thỏa thuận',
    targetDestination: `Hồ sơ NPP ${storeNPP?.name || 'Hưng Long Phát'} & Quản lý Chuỗi`
  });

  // 2.2 Nhà Máy Phú Quốc Tăng Trưởng
  const storeFactory = stores.find(s => s.type === 'NHA_MAY') || stores[0];
  items.push({
    id: 'task-opp-growth-factory',
    category: 'opportunity',
    type: 'CƠ HỘI MỞ RỘNG',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: `${storeFactory?.name || 'Nhà Máy Sản Xuất Phú Quốc'} Tăng Trưởng Công Suất +${storeFactory?.revenueGrowthPct || 14.5}%`,
    desc: `Nhà thùng hoạt động tối ưu công suất ủ chượp truyền thống. Đề xuất tăng tỷ trọng đóng chai thủy tinh cao cấp dòng Cốt Nhĩ 45°N để tối đa hóa biên lợi nhuận toàn chuỗi.`,
    impact: `Biên lợi nhuận gộp toàn chuỗi ước tính tăng thêm +2.4%`,
    dataSource: `Dữ liệu nhà máy & lò chượp`,
    actionLabel: 'Nâng hạn mức chiết rót dòng 45°N tại xưởng đóng chai',
    successText: `Đã gửi kế hoạch nâng công suất chiết rót dòng 45°N tới Quản đốc nhà máy Phú Quốc!`,
    iconName: 'TrendingUp',
    linkedStore: storeFactory,
    defaultResultNote: `Đã ban hành lệnh điều độ sản xuất tới Xưởng chiết rót Nhà máy Phú Quốc: Tăng tỷ trọng chiết chai thủy tinh dòng 45°N lên 45% tổng sản lượng tuần, chuẩn bị nguồn hàng phục vụ giỏ quà Tết và chuỗi siêu thị cao cấp.`,
    defaultAssignee: 'Nguyễn Văn Nghĩa (Quản đốc Nhà máy Phú Quốc)',
    defaultChannel: 'Hệ thống Điều độ Sản xuất Nhà máy',
    targetDestination: 'Kế hoạch sản xuất & Kho thành phẩm Phú Quốc'
  });

  // 2.3 Leads B2B Đang Chờ Chốt
  const pendingLeads = leads.filter(l => l.stage !== 'Ký kết thành công');
  const totalLeadValue = pendingLeads.reduce((acc, l) => acc + (l.estimatedValue || 30000000), 0) || 245000000;
  const leadNames = pendingLeads.slice(0, 2).map(l => l.companyName).join(', ') || 'Chuỗi Nhà Hàng Cơm Niêu Sài Gòn, Chuỗi Siêu Thị Thực Phẩm Sạch';

  items.push({
    id: 'task-opp-leads',
    category: 'opportunity',
    type: 'CƠ HỘI B2B LEADS',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    title: `Cơ Hội Ký Kết ${pendingLeads.length || 3} Hợp Đồng B2B Tiềm Năng (${(totalLeadValue / 1000000).toFixed(0)} Triệu đ)`,
    desc: `Đang có các đối tác (${leadNames}) trong giai đoạn tiếp cận và thử mẫu. Xác suất chốt thành công 85% nếu bổ sung hồ sơ OCOP 5 sao và chính sách chiết khấu bậc thang.`,
    impact: `Doanh thu hợp đồng ước tính: ${(totalLeadValue).toLocaleString('vi-VN')} đ/năm`,
    dataSource: `Dữ liệu phễu khách hàng B2B (${leads.length || 5} Leads)`,
    actionLabel: 'Gửi bảng báo giá chiết khấu đại lý cấp 1 và đặt lịch thử mắm',
    successText: `Đã tự động gửi hồ sơ năng lực OCOP và bảng giá chính sách đại lý tới đại diện các đối tác!`,
    iconName: 'ShoppingBag',
    defaultResultNote: `Đã gửi bộ hồ sơ năng lực OCOP 5 sao, chứng nhận chỉ dẫn địa lý Phú Quốc và chính sách giá đại lý cấp 1 cho các đối tác B2B. Đã chốt lịch hẹn gửi mẫu thử can 5L và chai thủy tinh 500ml vào 10:00 thứ Năm tuần này.`,
    defaultAssignee: 'Nguyễn Hoàng Nam (Phụ trách Kênh Đại lý & B2B)',
    defaultChannel: 'Gặp trực tiếp & Biên bản thỏa thuận',
    targetDestination: 'Phễu quản lý khách hàng tiềm năng Leads B2B'
  });

  // 2.4 Set Quà Tặng Cho Khách VIP
  const vipCusts = customers.filter(c => 
    c.rfmSegment.includes('Champions') || 
    c.rfmSegment.includes('Loyal') || 
    c.totalSpend > 4000000
  );
  const giftRevenue = (vipCusts.length || 4) * 1250000;

  items.push({
    id: 'task-opp-vip-gifts',
    category: 'opportunity',
    type: 'CƠ HỘI BÁN CHÉO (CROSS-SELL)',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-200',
    title: `Đề Xuất Set Quà Tặng "Hồn Biển Quê Hương" Cho ${vipCusts.length || 4} Khách Hàng VIP`,
    desc: `Tập khách hàng VIP và trung thành có tần suất dùng mắm cốt nhĩ cao. Thời điểm vàng để gửi thiệp điện tử giới thiệu Bộ Hộp Quà Gỗ Sơn Mài khắc tên độc bản.`,
    impact: `Doanh thu tiềm năng: ${(giftRevenue).toLocaleString('vi-VN')} đ`,
    dataSource: `Dữ liệu phân khúc RFM khách hàng`,
    actionLabel: 'Gửi thiệp điện tử giới thiệu Bộ Quà Tặng Giới Hạn',
    successText: `Đã gửi thiệp tương tác giới thiệu Bộ Quà Tặng tới khách hàng VIP qua kênh Zalo OA!`,
    iconName: 'PlusCircle',
    defaultResultNote: `Đã gửi thiệp tri ân nghệ nhân kèm catalogue Set Quà Tặng Sơn Mài 'Hồn Biển Quê Hương' tới ${vipCusts.length || 4} khách hàng VIP. Đã ghi nhận 2 khách hàng phản hồi quan tâm đặt trước số lượng lớn làm quà biếu doanh nghiệp.`,
    defaultAssignee: 'Trần Thu Hà (Chuyên viên CSKH & Khẩu vị VIP)',
    defaultChannel: 'Zalo Doanh Nghiệp OA & Hotline',
    targetDestination: 'Hồ sơ khách hàng VIP & Lịch sử tương tác'
  });

  // 2.5 Nâng Cấp Dòng 60°N Gài Nén
  items.push({
    id: 'task-opp-cross-sell-60n',
    category: 'opportunity',
    type: 'CƠ HỘI UP-SELL',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-200',
    title: `Gợi Ý Nâng Cấp Dòng Cực Phẩm Gài Nén 60°N Cho Khách Quen Dùng 45°N`,
    desc: `Khách hàng thường xuyên mua mắm 45°N đánh giá cao độ đạm tự nhiên và hậu vị ngọt thanh. AI gợi ý gửi tặng chai mẫu thử mini 60°N khi họ tái đặt hàng.`,
    impact: `Tăng giá trị đơn hàng trung bình (AOV) thêm +32%`,
    dataSource: `Phân tích khẩu vị & sở thích độ đạm`,
    actionLabel: 'Kích hoạt chương trình tặng mẫu thử 60N kèm đơn kế tiếp',
    successText: `Đã thiết lập ưu đãi đính kèm mẫu thử 60N vào giỏ hàng tự động cho các khách quen dùng 45N!`,
    iconName: 'PlusCircle',
    defaultResultNote: `Đã cấu hình chương trình kích cầu: Tự động đính kèm 1 chai mẫu thử 50ml Nước Mắm Gài Nén 60°N vào kiện hàng cho mọi đơn tái mua từ khách quen dòng 45°N. Dự kiến giúp chuyển đổi 35% khách hàng sang dòng cao cấp.`,
    defaultAssignee: 'Trần Thu Hà (Chuyên viên CSKH & Khẩu vị VIP)',
    defaultChannel: 'Zalo Doanh Nghiệp OA & Hotline',
    targetDestination: 'Chính sách kích cầu & Hồ sơ khẩu vị khách hàng'
  });

  // ============================================
  // 3. NGUY CƠ RỜI BỎ & THẤU CẢM (CHURN - 4 tasks)
  // ============================================

  // 3.1 Bác Trần Văn Hưng - Thấu Cảm Khiếu Nại Muối Kết Tinh
  const custHung = customers.find(c => c.name.includes('Trần Văn Hưng')) || customers[0];
  items.push({
    id: 'task-churn-feedback-hung',
    category: 'churn',
    type: 'THẤU CẢM KHIẾU NẠI',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-200',
    title: `${custHung.name} - Thấu Cảm Khiếu Nại: "Muối kết tinh ở đáy chai"`,
    desc: `Khách hàng phản ánh muối đọng ở đáy chai. AI phân tích: Đây là hiện tượng tự nhiên của nước mắm truyền thống cốt nhĩ nguyên chất độ đạm cao (>40°N) khi ra khí hậu miền Bắc lạnh. Cần điện thoại giải thích khoa học và tặng mẫu thử 60N tri ân.`,
    impact: `Bảo vệ khách hàng VIP (Đã chi tiêu ${(custHung.totalSpend || 5800000).toLocaleString('vi-VN')} đ, ${custHung.orderCount || 8} đơn)`,
    dataSource: `Dữ liệu phản hồi & khiếu nại khách hàng`,
    actionLabel: 'Giao chuyên viên VIP gọi điện giải thích & tặng mẫu thử 60N',
    successText: `Đã tạo nhiệm vụ CSKH ưu tiên cao và gửi cẩm nang ẩm thực giải thích hiện tượng muối kết tinh tới ${custHung.name}!`,
    iconName: 'UserX',
    linkedCustomer: custHung,
    defaultResultNote: `Chuyên viên VIP đã gọi điện trò chuyện cùng Bác Hưng, giải thích cơ chế khoa học: nước mắm cốt nhĩ nguyên chất độ đạm cao trên 40°N khi gặp thời tiết lạnh muối biển tự nhiên sẽ kết tinh ở đáy chai, đây là minh chứng mắm truyền thống không dùng chất chống đông vón. Đã gửi tặng bác 1 chai 60°N gài nén. Bác Hưng rất hài lòng, khen sự tận tâm của Hải Hương và cam kết tiếp tục dùng lâu dài.`,
    defaultAssignee: 'Trần Thu Hà (Chuyên viên CSKH & Khẩu vị VIP)',
    defaultChannel: 'Zalo Doanh Nghiệp OA & Hotline',
    targetDestination: `Hồ sơ 360° ${custHung.name} (Tab Lịch sử Phản hồi & Khiếu nại)`
  });

  // 3.2 Đại Lý Cô Ba - Hỗ Trợ Đổi Hàng 1L sang 500ml (NHIỆM VỤ USER KHOANH TRONG ẢNH!)
  const custCoBa = customers.find(c => c.name.includes('Cô Ba')) || customers.find(c => c.type === 'DAI_LY') || customers[1];
  items.push({
    id: 'task-churn-agency-coba',
    category: 'churn',
    type: 'HỖ TRỢ ĐẠI LÝ CHẬM HÀNG',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-200',
    title: `${custCoBa.name} - Hỗ Trợ Đổi Trả Cơ Cấu SKU Để Kích Hoạt Đơn Mới`,
    desc: `Đại lý bị đọng vốn do nhập nhiều chai 1L khó bán cho khách vãng lai, trong khi dòng 500ml bị thiếu hàng. Cần hỗ trợ thu hồi quay vòng sang chai 500ml để giải phóng vốn cho đại lý.`,
    impact: `Khôi phục doanh số ${(custCoBa.avgOrderValue || 12000000).toLocaleString('vi-VN')} đ/chu kỳ`,
    dataSource: `Dữ liệu lịch sử đặt hàng đại lý B2B`,
    actionLabel: 'Áp dụng chính sách đổi hàng tồn 1L sang 500ml không phí',
    successText: `Đã gửi văn bản thỏa thuận đổi hàng tồn sang chai 500ml và kích hoạt đơn mới cho ${custCoBa.name}!`,
    iconName: 'Repeat',
    linkedCustomer: custCoBa,
    defaultResultNote: `Đã cử nhân sự kinh doanh đến làm việc trực tiếp tại ${custCoBa.name}. Đã lập biên bản thu hồi 40 chai 1L tồn chậm và xuất đổi ngang sang 80 chai 500ml Cốt Nhĩ 40°N không tính phí vận chuyển. Chị Ba rất phấn khởi vì được giải phóng vốn tồn và đã ký hợp đồng đặt đợt hàng mới 120 chai cho tháng tới.`,
    defaultAssignee: 'Nguyễn Hoàng Nam (Phụ trách Kênh Đại lý & B2B)',
    defaultChannel: 'Gặp trực tiếp & Biên bản thỏa thuận',
    targetDestination: `Hồ sơ 360° ${custCoBa.name} & Sổ kho đại lý đối tác`
  });

  // 3.3 Chuỗi Cơm Niêu Sài Gòn - Giữ Chân Trước Lời Chào Giá Đối Thủ (NHIỆM VỤ NẰM CẠNH TRONG ẢNH!)
  const custComNieu = customers.find(c => c.name.includes('Cơm Niêu')) || customers.find(c => c.type === 'HORECA') || customers[2];
  items.push({
    id: 'task-churn-horeca-comnieu',
    category: 'churn',
    type: 'BẢO VỆ ĐỐI TÁC HORECA',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    title: `${custComNieu.name} - Giữ Chân Trước Lời Chào Giá Của Đối Thủ`,
    desc: `Ghi nhận đối thủ mắm công nghiệp chào giá thấp hơn 18%. Khách hàng rất coi trọng hương vị truyền thống cho thực khách quốc tế. Đề xuất tài trợ khay gỗ gia vị và cấp chứng nhận OCOP thực đơn.`,
    impact: `Bảo vệ hợp đồng tiêu thụ can 5L trị giá ${(custComNieu.totalSpend || 28500000).toLocaleString('vi-VN')} đ/năm`,
    dataSource: `Dữ liệu phân tích rủi ro churn Horeca`,
    actionLabel: 'Ký kết gói tài trợ khay gỗ gia vị nghệ nhân & cố định giá 12 tháng',
    successText: `Đã chuyển tiếp gói hỗ trợ đồng hành thương hiệu tới Ban Quản Lý của ${custComNieu.name}!`,
    iconName: 'BrainCircuit',
    linkedCustomer: custComNieu,
    defaultResultNote: `Đã có buổi làm việc với Tổng Bếp Trưởng và Giám đốc Thu Mua của ${custComNieu.name}. Thống nhất tài trợ 50 khay gỗ gia vị nghệ nhân có khắc logo đồng thương hiệu, đồng thời cam kết bình ổn giá can 5L Cốt Nhĩ trong 12 tháng. Phía Cơm Niêu đã chính thức từ chối nhà cung cấp công nghiệp và ký gia hạn hợp đồng độc quyền.`,
    defaultAssignee: 'Hải Hương (Ban Giám Đốc) & Nguyễn Hoàng Nam',
    defaultChannel: 'Gặp trực tiếp & Biên bản thỏa thuận',
    targetDestination: `Hồ sơ 360° ${custComNieu.name} & Hợp đồng Horeca đối tác`
  });

  // 3.4 Khách Hàng Mua Lần Đầu Cần Thấu Cảm
  const custFirstTime = customers.find(c => c.subType === 'Mua lần đầu' || c.orderCount <= 1) || customers[3];
  items.push({
    id: 'task-churn-first-time-b2c',
    category: 'churn',
    type: 'CHĂM SÓC KHÁCH MỚI',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-200',
    title: `Chăm Sóc Hậu Mãi Khách Mới Mua Lần Đầu (${custFirstTime?.name || 'Khách Hàng Mới'})`,
    desc: `Khách hàng mới trải nghiệm dòng Cốt Nhĩ 40°N sau 14 ngày. Cần kích hoạt tin nhắn Zalo gửi cẩm nang pha nước chấm tỏi ớt chua ngọt chuẩn vị nghệ nhân để gia tăng gắn kết.`,
    impact: `Tăng tỷ lệ chuyển đổi sang khách hàng thân thiết từ 42% lên 68%`,
    dataSource: `Hành vi đơn hàng đầu tiên`,
    actionLabel: 'Gửi tin nhắn Zalo kèm cẩm nang công thức pha nước chấm nghệ nhân',
    successText: `Đã gửi công thức pha nước chấm độc quyền cùng lời tri ân tới ${custFirstTime?.name}!`,
    iconName: 'BrainCircuit',
    linkedCustomer: custFirstTime,
    defaultResultNote: `Đã gửi tin nhắn Zalo kèm infographic cẩm nang pha 5 công thức nước chấm nghệ nhân chuẩn vị ba miền tới ${custFirstTime?.name || 'khách hàng mới'}. Khách hàng phản hồi rất thích thú và hỏi thêm về dòng 60°N gài nén.`,
    defaultAssignee: 'Trần Thu Hà (Chuyên viên CSKH & Khẩu vị VIP)',
    defaultChannel: 'Zalo Doanh Nghiệp OA & Hotline',
    targetDestination: `Hồ sơ khách hàng ${custFirstTime?.name || 'mới'} & Lịch sử chăm sóc`
  });

  // ============================================
  // 4. DỰ BÁO CHUỖI & SẢN XUẤT (CHAIN - 2 tasks)
  // ============================================

  // 4.1 Dự Báo Mở Chượp Lô Mắm Mới Tại Phú Quốc
  const totalProduced = batches.reduce((acc, b) => acc + b.totalBottlesProduced, 0) || 27600;
  const totalDistributed = batches.reduce((acc, b) => acc + b.distributedBottles, 0) || 20700;
  const totalWarehouse = batches.reduce((acc, b) => acc + b.currentWarehouseBottles, 0) || 6900;

  items.push({
    id: 'task-chain-batches-forecast',
    category: 'chain',
    type: 'DỰ BÁO SẢN XUẤT Ủ CHƯỢP',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    title: `Dự Báo Tiêu Thụ Toàn Chuỗi - Kế Hoạch Mở Chượp Thùng Gỗ Tại Phú Quốc`,
    desc: `Toàn chuỗi đã xuất ${totalDistributed.toLocaleString()} chai trên tổng ${totalProduced.toLocaleString()} chai đã đóng mẻ. Lượng dự trữ tại kho trung tâm còn ${totalWarehouse.toLocaleString()} chai. Đề xuất nhà máy chuẩn bị mở chượp lô ủ 15-18 tháng mới đón đầu mùa cao điểm.`,
    impact: `Đảm bảo nguồn cung 45.000 lít mắm cốt nhĩ không bị đứt đoạn`,
    dataSource: `Dữ liệu ${batches.length || 2} lô thùng gỗ ủ chượp Phú Quốc`,
    actionLabel: 'Lập kế hoạch mở chượp thùng gỗ nhà máy Phú Quốc',
    successText: 'Kế hoạch mở chượp thùng gỗ bời lời đã được đồng bộ với Quản đốc xưởng ủ chượp Phú Quốc!',
    iconName: 'Package',
    defaultResultNote: `Đã thống nhất với Nghệ nhân Lê Văn Hải và Quản đốc nhà thùng Phú Quốc: Tiến hành rút nỏ và mở chượp Thùng Gỗ Bời Lời #PQ-2024-03 vào ngày 15/10/2026. Sản lượng dự kiến đạt 18.000 lít nước mắm cốt nhĩ 42°N-45°N nguyên chất phục vụ cao điểm Tết.`,
    defaultAssignee: 'Nguyễn Văn Nghĩa (Quản đốc Nhà máy Phú Quốc)',
    defaultChannel: 'Hệ thống Điều độ Sản xuất Nhà máy',
    targetDestination: 'Sổ theo dõi Lô Ủ Chượp Thùng Gỗ Phú Quốc'
  });

  // 4.2 Cân Bằng Tồn Kho Mạng Lưới Chuỗi 5 Điểm
  const totalStock = stores.reduce((acc, s) => acc + s.totalStockBottles, 0) || 120000;
  const factoryStock = stores.filter(s => s.type === 'NHA_MAY').reduce((acc, s) => acc + s.totalStockBottles, 0) || 60000;
  const warehouseStock = stores.filter(s => s.type === 'KHO_TONG').reduce((acc, s) => acc + s.totalStockBottles, 0) || 30000;
  const distributorStock = stores.filter(s => s.type === 'NPP' || s.type === 'DAI_LY').reduce((acc, s) => acc + s.totalStockBottles, 0) || 28000;
  const retailStock = stores.filter(s => s.type === 'CUA_HANG').reduce((acc, s) => acc + s.totalStockBottles, 0) || 2000;

  items.push({
    id: 'task-chain-network-balance',
    category: 'chain',
    type: 'ĐIỀU PHỐI TỒN KHO MẠNG LƯỚI',
    tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    title: `Cân Bằng Tồn Kho Mạng Lưới (${totalStock.toLocaleString()} Chai Trên ${stores.length} Điểm)`,
    desc: `Phân bổ hiện tại: Nhà máy (${factoryStock.toLocaleString()} chai) → Kho Dĩ An (${warehouseStock.toLocaleString()} chai) → NPP & Đại lý (${distributorStock.toLocaleString()} chai) → Cửa hàng (${retailStock.toLocaleString()} chai). Cần duy trì nhịp cấp hàng 7 ngày/lần để tránh đọng vốn cục bộ.`,
    impact: `Tối ưu hóa hệ số luân chuyển vốn tồn kho toàn chuỗi`,
    dataSource: `Dữ liệu vận hành ${stores.length} điểm mạng lưới kết nối`,
    actionLabel: 'Xem và đồng bộ lịch điều phối chuỗi cung ứng',
    successText: 'Lịch điều phối luân chuyển chuỗi cung ứng đã được đồng bộ lên hệ thống vận tải!',
    iconName: 'Layers',
    defaultResultNote: `Đã ban hành biểu đồ luân chuyển hàng hóa tuần: duy trì nhịp cấp bổ sung 7 ngày/lần từ Kho Dĩ An sang các điểm bán và NPP, đồng thời tối ưu lịch trình xe tải gom hàng. Đảm bảo tỷ lệ đáp ứng hàng hóa luôn trên 98.5%.`,
    defaultAssignee: 'Lê Quốc Bảo (Quản đốc Kho Vận & Chuỗi Cung Ứng)',
    defaultChannel: 'Hệ thống Kho Vận & Lệnh Điều Chuyển Số',
    targetDestination: 'Mạng lưới Chuỗi Phân Phối Toàn Quốc'
  });

  return items;
}
