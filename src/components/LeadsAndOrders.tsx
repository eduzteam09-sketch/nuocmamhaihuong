import React, { useState, useEffect } from 'react';
import { 
  Target, 
  ShoppingCart, 
  Search, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Phone,
  Building,
  Edit3,
  Trash2,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import { LeadRecord, OrderRecord, CustomerType, StaffMember, Customer, ProductSKU, StoreNode } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

const AVAILABLE_SKUS = [
  { sku: 'NM-CN40-500', name: 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (500ml)', price: 125000 },
  { sku: 'NM-TH45-500', name: 'Nước Mắm Thượng Hạng Đặc Biệt 45°N (500ml)', price: 185000 },
  { sku: 'NM-GD35-750', name: 'Nước Mắm Gia Đình Thuần Khiết 35°N (750ml)', price: 85000 },
  { sku: 'NM-HOR35-CAN5L', name: 'Can Bếp Chuyên Nghiệp Horeca 35°N (5L)', price: 420000 },
  { sku: 'NM-VIP60-250', name: 'Bộ Cốt Nhĩ Tuyệt Phẩm 60°N Dâng Bàn Ăn (250ml)', price: 290000 },
];

interface LeadsAndOrdersProps {
  initialTab?: 'leads' | 'orders';
  leads: LeadRecord[];
  orders: OrderRecord[];
  staff?: StaffMember[];
  customers?: Customer[];
  products?: ProductSKU[];
  stores?: StoreNode[];
  onAddOrder?: (order: OrderRecord) => void;
  onUpdateOrder?: (order: OrderRecord) => void;
  onDeleteOrder?: (id: string) => void;
  onAddLead?: (lead: LeadRecord) => void;
  onUpdateLead?: (lead: LeadRecord) => void;
  onDeleteLead?: (id: string) => void;
  onAddCustomer?: (customer: Customer) => void;
  onNavigateToStaff?: () => void;
}

export const LeadsAndOrders: React.FC<LeadsAndOrdersProps> = ({
  initialTab = 'orders',
  leads: initialLeads,
  orders: initialOrders,
  staff = [],
  customers = [],
  products = [],
  stores = [],
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  onAddCustomer,
  onNavigateToStaff,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'leads'>(initialTab);
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  // Modal states for Order
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<OrderRecord | null>(null);

  // Modal states for Lead
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadRecord | null>(null);
  const [deletingLead, setDeletingLead] = useState<LeadRecord | null>(null);

  // New Order State
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('B2C');
  const [skuSelected, setSkuSelected] = useState('NM-CN40-500');
  const [orderQty, setOrderQty] = useState(2);
  const [deliveryAddr, setDeliveryAddr] = useState('');

  // New Lead State
  const [leadCompanyName, setLeadCompanyName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadType, setLeadType] = useState<LeadRecord['type']>('Nhà hàng Chuỗi');
  const [leadExpectedBottles, setLeadExpectedBottles] = useState(150);
  const [leadEstimatedValue, setLeadEstimatedValue] = useState(18500000);
  const [leadAssignedTo, setLeadAssignedTo] = useState('Trần Văn Khang (Sales B2B)');
  const [leadStage, setLeadStage] = useState<LeadRecord['stage']>('Tiếp cận');
  const [leadNotes, setLeadNotes] = useState('Lead B2B tiềm năng tìm nguồn nước mắm chuẩn vị nguyên chất');
  const [leadEmpathy, setLeadEmpathy] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredOrders = orders.filter(o => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderCode.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.deliveryAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredLeads = leads.filter(l => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.companyName.toLowerCase().includes(q) ||
        l.contactPerson.toLowerCase().includes(q) ||
        l.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConvertLeadToCustomer = (lead: LeadRecord) => {
    if (!onAddCustomer) return;
    const newCust: Customer = {
      id: `cust-b2b-${Date.now()}`,
      name: lead.companyName,
      phone: lead.phone || '0901 888 999',
      address: 'Việt Nam',
      region: 'Miền Nam',
      type: 'B2B',
      subType: lead.type === 'Nhà hàng Chuỗi' ? 'Nhà hàng' : 'Đại lý Cấp 1',
      favoriteSku: 'NM-HOR35-CAN5L',
      favoriteVolume: 'Can 5L',
      avgOrderValue: lead.estimatedValue || 15000000,
      totalSpend: lead.estimatedValue || 15000000,
      orderCount: 1,
      lastPurchaseDate: new Date().toISOString().slice(0, 10),
      purchaseCycleDays: 30,
      daysSinceLastPurchase: 0,
      nextPredictedPurchase: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      repurchaseProbability: 'Cao',
      churnRisk: 'Low',
      assignedSalesStaff: lead.assignedTo,
      rfmSegment: 'Champions (Khách VIP)',
      tastePreference: {
        proteinPreference: '35°N - 40°N Chuyên Bếp',
        saltinessLevel: 'Hài hòa thanh dịu',
        consumptionPurpose: 'Nấu bếp công nghiệp',
      },
      feedbackHistory: [
        {
          date: new Date().toISOString().slice(0, 10),
          rating: 5,
          comment: `Chuyển đổi từ Lead chốt hợp đồng thành công. Phụ trách: ${lead.assignedTo}. Nhu cầu: ${lead.expectedMonthlyBottles} chai/tháng.`,
          sentiment: 'Tích cực',
          resolved: true,
        }
      ],
      aiRecommendation: {
        recommendedCombo: 'Gói định kỳ 10 can 5L Horeca + Tặng 2 chai cốt nhĩ 40N thử món mới',
        personalizedReason: 'Đáp ứng nhu cầu nguyên liệu ổn định cho bếp chuỗi',
        incentiveText: 'Chiết khấu bổ sung 5% khi chốt hợp đồng năm',
      }
    };
    onAddCustomer(newCust);
    showToast(`Đã chuyển đổi thành công đối tác "${lead.companyName}" thành Khách Hàng B2B chính thức!`);
  };

  // Handle Orders
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const unitPrice = skuSelected === 'NM-HOR35-CAN5L' ? 245000 : 125000;
    const total = unitPrice * orderQty;

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderCode: `DH-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(10 + Math.random() * 90)}`,
      customerName: customerName.trim(),
      customerType,
      channel: 'Cửa hàng chuỗi',
      items: [
        {
          sku: skuSelected,
          productName: skuSelected === 'NM-HOR35-CAN5L' ? 'Can Bếp Chuyên Nghiệp Horeca 35°N (5L)' : 'Nước Mắm Cốt Nhĩ Cá Cơm 40°N (500ml)',
          quantity: orderQty,
          unitPrice,
        }
      ],
      totalAmount: total,
      discount: 0,
      finalAmount: total,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Chờ xuất kho',
      deliveryAddress: deliveryAddr || 'TP. Hồ Chí Minh',
      empathyNote: 'Khách hàng mong muốn giao trước giờ nấu cơm trưa.'
    };

    setOrders([newOrder, ...orders]);
    if (onAddOrder) onAddOrder(newOrder);
    setShowNewOrderModal(false);
    setCustomerName('');
    setDeliveryAddr('');
    showToast(`Đã tạo thành công đơn hàng ${newOrder.orderCode}!`);
  };

  const handleUpdateOrderStatus = (order: OrderRecord, newStatus: OrderRecord['status']) => {
    const updated = { ...order, status: newStatus };
    setOrders(prev => prev.map(o => o.id === order.id ? updated : o));
    if (onUpdateOrder) onUpdateOrder(updated);
    showToast(`Đơn hàng ${order.orderCode} đã chuyển sang: ${newStatus}`);
  };

  const handleUpdateOrderItem = (index: number, field: 'sku' | 'productName' | 'quantity' | 'unitPrice', val: any) => {
    if (!editingOrder) return;
    const newItems = [...editingOrder.items];
    newItems[index] = { ...newItems[index], [field]: val };

    if (field === 'sku') {
      const matched = AVAILABLE_SKUS.find(p => p.sku === val);
      if (matched) {
        newItems[index].productName = matched.name;
        newItems[index].unitPrice = matched.price;
      }
    }

    const newTotal = newItems.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
    const newFinal = Math.max(0, newTotal - (editingOrder.discount || 0));

    setEditingOrder({
      ...editingOrder,
      items: newItems,
      totalAmount: newTotal,
      finalAmount: newFinal
    });
  };

  const handleAddOrderItem = () => {
    if (!editingOrder) return;
    const defaultSku = AVAILABLE_SKUS[0];
    const newItems = [
      ...editingOrder.items,
      {
        sku: defaultSku.sku,
        productName: defaultSku.name,
        quantity: 1,
        unitPrice: defaultSku.price
      }
    ];
    const newTotal = newItems.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
    const newFinal = Math.max(0, newTotal - (editingOrder.discount || 0));
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      totalAmount: newTotal,
      finalAmount: newFinal
    });
  };

  const handleRemoveOrderItem = (index: number) => {
    if (!editingOrder) return;
    if (editingOrder.items.length <= 1) {
      showToast('Đơn hàng phải có ít nhất 1 sản phẩm!');
      return;
    }
    const newItems = editingOrder.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
    const newFinal = Math.max(0, newTotal - (editingOrder.discount || 0));
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      totalAmount: newTotal,
      finalAmount: newFinal
    });
  };

  const handleDiscountChange = (discount: number) => {
    if (!editingOrder) return;
    const newFinal = Math.max(0, editingOrder.totalAmount - discount);
    setEditingOrder({
      ...editingOrder,
      discount,
      finalAmount: newFinal
    });
  };

  const handleSaveEditOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setOrders(prev => prev.map(o => o.id === editingOrder.id ? editingOrder : o));
    if (onUpdateOrder) onUpdateOrder(editingOrder);
    showToast(`Đã cập nhật đơn hàng ${editingOrder.orderCode}!`);
    setEditingOrder(null);
  };

  const handleConfirmDeleteOrder = () => {
    if (!deletingOrder) return;
    setOrders(prev => prev.filter(o => o.id !== deletingOrder.id));
    if (onDeleteOrder) onDeleteOrder(deletingOrder.id);
    showToast(`Đã xóa đơn hàng ${deletingOrder.orderCode}!`);
    setDeletingOrder(null);
  };

  // Handle Leads
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCompanyName.trim() || !leadContact.trim()) return;

    const newLead: LeadRecord = {
      id: `lead-${Date.now()}`,
      companyName: leadCompanyName.trim(),
      contactPerson: leadContact.trim(),
      phone: leadPhone.trim() || '09xx xxx xxx',
      type: leadType,
      expectedMonthlyBottles: leadExpectedBottles,
      estimatedValue: leadEstimatedValue,
      assignedTo: leadAssignedTo,
      stage: leadStage,
      lastInteraction: 'Vừa tạo mới',
      notes: leadNotes.trim() || 'Lead B2B tiềm năng tìm nguồn nước mắm chuẩn vị nguyên chất',
      empathyProfile: leadEmpathy.trim() || 'Ưu tiên nước mắm thơm dịu, độ đạm chuẩn không lẫn mùi gắt hóa chất, giá sỉ ưu đãi cho hợp đồng dài hạn.'
    };

    setLeads([newLead, ...leads]);
    if (onAddLead) onAddLead(newLead);
    setShowNewLeadModal(false);
    setLeadCompanyName('');
    setLeadContact('');
    setLeadPhone('');
    setLeadEmpathy('');
    setLeadNotes('Lead B2B tiềm năng tìm nguồn nước mắm chuẩn vị nguyên chất');
    showToast(`Đã thêm thành công cơ hội B2B từ ${newLead.companyName}!`);
  };

  const handleUpdateLeadStage = (lead: LeadRecord, newStage: LeadRecord['stage']) => {
    const updated = { ...lead, stage: newStage };
    setLeads(prev => prev.map(l => l.id === lead.id ? updated : l));
    if (onUpdateLead) onUpdateLead(updated);
    showToast(`Cơ hội ${lead.companyName} đã chuyển sang bước: ${newStage}`);
  };

  const handleSaveEditLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
    if (onUpdateLead) onUpdateLead(editingLead);
    showToast(`Đã cập nhật cơ hội ${editingLead.companyName}!`);
    setEditingLead(null);
  };

  const handleConfirmDeleteLead = () => {
    if (!deletingLead) return;
    setLeads(prev => prev.filter(l => l.id !== deletingLead.id));
    if (onDeleteLead) onDeleteLead(deletingLead.id);
    showToast(`Đã xóa cơ hội ${deletingLead.companyName}!`);
    setDeletingLead(null);
  };

  return (
    <div id="leads-orders-view" className="space-y-6 pb-12">
      {/* Header Banner with Mascot */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4 text-amber-400" />
            <span>QUẢN LÝ BÁN HÀNG & TIẾN ĐỘ GIAO NHẬN</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            {activeTab === 'orders' ? 'Đơn Hàng Toàn Chuỗi' : 'Pipeline Cơ Hội & Leads B2B'}
          </h2>
          <p className="text-amber-200/80 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
            Quy trình khép kín: Lead → Cơ hội dùng thử → Báo giá chính sách → Đơn hàng → Xuất kho điều phối.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 bg-white/10 backdrop-blur-xs p-2 rounded-2xl border border-amber-500/30">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <HuongGiotBienMascot pose="winking" size="md" speechBubble="Đơn đi nhanh!" />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold text-amber-300 font-serif">Hương Giọt Biển</div>
              <div className="text-[10px] text-amber-100/90 leading-tight">
                Giao hàng đúng hẹn
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-amber-950/60 p-1 rounded-xl border border-amber-800/60 flex">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'orders' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-200 hover:text-white'
                }`}
              >
                Đơn Hàng ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'leads' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-200 hover:text-white'
                }`}
              >
                Leads & Pipeline ({leads.length})
              </button>
            </div>

            {activeTab === 'orders' ? (
              <button
                type="button"
                onClick={() => setShowNewOrderModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Đơn Hàng Mới</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewLeadModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Cơ Hội / Lead</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Tab View */}
      {activeTab === 'orders' && (
        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-amber-950">Danh Sách Đơn Hàng Đang Xử Lý ({filteredOrders.length})</h3>
            <div className="w-72 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên khách..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-xs text-left min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-200 bg-amber-50/50 text-gray-600">
                  <th className="py-3 px-3">Mã Đơn</th>
                  <th className="py-3 px-3">Khách Hàng / Điểm Bán</th>
                  <th className="py-3 px-3">Kênh Bán</th>
                  <th className="py-3 px-3">Sản Phẩm & Số Lượng</th>
                  <th className="py-3 px-3">Tổng Tiền</th>
                  <th className="py-3 px-3">Trạng Thái</th>
                  <th className="py-3 px-3">Ghi Chú Thấu Cảm</th>
                  <th className="py-3 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-900">{ord.orderCode}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-amber-950">{ord.customerName}</div>
                      <span className="text-[10px] text-gray-400">{ord.deliveryAddress}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{ord.channel}</td>
                    <td className="py-3 px-3">
                      {ord.items.map((item, i) => (
                        <div key={i} className="text-gray-700">
                          {item.productName} × <strong>{item.quantity}</strong>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-3 font-serif font-bold text-amber-950 text-sm">
                      {ord.finalAmount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3 px-3">
                      {/* Interactive Status Selector */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord, e.target.value as any)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          ord.status === 'Đã hoàn thành' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          ord.status === 'Đang vận chuyển' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          ord.status === 'Đã hủy' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="Chờ xuất kho">⏳ Chờ xuất kho</option>
                        <option value="Đang vận chuyển">🚚 Đang vận chuyển</option>
                        <option value="Đã hoàn thành">✓ Đã hoàn thành</option>
                        <option value="Đã hủy">✕ Đã hủy</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-gray-500 italic max-w-xs truncate">
                      {ord.empathyNote || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          title="Sửa đơn hàng"
                          onClick={() => setEditingOrder({ ...ord })}
                          className="p-1.5 text-gray-500 hover:text-amber-800 hover:bg-amber-100/60 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Xóa đơn hàng"
                          onClick={() => setDeletingOrder(ord)}
                          className="p-1.5 text-gray-500 hover:text-rose-700 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leads Tab View */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
            <h3 className="font-bold text-sm text-amber-950">Đường Ống Bán Hàng & Chăm Sóc Khách B2B ({filteredLeads.length})</h3>
            <div className="w-72 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm công ty, người liên hệ..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-5 rounded-2xl bg-white border border-amber-900/10 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {lead.type}
                    </span>
                    <h4 className="font-bold text-base text-amber-950 mt-1">{lead.companyName}</h4>
                    <p className="text-xs text-gray-500">{lead.contactPerson} • {lead.phone}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Interactive Stage Selector */}
                    <select
                      value={lead.stage}
                      onChange={(e) => handleUpdateLeadStage(lead, e.target.value as any)}
                      className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 cursor-pointer"
                    >
                      <option value="Tiếp cận ban đầu">1. Tiếp cận ban đầu</option>
                      <option value="Gửi mẫu thử nước mắm">2. Gửi mẫu thử</option>
                      <option value="Báo giá chính sách">3. Báo giá chính sách</option>
                      <option value="Đàm phán hợp đồng">4. Đàm phán HĐ</option>
                      <option value="Ký kết thành công">5. Ký kết thành công</option>
                    </select>

                    <button
                      type="button"
                      title="Sửa thông tin Lead"
                      onClick={() => setEditingLead({ ...lead })}
                      className="p-1.5 text-gray-500 hover:text-purple-800 hover:bg-purple-100/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Xóa Lead"
                      onClick={() => setDeletingLead(lead)}
                      className="p-1.5 text-gray-500 hover:text-rose-700 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Nhu cầu ước tính:</span>
                    <strong className="text-amber-950">{lead.expectedMonthlyBottles} chai / tháng</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá trị hợp đồng:</span>
                    <strong className="font-serif text-amber-950">{(lead.estimatedValue).toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Nhân sự phụ trách:</span>
                    <span className="text-gray-900 font-medium">{lead.assignedTo}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Thấu Cảm Tâm Lý Khách Hàng:</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-sans">{lead.empathyProfile}</p>
                </div>

                {lead.stage === 'Ký kết thành công' && onAddCustomer && (
                  <button
                    type="button"
                    onClick={() => handleConvertLeadToCustomer(lead)}
                    className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Chuyển thành Khách Hàng B2B Chính Thức</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-amber-950">Lập Đơn Hàng Mới</h3>
              <button 
                onClick={() => setShowNewOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              {customers && customers.length > 0 && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <label className="block text-amber-950 font-bold text-[11px] mb-1">
                    Chọn nhanh khách hàng đã có trong hệ thống:
                  </label>
                  <select
                    onChange={(e) => {
                      const c = customers.find(x => x.id === e.target.value);
                      if (c) {
                        setCustomerName(c.name);
                        setCustomerType(c.type === 'B2B' ? 'HORECA' : 'B2C');
                        setDeliveryAddr(c.address || 'Việt Nam');
                      }
                    }}
                    defaultValue=""
                    className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-lg bg-white text-gray-800"
                  >
                    <option value="">-- Chọn khách hàng sẵn có --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type} - {c.phone} - {c.rfmSegment})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên khách hàng / Điểm nhận *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Chị Mai Lan hoặc Đại Lý Cô Ba..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Loại khách</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="B2C">B2C Gia đình</option>
                    <option value="HORECA">Horeca Nhà hàng</option>
                    <option value="DAI_LY">Đại lý Cấp 1</option>
                    <option value="NPP">Nhà Phân Phối</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Chọn SKU</label>
                  <select
                    value={skuSelected}
                    onChange={(e) => setSkuSelected(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="NM-CN40-500">Cốt Nhĩ 40N (500ml)</option>
                    <option value="NM-HOR35-CAN5L">Horeca 35N (Can 5L)</option>
                    <option value="NM-TH45-500">Thượng Hạng 45N (500ml)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số lượng</label>
                  <input
                    type="number"
                    min={1}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    value={deliveryAddr}
                    onChange={(e) => setDeliveryAddr(e.target.value)}
                    placeholder="Quận/Huyện..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                >
                  Tạo Đơn Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Chỉnh Sửa Đơn Hàng: {editingOrder.orderCode}</h3>
              </div>
              <button 
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã đơn hàng</label>
                  <input
                    type="text"
                    disabled
                    value={editingOrder.orderCode}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 font-mono text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trạng thái đơn</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-semibold"
                  >
                    <option value="Chờ xuất kho">Chờ xuất kho</option>
                    <option value="Đang vận chuyển">Đang vận chuyển</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tên khách hàng / Điểm bán</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.customerName}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kênh đặt hàng</label>
                  <select
                    value={editingOrder.channel}
                    onChange={(e) => setEditingOrder({ ...editingOrder, channel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="Cửa hàng chuỗi">Cửa hàng chuỗi</option>
                    <option value="Đại lý">Đại lý</option>
                    <option value="NPP">NPP</option>
                    <option value="Zalo OA / Hotline">Zalo OA / Hotline</option>
                    <option value="Website">Website</option>
                    <option value="Shopee / TikTok Shop">Shopee / TikTok Shop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  value={editingOrder.deliveryAddress}
                  onChange={(e) => setEditingOrder({ ...editingOrder, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              {/* Chi tiết Sản Phẩm & Số Lượng Trong Đơn */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-800 font-bold">Danh sách sản phẩm & số lượng *</label>
                  <button
                    type="button"
                    onClick={handleAddOrderItem}
                    className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm sản phẩm</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {editingOrder.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-900">Mặt hàng #{idx + 1}</span>
                        {editingOrder.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOrderItem(idx)}
                            className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-0.5 cursor-pointer"
                            title="Xóa dòng này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-600 text-[11px] font-medium mb-0.5">Chọn mẫu SKU</label>
                          <select
                            value={item.sku}
                            onChange={(e) => handleUpdateOrderItem(idx, 'sku', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-mono"
                          >
                            {AVAILABLE_SKUS.map(s => (
                              <option key={s.sku} value={s.sku}>{s.sku} - {s.name}</option>
                            ))}
                            {!AVAILABLE_SKUS.some(s => s.sku === item.sku) && (
                              <option value={item.sku}>{item.sku} (Tùy chỉnh)</option>
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-600 text-[11px] font-medium mb-0.5">Tên sản phẩm hiển thị</label>
                          <input
                            type="text"
                            value={item.productName}
                            onChange={(e) => handleUpdateOrderItem(idx, 'productName', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-gray-600 text-[11px] font-medium mb-0.5">Số lượng (chai/can)</label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleUpdateOrderItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-bold text-amber-950"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 text-[11px] font-medium mb-0.5">Đơn giá (VNĐ)</label>
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateOrderItem(idx, 'unitPrice', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 text-[11px] font-medium mb-0.5">Thành tiền</label>
                          <div className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-amber-900 text-right">
                            {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Tạm tính (VNĐ)</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-700">
                    {editingOrder.totalAmount.toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Chiết khấu (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={editingOrder.discount || 0}
                    onChange={(e) => handleDiscountChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Tổng thanh toán</label>
                  <div className="px-3 py-2 bg-amber-100/70 border border-amber-300 rounded-lg font-bold text-amber-950 text-right">
                    {editingOrder.finalAmount.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Ghi chú thấu cảm / Lưu ý vận chuyển</label>
                <textarea
                  rows={2}
                  value={editingOrder.empathyNote || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, empathyNote: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {deletingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-rose-950">Xóa Đơn Hàng</h3>
                <p className="text-xs text-rose-700">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-gray-700 space-y-1">
              <p>Mã đơn: <strong className="text-amber-950 font-mono">{deletingOrder.orderCode}</strong></p>
              <p>Khách hàng: <strong>{deletingOrder.customerName}</strong></p>
              <p>Trị giá: <strong className="text-amber-900">{deletingOrder.finalAmount.toLocaleString('vi-VN')} đ</strong></p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteOrder}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Đơn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Thêm Cơ Hội & Lead B2B Mới</h3>
              </div>
              <button 
                onClick={() => setShowNewLeadModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên đối tác / Doanh nghiệp *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nhà Hàng Hải Sản Biển Đông, Chuỗi Phở..."
                  value={leadCompanyName}
                  onChange={(e) => setLeadCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Người liên hệ / Bếp trưởng *</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên..."
                    value={leadContact}
                    onChange={(e) => setLeadContact(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="09xx..."
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phân khúc đối tác</label>
                  <select
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="Nhà hàng Chuỗi">Nhà hàng Chuỗi</option>
                    <option value="Đại lý mới">Đại lý mới</option>
                    <option value="Bếp ăn công nghiệp">Bếp ăn công nghiệp</option>
                    <option value="Quà tết doanh nghiệp">Quà tết doanh nghiệp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giai đoạn Pipeline</label>
                  <select
                    value={leadStage}
                    onChange={(e) => setLeadStage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 bg-white font-semibold"
                  >
                    <option value="Tiếp cận">1. Tiếp cận</option>
                    <option value="Gửi mẫu thử nước mắm">2. Gửi mẫu thử nước mắm</option>
                    <option value="Báo giá chính sách">3. Báo giá chính sách</option>
                    <option value="Đàm phán hợp đồng">4. Đàm phán hợp đồng</option>
                    <option value="Ký kết thành công">5. Ký kết thành công</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nhu cầu ước tính (chai/tháng)</label>
                  <input
                    type="number"
                    min={10}
                    value={leadExpectedBottles}
                    onChange={(e) => setLeadExpectedBottles(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá trị ước tính (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000000}
                    value={leadEstimatedValue}
                    onChange={(e) => setLeadEstimatedValue(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-700 font-semibold">Nhân sự phụ trách *</label>
                  {onNavigateToStaff && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewLeadModal(false);
                        onNavigateToStaff();
                      }}
                      className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold underline cursor-pointer"
                    >
                      Quản lý đội ngũ nhân sự ↗
                    </button>
                  )}
                </div>
                {staff && staff.length > 0 ? (
                  <select
                    value={leadAssignedTo}
                    onChange={(e) => setLeadAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 bg-white font-medium"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={`${s.name} (${s.role})`}>
                        {s.name} - {s.role} ({s.region})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={leadAssignedTo}
                    onChange={(e) => setLeadAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Ghi chú tiến độ & đàm phán</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về nhu cầu, lịch hẹn gửi mẫu thử hoặc điều khoản thương mại..."
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Hồ sơ thấu cảm khách hàng</label>
                <textarea
                  rows={2}
                  placeholder="Ghi lại khẩu vị mong muốn, yêu cầu về độ đạm, chiết khấu hoặc hạn nợ..."
                  value={leadEmpathy}
                  onChange={(e) => setLeadEmpathy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Cơ Hội Mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Chỉnh Sửa Cơ Hội B2B</h3>
              </div>
              <button 
                onClick={() => setEditingLead(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên đối tác / Doanh nghiệp</label>
                <input
                  type="text"
                  required
                  value={editingLead.companyName}
                  onChange={(e) => setEditingLead({ ...editingLead, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Người liên hệ</label>
                  <input
                    type="text"
                    required
                    value={editingLead.contactPerson}
                    onChange={(e) => setEditingLead({ ...editingLead, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phân khúc đối tác</label>
                  <select
                    value={editingLead.type}
                    onChange={(e) => setEditingLead({ ...editingLead, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="Nhà hàng Chuỗi">Nhà hàng Chuỗi</option>
                    <option value="Đại lý mới">Đại lý mới</option>
                    <option value="Bếp ăn công nghiệp">Bếp ăn công nghiệp</option>
                    <option value="Quà tết doanh nghiệp">Quà tết doanh nghiệp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giai đoạn Pipeline</label>
                  <select
                    value={editingLead.stage}
                    onChange={(e) => setEditingLead({ ...editingLead, stage: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 bg-white font-semibold"
                  >
                    <option value="Tiếp cận">1. Tiếp cận</option>
                    <option value="Gửi mẫu thử nước mắm">2. Gửi mẫu thử nước mắm</option>
                    <option value="Báo giá chính sách">3. Báo giá chính sách</option>
                    <option value="Đàm phán hợp đồng">4. Đàm phán hợp đồng</option>
                    <option value="Ký kết thành công">5. Ký kết thành công</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nhân sự phụ trách</label>
                  {staff && staff.length > 0 ? (
                    <select
                      value={editingLead.assignedTo}
                      onChange={(e) => setEditingLead({ ...editingLead, assignedTo: e.target.value })}
                      className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600 bg-white text-xs"
                    >
                      {staff.map((s) => (
                        <option key={s.id} value={`${s.name} (${s.role})`}>
                          {s.name} - {s.role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editingLead.assignedTo}
                      onChange={(e) => setEditingLead({ ...editingLead, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nhu cầu (chai/tháng)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingLead.expectedMonthlyBottles}
                    onChange={(e) => setEditingLead({ ...editingLead, expectedMonthlyBottles: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá trị hợp đồng (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingLead.estimatedValue}
                    onChange={(e) => setEditingLead({ ...editingLead, estimatedValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Ghi chú tiến độ & đàm phán</label>
                <textarea
                  rows={2}
                  value={editingLead.notes}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Hồ sơ thấu cảm khách hàng</label>
                <textarea
                  rows={2}
                  value={editingLead.empathyProfile}
                  onChange={(e) => setEditingLead({ ...editingLead, empathyProfile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Cập Nhật Cơ Hội</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lead Modal */}
      {deletingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-rose-950">Xóa Cơ Hội / Lead</h3>
                <p className="text-xs text-rose-700">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-gray-700 space-y-1">
              <p>Doanh nghiệp: <strong className="text-amber-950 font-bold">{deletingLead.companyName}</strong></p>
              <p>Người liên hệ: {deletingLead.contactPerson} ({deletingLead.phone})</p>
              <p>Giá trị: <strong className="text-amber-900">{deletingLead.estimatedValue.toLocaleString('vi-VN')} đ</strong></p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingLead(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteLead}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Lead</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#261000] text-amber-50 px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
