import { ProductSKU, Customer, StoreNode, BatchLot, OrderRecord, AIBusinessAlert, LeadRecord, StaffMember, BatchDispatchRecord } from '../types';

export const INITIAL_PRODUCTS: ProductSKU[] = [
  {
    id: 'prod-1',
    sku: 'NM-CN40-500',
    name: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N',
    productLine: 'Dòng Truyền Thống Cốt Nhĩ',
    nitrogenDegree: 40,
    capacity: '500ml',
    packagingSpec: 'Thùng 6 chai thủy tinh',
    priceRetail: 125000,
    priceAgency: 95000,
    priceNPP: 82000,
    costPrice: 52000,
    marginPct: 36.6,
    monthlySalesBottles: 8200,
    status: 'Đang kinh doanh',
    bestPairsWith: ['Bột tỏi Lý Sơn', 'Thịt luộc chấm sống', 'Cá chiên giòn'],
    description: 'Chiết xuất giọt mắm đầu tiên từ thùng chượp gỗ bời lời ủ 14 tháng. Hậu vị ngọt béo đạm tự nhiên, thơm dịu đặc trưng.',
    ingredients: '100% Cá cơm than Phú Quốc tươi, Muối hạt tinh khiết Bà Rịa'
  },
  {
    id: 'prod-2',
    sku: 'NM-TH45-500',
    name: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N',
    productLine: 'Dòng Thượng Hạng Đặc Biệt',
    nitrogenDegree: 45,
    capacity: '500ml',
    packagingSpec: 'Thùng 6 chai thủy tinh cao cấp',
    priceRetail: 185000,
    priceAgency: 142000,
    priceNPP: 125000,
    costPrice: 78000,
    marginPct: 37.6,
    monthlySalesBottles: 4150,
    status: 'Đang kinh doanh',
    bestPairsWith: ['Hải sản hấp', 'Món ăn gia đình sành điệu'],
    description: 'Độ đạm tự nhiên cực đại đạt được từ cá cơm mùa thu béo ngậy. Nước mắm sánh như mật ong, đỏ cánh gián hổ phách.',
    ingredients: 'Cá cơm than chọn lọc, muối biển lưu kho 1 năm'
  },
  {
    id: 'prod-3',
    sku: 'NM-CP60-500',
    name: 'Nước Mắm Cực Phẩm Gài Nén 60°N (Chai Sứ Quà Tặng)',
    productLine: 'Bộ Quà Tặng Lễ Tết',
    nitrogenDegree: 60,
    capacity: '500ml',
    packagingSpec: 'Hộp gỗ sơn mài + Chai sứ Bát Tràng',
    priceRetail: 360000,
    priceAgency: 280000,
    priceNPP: 245000,
    costPrice: 150000,
    marginPct: 38.8,
    monthlySalesBottles: 820,
    status: 'Mới ra mắt',
    bestPairsWith: ['Quà biếu tri ân đối tác', 'Lễ Tết truyền thống'],
    description: 'Sản xuất số lượng giới hạn theo phương pháp cô đặc chân không đạm sinh học nhiệt độ thấp, bảo tồn trọn vẹn axit amin quý.',
    ingredients: 'Nước mắm nhĩ 45N cô đặc tự nhiên không hóa chất'
  },
  {
    id: 'prod-4',
    sku: 'NM-GD30-1000',
    name: 'Nước Mắm Gia Đình Nấu Bếp 30°N',
    productLine: 'Dòng Gia Đình Tiết Kiệm',
    nitrogenDegree: 30,
    capacity: '1000ml',
    packagingSpec: 'Thùng 12 chai PET an toàn',
    priceRetail: 85000,
    priceAgency: 62000,
    priceNPP: 54000,
    costPrice: 34000,
    marginPct: 37.0,
    monthlySalesBottles: 14500,
    status: 'Đang kinh doanh',
    bestPairsWith: ['Kho thịt cá', 'Nêm canh', 'Ướp nướng'],
    description: 'Lựa chọn kinh tế cho mọi gia đình đông người. Mùi thơm đằm, dậy vị khi gặp nhiệt lửa nấu nướng.',
    ingredients: 'Cá cơm, cá nục tươi, muối hầm biển sạch'
  },
  {
    id: 'prod-5',
    sku: 'NM-HOR35-CAN5L',
    name: 'Nước Mắm Bếp Chuyên Nghiệp Horeca 35°N (Can 5L)',
    productLine: 'Dòng Bếp Chuyên Nghiệp (Horeca)',
    nitrogenDegree: 35,
    capacity: 'Can 5L',
    packagingSpec: 'Can nhựa HDPE thực phẩm',
    priceRetail: 320000,
    priceAgency: 245000,
    priceNPP: 215000,
    costPrice: 140000,
    marginPct: 34.9,
    monthlySalesBottles: 3200,
    status: 'Đang kinh doanh',
    bestPairsWith: ['Nước chấm pha chế nhà hàng', 'Nồi nước dùng phở/bún'],
    description: 'Thiết kế riêng cho các bếp trưởng nhà hàng, khách sạn và chuỗi quán ăn chuẩn vị Việt, ổn định màu và hương vị quanh năm.',
    ingredients: 'Nước mắm cá cơm ủ tự nhiên 12 tháng'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-b2c-001',
    name: 'Nguyễn Thị Mai Lan',
    phone: '0903829112',
    email: 'mailan.nguyen@gmail.com',
    address: '142 Nguyễn Đình Chiểu, P. Đa Kao, Quận 1, TP.HCM',
    region: 'Miền Nam',
    type: 'B2C',
    subType: 'Gia đình',
    favoriteSku: 'NM-CN40-500',
    favoriteVolume: '500ml',
    avgOrderValue: 250000,
    totalSpend: 3750000,
    orderCount: 15,
    lastPurchaseDate: '2026-08-20',
    purchaseCycleDays: 32,
    daysSinceLastPurchase: 32,
    nextPredictedPurchase: '2026-09-21',
    repurchaseProbability: 'Rất cao',
    churnRisk: 'Low',
    assignedStore: 'Cửa hàng Chuỗi Q1 - 88 Hai Bà Trưng',
    assignedSalesStaff: 'Võ Thanh Tú (CSKH Chuỗi)',
    rfmSegment: 'Loyal Customers (Trung thành)',
    tastePreference: {
      proteinPreference: '40N Nhĩ Cá Cơm',
      saltinessLevel: 'Hài hòa thanh dịu',
      consumptionPurpose: 'Bữa cơm gia đình'
    },
    feedbackHistory: [
      {
        date: '2026-08-20',
        rating: 5,
        comment: 'Nước mắm thơm rất dịu, kho cá bống thơm phức cả xóm.',
        sentiment: 'Tích cực',
        resolved: true
      },
      {
        date: '2026-06-18',
        rating: 4,
        comment: 'Mở nắp chai đôi khi bị rỉ chút ít mắm ra cổ chai, nếu cải thiện nắp rót giọt thì tuyệt vời.',
        sentiment: 'Trung tính',
        resolved: true
      }
    ],
    aiRecommendation: {
      recommendedCombo: 'Combo 3 chai 500ml (40N) tặng 1 chai tương ớt thủ công ủ chum',
      personalizedReason: 'Đã đến chu kỳ 32 ngày dùng hết 2 chai cho gia đình 4 người. Chị rất thích quà tặng nông sản lành.',
      incentiveText: 'Freeship tận bếp kèm lời chúc ấm cúng ngày rằm.'
    }
  },
  {
    id: 'cust-b2c-002',
    name: 'Bác Trần Văn Hưng',
    phone: '0912448392',
    address: '45 Hàng Bài, Q. Hoàn Kiếm, Hà Nội',
    region: 'Miền Bắc',
    type: 'B2C',
    subType: 'Cao cấp',
    favoriteSku: 'NM-TH45-500',
    favoriteVolume: '500ml',
    avgOrderValue: 555000,
    totalSpend: 6660000,
    orderCount: 12,
    lastPurchaseDate: '2026-07-28',
    purchaseCycleDays: 35,
    daysSinceLastPurchase: 55,
    nextPredictedPurchase: '2026-09-02',
    repurchaseProbability: 'Thấp',
    churnRisk: 'High',
    churnReason: 'Quá 20 ngày so với chu kỳ mua thông thường (35 ngày). Nghi ngờ đối thủ tặng mẫu thử hoặc chuyển kênh mua siêu thị.',
    assignedStore: 'Cửa hàng Chuỗi Hà Nội - 24 Tràng Tiền',
    assignedSalesStaff: 'Lê Thu Trang (Chuyên viên Khách VIP)',
    rfmSegment: 'At Risk (Nguy cơ rời bỏ)',
    tastePreference: {
      proteinPreference: '45N Thượng Hạng',
      saltinessLevel: 'Đậm đà truyền thống',
      consumptionPurpose: 'Chấm tươi sống'
    },
    feedbackHistory: [
      {
        date: '2026-07-28',
        rating: 3,
        comment: 'Đợt này nước mắm hơi có tinh thể muối đọng ở đáy chai, tôi sợ bị hỏng.',
        sentiment: 'Cần hỗ trợ',
        resolved: false
      }
    ],
    aiRecommendation: {
      recommendedCombo: 'Set Tri Ân 2 chai 45N + Thư tay nghệ nhân giải thích hiện tượng muối kết tinh tự nhiên',
      personalizedReason: 'Bác Hưng hiểu lầm muối kết tinh (dấu hiệu mắm cốt truyền thống nguyên chất) là hàng hỏng. Cần điện thoại thấu cảm ngay.',
      incentiveText: 'Tặng phiếu trải nghiệm mẻ mắm Nhĩ 60N phiên bản gài nén thùng gỗ.'
    }
  },
  {
    id: 'cust-b2b-001',
    name: 'NPP Hưng Long Phát (TP.HCM & Đông Nam Bộ)',
    phone: '02838994412',
    email: 'contact@hunglongphat.vn',
    address: 'Lô A4, KCN Sóng Thần 1, Dĩ An, Bình Dương',
    region: 'Miền Nam',
    type: 'NPP',
    subType: 'NPP Độc Quyền',
    favoriteSku: 'NM-CN40-500',
    favoriteVolume: 'Thùng 6 chai',
    avgOrderValue: 185000000,
    totalSpend: 2200000000,
    orderCount: 24,
    lastPurchaseDate: '2026-09-10',
    purchaseCycleDays: 14,
    daysSinceLastPurchase: 11,
    nextPredictedPurchase: '2026-09-24',
    repurchaseProbability: 'Cao',
    churnRisk: 'Low',
    assignedSalesStaff: 'Trương Hoàng Nam (GĐ Kênh Phân Phối B2B)',
    rfmSegment: 'Champions (Khách VIP)',
    tastePreference: {
      proteinPreference: 'Toàn dải sản phẩm',
      saltinessLevel: 'Đậm đà truyền thống',
      consumptionPurpose: 'Nấu bếp công nghiệp'
    },
    feedbackHistory: [
      {
        date: '2026-09-10',
        rating: 5,
        comment: 'Tiến độ giao 1.200 thùng tuần qua đúng hẹn. 12 đại lý cấp dưới phản hồi hàng xuất kho rất mới.',
        sentiment: 'Tích cực',
        resolved: true
      }
    ],
    aiRecommendation: {
      recommendedCombo: 'Chính sách chiết khấu lũy tiến thêm 2.5% cho đơn hàng chạm mốc 3.000 thùng mùa Trung Thu',
      personalizedReason: 'Sản lượng tại 45 điểm bán phụ thuộc đang tăng tốc 23%. Có cơ hội mở thêm 8 điểm bán ở Thủ Đức.',
      incentiveText: 'Tài trợ 100% biển bảng quảng cáo gỗ nghệ nhân tại 8 điểm bán mới.'
    }
  },
  {
    id: 'cust-b2b-002',
    name: 'Chuỗi Cơm Niêu Sài Gòn & Khách Sạn Majestic',
    phone: '0908123999',
    email: 'purchasing@comnieusaigon.com',
    address: '59 Hồ Xuân Hương, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    region: 'Miền Nam',
    type: 'HORECA',
    subType: 'Nhà hàng',
    favoriteSku: 'NM-HOR35-CAN5L',
    favoriteVolume: 'Can 5L',
    avgOrderValue: 9600000,
    totalSpend: 115000000,
    orderCount: 18,
    lastPurchaseDate: '2026-09-05',
    purchaseCycleDays: 18,
    daysSinceLastPurchase: 16,
    nextPredictedPurchase: '2026-09-23',
    repurchaseProbability: 'Rất cao',
    churnRisk: 'Medium',
    churnReason: 'Đối thủ mắm công nghiệp đang chào giá rẻ hơn 18% kèm hợp đồng tài trợ bộ gia vị bàn ăn.',
    assignedStore: 'Kho Trung Tâm Dĩ An',
    assignedSalesStaff: 'Phan Quốc Đạt (Trưởng nhóm Horeca)',
    rfmSegment: 'Loyal Customers (Trung thành)',
    tastePreference: {
      proteinPreference: '35N Bếp Chuyên Nghiệp',
      saltinessLevel: 'Đậm đà truyền thống',
      consumptionPurpose: 'Nấu bếp công nghiệp'
    },
    feedbackHistory: [
      {
        date: '2026-08-15',
        rating: 5,
        comment: 'Bếp trưởng cực kỳ khen món kho quẹt tôm thịt dùng mắm 35N chuẩn vị béo ngọt.',
        sentiment: 'Tích cực',
        resolved: true
      }
    ],
    aiRecommendation: {
      recommendedCombo: 'Gói Cung Ứng Horeca Bền Vững: Tặng khay gỗ đựng gia vị khắc tên nhà hàng + Cố định giá 12 tháng',
      personalizedReason: 'Nhà hàng coi trọng độ ổn định hương vị cho khách du lịch nước ngoài. Cần giữ chân bằng giải pháp thương hiệu đồng hành.',
      incentiveText: 'Hỗ trợ in chứng nhận Nước mắm truyền thống sạch chuẩn OCOP 5 sao lên thực đơn.'
    }
  },
  {
    id: 'cust-b2b-003',
    name: 'Đại Lý Nước Mắm Truyền Thống Cô Ba',
    phone: '0937889123',
    address: '18 Chợ Tân Định, Phường Tân Định, Quận 1, TP.HCM',
    region: 'Miền Nam',
    type: 'DAI_LY',
    subType: 'Đại lý Cấp 1',
    favoriteSku: 'NM-CN40-500',
    favoriteVolume: '500ml',
    avgOrderValue: 14500000,
    totalSpend: 174000000,
    orderCount: 14,
    lastPurchaseDate: '2026-08-30',
    purchaseCycleDays: 12,
    daysSinceLastPurchase: 22,
    nextPredictedPurchase: '2026-09-11',
    repurchaseProbability: 'Thấp',
    churnRisk: 'High',
    churnReason: 'Chậm nhập hàng 10 ngày. Ghi nhận tình trạng tồn chai 1L nhiều, thiếu chai 500ml nhưng chưa liên hệ bổ sung.',
    assignedStore: 'NPP Hưng Long Phát',
    assignedSalesStaff: 'Võ Thanh Tú',
    rfmSegment: 'Needs Attention (Cần chăm sóc)',
    tastePreference: {
      proteinPreference: '40N Cốt Nhĩ',
      saltinessLevel: 'Hài hòa thanh dịu',
      consumptionPurpose: 'Bữa cơm gia đình'
    },
    feedbackHistory: [
      {
        date: '2026-08-30',
        rating: 4,
        comment: 'Khách vãng lai chuộng chai 500ml hơn, đợt trước nhập nhiều chai 1L bán hơi chậm.',
        sentiment: 'Trung tính',
        resolved: false
      }
    ],
    aiRecommendation: {
      recommendedCombo: 'Chính sách đổi hàng tồn chai 1L sang 500ml không mất phí + Tặng 2 kệ để quầy nhỏ',
      personalizedReason: 'Đại lý bị đọng vốn ở dòng 1L, dẫn đến ngại đặt đơn mới. Đổi trả hàng quay vòng sẽ kích hoạt ngay 30 thùng 500ml.',
      incentiveText: 'Chiết khấu 3% thanh toán ngay trong 48 giờ.'
    }
  }
];

