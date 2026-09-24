import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Package, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Send,
  RefreshCw,
  Search,
  Building2,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { StoreNode, ProductSKU, BatchLot, OrderRecord } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface ChainManagementProps {
  stores: StoreNode[];
  products?: ProductSKU[];
  batches?: BatchLot[];
  orders?: OrderRecord[];
  onAddStore?: (newStore: StoreNode) => void;
  onUpdateStore?: (updated: StoreNode) => void;
  onDeleteStore?: (id: string) => void;
  onNavigateToBatches?: () => void;
}

export const ChainManagement: React.FC<ChainManagementProps> = ({ 
  stores, 
  products = [],
  batches = [],
  orders = [],
  onAddStore,
  onUpdateStore,
  onDeleteStore,
  onNavigateToBatches
}) => {
  const [selectedStore, setSelectedStore] = useState<StoreNode>(stores[3] || stores[0]);
  const [activeTierFilter, setActiveTierFilter] = useState<'ALL' | StoreNode['type']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreNode | null>(null);
  const [deletingStore, setDeletingStore] = useState<StoreNode | null>(null);

  // New store form state
  const [newCode, setNewCode] = useState(`CH-${Math.floor(100 + Math.random() * 900)}`);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<StoreNode['type']>('CUA_HANG');
  const [newAddress, setNewAddress] = useState('');
  const [newProvince, setNewProvince] = useState('TP. Hồ Chí Minh');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStock, setNewStock] = useState(350);
  const [newRevenue, setNewRevenue] = useState(45000000);
  const [newSupplyCycleDays, setNewSupplyCycleDays] = useState<number>(7);
  const [newTopSellingSku, setNewTopSellingSku] = useState<string>('DEFAULT_TOP');
  const [newSlowSellingSku, setNewSlowSellingSku] = useState<string>('NONE');
  const [newShelfCondition, setNewShelfCondition] = useState<StoreNode['shelfCondition']>('Chuẩn quy cách');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic breakdown of actual network nodes
  const nodeCounts = useMemo(() => {
    const factory = stores.filter(s => s.type === 'NHA_MAY').length;
    const warehouse = stores.filter(s => s.type === 'KHO_TONG').length;
    const distributor = stores.filter(s => s.type === 'NPP' || s.type === 'DAI_LY').length;
    const retail = stores.filter(s => s.type === 'CUA_HANG').length;
    const total = stores.length;

    return { factory, warehouse, distributor, retail, total };
  }, [stores]);

  const getStoreAiInsight = (st: StoreNode): string => {
    if (st.stockStatus === 'Cảnh báo sắp hết' || st.stockStatus === 'Đứt hàng cục bộ' || (st.type === 'CUA_HANG' && st.totalStockBottles < 500)) {
      return `Tồn kho chỉ còn ${st.totalStockBottles.toLocaleString()} chai (dưới ngưỡng an toàn). Chu kỳ cấp ${st.supplyCycleDays} ngày đã đến hạn. Đề xuất tạo đơn điều chuyển bổ sung ngay dòng bán chạy ${st.topSellingSku}.`;
    }
    if (st.stockStatus === 'Tồn cao') {
      return `Tồn kho ở mức cao (${st.totalStockBottles.toLocaleString()} chai), tăng trưởng doanh số ${st.revenueGrowthPct < 0 ? `giảm ${Math.abs(st.revenueGrowthPct)}%` : 'chậm'}. Đề xuất chương trình trải nghiệm thử vị mắm tại chỗ & luân chuyển dòng tồn ${st.slowSellingSku}.`;
    }
    if (st.debtAmount > 0) {
      return `Hoạt động ổn định với doanh số ${(st.revenueMonthly / 1000000).toFixed(0)} Tr/tháng. Cần lưu ý đối soát công nợ lũy kế ${(st.debtAmount / 1000000).toFixed(1)} Tr đ trước kỳ xuất hàng kế tiếp.`;
    }
    if (st.type === 'NPP') {
      return `NPP tăng trưởng ${st.revenueGrowthPct > 0 ? `+${st.revenueGrowthPct}%` : 'ổn định'}, doanh số ${(st.revenueMonthly / 1000000).toFixed(0)} Tr/tháng. Đề xuất bổ sung chính sách hỗ trợ biển bảng kệ trưng bày.`;
    }
    if (st.type === 'NHA_MAY') {
      return `Nhà máy vận hành công suất ổn định với ${st.totalStockBottles.toLocaleString()} chai lưu kho. Đảm bảo nguồn cung cho toàn chuỗi.`;
    }
    return `Vận hành tối ưu. Tốc độ tiêu thụ dòng chủ lực ${st.topSellingSku} tăng trưởng +${st.revenueGrowthPct}%. Kế hoạch cấp hàng định kỳ ${st.supplyCycleDays} ngày/lần.`;
  };

  const filteredStores = stores.filter(s => {
    if (activeTierFilter !== 'ALL' && s.type !== activeTierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRestockOrder = (store: StoreNode) => {
    showToast(`Đã tạo lệnh điều chuyển 24 thùng Nước Mắm Cốt Nhĩ 40N từ Kho Trung Tâm sang ${store.name}!`);
  };

  const handleQuickChangeStockStatus = (store: StoreNode, newStatus: StoreNode['stockStatus']) => {
    const updated: StoreNode = {
      ...store,
      stockStatus: newStatus
    };
    if (onUpdateStore) onUpdateStore(updated);
    if (selectedStore?.id === store.id) setSelectedStore(updated);
    showToast(`Đã cập nhật trạng thái tồn kho của ${store.name} sang: ${newStatus}`);
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let topSkuValue = 'Chưa có giao dịch (Điểm bán mới)';
    if (newTopSellingSku === 'DEFAULT_TOP') {
      const topProd = products[0] || { sku: 'NM-CN40-500', name: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N' };
      topSkuValue = `${topProd.sku} (${topProd.name})`;
    } else if (newTopSellingSku !== 'NONE') {
      const matched = products.find(p => p.sku === newTopSellingSku);
      topSkuValue = matched ? `${matched.sku} (${matched.name})` : newTopSellingSku;
    }

    let slowSkuValue = 'Chưa ghi nhận (Điểm bán mới)';
    if (newSlowSellingSku !== 'NONE') {
      const matchedSlow = products.find(p => p.sku === newSlowSellingSku);
      slowSkuValue = matchedSlow ? `${matchedSlow.sku} (${matchedSlow.name})` : newSlowSellingSku;
    }

    const calculatedStatus: StoreNode['stockStatus'] = 
      newStock === 0 ? 'Đứt hàng cục bộ' :
      newStock < 100 ? 'Cảnh báo sắp hết' :
      newStock > 2000 ? 'Tồn cao' : 'Đầy đủ';

    const newStoreNode: StoreNode = {
      id: `store-${Date.now()}`,
      code: newCode.trim(),
      name: newName.trim(),
      type: newType,
      address: newAddress.trim() || 'Việt Nam',
      province: newProvince,
      region: newProvince.includes('Hà Nội') ? 'Miền Bắc' : newProvince.includes('Đà Nẵng') ? 'Miền Trung' : 'Miền Nam',
      contactPerson: newContact.trim() || 'Quản lý điểm bán',
      phone: newPhone.trim() || '0901 000 000',
      totalStockBottles: newStock,
      stockStatus: calculatedStatus,
      revenueMonthly: newRevenue,
      revenueGrowthPct: 0,
      debtAmount: 0,
      supplyCycleDays: Math.max(1, newSupplyCycleDays),
      daysSinceLastRestock: 0, // Vừa nhập lô đầu khai trương
      topSellingSku: topSkuValue,
      slowSellingSku: slowSkuValue,
      shelfCondition: newShelfCondition,
      aiAlert: `Điểm bán mới khai trương. Kế hoạch cấp hàng định kỳ mỗi ${newSupplyCycleDays} ngày/lần.`
    };

    if (onAddStore) onAddStore(newStoreNode);
    setSelectedStore(newStoreNode);
    setShowAddModal(false);
    setNewName('');
    setNewAddress('');
    setNewContact('');
    setNewPhone('');
    setNewCode(`CH-${Math.floor(100 + Math.random() * 900)}`);
    showToast(`Đã thêm thành công điểm bán ${newStoreNode.name}!`);
  };

  const handleSaveEditStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;
    if (onUpdateStore) onUpdateStore(editingStore);
    if (selectedStore?.id === editingStore.id) setSelectedStore(editingStore);
    showToast(`Đã cập nhật thông tin điểm bán ${editingStore.name}!`);
    setEditingStore(null);
  };

  const handleConfirmDeleteStore = () => {
    if (!deletingStore) return;
    if (onDeleteStore) onDeleteStore(deletingStore.id);
    if (selectedStore?.id === deletingStore.id) {
      const remaining = stores.filter(s => s.id !== deletingStore.id);
      setSelectedStore(remaining[0] || null);
    }
    showToast(`Đã xóa điểm bán ${deletingStore.name}!`);
    setDeletingStore(null);
  };

  return (
    <div id="chain-management-view" className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner with Mascot Ambassador */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>CHAIN 360 - ĐIỀU HÀNH MẠNG LƯỚI PHÂN PHỐI</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Quản Lý Chuỗi Phân Phối & Điểm Bán
            </h2>
            <p className="text-amber-200/80 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
              Kiểm soát hành trình chai nước mắm từ bể ủ chượp nhà máy qua kho trung chuyển, nhà phân phối đến hệ thống điểm bán thực tế.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-amber-500/30 shrink-0 self-start md:self-auto">
            <div className="w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
              <HuongGiotBienMascot pose="winking" size="lg" speechBubble="Toàn Quốc!" />
            </div>
            <div className="text-left pr-2">
              <div className="text-xs font-bold text-amber-300 font-serif">Mạng Lưới Chuỗi</div>
              <div className="text-[11px] text-amber-100/90 leading-tight mt-0.5 max-w-[160px]">
                "Hương Giọt Biển đồng hành cùng {nodeCounts.total} điểm mạng lưới kết nối"
              </div>
            </div>
          </div>
        </div>

        {/* Chain Overview Tree Banner */}
        <div className="mt-5 p-4 rounded-xl bg-amber-950/80 border border-amber-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-2.5 bg-amber-900/40 rounded-xl border border-amber-700/30">
            <div className="text-amber-400 font-bold text-base sm:text-lg">
              {nodeCounts.factory < 10 ? `0${nodeCounts.factory}` : nodeCounts.factory} Nhà Máy
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">Ủ chượp Phú Quốc</div>
          </div>
          <div className="p-2.5 bg-amber-900/40 rounded-xl border border-amber-700/30">
            <div className="text-amber-400 font-bold text-base sm:text-lg">
              {nodeCounts.warehouse < 10 ? `0${nodeCounts.warehouse}` : nodeCounts.warehouse} Kho Trung Chuyển
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">Kho Tổng Dĩ An</div>
          </div>
          <div className="p-2.5 bg-amber-900/40 rounded-xl border border-amber-700/30">
            <div className="text-amber-400 font-bold text-base sm:text-lg">
              {nodeCounts.distributor < 10 ? `0${nodeCounts.distributor}` : nodeCounts.distributor} Nhà Phân Phối
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">NPP Hưng Long Phát</div>
          </div>
          <div className="p-2.5 bg-amber-900/40 rounded-xl border border-amber-700/30">
            <div className="text-amber-400 font-bold text-base sm:text-lg">
              {nodeCounts.retail < 10 ? `0${nodeCounts.retail}` : nodeCounts.retail} Cửa Hàng / Điểm Bán
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">Showroom Q1 & Hà Nội</div>
          </div>
          <div className="p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-500/40 col-span-2 sm:col-span-1">
            <div className="text-emerald-400 font-bold text-base sm:text-lg">
              {nodeCounts.total < 10 ? `0${nodeCounts.total}` : nodeCounts.total} Mạng Lưới Điểm Bán
            </div>
            <div className="text-[11px] text-emerald-200/90 mt-0.5">Vận hành kết nối thực tế</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Left Store List & Right Store 360 Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chain Nodes List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-sm text-amber-950">Mạng Lưới Điểm Bán ({filteredStores.length})</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Điểm Bán</span>
              </button>
            </div>

            {/* Filter by Tier */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Lọc cấp độ:</span>
              <select
                value={activeTierFilter}
                onChange={(e) => setActiveTierFilter(e.target.value as any)}
                className="text-xs px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 font-medium"
              >
                <option value="ALL">Tất cả các tầng</option>
                <option value="NHA_MAY">Nhà máy sản xuất</option>
                <option value="KHO_TONG">Kho trung chuyển</option>
                <option value="NPP">Nhà phân phối (NPP)</option>
                <option value="CUA_HANG">Cửa hàng / Điểm bán</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã hoặc tên điểm bán..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Node Items */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredStores.map((st) => {
                const isSelected = selectedStore?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStore(st)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs' 
                        : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-amber-950">{st.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">[{st.code}] • {st.province}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                        st.stockStatus === 'Cảnh báo sắp hết' ? 'bg-rose-100 text-rose-800' :
                        st.stockStatus === 'Tồn cao' ? 'bg-amber-100 text-amber-900' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {st.stockStatus}
                      </span>
                    </div>

                    <div className="mt-2 text-xs flex justify-between text-gray-600 border-t border-gray-100 pt-2">
                      <span>Tồn kho: <strong className="text-amber-950">{st.totalStockBottles.toLocaleString()} chai</strong></span>
                      <span>Doanh số: <strong className="text-amber-950">{(st.revenueMonthly / 1000000).toFixed(0)} Tr</strong></span>
                    </div>

                    {/* Dynamic AI Store Insight */}
                    <div className="mt-2 text-[11px] text-amber-900 bg-amber-100/70 p-1.5 rounded flex items-start gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{getStoreAiInsight(st)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: STORE 360 DETAIL (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedStore ? (
            <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-5">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold uppercase tracking-wider">
                      {selectedStore.type === 'CUA_HANG' ? 'Cửa Hàng Chuỗi' : selectedStore.type}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Mã: {selectedStore.code}</span>

                    {/* Quick status dropdown */}
                    <div className="flex items-center gap-1.5 ml-1">
                      <span className="text-[11px] text-gray-500">Tồn kho:</span>
                      <select
                        value={selectedStore.stockStatus}
                        onChange={(e) => handleQuickChangeStockStatus(selectedStore, e.target.value as any)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-colors cursor-pointer ${
                          selectedStore.stockStatus === 'Cảnh báo sắp hết' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          selectedStore.stockStatus === 'Tồn cao' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                          selectedStore.stockStatus === 'Đứt hàng cục bộ' ? 'bg-red-100 text-red-900 border-red-400' :
                          'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="Đầy đủ">✓ Đầy đủ</option>
                        <option value="Cảnh báo sắp hết">⚠️ Cảnh báo sắp hết</option>
                        <option value="Tồn cao">📦 Tồn cao</option>
                        <option value="Đứt hàng cục bộ">🚫 Đứt hàng cục bộ</option>
                      </select>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-amber-950 mt-1">
                    {selectedStore.name}
                  </h3>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{selectedStore.address}</span>
                  </p>
                </div>

                <div className="flex items-center sm:items-end justify-between sm:justify-start gap-4">
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-500">Doanh số tháng</div>
                    <div className="font-serif font-bold text-xl text-amber-950">
                      {(selectedStore.revenueMonthly).toLocaleString('vi-VN')} đ
                    </div>
                    <div className={`text-xs font-semibold ${selectedStore.revenueGrowthPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {selectedStore.revenueGrowthPct >= 0 ? `+${selectedStore.revenueGrowthPct}%` : `${selectedStore.revenueGrowthPct}%`} so với tháng trước
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Chỉnh sửa thông tin điểm bán"
                      onClick={() => setEditingStore({ ...selectedStore })}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Xóa điểm bán"
                      onClick={() => setDeletingStore(selectedStore)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Store Insight Alert (Section XV in doc) */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>AI STORE 360 INSIGHT & CẢNH BÁO THIẾU HÀNG</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold">
                    Tự động tính toán
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-sans">
                  {getStoreAiInsight(selectedStore)}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleRestockOrder(selectedStore)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Tạo Đơn Bổ Sung Khẩn Cấp</span>
                  </button>
                </div>
              </div>

              {/* Store 360 Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">Người quản lý:</span>
                  <div className="font-bold text-amber-950 mt-1">{selectedStore.contactPerson}</div>
                  <div className="text-[11px] text-gray-500">{selectedStore.phone}</div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">SKU Bán Chạy Nhất:</span>
                  <div className="font-bold text-emerald-700 mt-1">{selectedStore.topSellingSku}</div>
                  <div className="text-[11px] text-gray-500">Cốt Nhĩ 40N 500ml</div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">SKU Bán Chậm / Tồn:</span>
                  <div className="font-bold text-rose-700 mt-1">{selectedStore.slowSellingSku}</div>
                  <div className="text-[11px] text-gray-500">Đề xuất luân chuyển</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  selectedStore.daysSinceLastRestock >= selectedStore.supplyCycleDays 
                    ? 'bg-rose-50/70 border-rose-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Chu kỳ nhập hàng:</span>
                    {selectedStore.daysSinceLastRestock >= selectedStore.supplyCycleDays ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                        Đến hạn nhập
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        An toàn
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-amber-950 mt-1">{selectedStore.supplyCycleDays} ngày / lần</div>
                  <div className="text-[11px] text-gray-500 flex items-center justify-between mt-0.5">
                    <span>Lần nhập trước: <strong className={selectedStore.daysSinceLastRestock >= selectedStore.supplyCycleDays ? 'text-rose-700' : 'text-gray-700'}>{selectedStore.daysSinceLastRestock} ngày</strong></span>
                    {onNavigateToBatches && (
                      <button
                        type="button"
                        onClick={onNavigateToBatches}
                        className="text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer text-[10px]"
                        title="Đến mục Lô sản xuất để xuất kho bổ sung"
                      >
                        Xuất lô ↗
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">Công nợ hiện hành:</span>
                  <div className="font-bold text-amber-950 mt-1">{(selectedStore.debtAmount).toLocaleString('vi-VN')} đ</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">Trong hạn tín dụng</div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">Tình trạng quầy kệ POSM:</span>
                  <div className="font-bold text-amber-950 mt-1">{selectedStore.shelfCondition}</div>
                  <div className="text-[11px] text-amber-700">Đạt chuẩn thương hiệu</div>
                </div>
              </div>

              {/* Hierarchy Visualizer */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 text-xs">
                <span className="font-bold text-amber-950">Mắt Xích Trong Chuỗi Cung Ứng:</span>
                <div className="flex items-center gap-2 text-gray-700 overflow-x-auto py-1">
                  <span className="px-2 py-1 rounded bg-white border border-amber-200 font-semibold shrink-0">
                    Lò chượp Phú Quốc
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="px-2 py-1 rounded bg-white border border-amber-200 font-semibold shrink-0">
                    Kho Trung Tâm Dĩ An
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="px-2 py-1 rounded bg-amber-600 text-white font-bold shrink-0">
                    {selectedStore.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="px-2 py-1 rounded bg-white border border-amber-200 font-semibold shrink-0">
                    Người Ăn Mắm B2C
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400">
              Chọn một điểm bán bên danh sách để xem hồ sơ Store 360
            </div>
          )}
        </div>
      </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#261000] text-amber-50 px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Thêm Mắt Xích / Điểm Bán Mới</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã điểm bán *</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tầng phân phối</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="CUA_HANG">Cửa hàng chuỗi</option>
                    <option value="NPP">Nhà phân phối (NPP)</option>
                    <option value="KHO_TONG">Kho trung chuyển</option>
                    <option value="NHA_MAY">Nhà máy sản xuất</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên điểm bán / Kho / NPP *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đại Lý Nước Mắm Hoàng Gia - Quận 7"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    placeholder="Số nhà, đường, phường..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Người quản lý</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="Họ và tên..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="09xx..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tồn kho ban đầu (chai)</label>
                  <input
                    type="number"
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Doanh số mục tiêu tháng (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000000}
                    value={newRevenue}
                    onChange={(e) => setNewRevenue(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Chu kỳ nhập hàng (ngày) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={newSupplyCycleDays}
                    onChange={(e) => setNewSupplyCycleDays(Math.max(1, parseInt(e.target.value) || 7))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold text-amber-950"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Gợi ý: Cửa hàng (7 ngày), Đại lý (14 ngày), NPP/Kho (30 ngày)
                  </span>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tình trạng quầy kệ & POSM</label>
                  <select
                    value={newShelfCondition}
                    onChange={(e) => setNewShelfCondition(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="Chuẩn quy cách">Chuẩn quy cách (Đầy đủ kệ, bảng giá)</option>
                    <option value="Cần POSM mới">Cần POSM mới (Bảng hiệu/standee)</option>
                    <option value="Thiếu diện tích trưng bày">Thiếu diện tích trưng bày</option>
                  </select>
                </div>
              </div>

              {/* Logic giải thích & thiết lập SKU ban đầu */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>CƠ CHẾ DỮ LIỆU SKU BÁN CHẠY / CHẬM CHO ĐIỂM BÁN MỚI:</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Điểm bán mới chưa có lịch sử bán hàng thực tế. Bạn có thể chọn <strong>SKU định hướng bán chủ lực ban đầu</strong> hoặc để hệ thống tự động tổng hợp từ các đơn hàng phân phối tiếp theo.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-gray-700 font-semibold text-[11px] mb-1">SKU định hướng chủ lực</label>
                    <select
                      value={newTopSellingSku}
                      onChange={(e) => setNewTopSellingSku(e.target.value)}
                      className="w-full px-2 py-1.5 border border-amber-200 rounded-lg bg-white text-[11px] font-medium"
                    >
                      <option value="DEFAULT_TOP">⭐ Tự động (Theo sản phẩm bán chạy toàn chuỗi)</option>
                      {products.map(p => (
                        <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>
                      ))}
                      <option value="NONE">Chưa có dữ liệu (Chờ phát sinh đơn hàng)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold text-[11px] mb-1">SKU bán chậm / cảnh báo</label>
                    <select
                      value={newSlowSellingSku}
                      onChange={(e) => setNewSlowSellingSku(e.target.value)}
                      className="w-full px-2 py-1.5 border border-amber-200 rounded-lg bg-white text-[11px] font-medium"
                    >
                      <option value="NONE">Chưa ghi nhận (Điểm bán mới)</option>
                      {products.map(p => (
                        <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Điểm Bán Mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Modal */}
      {editingStore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Chỉnh Sửa Hồ Sơ Điểm Bán</h3>
              </div>
              <button 
                onClick={() => setEditingStore(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStore} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã điểm bán</label>
                  <input
                    type="text"
                    required
                    value={editingStore.code}
                    onChange={(e) => setEditingStore({ ...editingStore, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tầng phân phối</label>
                  <select
                    value={editingStore.type}
                    onChange={(e) => setEditingStore({ ...editingStore, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="CUA_HANG">Cửa hàng chuỗi</option>
                    <option value="NPP">Nhà phân phối (NPP)</option>
                    <option value="KHO_TONG">Kho trung chuyển</option>
                    <option value="NHA_MAY">Nhà máy sản xuất</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên điểm bán / Kho / NPP *</label>
                <input
                  type="text"
                  required
                  value={editingStore.name}
                  onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={editingStore.province}
                    onChange={(e) => setEditingStore({ ...editingStore, province: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trạng thái tồn kho</label>
                  <select
                    value={editingStore.stockStatus}
                    onChange={(e) => setEditingStore({ ...editingStore, stockStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-semibold"
                  >
                    <option value="Đầy đủ">Đầy đủ</option>
                    <option value="Cảnh báo sắp hết">Cảnh báo sắp hết</option>
                    <option value="Tồn cao">Tồn cao</option>
                    <option value="Đứt hàng cục bộ">Đứt hàng cục bộ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  value={editingStore.address}
                  onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Người quản lý</label>
                  <input
                    type="text"
                    value={editingStore.contactPerson}
                    onChange={(e) => setEditingStore({ ...editingStore, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editingStore.phone}
                    onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tồn kho (chai)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingStore.totalStockBottles}
                    onChange={(e) => setEditingStore({ ...editingStore, totalStockBottles: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Doanh số tháng (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingStore.revenueMonthly}
                    onChange={(e) => setEditingStore({ ...editingStore, revenueMonthly: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Công nợ (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingStore.debtAmount}
                    onChange={(e) => setEditingStore({ ...editingStore, debtAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Chu kỳ nhập hàng (ngày)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingStore.supplyCycleDays}
                    onChange={(e) => setEditingStore({ ...editingStore, supplyCycleDays: Math.max(1, parseInt(e.target.value) || 7) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số ngày từ lần nhập trước</label>
                  <input
                    type="number"
                    min={0}
                    value={editingStore.daysSinceLastRestock}
                    onChange={(e) => setEditingStore({ ...editingStore, daysSinceLastRestock: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">SKU Bán Chạy Nhất</label>
                  <input
                    type="text"
                    value={editingStore.topSellingSku}
                    onChange={(e) => setEditingStore({ ...editingStore, topSellingSku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">SKU Bán Chậm / Cảnh Báo</label>
                  <input
                    type="text"
                    value={editingStore.slowSellingSku}
                    onChange={(e) => setEditingStore({ ...editingStore, slowSellingSku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tình trạng quầy kệ & POSM</label>
                <select
                  value={editingStore.shelfCondition}
                  onChange={(e) => setEditingStore({ ...editingStore, shelfCondition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-medium"
                >
                  <option value="Chuẩn quy cách">Chuẩn quy cách (Đầy đủ kệ gỗ, wobbler & bảng giá)</option>
                  <option value="Cần POSM mới">Cần POSM mới (Bảng hiệu/standee cũ hỏng, cần cấp bổ sung)</option>
                  <option value="Thiếu diện tích trưng bày">Thiếu diện tích trưng bày (Quầy chật, chen chúc mặt hàng khác)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStore(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Cập Nhật Điểm Bán</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-rose-950">Xóa Điểm Bán</h3>
                <p className="text-xs text-rose-700">Hành động này sẽ gỡ mắt xích khỏi chuỗi</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-gray-700 space-y-1.5">
              <p>Bạn có chắc chắn muốn xóa điểm bán:</p>
              <p className="font-bold text-amber-950 text-sm">{deletingStore.name} ({deletingStore.code})</p>
              <p className="text-gray-500">{deletingStore.address} • {deletingStore.province}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingStore(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStore}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Điểm Bán</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
