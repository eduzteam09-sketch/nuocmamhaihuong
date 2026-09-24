import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  HeartHandshake, 
  TrendingUp, 
  Calendar, 
  Sparkles,
  ChevronRight,
  UserCheck,
  Package,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Save,
  RotateCcw
} from 'lucide-react';
import { Customer, CustomerType, ChurnRiskLevel } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface CustomerManagementProps {
  customers: Customer[];
  onSelectCustomer: (cust: Customer) => void;
  onAddCustomer: (newCust: Customer) => void;
  onUpdateCustomer?: (updated: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onSelectCustomer,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | CustomerType>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New customer form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState<CustomerType>('B2C');
  const [formAddress, setFormAddress] = useState('');
  const [formRegion, setFormRegion] = useState<'Miền Nam' | 'Miền Bắc' | 'Miền Trung' | 'Miền Tây'>('Miền Nam');
  const [formProtein, setFormProtein] = useState('40N Nhĩ Cá Cơm');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const overdueCustomers = useMemo(() => {
    return customers.filter(c => c.daysSinceLastPurchase > c.purchaseCycleDays || c.churnRisk === 'High');
  }, [customers]);

  const empathyTipText = useMemo(() => {
    if (overdueCustomers.length === 0) {
      return `Hiện tại toàn bộ ${customers.length} khách hàng trong hệ thống đang trong chu kỳ tiêu thụ mắm ổn định. Hãy tiếp tục duy trì tương tác và chia sẻ cẩm nang ẩm thực truyền thống nhé!`;
    }
    const topOverdue = overdueCustomers.slice(0, 2);
    const detailList = topOverdue.map(c => {
      const daysOver = c.daysSinceLastPurchase - c.purchaseCycleDays;
      return `${c.name} (${daysOver > 0 ? `trễ ${daysOver} ngày` : 'nguy cơ rời bỏ'})`;
    }).join(' và ');
    const remainingCount = overdueCustomers.length - topOverdue.length;
    const remainingText = remainingCount > 0 ? ` cùng ${remainingCount} đối tác khác` : '';

    return `Hệ thống AI phát hiện ${overdueCustomers.length} khách hàng đã trễ chu kỳ mua mắm (tiêu biểu: ${detailList}${remainingText}). Hãy kích hoạt kịch bản gọi thăm hỏi thấu cảm và gửi ưu đãi tri ân kịp thời nhé!`;
  }, [overdueCustomers, customers.length]);

  const filteredCustomers = customers.filter(c => {
    if (activeTab !== 'ALL' && c.type !== activeTab) return false;
    if (filterRisk !== 'ALL' && c.churnRisk !== filterRisk) return false;
    if (filterRegion !== 'ALL' && c.region !== filterRegion) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.favoriteSku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmitNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: formName.trim(),
      phone: formPhone.trim(),
      address: formAddress.trim() || 'Hồ Chí Minh',
      region: formRegion,
      type: formType,
      subType: formType === 'B2C' ? 'Gia đình' : formType === 'HORECA' ? 'Nhà hàng' : 'Đại lý Cấp 1',
      favoriteSku: 'NM-CN40-500',
      favoriteVolume: formType === 'HORECA' ? 'Can 5L' : '500ml',
      avgOrderValue: formType === 'B2C' ? 250000 : 5000000,
      totalSpend: formType === 'B2C' ? 250000 : 5000000,
      orderCount: 1,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
      purchaseCycleDays: formType === 'B2C' ? 30 : 14,
      daysSinceLastPurchase: 0,
      nextPredictedPurchase: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      repurchaseProbability: 'Cao',
      churnRisk: 'Low',
      assignedStore: 'Cửa Hàng Chuỗi Trung Tâm',
      rfmSegment: 'Potential (Tiềm năng)',
      tastePreference: {
        proteinPreference: formProtein,
        saltinessLevel: 'Đậm đà truyền thống',
        consumptionPurpose: formType === 'HORECA' ? 'Nấu bếp công nghiệp' : 'Bữa cơm gia đình'
      },
      feedbackHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          rating: 5,
          comment: 'Khách hàng mới tạo từ ứng dụng CRM Chuỗi Nước Mắm.',
          sentiment: 'Tích cực',
          resolved: true
        }
      ],
      aiRecommendation: {
        recommendedCombo: 'Combo 2 chai Cốt Nhĩ 40N tặng sổ tay cẩm nang ẩm thực biển',
        personalizedReason: 'Khách mới tìm hiểu nước mắm cá cơm truyền thống.',
        incentiveText: 'Tặng mã freeship cho lần đặt kế tiếp.'
      }
    };

    onAddCustomer(newCust);
    setShowAddModal(false);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    showToast(`Đã thêm thành công khách hàng ${newCust.name}!`);
  };

  const handleSaveEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (onUpdateCustomer) {
      onUpdateCustomer(editingCustomer);
    }
    showToast(`Đã cập nhật thông tin khách hàng ${editingCustomer.name}!`);
    setEditingCustomer(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingCustomer) return;
    if (onDeleteCustomer) {
      onDeleteCustomer(deletingCustomer.id);
    }
    showToast(`Đã xóa khách hàng ${deletingCustomer.name}!`);
    setDeletingCustomer(null);
  };

  const handleQuickToggleRisk = (e: React.MouseEvent, cust: Customer) => {
    e.stopPropagation();
    const nextRisk: Record<ChurnRiskLevel, ChurnRiskLevel> = {
      'Low': 'Medium',
      'Medium': 'High',
      'High': 'Low'
    };
    const updated: Customer = {
      ...cust,
      churnRisk: nextRisk[cust.churnRisk] || 'Low'
    };
    if (onUpdateCustomer) {
      onUpdateCustomer(updated);
    }
    showToast(`Đã đổi nguy cơ rời bỏ của ${cust.name} sang: ${updated.churnRisk}`);
  };

  return (
    <div id="customer-management-view" className="space-y-6 pb-12">
      {/* Header Banner with Mascot */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>HỆ THỐNG CUSTOMER 360 ĐA KÊNH</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Khách Hàng & Đối Tác Chuỗi
          </h2>
          <p className="text-amber-200/80 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
            Quản trị thông tin từ người tiêu dùng gia đình B2C, đại lý bán lẻ cho đến nhà hàng Horeca và NPP độc quyền.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-500/30">
            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
              <HuongGiotBienMascot pose="winking" size="md" speechBubble="Tận Tâm!" />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold text-amber-300 font-serif">Chăm Sóc Chu Đáo</div>
              <div className="text-[10px] text-amber-100/90 leading-tight mt-0.5 max-w-[130px]">
                Gắn kết từng giọt mắm tới bữa cơm gia đình
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khách Hàng / Điểm Bán Mới</span>
          </button>
        </div>
      </div>

      {/* Mascot Empathy Advice Tip Card */}
      <HuongGiotBienMascot
        pose="tip-card"
        tipTitle="Hương Giọt Biển Thấu Cảm Khách Hàng:"
        tipText={empathyTipText}
      />

      {/* Tabs & Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Customer Type Tabs */}
          <div className="flex flex-wrap gap-1 bg-amber-50/80 p-1 rounded-lg border border-amber-200/60 text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'ALL' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              Tất cả ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('B2C')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'B2C' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              B2C Gia đình ({customers.filter(c => c.type === 'B2C').length})
            </button>
            <button
              onClick={() => setActiveTab('NPP')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'NPP' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              Nhà Phân Phối ({customers.filter(c => c.type === 'NPP').length})
            </button>
            <button
              onClick={() => setActiveTab('DAI_LY')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'DAI_LY' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              Đại Lý Cấp 1 ({customers.filter(c => c.type === 'DAI_LY').length})
            </button>
            <button
              onClick={() => setActiveTab('HORECA')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'HORECA' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              Horeca Nhà Hàng ({customers.filter(c => c.type === 'HORECA').length})
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 text-xs">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-hidden"
            >
              <option value="ALL">Tất cả nguy cơ rời bỏ</option>
              <option value="High">Nguy cơ cao (High)</option>
              <option value="Medium">Nguy cơ trung bình (Medium)</option>
              <option value="Low">Nguy cơ thấp (Low)</option>
            </select>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-hidden"
            >
              <option value="ALL">Tất cả khu vực</option>
              <option value="Miền Nam">Miền Nam</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Tây">Miền Tây</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên khách hàng, số điện thoại, địa chỉ nhận mắm, SKU yêu thích..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const daysRemaining = cust.purchaseCycleDays - cust.daysSinceLastPurchase;
          const isOverdue = daysRemaining < 0;

          return (
            <div
              key={cust.id}
              onClick={() => onSelectCustomer(cust)}
              className="p-5 rounded-2xl bg-white border border-amber-900/10 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      cust.type === 'B2C' ? 'bg-amber-100 text-amber-900' :
                      cust.type === 'HORECA' ? 'bg-rose-100 text-rose-900' :
                      'bg-blue-100 text-blue-900'
                    }`}>
                      {cust.type}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-amber-950 leading-tight">
                        {cust.name}
                      </h4>
                      <span className="text-[11px] text-gray-500">{cust.phone}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    title="Bấm để chuyển nhanh trạng thái: Low (Ổn định) → Medium (Theo dõi) → High (Rủi ro)"
                    onClick={(e) => handleQuickToggleRisk(e, cust)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-transform hover:scale-105 cursor-pointer flex items-center gap-1 ${
                      cust.churnRisk === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      cust.churnRisk === 'Medium' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    <span>{cust.churnRisk === 'High' ? '⚠️ Rủi ro Churn' : cust.churnRisk === 'Medium' ? '⏳ Cần chăm sóc' : '✓ Ổn định'}</span>
                  </button>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span>Phân khúc:</span>
                    <strong className="text-amber-950 font-medium">{cust.subType || cust.type} ({cust.rfmSegment.split(' ')[0]})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Độ đạm ưa chuộng:</span>
                    <span className="text-amber-900 font-bold bg-amber-50 px-1.5 rounded">{cust.tastePreference.proteinPreference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doanh số tích lũy:</span>
                    <span className="font-serif font-bold text-amber-950">{(cust.totalSpend).toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                {/* Repurchase timeline snippet */}
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-[11px] text-gray-700">
                  <div className="flex justify-between font-medium">
                    <span>Chu kỳ: {cust.purchaseCycleDays} ngày</span>
                    <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
                      {isOverdue ? `Trễ hạn ${Math.abs(daysRemaining)} ngày` : `Còn ${daysRemaining} ngày hết mắm`}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Dự báo phát sinh nhu cầu: {cust.nextPredictedPurchase}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{cust.region}</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Chỉnh sửa thông tin khách hàng"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCustomer({ ...cust });
                    }}
                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Xóa khách hàng"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingCustomer(cust);
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCustomer(cust);
                    }}
                    className="text-amber-800 font-bold flex items-center gap-1 hover:text-amber-950 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <span>Hồ Sơ 360</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#261000] text-amber-50 px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Chỉnh Sửa Hồ Sơ Khách Hàng</h3>
              </div>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên khách hàng / Nhà hàng *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phân loại đối tác</label>
                  <select
                    value={editingCustomer.type}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, type: e.target.value as CustomerType })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="B2C">B2C Gia Đình</option>
                    <option value="HORECA">HORECA Nhà Hàng</option>
                    <option value="DAI_LY">Đại Lý Cấp 1</option>
                    <option value="NPP">Nhà Phân Phối</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Khu vực</label>
                  <select
                    value={editingCustomer.region}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, region: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="Miền Nam">Miền Nam</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Miền Tây">Miền Tây</option>
                    <option value="Tây Nguyên">Tây Nguyên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nguy cơ rời bỏ (Churn Risk)</label>
                  <select
                    value={editingCustomer.churnRisk}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, churnRisk: e.target.value as ChurnRiskLevel })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-semibold"
                  >
                    <option value="Low">Low - An toàn / Ổn định</option>
                    <option value="Medium">Medium - Cần theo dõi</option>
                    <option value="High">High - Nguy cơ rời bỏ cao</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Chu kỳ tiêu thụ mắm (ngày)</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={editingCustomer.purchaseCycleDays}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, purchaseCycleDays: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Độ đạm ưa thích</label>
                  <input
                    type="text"
                    value={editingCustomer.tastePreference.proteinPreference}
                    onChange={(e) => setEditingCustomer({ 
                      ...editingCustomer, 
                      tastePreference: { ...editingCustomer.tastePreference, proteinPreference: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Cập Nhật Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-rose-950">Xác Nhận Xóa</h3>
                <p className="text-xs text-rose-700">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-gray-700 space-y-1.5">
              <p>Bạn có chắc chắn muốn xóa hồ sơ khách hàng:</p>
              <p className="font-bold text-amber-950 text-sm">{deletingCustomer.name}</p>
              <p className="text-gray-500">SĐT: {deletingCustomer.phone} • Khu vực: {deletingCustomer.region}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Vĩnh Viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-amber-950">Thêm Khách Hàng / Đối Tác Mới</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên khách hàng / Nhà hàng / Đại lý *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Chị Lan (Gia đình) hoặc Nhà Hàng Cơm Niêu..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phân loại đối tượng</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as CustomerType)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="B2C">B2C (Gia đình / Người tiêu dùng)</option>
                    <option value="HORECA">Horeca (Nhà hàng / Bếp ăn)</option>
                    <option value="DAI_LY">Đại lý Cấp 1</option>
                    <option value="NPP">Nhà Phân Phối Vùng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Địa chỉ giao nước mắm</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, quận/huyện, tỉnh thành..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Khu vực</label>
                  <select
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="Miền Nam">Miền Nam</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Miền Tây">Miền Tây</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Độ đạm ưa thích</label>
                  <select
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="40N Nhĩ Cá Cơm">40N Nhĩ Cá Cơm (Gia đình)</option>
                    <option value="45N Thượng Hạng">45N Thượng Hạng (Chấm sống)</option>
                    <option value="60N Thượng Phẩm">60N Thượng Phẩm (Quà biếu)</option>
                    <option value="35N Bếp Chuyên Nghiệp">35N Bếp Chuyên Nghiệp (Horeca)</option>
                    <option value="30N Nấu Bếp Tiết Kiệm">30N Nấu Bếp Tiết Kiệm</option>
                  </select>
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
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                >
                  Lưu Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