export const INITIAL_STORES: StoreNode[] = [
  {
    id: 'node-factory-01',
    code: 'FAC-PQ01',
    name: 'Nhà Máy & Nhà Thùng Cốt Nhĩ Phú Quốc',
    type: 'NHA_MAY',
    address: 'Khu phố 1, Dương Đông, TP. Phú Quốc, Kiên Giang',
    province: 'Kiên Giang',
    region: 'Miền Nam',
    contactPerson: 'Ông Đặng Văn Nghĩa (Chủ lò thùng nghệ nhân)',
    phone: '02973846123',
    revenueMonthly: 4500000000,
    revenueGrowthPct: 14.5,
    totalStockBottles: 185000,
    topSellingSku: 'NM-CN40-500',
    slowSellingSku: 'NM-CP60-500',
    stockStatus: 'Đầy đủ',
    supplyCycleDays: 30,
    daysSinceLastRestock: 5,
    debtAmount: 0,
    shelfCondition: 'Chuẩn quy cách',
    aiAlert: 'Nhu cầu toàn chuỗi dự kiến tăng 46.000 chai tháng tới. Cần mở chượp lô cá cơm mẻ tháng 4/2025.'
  },
  {
    id: 'node-wh-01',
    code: 'WH-BD01',
    name: 'Kho Trung Tâm Phía Nam (Dĩ An)',
    type: 'KHO_TONG',
    address: 'Đường Số 3, KCN Sóng Thần 1, Dĩ An, Bình Dương',
    province: 'Bình Dương',
    region: 'Miền Nam',
    contactPerson: 'Lê Minh Quân (Trưởng kho vận)',
    phone: '02743789012',
    parentEntityId: 'node-factory-01',
    revenueMonthly: 3800000000,
    revenueGrowthPct: 18.2,
    totalStockBottles: 95000,
    topSellingSku: 'NM-CN40-500',
    slowSellingSku: 'NM-GD30-1000',
    stockStatus: 'Đầy đủ',
    supplyCycleDays: 14,
    daysSinceLastRestock: 3,
    debtAmount: 0,
    shelfCondition: 'Chuẩn quy cách',
    aiAlert: 'Kho còn tồn 12.000 can 5L Horeca, điều chuyển 4.000 can sang Kho Vệ Tinh Đà Nẵng để phục vụ mùa du lịch.'
  },
  {
    id: 'node-npp-01',
    code: 'NPP-HCM01',
    name: 'Tổng Đại Lý & NPP Hưng Long Phát',
    type: 'NPP',
    address: '108 Xa Lộ Hà Nội, P. Phước Long A, TP. Thủ Đức, TP.HCM',
    province: 'TP.HCM',
    region: 'Miền Nam',
    contactPerson: 'Vũ Đức Long (Giám đốc NPP)',
    phone: '0903998811',
    parentEntityId: 'node-wh-01',
    revenueMonthly: 1250000000,
    revenueGrowthPct: 23.0,
    totalStockBottles: 24000,
    topSellingSku: 'NM-CN40-500',
    slowSellingSku: 'NM-GD30-1000',
    stockStatus: 'Cảnh báo sắp hết',
    supplyCycleDays: 14,
    daysSinceLastRestock: 12,
    debtAmount: 185000000,
    shelfCondition: 'Chuẩn quy cách',
    aiAlert: 'Sản lượng tăng 23%, dự báo đứt hàng dòng 40N trong 4 ngày nữa nếu không nhập bổ sung 1.500 thùng.'
  },
  {
    id: 'node-store-01',
    code: 'STR-HCM001',
    name: 'Cửa Hàng Trưng Bày & Bán Lẻ Q1',
    type: 'CUA_HANG',
    address: '88 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM',
    province: 'TP.HCM',
    region: 'Miền Nam',
    contactPerson: 'Nguyễn Thị Bích Ngọc (Cửa hàng trưởng)',
    phone: '02838221199',
    parentEntityId: 'node-npp-01',
    revenueMonthly: 210000000,
    revenueGrowthPct: 8.5,
    totalStockBottles: 820,
    topSellingSku: 'NM-CN40-500',
    slowSellingSku: 'NM-GD30-1000',
    stockStatus: 'Cảnh báo sắp hết',
    supplyCycleDays: 7,
    daysSinceLastRestock: 9,
    debtAmount: 12000000,
    shelfCondition: 'Cần POSM mới',
    aiAlert: 'Chai 500ml bán rất tốt, còn 36 chai. Đề xuất tạo đơn bổ sung 24 thùng 500ml ngay hôm nay.'
  },
  {
    id: 'node-store-02',
    code: 'STR-HN002',
    name: 'Cửa Hàng Đặc Sản Nước Mắm Hà Nội',
    type: 'CUA_HANG',
    address: '24 Tràng Tiền, Hoàn Kiếm, Hà Nội',
    province: 'Hà Nội',
    region: 'Miền Bắc',
    contactPerson: 'Hoàng Văn Thái',
    phone: '02439332211',
    parentEntityId: 'node-wh-01',
    revenueMonthly: 195000000,
    revenueGrowthPct: -12.4,
    totalStockBottles: 1450,
    topSellingSku: 'NM-TH45-500',
    slowSellingSku: 'NM-HOR35-CAN5L',
    stockStatus: 'Tồn cao',
    supplyCycleDays: 14,
    daysSinceLastRestock: 4,
    debtAmount: 25000000,
    shelfCondition: 'Chuẩn quy cách',
    aiAlert: 'Doanh số giảm 12.4% do thời tiết mưa nhiều. Kích hoạt chương trình thử vị mắm tại chỗ và quà tặng mini.'
  }
];

