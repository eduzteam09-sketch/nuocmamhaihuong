import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Store, 
  Package, 
  BrainCircuit, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Layers,
  HeartHandshake,
  DollarSign,
  Activity,
  ChevronRight,
  ShieldCheck,
  Truck,
  Calendar,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { Customer, StoreNode, ProductSKU, AIBusinessAlert, OrderRecord } from '../types';
import { mockOrders } from '../data/mockData';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';
import { HaiHuongLogo } from './brand/HaiHuongLogo';
import { MonthlyReportModal } from './MonthlyReportModal';
import { ReportContextData, exportToExcel } from '../utils/exportReports';

interface DashboardViewProps {
  customers: Customer[];
  stores: StoreNode[];
  products: ProductSKU[];
  alerts: AIBusinessAlert[];
  orders?: OrderRecord[];
  onNavigateTab: (tab: any) => void;
  onSelectCustomer: (cust: Customer) => void;
}

const CustomRevenueTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#2E1200] text-white p-3.5 rounded-xl shadow-2xl border border-[#FFA31A]/40 text-xs min-w-[220px]">
        <div className="font-extrabold text-[#FFA31A] text-sm border-b border-amber-900/60 pb-1.5 flex items-center justify-between">
          <span>{item.fullMonthName}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            item.growthRate >= 0 
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50' 
              : 'bg-rose-950 text-rose-300 border border-rose-600/50'
          }`}>
            {item.growthRate >= 0 ? `+${item.growthRate}% MoM` : `${item.growthRate}% MoM`}
          </span>
        </div>
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-stone-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFA31A] inline-block shadow-xs" />
              <span>Doanh thu thực tế:</span>
            </span>
            <span className="font-extrabold text-[#FFA31A] text-sm">
              {item.revenueInBillion.toFixed(2)} Tỷ đ
            </span>
          </div>
          <div className="flex justify-between items-center text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block" />
              <span>Kế hoạch mục tiêu:</span>
            </span>
            <span className="font-semibold text-stone-200">
              {item.targetInBillion.toFixed(2)} Tỷ đ
            </span>
          </div>
          <div className="flex justify-between items-center text-stone-400 pt-1.5 border-t border-amber-900/40 text-[11px]">
            <span>Tỷ lệ hoàn thành KH:</span>
            <span className={`font-bold ${item.achievementRate >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {item.achievementRate}%
            </span>
          </div>
          <div className="flex justify-between items-center text-stone-400 text-[11px]">
            <span>Số đơn phân phối:</span>
            <span className="text-white font-medium">{item.orderCount} đơn hàng</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  customers,
  stores,
  products,
  alerts,
  orders = mockOrders,
  onNavigateTab,
  onSelectCustomer,
}) => {
  const [subDashboard, setSubDashboard] = useState<'ceo' | 'sales'>('ceo');
  const [chartTimeframe, setChartTimeframe] = useState<'all' | '6m' | 'q3'>('all');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'growth'>('revenue');

  // Compute monthly revenue trend dynamically from orders (or mockOrders)
  const monthlyRevenueData = useMemo(() => {
    const ordersList = (orders && orders.length > 0) ? orders : mockOrders;

    // Monthly planned budget targets (Tỷ VNĐ)
    const targetMap: Record<string, number> = {
      '2026-01': 3.80,
      '2026-02': 3.60,
      '2026-03': 4.00,
      '2026-04': 4.20,
      '2026-05': 4.50,
      '2026-06': 4.70,
      '2026-07': 4.90,
      '2026-08': 5.00,
      '2026-09': 5.50,
    };

    const monthNames: Record<string, { short: string; full: string }> = {
      '2026-01': { short: 'T1', full: 'Tháng 1/2026' },
      '2026-02': { short: 'T2', full: 'Tháng 2/2026' },
      '2026-03': { short: 'T3', full: 'Tháng 3/2026' },
      '2026-04': { short: 'T4', full: 'Tháng 4/2026' },
      '2026-05': { short: 'T5', full: 'Tháng 5/2026' },
      '2026-06': { short: 'T6', full: 'Tháng 6/2026' },
      '2026-07': { short: 'T7', full: 'Tháng 7/2026' },
      '2026-08': { short: 'T8', full: 'Tháng 8/2026' },
      '2026-09': { short: 'T9', full: 'Tháng 9/2026' },
    };

    // Group orders by month (YYYY-MM)
    const monthlyGroups: Record<string, {
      totalRevenue: number;
      orderCount: number;
      nppRevenue: number;
      horecaRevenue: number;
      b2cRevenue: number;
    }> = {};

    // Initialize all 9 months in 2026 to guarantee continuous line
    Object.keys(targetMap).forEach((monthKey) => {
      monthlyGroups[monthKey] = {
        totalRevenue: 0,
        orderCount: 0,
        nppRevenue: 0,
        horecaRevenue: 0,
        b2cRevenue: 0,
      };
    });

    // Aggregate orders
    ordersList.forEach((order) => {
      if (!order.createdAt) return;
      const monthKey = order.createdAt.slice(0, 7); // '2026-09'
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = {
          totalRevenue: 0,
          orderCount: 0,
          nppRevenue: 0,
          horecaRevenue: 0,
          b2cRevenue: 0,
        };
      }

      const amount = order.finalAmount || order.totalAmount || 0;
      monthlyGroups[monthKey].totalRevenue += amount;
      monthlyGroups[monthKey].orderCount += 1;

      if (order.customerType === 'NPP' || order.customerType === 'DAI_LY') {
        monthlyGroups[monthKey].nppRevenue += amount;
      } else if (order.customerType === 'HORECA') {
        monthlyGroups[monthKey].horecaRevenue += amount;
      } else {
        monthlyGroups[monthKey].b2cRevenue += amount;
      }
    });

    const sortedMonthKeys = Object.keys(monthlyGroups).sort();
    let previousRevenue = 0;

    const dataPoints = sortedMonthKeys.map((key) => {
      const g = monthlyGroups[key];
      const revenueInBillion = Number((g.totalRevenue / 1_000_000_000).toFixed(2));
      const targetInBillion = targetMap[key] || 4.5;
      
      let growthRate = 0;
      if (previousRevenue > 0) {
        growthRate = Number((((g.totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1));
      } else {
        growthRate = 0;
      }
      previousRevenue = g.totalRevenue;

      const achievementRate = targetInBillion > 0 
        ? Number(((revenueInBillion / targetInBillion) * 100).toFixed(1))
        : 100;

      return {
        monthKey: key,
        monthLabel: monthNames[key]?.short || key,
        fullMonthName: monthNames[key]?.full || key,
        revenueInBillion,
        targetInBillion,
        growthRate,
        rawRevenue: g.totalRevenue,
        orderCount: g.orderCount,
        achievementRate,
        nppShare: g.totalRevenue > 0 ? Math.round((g.nppRevenue / g.totalRevenue) * 100) : 0,
      };
    });

    return dataPoints;
  }, [orders]);

  // Filtered dataset according to timeframe toggle
  const displayedChartData = useMemo(() => {
    if (chartTimeframe === '6m') {
      return monthlyRevenueData.slice(-6);
    }
    if (chartTimeframe === 'q3') {
      return monthlyRevenueData.slice(-3);
    }
    return monthlyRevenueData;
  }, [monthlyRevenueData, chartTimeframe]);

  // Aggregate metrics for summary bar
  const totalYtdRevenue = useMemo(() => {
    const sum = monthlyRevenueData.reduce((acc, curr) => acc + curr.rawRevenue, 0);
    return (sum / 1_000_000_000).toFixed(2);
  }, [monthlyRevenueData]);

  const latestMonthData = monthlyRevenueData[monthlyRevenueData.length - 1] || {
    monthKey: '2026-09',
    monthLabel: 'T9',
    fullMonthName: 'Tháng 9/2026',
    revenueInBillion: 5.97,
    growthRate: 16.6,
    achievementRate: 108.5,
    rawRevenue: 5970050000,
    targetInBillion: 5.50,
    orderCount: 6,
    nppShare: 88,
  };

  const revenueGrowth = latestMonthData.growthRate;

  // Plan comparison for latest month
  const planDiffMillion = Math.round((latestMonthData.rawRevenue - (latestMonthData.targetInBillion * 1_000_000_000)) / 1_000_000);
  const planDiffPct = latestMonthData.targetInBillion > 0
    ? Number((((latestMonthData.revenueInBillion - latestMonthData.targetInBillion) / latestMonthData.targetInBillion) * 100).toFixed(1))
    : 0;

  // Total orders recorded across all months
  const totalRecordedOrders = useMemo(() => {
    return monthlyRevenueData.reduce((acc, c) => acc + c.orderCount, 0);
  }, [monthlyRevenueData]);

  // Wholesale / B2B revenue share
  const b2bSharePct = useMemo(() => {
    const ordersList = (orders && orders.length > 0) ? orders : mockOrders;
    const totalOrdersRevenue = monthlyRevenueData.reduce((acc, c) => acc + c.rawRevenue, 0);
    const totalB2bRevenue = ordersList
      .filter(o => o.customerType === 'NPP' || o.customerType === 'DAI_LY' || o.customerType === 'HORECA')
      .reduce((acc, o) => acc + (o.finalAmount || o.totalAmount || 0), 0);
    return totalOrdersRevenue > 0 ? Math.round((totalB2bRevenue / totalOrdersRevenue) * 100) : 88;
  }, [orders, monthlyRevenueData]);

  // Production & inventory stats
  const totalMonthlySalesBottles = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.monthlySalesBottles || 0), 0);
  }, [products]);

  const totalWarehouseStock = useMemo(() => {
    const wh = stores.find(s => s.type === 'KHO_TONG');
    return wh ? wh.totalStockBottles : 95000;
  }, [stores]);

  const totalChainStock = useMemo(() => {
    return stores.reduce((acc, s) => acc + (s.totalStockBottles || 0), 0);
  }, [stores]);

  // Chain network stats
  const chainStats = useMemo(() => {
    const totalConfiguredNodes = stores.length;
    const factoryCount = stores.filter(s => s.type === 'NHA_MAY').length;
    const warehouseCount = stores.filter(s => s.type === 'KHO_TONG').length;
    const distributorCount = stores.filter(s => s.type === 'NPP' || s.type === 'DAI_LY').length;
    const retailCount = stores.filter(s => s.type === 'CUA_HANG').length;

    const healthyCount = stores.filter(s => s.stockStatus !== 'Đứt hàng cục bộ' && s.stockStatus !== 'Cảnh báo sắp hết').length;
    const operationalRate = totalConfiguredNodes > 0 
      ? Number(((healthyCount / totalConfiguredNodes) * 100).toFixed(1)) 
      : 100;

    return {
      totalConfiguredNodes,
      factoryCount,
      warehouseCount,
      distributorCount,
      retailCount,
      operationalRate,
    };
  }, [stores]);

  // Customer empathy & retention stats
  const atRiskCustomers = useMemo(() => {
    return customers.filter(c => c.churnRisk === 'High' || c.rfmSegment === 'At Risk (Nguy cơ rời bỏ)');
  }, [customers]);

  const retentionRate = useMemo(() => {
    if (customers.length === 0) return 84.5;
    const loyalCount = customers.filter(c => c.churnRisk !== 'High').length;
    return Number(((loyalCount / customers.length) * 100).toFixed(1));
  }, [customers]);

  const avgPurchaseCycleDays = useMemo(() => {
    if (customers.length === 0) return 32;
    const sum = customers.reduce((acc, c) => acc + (c.purchaseCycleDays || 30), 0);
    return Math.round(sum / customers.length);
  }, [customers]);

  const criticalStores = useMemo(() => {
    return stores.filter(s => s.stockStatus === 'Cảnh báo sắp hết' || s.stockStatus === 'Đứt hàng cục bộ' || (s.type === 'CUA_HANG' && s.totalStockBottles < 600));
  }, [stores]);

  const mascotTipText = useMemo(() => {
    const custText = atRiskCustomers.length > 0 
      ? `${atRiskCustomers.length} khách hàng có nguy cơ rời bỏ hoặc trễ chu kỳ dùng mắm`
      : 'toàn bộ khách hàng đang duy trì chu kỳ tiêu thụ tốt';
    
    const storeText = criticalStores.length > 0
      ? ` và ${criticalStores[0].name} sắp hết dòng ${criticalStores[0].topSellingSku}`
      : ' và các kho điểm bán đang duy trì mức tồn an toàn';

    return `Hôm nay hệ thống AI phát hiện ${custText}${storeText}. Bạn có muốn kích hoạt kịch bản chăm sóc thấu cảm và điều phối kho chuỗi không?`;
  }, [atRiskCustomers, criticalStores]);

  // Real-time protein breakdown from orders
  const proteinBreakdown = useMemo(() => {
    const ordersList = (orders && orders.length > 0) ? orders : mockOrders;
    
    const categories: Record<string, { label: string; revenue: number; color: string }> = {
      '40N': { label: 'Cốt Nhĩ 40°N (Chủ lực gia đình)', revenue: 0, color: 'bg-[#FFA31A]' },
      '45N': { label: 'Thượng Hạng Gài Nén 45°N', revenue: 0, color: 'bg-[#E67E00]' },
      '30N': { label: 'Gia Đình Nấu Bếp 30°N', revenue: 0, color: 'bg-[#FFC407]' },
      '35N': { label: 'Bếp Horeca 35°N (Can 5L)', revenue: 0, color: 'bg-[#D96600]' },
      '60N': { label: 'Cực Phẩm 60°N Chai Sứ Quà Tặng', revenue: 0, color: 'bg-[#8A3E00]' },
    };

    ordersList.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
          const skuUpper = (item.sku || '').toUpperCase();
          if (skuUpper.includes('40')) {
            categories['40N'].revenue += itemTotal;
          } else if (skuUpper.includes('45')) {
            categories['45N'].revenue += itemTotal;
          } else if (skuUpper.includes('35') || skuUpper.includes('HOR')) {
            categories['35N'].revenue += itemTotal;
          } else if (skuUpper.includes('30') || skuUpper.includes('GD')) {
            categories['30N'].revenue += itemTotal;
          } else if (skuUpper.includes('60') || skuUpper.includes('CP')) {
            categories['60N'].revenue += itemTotal;
          } else {
            categories['40N'].revenue += itemTotal;
          }
        });
      }
    });

    const totalItemRevenue = Object.values(categories).reduce((sum, c) => sum + c.revenue, 0);

    return Object.entries(categories).map(([key, data]) => {
      const pct = totalItemRevenue > 0 ? Math.round((data.revenue / totalItemRevenue) * 100) : 20;
      const formattedRevenue = data.revenue >= 1_000_000_000
        ? `${(data.revenue / 1_000_000_000).toFixed(2)} Tỷ`
        : `${Math.round(data.revenue / 1_000_000).toLocaleString('vi-VN')} Triệu`;

      return {
        key,
        label: data.label,
        percentage: pct,
        formattedRevenue,
        color: data.color,
      };
    });
  }, [orders]);

  // State for monthly report export modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Bundle complete business data context for Excel/PDF exports
  const reportContext = useMemo<ReportContextData>(() => {
    return {
      orders: (orders && orders.length > 0) ? orders : mockOrders,
      monthlyData: monthlyRevenueData,
      customers,
      stores,
      products,
      alerts,
      latestMonthRevenue: latestMonthData.rawRevenue,
      totalYtdRevenue: monthlyRevenueData.reduce((acc, c) => acc + c.rawRevenue, 0),
      revenueGrowth: latestMonthData.growthRate,
    };
  }, [orders, monthlyRevenueData, customers, stores, products, alerts, latestMonthData]);

  // Handle direct Excel export from chart section
  const handleDirectExportExcel = () => {
    try {
      exportToExcel(reportContext);
      setExportToast('Đã xuất thành công file Excel (.xlsx) gồm 3 sheet chi tiết!');
      setTimeout(() => setExportToast(null), 4000);
    } catch (err) {
      console.error('Error exporting Excel:', err);
    }
  };

  return (
    <div id="dashboard-container" className="space-y-5 sm:space-y-6 pb-20 lg:pb-12">
      {/* Top Banner: Hải Hương & Mascot Greeting */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 bg-gradient-to-r from-[#3D1B00] via-[#5C2700] to-[#2E1200] p-4 sm:p-6 lg:p-7 rounded-2xl text-white shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-[#FFA31A]/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-start gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 shrink-0 bg-white/10 rounded-2xl p-1 border border-[#FFA31A]/40 shadow-lg flex items-center justify-center relative">
            <HuongGiotBienMascot pose="winking" size="lg" speechBubble="Số 1 Cốt Nhĩ!" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <HaiHuongLogo size="sm" />
              <span className="text-[10px] sm:text-[11px] text-[#FFC407] font-bold tracking-wider uppercase">• HỆ THỐNG ĐIỀU HÀNH CHUỖI</span>
            </div>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight break-words">
              {subDashboard === 'ceo' ? 'Trung Tâm Điều Hành Chuỗi Toàn Quốc' : 'Bảng Chỉ Huy Kinh Doanh & Phân Phối'}
            </h2>
            <p className="text-amber-100/85 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Quản trị liền mạch từ Nhà máy ủ chượp truyền thống Phú Quốc → Kho trung tâm Dĩ An → NPP Hưng Long Phát → Cửa hàng bán lẻ & Khách hàng.
            </p>
          </div>
        </div>

        {/* Action controls: View Switcher & Export Report Button */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 self-start xl:self-auto pt-1 xl:pt-0 border-t border-white/10 xl:border-t-0 w-full xl:w-auto justify-start xl:justify-end">
          {/* Export Report Action */}
          <button
            id="btn-open-monthly-report-modal"
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] hover:from-[#FFB74D] hover:to-[#FFA000] text-[#3D1B00] text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#3D1B00]" />
            <span>Xuất Báo Cáo (PDF/Excel)</span>
          </button>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-[#FFA31A]/30">
            <button
              id="btn-switch-dashboard-ceo"
              onClick={() => setSubDashboard('ceo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subDashboard === 'ceo' 
                  ? 'bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-[#3D1B00] shadow-sm' 
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              Ban Lãnh Đạo
            </button>
            <button
              id="btn-switch-dashboard-sales"
              onClick={() => setSubDashboard('sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subDashboard === 'sales' 
                  ? 'bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-[#3D1B00] shadow-sm' 
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              Kinh Doanh & Chuỗi
            </button>
          </div>
        </div>
      </div>

      {/* Mascot Empathy Advice Tip Box */}
      <HuongGiotBienMascot
        pose="tip-card"
        tipTitle="Lời Khuyên Thấu Cảm Hôm Nay Từ Hương Giọt Biển"
        tipText={mascotTipText}
        actionText="Mở AI Business Center"
        onActionClick={() => onNavigateTab('ai_business_center')}
      />

      {/* Main KPI Grid (Responsive 1 -> 2 -> 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Revenue */}
        <div id="kpi-card-revenue" className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-xs hover:border-[#FFA31A]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Doanh Thu Tháng Toàn Chuỗi ({latestMonthData.monthLabel})</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#3D1B00]">
              {latestMonthData.rawRevenue.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${latestMonthData.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {latestMonthData.growthRate >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{latestMonthData.growthRate >= 0 ? `+${latestMonthData.growthRate}%` : `${latestMonthData.growthRate}%`} so với tháng trước</span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100/60 text-[11px] text-stone-500 flex justify-between">
            <span>Kế hoạch: {latestMonthData.targetInBillion.toFixed(2)} Tỷ</span>
            <span className={`font-bold ${latestMonthData.achievementRate >= 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
              Đạt {latestMonthData.achievementRate}%
            </span>
          </div>
        </div>

        {/* Metric 2: Production */}
        <div id="kpi-card-production" className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-xs hover:border-[#FFA31A]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Sản Lượng Đã Xuất / Tiêu Thụ</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-[#8A3E00]">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#3D1B00]">
              {totalMonthlySalesBottles.toLocaleString('vi-VN')} Chai
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8A3E00] font-semibold">
            <span>Kho tồn trung tâm: {totalWarehouseStock.toLocaleString('vi-VN')} chai</span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100/60 text-[11px] text-stone-500 flex justify-between">
            <span>Toàn mạng lưới: {totalChainStock.toLocaleString('vi-VN')} chai</span>
            <span className="text-[#8A3E00] font-bold">Chuẩn tối ưu</span>
          </div>
        </div>

        {/* Metric 3: Chain Nodes */}
        <div id="kpi-card-chain-nodes" className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-xs hover:border-[#FFA31A]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Mạng Lưới Chuỗi Hải Hương</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Store className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#3D1B00]">
              {chainStats.totalConfiguredNodes < 10 ? `0${chainStats.totalConfiguredNodes}` : chainStats.totalConfiguredNodes} Mạng Lưới Điểm Bán
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-600 flex-wrap">
            <span className="text-blue-700 font-bold">{chainStats.factoryCount} Nhà máy</span>
            <span>•</span>
            <span className="text-blue-700 font-bold">{chainStats.warehouseCount} Kho</span>
            <span>•</span>
            <span className="text-blue-700 font-bold">{chainStats.distributorCount} NPP</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{chainStats.retailCount} Cửa hàng</span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100/60 text-[11px] text-stone-500 flex justify-between">
            <span>Vận hành ổn định</span>
            <span className="text-blue-700 font-bold">{chainStats.operationalRate}%</span>
          </div>
        </div>

        {/* Metric 4: Empathy Index */}
        <div id="kpi-card-empathy" className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-xs hover:border-[#FFA31A]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Chỉ Số Thấu Cảm & Giữ Chân (AI)</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <HeartHandshake className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#3D1B00]">{retentionRate}%</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Tỷ lệ giữ chân</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{atRiskCustomers.length} khách cần can thiệp</span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100/60 text-[11px] text-stone-500 flex justify-between">
            <span>Chu kỳ bình quân: {avgPurchaseCycleDays} ngày</span>
            <span className="text-rose-700 font-bold">Kích hoạt CSKH</span>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Trend Line Chart Section (recharts) */}
      <div id="monthly-revenue-chart-section" className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-5">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-[#8A3E00] border border-amber-200/60">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-[#3D1B00]">
                Xu Hướng Tăng Trưởng Doanh Thu Chuỗi (Theo Tháng)
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300/60 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{latestMonthData.growthRate}% MoM
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Trực quan hóa biến động doanh thu từ dữ liệu phân phối NPP, Đại lý và chuỗi cửa hàng (dữ liệu tích hợp đơn hàng thực tế).
            </p>
          </div>

          {/* Control buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Switcher */}
            <div className="flex bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs">
              <button
                id="chart-metric-revenue"
                type="button"
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMetric === 'revenue' 
                    ? 'bg-white text-[#3D1B00] shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Doanh thu & Mục tiêu
              </button>
              <button
                id="chart-metric-growth"
                type="button"
                onClick={() => setChartMetric('growth')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMetric === 'growth' 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Tốc độ tăng trưởng (%)
              </button>
            </div>

            {/* Timeframe Filter */}
            <div className="flex bg-amber-50/60 p-0.5 rounded-xl border border-amber-200/60 text-xs">
              <button
                id="chart-timeframe-all"
                type="button"
                onClick={() => setChartTimeframe('all')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  chartTimeframe === 'all' 
                    ? 'bg-[#8A3E00] text-white shadow-xs font-bold' 
                    : 'text-[#8A3E00] hover:bg-amber-100/50'
                }`}
              >
                Toàn bộ 2026 (9T)
              </button>
              <button
                id="chart-timeframe-6m"
                type="button"
                onClick={() => setChartTimeframe('6m')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  chartTimeframe === '6m' 
                    ? 'bg-[#8A3E00] text-white shadow-xs font-bold' 
                    : 'text-[#8A3E00] hover:bg-amber-100/50'
                }`}
              >
                6 tháng gần nhất
              </button>
              <button
                id="chart-timeframe-q3"
                type="button"
                onClick={() => setChartTimeframe('q3')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  chartTimeframe === 'q3' 
                    ? 'bg-[#8A3E00] text-white shadow-xs font-bold' 
                    : 'text-[#8A3E00] hover:bg-amber-100/50'
                }`}
              >
                Quý 3 (T7 - T9)
              </button>
            </div>

            {/* Quick Direct Export Action Buttons */}
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs">
              <button
                id="btn-chart-export-excel"
                type="button"
                onClick={handleDirectExportExcel}
                title="Tải ngay bảng tính Excel (.xlsx) gồm 3 sheet đầy đủ"
                className="px-2.5 py-1.5 rounded-lg font-bold text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 transition-all flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất Excel</span>
              </button>
              <button
                id="btn-chart-export-pdf"
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                title="Xem trước và tải file PDF báo cáo kinh doanh"
                className="px-2.5 py-1.5 rounded-lg font-bold text-[#8A3E00] hover:bg-amber-100/60 hover:text-[#5C2700] transition-all flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#FFA31A]" />
                <span>Xuất PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytical Highlights Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50/80 p-3 sm:p-4 rounded-xl border border-amber-900/5">
          <div className="space-y-0.5">
            <span className="text-[11px] text-stone-500 font-medium">Doanh thu {latestMonthData.monthLabel} (Hiện tại)</span>
            <div className="text-base sm:text-lg font-extrabold text-[#8A3E00]">
              {latestMonthData.revenueInBillion.toFixed(2)} Tỷ đ
            </div>
            <div className={`text-[10px] font-bold flex items-center gap-0.5 ${latestMonthData.growthRate >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {latestMonthData.growthRate >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{latestMonthData.growthRate >= 0 ? `+${latestMonthData.growthRate}%` : `${latestMonthData.growthRate}%`} MoM (Đạt {latestMonthData.achievementRate}% KH)</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-stone-500 font-medium">Lũy kế YTD ({monthlyRevenueData.length} tháng)</span>
            <div className="text-base sm:text-lg font-extrabold text-[#3D1B00]">
              {totalYtdRevenue} Tỷ đ
            </div>
            <div className="text-[10px] text-stone-500">
              Mục tiêu năm 55 Tỷ (Đạt {Number(((Number(totalYtdRevenue) / 55) * 100).toFixed(1))}%)
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-stone-500 font-medium">Kế hoạch {latestMonthData.monthLabel}</span>
            <div className="text-base sm:text-lg font-extrabold text-stone-700">
              {latestMonthData.targetInBillion.toFixed(2)} Tỷ đ
            </div>
            <div className={`text-[10px] font-semibold ${planDiffMillion >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {planDiffMillion >= 0 
                ? `Vượt +${planDiffMillion.toLocaleString('vi-VN')} Tr đ (+${planDiffPct}%)` 
                : `Chưa đạt ${Math.abs(planDiffMillion).toLocaleString('vi-VN')} Tr đ (${planDiffPct}%)`}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-stone-500 font-medium">Đơn hàng ghi nhận</span>
            <div className="text-base sm:text-lg font-extrabold text-[#3D1B00]">
              {totalRecordedOrders} đơn
            </div>
            <div className="text-[10px] text-stone-500">
              Tỷ trọng NPP & Bán buôn: {b2bSharePct}%
            </div>
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayedChartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" vertical={false} />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fill: '#78716C', fontSize: 12, fontWeight: 600 }}
                tickLine={{ stroke: '#E7DFD5' }}
                axisLine={{ stroke: '#E7DFD5' }}
              />
              <YAxis 
                tick={{ fill: '#78716C', fontSize: 11 }}
                tickLine={{ stroke: '#E7DFD5' }}
                axisLine={{ stroke: '#E7DFD5' }}
                domain={chartMetric === 'revenue' ? [0, 7] : [-10, 25]}
                tickFormatter={(v) => chartMetric === 'revenue' ? `${v} Tỷ` : `${v}%`}
              />
              <Tooltip content={<CustomRevenueTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: 10, fontSize: 12, fontWeight: 500 }}
                iconType="circle"
              />
              {chartMetric === 'revenue' ? (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="revenueInBillion" 
                    name="Doanh Thu Thực Tế (Tỷ VNĐ)" 
                    stroke="#D96600" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#FFA31A', stroke: '#8A3E00', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#FFA31A', stroke: '#3D1B00', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="targetInBillion" 
                    name="Mục Tiêu Kế Hoạch (Tỷ VNĐ)" 
                    stroke="#A8A29E" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#A8A29E' }}
                  />
                </>
              ) : (
                <>
                  <ReferenceLine y={0} stroke="#D1D5DB" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="growthRate" 
                    name="Tốc Độ Tăng Trưởng MoM (%)" 
                    stroke="#059669" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10B981', stroke: '#047857', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#10B981', stroke: '#064E3B', strokeWidth: 2 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Customer 360 & Taste Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left: Customer Repurchase Predictions */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#3D1B00]">
                Thấu Cảm Khách Hàng: Chu Kỳ Tiêu Thụ & Nguy Cơ Rời Bỏ
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                AI tự động tính toán lượng mắm tiêu thụ, thời điểm cạn chai và gợi ý kích hoạt mua lại.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-xs font-bold text-[#8A3E00] hover:text-[#5C2700] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Xem Customer 360</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Customer Cards List */}
          <div className="space-y-2.5">
            {customers.map((cust) => {
              const isOverdue = cust.daysSinceLastPurchase > cust.purchaseCycleDays;
              const daysRemaining = cust.purchaseCycleDays - cust.daysSinceLastPurchase;

              return (
                <div
                  key={cust.id}
                  onClick={() => onSelectCustomer(cust)}
                  className="p-3.5 sm:p-4 rounded-xl border border-amber-100 bg-amber-50/20 hover:bg-amber-50/60 hover:border-[#FFA31A]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs ${
                      cust.type === 'B2C' ? 'bg-[#FFA31A]/20 text-[#8A3E00]' :
                      cust.type === 'HORECA' ? 'bg-rose-100 text-rose-900' :
                      'bg-blue-100 text-blue-900'
                    }`}>
                      {cust.type}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#3D1B00]">{cust.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-[#8A3E00] font-semibold">
                          {cust.subType || cust.type}
                        </span>
                        {cust.churnRisk === 'High' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                            Nguy cơ rời bỏ cao
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                        <span>Độ đạm ưa thích: <strong className="text-[#8A3E00]">{cust.tastePreference.proteinPreference}</strong></span>
                        <span>•</span>
                        <span>Chu kỳ dùng: <strong className="text-stone-700">{cust.purchaseCycleDays} ngày</strong></span>
                        <span>•</span>
                        <span>Đã trôi qua: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-stone-700'}>{cust.daysSinceLastPurchase} ngày</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-100">
                    <div className="text-left sm:text-right text-xs">
                      <div className="font-bold text-[#3D1B00]">
                        {daysRemaining <= 0 ? (
                          <span className="text-rose-600 font-bold">Đã hết mắm ({Math.abs(daysRemaining)} ngày)</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Hết mắm sau {daysRemaining} ngày</span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400">Dự báo: {cust.nextPredictedPurchase}</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] hover:brightness-105 text-[#3D1B00] text-xs font-bold shadow-xs cursor-pointer shrink-0">
                      Chăm sóc AI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Protein spectrum revenue breakdown */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-[#3D1B00]">
              Tỉ Trọng Dòng Độ Đạm Hải Hương
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Cơ cấu đóng góp doanh thu theo độ đạm tự nhiên ủ chượp
            </p>
          </div>

          <div className="space-y-3.5">
            {proteinBreakdown.map((item) => (
              <div key={item.key}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-[#3D1B00] font-bold">{item.label}</span>
                  <span className="text-[#8A3E00] font-extrabold">{item.percentage}% ({item.formattedRevenue})</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(item.percentage, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Chain quick access */}
          <div className="pt-3 border-t border-amber-100">
            <button
              onClick={() => onNavigateTab('chain')}
              className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8A3E00] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Xem Bản Đồ Mạng Lưới Chuỗi Phân Phối ({chainStats.totalConfiguredNodes} Điểm)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Toast Notification */}
      {exportToast && (
        <div 
          id="dashboard-export-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#3D1B00] text-amber-50 px-4 py-3 rounded-xl shadow-2xl border border-[#FFA31A]/50 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportToast}</span>
        </div>
      )}

      {/* Monthly Business Report Modal (PDF / Excel / Print) */}
      <MonthlyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        context={reportContext}
      />
    </div>
  );
};