export const INITIAL_BATCHES: BatchLot[] = [
  {
    id: 'batch-2024-C40-08',
    batchCode: 'LOT-PQ-2024-C40',
    factoryName: 'Nhà thùng Phú Quốc #01 (Bờ nam sông Dương Đông)',
    barrelId: 'Thùng Gỗ Bời Lời Số #42 (Dung tích 15 tấn chượp)',
    fishOrigin: '100% Cá cơm than tươi đánh bắt vùng biển Thổ Chu - Phú Quốc',
    saltOrigin: 'Muối hạt tinh thể Bà Rịa - Vũng Tàu (Lưu kho phơi nắng 14 tháng khử đắng)',
    fermentationStartDate: '2025-02-15',
    fermentationDurationMonths: 15,
    extractionDate: '2026-05-20',
    bottlingDate: '2026-06-05',
    expiryDate: '2028-06-05',
    nitrogenDegreeTested: 41.2,
    totalBottlesProduced: 18000,
    distributedBottles: 13500,
    currentWarehouseBottles: 4500,
    qualityCertificateNo: 'HACCP-PQ-2026-9921',
    status: 'Đang phân phối chuỗi',
    traceChain: [
      { nodeType: 'Nhà Thùng Sản Xuất', nodeName: 'Lò chượp Phú Quốc #01', date: '2026-05-20', quantity: 18000 },
      { nodeType: 'Kho Trung Tâm', nodeName: 'Kho Phía Nam Dĩ An', date: '2026-05-28', quantity: 14000 },
      { nodeType: 'Nhà Phân Phối', nodeName: 'NPP Hưng Long Phát', date: '2026-06-15', quantity: 8000 },
      { nodeType: 'Cửa Hàng Chuỗi', nodeName: 'Cửa Hàng 88 Hai Bà Trưng Q1', date: '2026-07-02', quantity: 1200 }
    ],
    dispatches: [
      {
        id: 'disp-01',
        dispatchCode: 'XK-PQ-C40-01',
        date: '2026-06-15',
        destinationStoreId: 'node-npp-01',
        destinationName: 'NPP Hưng Long Phát (Bình Dương & TP.HCM)',
        destinationType: 'NPP',
        quantityBottles: 8000,
        receiverContact: '0903998811 (Vũ Đức Long)',
        dispatchedBy: 'Trịnh Kim Chi (Quản Lý Kho Vận)',
        notes: 'Xuất điều chuyển tổng kho phục vụ 25 đại lý miền Nam'
      },
      {
        id: 'disp-02',
        dispatchCode: 'XK-PQ-C40-02',
        date: '2026-06-28',
        destinationStoreId: 'node-wh-01',
        destinationName: 'Kho Phía Bắc Gia Lâm - NPP Bắc Việt',
        destinationType: 'NPP',
        quantityBottles: 4300,
        receiverContact: '0912334455 (Hoàng Minh)',
        dispatchedBy: 'Trịnh Kim Chi (Quản Lý Kho Vận)',
        notes: 'Vận chuyển xe lạnh container đường bộ ra tổng kho miền Bắc'
      },
      {
        id: 'disp-03',
        dispatchCode: 'XK-PQ-C40-03',
        date: '2026-07-02',
        destinationStoreId: 'node-store-01',
        destinationName: 'Cửa Hàng Trưng Bày & Bán Lẻ Q1',
        destinationType: 'CUA_HANG',
        quantityBottles: 1200,
        receiverContact: '02838221199 (Nguyễn Thị Bích Ngọc)',
        dispatchedBy: 'Hoàng Hải Đăng (Sales Thị Trường Chuỗi)',
        notes: 'Bổ sung quầy kệ POSM trưng bày phố đi bộ Hai Bà Trưng'
      }
    ]
  },
  {
    id: 'batch-2024-T45-02',
    batchCode: 'LOT-PQ-2024-T45',
    factoryName: 'Nhà thùng Phú Quốc #02',
    barrelId: 'Thùng Gỗ Dền Dền Số #19 (Ủ gài nén truyền thống)',
    fishOrigin: 'Cá cơm sọc tiêu thu mua mùa cá trăng tròn',
    saltOrigin: 'Muối hạt sạch Cà Ná',
    fermentationStartDate: '2024-11-10',
    fermentationDurationMonths: 18,
    extractionDate: '2026-05-15',
    bottlingDate: '2026-06-01',
    expiryDate: '2028-06-01',
    nitrogenDegreeTested: 45.8,
    totalBottlesProduced: 9600,
    distributedBottles: 7200,
    currentWarehouseBottles: 2400,
    qualityCertificateNo: 'ISO-22000-PQ-8834',
    status: 'Đang phân phối chuỗi',
    traceChain: [
      { nodeType: 'Nhà Thùng Sản Xuất', nodeName: 'Lò chượp Phú Quốc #02', date: '2026-05-15', quantity: 9600 },
      { nodeType: 'Kho Trung Tâm', nodeName: 'Kho Phía Nam Dĩ An', date: '2026-05-25', quantity: 7200 },
      { nodeType: 'Nhà Phân Phối', nodeName: 'NPP Bắc Việt Hà Nội', date: '2026-06-20', quantity: 4000 }
    ],
    dispatches: [
      {
        id: 'disp-04',
        dispatchCode: 'XK-PQ-T45-01',
        date: '2026-06-10',
        destinationStoreId: 'node-wh-01',
        destinationName: 'Kho Phía Nam Dĩ An (Khu trữ lạnh)',
        destinationType: 'KHO_TONG',
        quantityBottles: 3200,
        receiverContact: '0908123456 (Trưởng kho Dĩ An)',
        dispatchedBy: 'Trịnh Kim Chi (Quản Lý Kho Vận)',
        notes: 'Chuyển lưu kho bảo quản tiêu chuẩn mát chờ đóng hộp quà tặng'
      },
      {
        id: 'disp-05',
        dispatchCode: 'XK-PQ-T45-02',
        date: '2026-06-20',
        destinationName: 'NPP Bắc Việt Hà Nội',
        destinationType: 'NPP',
        quantityBottles: 4000,
        receiverContact: '0918223344 (Phạm Thu Hà)',
        dispatchedBy: 'Lê Thu Trang (Sales B2B)',
        notes: 'Xuất phân phối các đại lý cao cấp và chuỗi nhà hàng thủ đô'
      }
    ]
  }
];

export const INITIAL_ALERTS: AIBusinessAlert[] = [
  {
    id: 'alert-01',
    type: 'ALERT',
    title: 'CẢNH BÁO MUA LẠI: 12 Khách hàng VIP chưa mua lại trong chu kỳ',
    description: '12 khách hàng thân thiết mua dòng 40N & 45N đã vượt quá chu kỳ 32-35 ngày bình quân 10-18 ngày. Có nguy cơ chuyển sang dùng nước mắm công nghiệp hoặc siêu thị.',
    entityName: 'B2C VIP Club',
    severity: 'high',
    metricHighlight: '12 khách VIP trễ hạn (Doanh thu nguy cơ: 18.500.000 đ)',
    suggestedAction: 'Kích hoạt chiến dịch Zalo ZNS Thấu Cảm: "Hương vị bữa cơm gia đình" kèm mã giảm 15% và freeship tận bếp.',
    createdTime: '10 phút trước'
  },
  {
    id: 'alert-02',
    type: 'OPPORTUNITY',
    title: 'CƠ HỘI MỞ RỘNG: NPP Bình Dương tăng trưởng sản lượng 23%',
    description: 'NPP Hưng Long Phát tiêu thụ vượt mức chỉ tiêu quý. Nhu cầu nước mắm cốt nhĩ tại khu vực TP. Thủ Đức & Dĩ An tăng đột biến nhờ các khu căn hộ mới.',
    entityName: 'NPP Hưng Long Phát',
    severity: 'medium',
    metricHighlight: '+23% sản lượng tháng này',
    suggestedAction: 'Đề xuất ký phụ lục mở rộng độc quyền thêm 8 điểm bán tại TP. Thủ Đức và cấp bổ sung 500 thùng.',
    createdTime: '1 giờ trước'
  },
  {
    id: 'alert-03',
    type: 'RISK',
    title: 'RỦI RO ĐỨT HÀNG: Cửa hàng #STR-HCM001 chỉ còn tồn đủ bán trong 3 ngày',
    description: 'Tồn chai 500ml 40N tại cửa hàng Q1 chỉ còn 36 chai trong khi tốc độ bán đạt 18 chai/ngày. Chu kỳ nhập hàng thông thường là 7 ngày nhưng đã 9 ngày chưa bổ sung.',
    entityName: 'Cửa Hàng 88 Hai Bà Trưng',
    severity: 'high',
    metricHighlight: '36 chai còn lại (Tốc độ tiêu thụ: 18 chai/ngày)',
    suggestedAction: 'Tạo lệnh điều chuyển khẩn 24 thùng (144 chai) từ Kho Trung Tâm Dĩ An sang trong 12h tới.',
    createdTime: '2 giờ trước'
  },
  {
    id: 'alert-04',
    type: 'SALES_LEAD',
    title: 'CƠ HỘI BÁN HÀNG: 428 Khách hàng có hành vi phù hợp với Combo Nước Mắm Cao Cấp',
    description: 'Thuật toán AI phát hiện 428 khách hàng B2C thường xuyên mua đơn trên 400.000đ và thích nước mắm 45N có người thân ở xa, rất phù hợp với Bộ Quà Tặng Mùa Lễ Tết.',
    entityName: 'Tập Khách Hàng Tiềm Năng Quà Tặng',
    severity: 'medium',
    metricHighlight: '428 khách hàng (Ước tính doanh thu tiềm năng: 154.000.000 đ)',
    suggestedAction: 'Gửi thiệp giới thiệu Set Quà Tặng "Hồn Biển Quê Hương" phiên bản hộp gỗ sơn mài giới hạn.',
    createdTime: '4 giờ trước'
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  // Tháng 9/2026 (Tháng hiện tại - Đạt 5.98 Tỷ đ)
  {
    id: 'ord-1001',
    orderCode: 'DH-2026-0921-01',
    customerName: 'Nguyễn Thị Mai Lan',
    customerType: 'B2C',
    channel: 'Cửa hàng chuỗi',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (500ml)', quantity: 2, unitPrice: 125000 }
    ],
    totalAmount: 250000,
    discount: 0,
    finalAmount: 250000,
    createdAt: '2026-09-21 08:30',
    status: 'Đang vận chuyển',
    deliveryAddress: '142 Nguyễn Đình Chiểu, P. Đa Kao, Quận 1, TP.HCM',
    empathyNote: 'Khách dặn đóng gói kỹ vì mang lên chung cư, tặng kèm cẩm nang pha nước chấm tỏi ớt không chìm.'
  },
  {
    id: 'ord-1002',
    orderCode: 'DH-2026-0920-89',
    customerName: 'Chuỗi Cơm Niêu Sài Gòn',
    customerType: 'HORECA',
    channel: 'Zalo OA / Hotline',
    items: [
      { sku: 'NM-HOR35-CAN5L', productName: 'Can Bếp Chuyên Nghiệp Horeca 35°N (5L)', quantity: 15, unitPrice: 245000 },
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (500ml)', quantity: 24, unitPrice: 95000 }
    ],
    totalAmount: 5955000,
    discount: 155000,
    finalAmount: 5800000,
    createdAt: '2026-09-20 15:45',
    status: 'Đã hoàn thành',
    deliveryAddress: '59 Hồ Xuân Hương, P. Võ Thị Sáu, Quận 3, TP.HCM',
    empathyNote: 'Bếp trưởng chuẩn bị mở thêm chi nhánh mới tại Thảo Điền, cần hỗ trợ thêm tài liệu bảng kiểm định độ đạm.'
  },
  {
    id: 'ord-1003',
    orderCode: 'DH-2026-0919-45',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 3000, unitPrice: 492000 },
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 1500, unitPrice: 750000 }
    ],
    totalAmount: 2601000000,
    discount: 101000000,
    finalAmount: 2500000000,
    createdAt: '2026-09-19 10:15',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Nam Dĩ An -> KCN Sóng Thần 1',
    empathyNote: 'Đơn hàng lớn phục vụ phân phối cho 25 đại lý khu vực TP. Thủ Đức & Dĩ An.'
  },
  {
    id: 'ord-1004',
    orderCode: 'DH-2026-0910-12',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2800, unitPrice: 750000 },
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 1600, unitPrice: 492000 }
    ],
    totalAmount: 2887200000,
    discount: 87200000,
    finalAmount: 2800000000,
    createdAt: '2026-09-10 14:20',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội',
    empathyNote: 'Lô hàng phục vụ chuỗi điểm bán ẩm thực truyền thống miền Bắc đón mùa thu đông.'
  },
  {
    id: 'ord-1005',
    orderCode: 'DH-2026-0905-04',
    customerName: 'Đại Lý Nước Mắm Cô Ba',
    customerType: 'DAI_LY',
    channel: 'Đại lý',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (500ml)', quantity: 500, unitPrice: 105000 },
      { sku: 'NM-GD30-1L', productName: 'Nước Mắm Bếp Gia Đình 30°N (1L)', quantity: 400, unitPrice: 85000 }
    ],
    totalAmount: 86500000,
    discount: 2500000,
    finalAmount: 84000000,
    createdAt: '2026-09-05 09:30',
    status: 'Đã hoàn thành',
    deliveryAddress: '18 Chợ Tân Định, Quận 1, TP.HCM',
    empathyNote: 'Bổ sung kệ gỗ mộc trưng bày chuẩn phong cách nhà thùng truyền thống.'
  },
  {
    id: 'ord-1006',
    orderCode: 'DH-2026-0902-18',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 950, unitPrice: 492000 },
      { sku: 'NM-HOR35-CAN5L', productName: 'Can Bếp Chuyên Nghiệp Horeca 35°N (5L)', quantity: 500, unitPrice: 245000 }
    ],
    totalAmount: 589900000,
    discount: 9900000,
    finalAmount: 580000000,
    createdAt: '2026-09-02 11:00',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Cẩm Lệ, Đà Nẵng',
    empathyNote: 'Đơn hàng phục vụ chuỗi nhà hàng đặc sản Miền Trung dịp Lễ 2/9.'
  },

  // Tháng 8/2026 (Đạt 5.12 Tỷ đ)
  {
    id: 'ord-0901',
    orderCode: 'DH-2026-0824-03',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2400, unitPrice: 750000 },
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 1400, unitPrice: 492000 }
    ],
    totalAmount: 2488800000,
    discount: 68800000,
    finalAmount: 2420000000,
    createdAt: '2026-08-24 16:30',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội',
    empathyNote: 'Nhập hàng đón đầu mùa Rằm Tháng Bảy xá tội vong nhân.'
  },
  {
    id: 'ord-0902',
    orderCode: 'DH-2026-0818-19',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2600, unitPrice: 492000 },
      { sku: 'NM-HOR35-CAN5L', productName: 'Can Bếp Horeca 35°N (5L)', quantity: 2000, unitPrice: 245000 }
    ],
    totalAmount: 1769200000,
    discount: 49200000,
    finalAmount: 1720000000,
    createdAt: '2026-08-18 10:15',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương',
    empathyNote: 'Đáp ứng nhu cầu tăng cao của hệ thống bếp ăn và chuỗi quán cơm niêu.'
  },
  {
    id: 'ord-0903',
    orderCode: 'DH-2026-0810-08',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 1500, unitPrice: 492000 },
      { sku: 'NM-GD30-1L', productName: 'Nước Mắm Bếp Gia Đình 30°N (Thùng 6)', quantity: 500, unitPrice: 510000 }
    ],
    totalAmount: 993000000,
    discount: 23000000,
    finalAmount: 970000000,
    createdAt: '2026-08-10 13:45',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  },
  {
    id: 'ord-0904',
    orderCode: 'DH-2026-0803-02',
    customerName: 'Chuỗi Cơm Niêu Sài Gòn',
    customerType: 'HORECA',
    channel: 'Zalo OA / Hotline',
    items: [
      { sku: 'NM-HOR35-CAN5L', productName: 'Can Bếp Chuyên Nghiệp Horeca 35°N (5L)', quantity: 35, unitPrice: 245000 }
    ],
    totalAmount: 10575000,
    discount: 575000,
    finalAmount: 10000000,
    createdAt: '2026-08-03 09:00',
    status: 'Đã hoàn thành',
    deliveryAddress: '59 Hồ Xuân Hương, Quận 3, TP.HCM'
  },

  // Tháng 7/2026 (Đạt 4.95 Tỷ đ)
  {
    id: 'ord-0801',
    orderCode: 'DH-2026-0722-11',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 3100, unitPrice: 492000 }
    ],
    totalAmount: 1525200000,
    discount: 45200000,
    finalAmount: 1480000000,
    createdAt: '2026-07-22 14:00',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương'
  },
  {
    id: 'ord-0802',
    orderCode: 'DH-2026-0715-05',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2900, unitPrice: 750000 }
    ],
    totalAmount: 2175000000,
    discount: 55000000,
    finalAmount: 2120000000,
    createdAt: '2026-07-15 10:20',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội'
  },
  {
    id: 'ord-0803',
    orderCode: 'DH-2026-0708-22',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2700, unitPrice: 492000 }
    ],
    totalAmount: 1328400000,
    discount: 28400000,
    finalAmount: 1300000000,
    createdAt: '2026-07-08 09:30',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  },
  {
    id: 'ord-0804',
    orderCode: 'DH-2026-0702-09',
    customerName: 'Đại Lý Thu Thủy Nha Trang',
    customerType: 'DAI_LY',
    channel: 'Đại lý',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ 40°N (500ml)', quantity: 350, unitPrice: 110000 }
    ],
    totalAmount: 51000000,
    discount: 1000000,
    finalAmount: 50000000,
    createdAt: '2026-07-02 15:10',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Chợ Đầm, TP. Nha Trang'
  },

  // Tháng 6/2026 (Đạt 4.78 Tỷ đ)
  {
    id: 'ord-0701',
    orderCode: 'DH-2026-0620-14',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 3800, unitPrice: 492000 }
    ],
    totalAmount: 1869600000,
    discount: 39600000,
    finalAmount: 1830000000,
    createdAt: '2026-06-20 11:15',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương'
  },
  {
    id: 'ord-0702',
    orderCode: 'DH-2026-0612-07',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2600, unitPrice: 750000 }
    ],
    totalAmount: 1950000000,
    discount: 50000000,
    finalAmount: 1900000000,
    createdAt: '2026-06-12 15:45',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội'
  },
  {
    id: 'ord-0703',
    orderCode: 'DH-2026-0604-03',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2150, unitPrice: 492000 }
    ],
    totalAmount: 1057800000,
    discount: 7800000,
    finalAmount: 1050000000,
    createdAt: '2026-06-04 08:50',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  },

  // Tháng 5/2026 (Đạt 4.60 Tỷ đ)
  {
    id: 'ord-0601',
    orderCode: 'DH-2026-0525-18',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 3500, unitPrice: 492000 }
    ],
    totalAmount: 1722000000,
    discount: 42000000,
    finalAmount: 1680000000,
    createdAt: '2026-05-25 10:30',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương'
  },
  {
    id: 'ord-0602',
    orderCode: 'DH-2026-0516-10',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2500, unitPrice: 750000 }
    ],
    totalAmount: 1875000000,
    discount: 45000000,
    finalAmount: 1830000000,
    createdAt: '2026-05-16 14:15',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội'
  },
  {
    id: 'ord-0603',
    orderCode: 'DH-2026-0508-02',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2250, unitPrice: 492000 }
    ],
    totalAmount: 1107000000,
    discount: 17000000,
    finalAmount: 1090000000,
    createdAt: '2026-05-08 09:20',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  },

  // Tháng 4/2026 (Đạt 4.35 Tỷ đ)
  {
    id: 'ord-0501',
    orderCode: 'DH-2026-0420-15',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 3200, unitPrice: 492000 }
    ],
    totalAmount: 1574400000,
    discount: 34400000,
    finalAmount: 1540000000,
    createdAt: '2026-04-20 11:00',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương'
  },
  {
    id: 'ord-0502',
    orderCode: 'DH-2026-0414-06',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2400, unitPrice: 750000 }
    ],
    totalAmount: 1800000000,
    discount: 40000000,
    finalAmount: 1760000000,
    createdAt: '2026-04-14 15:30',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội'
  },
  {
    id: 'ord-0503',
    orderCode: 'DH-2026-0406-01',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2150, unitPrice: 492000 }
    ],
    totalAmount: 1057800000,
    discount: 7800000,
    finalAmount: 1050000000,
    createdAt: '2026-04-06 09:40',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  },

  // Tháng 3/2026 (Đạt 4.10 Tỷ đ)
  {
    id: 'ord-0401',
    orderCode: 'DH-2026-0322-19',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2900, unitPrice: 492000 }
    ],
    totalAmount: 1426800000,
    discount: 26800000,
    finalAmount: 1400000000,
    createdAt: '2026-03-22 13:20',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương'
  },
  {
    id: 'ord-0402',
    orderCode: 'DH-2026-0315-08',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2300, unitPrice: 750000 }
    ],
    totalAmount: 1725000000,
    discount: 35000000,
    finalAmount: 1690000000,
    createdAt: '2026-03-15 10:45',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội'
  },
  {
    id: 'ord-0403',
    orderCode: 'DH-2026-0308-03',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2060, unitPrice: 492000 }
    ],
    totalAmount: 1013520000,
    discount: 3520000,
    finalAmount: 1010000000,
    createdAt: '2026-03-08 14:10',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  },

  // Tháng 2/2026 (Đạt 3.65 Tỷ đ - Sau Tết)
  {
    id: 'ord-0301',
    orderCode: 'DH-2026-0220-11',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2600, unitPrice: 492000 }
    ],
    totalAmount: 1279200000,
    discount: 29200000,
    finalAmount: 1250000000,
    createdAt: '2026-02-20 10:00',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương'
  },
  {
    id: 'ord-0302',
    orderCode: 'DH-2026-0212-04',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2050, unitPrice: 750000 }
    ],
    totalAmount: 1537500000,
    discount: 37500000,
    finalAmount: 1500000000,
    createdAt: '2026-02-12 14:30',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội'
  },
  {
    id: 'ord-0303',
    orderCode: 'DH-2026-0205-02',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 1850, unitPrice: 492000 }
    ],
    totalAmount: 910200000,
    discount: 10200000,
    finalAmount: 900000000,
    createdAt: '2026-02-05 09:15',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  },

  // Tháng 1/2026 (Đạt 3.95 Tỷ đ - Mùa Tết Nguyên Đán)
  {
    id: 'ord-0201',
    orderCode: 'DH-2026-0125-22',
    customerName: 'NPP Hưng Long Phát',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2800, unitPrice: 492000 }
    ],
    totalAmount: 1377600000,
    discount: 27600000,
    finalAmount: 1350000000,
    createdAt: '2026-01-25 11:20',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Dĩ An, Bình Dương'
  },
  {
    id: 'ord-0202',
    orderCode: 'DH-2026-0118-14',
    customerName: 'NPP Bắc Việt Hà Nội',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-TH45-500', productName: 'Nước Mắm Thượng Hạng Cốt Nhĩ 45°N (Thùng 6)', quantity: 2200, unitPrice: 750000 }
    ],
    totalAmount: 1650000000,
    discount: 30000000,
    finalAmount: 1620000000,
    createdAt: '2026-01-18 15:10',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Kho Phía Bắc Gia Lâm, Hà Nội'
  },
  {
    id: 'ord-0203',
    orderCode: 'DH-2026-0110-09',
    customerName: 'NPP Miền Trung Đà Nẵng',
    customerType: 'NPP',
    channel: 'NPP',
    items: [
      { sku: 'NM-CN40-500', productName: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (Thùng 6)', quantity: 2000, unitPrice: 492000 }
    ],
    totalAmount: 984000000,
    discount: 4000000,
    finalAmount: 980000000,
    createdAt: '2026-01-10 08:45',
    status: 'Đã hoàn thành',
    deliveryAddress: 'Tổng kho Hòa Cầm, Đà Nẵng'
  }
];

export const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'lead-01',
    companyName: 'Chuỗi Phở Thìn Lò Đúc (5 Cơ Sở Miền Nam)',
    contactPerson: 'Anh Trần Trọng Nam (Trưởng bộ phận Thu mua)',
    phone: '0988771122',
    type: 'Nhà hàng Chuỗi',
    expectedMonthlyBottles: 80,
    estimatedValue: 24000000,
    stage: 'Gửi mẫu thử nước mắm',
    assignedTo: 'Phan Quốc Đạt (Sales Horeca & Nhà hàng)',
    notes: 'Khách hàng yêu cầu nước mắm có độ đạm 35N-40N để pha nước chấm phở và nêm nước dùng không bị chua.',
    empathyProfile: 'Người làm ẩm thực Bắc truyền thống khó tính, coi trọng uy tín không dùng hương liệu hóa học.'
  },
  {
    id: 'lead-02',
    companyName: 'Công ty CP Đầu Tư & Xây Dựng Hòa Bình',
    contactPerson: 'Chị Mai Lan (Phòng Hành chính Nhân sự)',
    phone: '0918223344',
    type: 'Quà tết doanh nghiệp',
    expectedMonthlyBottles: 500,
    estimatedValue: 180000000,
    stage: 'Báo giá chính sách',
    assignedTo: 'Lê Thu Trang (Sales B2B & Quà Tết)',
    notes: 'Muốn đặt 500 hộp quà tặng Nước mắm gài nén 60N chai sứ kèm logo công ty để tri ân kỹ sư và đối tác cuối năm.',
    empathyProfile: 'Tìm kiếm món quà ý nghĩa văn hóa quê hương Việt Nam thay vì giỏ bánh kẹo công nghiệp thông thường.'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-01',
    code: 'NV-SL01',
    name: 'Phan Quốc Đạt',
    role: 'Sales B2B',
    phone: '0933112244',
    email: 'dat.phan@nuocmamhoanggia.vn',
    region: 'Miền Nam',
    status: 'Đang làm việc',
    joinedDate: '2023-04-15'
  },
  {
    id: 'staff-02',
    code: 'NV-SL02',
    name: 'Lê Thu Trang',
    role: 'Sales B2B',
    phone: '0918223344',
    email: 'trang.le@nuocmamhoanggia.vn',
    region: 'Toàn quốc',
    status: 'Đang làm việc',
    joinedDate: '2022-11-01'
  },
  {
    id: 'staff-03',
    code: 'NV-SL03',
    name: 'Trần Văn Khang',
    role: 'Sales B2B',
    phone: '0908889900',
    email: 'khang.tran@nuocmamhoanggia.vn',
    region: 'Miền Nam',
    status: 'Đang làm việc',
    joinedDate: '2024-02-10'
  },
  {
    id: 'staff-04',
    code: 'NV-RT01',
    name: 'Hoàng Hải Đăng',
    role: 'Sales Thị Trường Chuỗi',
    phone: '0987654321',
    email: 'dang.hoang@nuocmamhoanggia.vn',
    region: 'Miền Nam',
    status: 'Đang làm việc',
    joinedDate: '2023-08-20'
  },
  {
    id: 'staff-05',
    code: 'NV-LOG01',
    name: 'Trịnh Kim Chi',
    role: 'Quản Lý Kho Vận',
    phone: '0903998811',
    email: 'chi.trinh@nuocmamhoanggia.vn',
    region: 'Toàn quốc',
    status: 'Đang làm việc',
    joinedDate: '2021-06-01'
  },
  {
    id: 'staff-06',
    code: 'NV-QC01',
    name: 'Nguyễn Văn Bảy',
    role: 'Chuyên Viên R&D / QC',
    phone: '0977223388',
    email: 'bay.nguyen@nuocmamhoanggia.vn',
    region: 'Miền Nam',
    status: 'Đang làm việc',
    joinedDate: '2019-03-10'
  }
];

export const companyProfile = {
  name: 'NƯỚC MẮM CỐT NHĨ HOÀNG GIA',
  brandTagline: 'Hồn Biển Quê Hương - Đượm Vị Tình Thân',
  foundedYear: 1982,
  factoryLocation: 'Phú Quốc & Phan Thiết',
  totalBarrels: 48,
  activeRetailStores: 120,
  activeDistributors: 3,
  activeAgencies: 25,
};

export const mockProducts = INITIAL_PRODUCTS;
export const mockCustomers = INITIAL_CUSTOMERS;
export const mockStores = INITIAL_STORES;
export const mockBatches = INITIAL_BATCHES;
export const mockOrders = INITIAL_ORDERS;
export const mockLeads = INITIAL_LEADS;
export const mockAIAlerts = INITIAL_ALERTS;
export const mockStaff = INITIAL_STAFF;
