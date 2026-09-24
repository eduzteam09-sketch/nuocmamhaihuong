import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  QrCode, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Building,
  Anchor,
  Clock,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Truck,
  Send,
  Store,
  FileText
} from 'lucide-react';
import { BatchLot, StoreNode, StaffMember, BatchDispatchRecord } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface BatchManagementProps {
  batches: BatchLot[];
  stores?: StoreNode[];
  staff?: StaffMember[];
  onAddBatch?: (batch: BatchLot) => void;
  onUpdateBatch?: (batch: BatchLot) => void;
  onDeleteBatch?: (id: string) => void;
  onUpdateStore?: (updated: StoreNode) => void;
}

export const BatchManagement: React.FC<BatchManagementProps> = ({ 
  batches: initialBatches,
  stores = [],
  staff = [],
  onAddBatch,
  onUpdateBatch,
  onDeleteBatch,
  onUpdateStore
}) => {
  const [batches, setBatches] = useState<BatchLot[]>(initialBatches);
  const [selectedBatch, setSelectedBatch] = useState<BatchLot>(batches[0] || initialBatches[0]);

  useEffect(() => {
    setBatches(initialBatches);
    if (selectedBatch) {
      const refreshed = initialBatches.find(b => b.id === selectedBatch.id);
      if (refreshed) setSelectedBatch(refreshed);
    }
  }, [initialBatches]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQrVerifier, setShowQrVerifier] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchLot | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<BatchLot | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchBatch, setDispatchBatch] = useState<BatchLot | null>(null);

  // Dispatch form state
  const [dispatchStoreId, setDispatchStoreId] = useState<string>('CUSTOM');
  const [dispatchCustomDest, setDispatchCustomDest] = useState('');
  const [dispatchQty, setDispatchQty] = useState(500);
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [dispatchStaff, setDispatchStaff] = useState('Trịnh Kim Chi (Quản Lý Kho Vận)');
  const [dispatchReceiverContact, setDispatchReceiverContact] = useState('');
  const [dispatchNotes, setDispatchNotes] = useState('');

  // New Batch form state
  const currentYear = new Date().getFullYear();
  const [newBatchCode, setNewBatchCode] = useState(`LOT-${currentYear}-PQ${Math.floor(10 + Math.random() * 90)}`);
  const [newFactory, setNewFactory] = useState('Nhà thùng Phú Quốc #01 (An Thới)');
  const [newBarrel, setNewBarrel] = useState(`Thùng gỗ bời lời #${Math.floor(10 + Math.random() * 50)}`);
  const [newFishOrigin, setNewFishOrigin] = useState('Cá cơm than đảo Thổ Chu - Đánh bắt vụ cá Bắc');
  const [newSaltOrigin, setNewSaltOrigin] = useState('Muối hạt Bà Rịa lưu kho khô ráo 12 tháng');
  const [newStartDate, setNewStartDate] = useState(`${currentYear - 2}-03-15`);
  const [newDuration, setNewDuration] = useState(18);
  const [newExtractionDate, setNewExtractionDate] = useState(`${currentYear}-09-15`);
  const [newBottlingDate, setNewBottlingDate] = useState(`${currentYear}-10-01`);
  const [newExpiryDate, setNewExpiryDate] = useState(`${currentYear + 2}-10-01`);
  const [newDegree, setNewDegree] = useState(42.5);
  const [newTotalBottles, setNewTotalBottles] = useState(5000);
  const [newDistributed, setNewDistributed] = useState(1200);
  const [newCert, setNewCert] = useState(`HACCP-PQ-${currentYear}-009`);
  const [newStatus, setNewStatus] = useState<BatchLot['status']>('Đang phân phối chuỗi');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredBatches = batches.filter(b => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.batchCode.toLowerCase().includes(q) ||
        b.barrelId.toLowerCase().includes(q) ||
        b.fishOrigin.toLowerCase().includes(q) ||
        b.qualityCertificateNo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleQuickStatusChange = (batch: BatchLot, newStat: BatchLot['status']) => {
    const updated = { ...batch, status: newStat };
    setBatches(prev => prev.map(b => b.id === batch.id ? updated : b));
    if (selectedBatch?.id === batch.id) setSelectedBatch(updated);
    if (onUpdateBatch) onUpdateBatch(updated);
    showToast(`Đã chuyển trạng thái lô [${batch.batchCode}] sang: ${newStat}`);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchCode.trim()) return;

    const newBatch: BatchLot = {
      id: `batch-${Date.now()}`,
      batchCode: newBatchCode.trim(),
      factoryName: newFactory.trim(),
      barrelId: newBarrel.trim(),
      fishOrigin: newFishOrigin.trim(),
      saltOrigin: newSaltOrigin.trim(),
      fermentationStartDate: newStartDate,
      fermentationDurationMonths: newDuration,
      extractionDate: newExtractionDate,
      bottlingDate: newBottlingDate,
      expiryDate: newExpiryDate,
      nitrogenDegreeTested: newDegree,
      totalBottlesProduced: newTotalBottles,
      distributedBottles: newDistributed,
      currentWarehouseBottles: Math.max(0, newTotalBottles - newDistributed),
      qualityCertificateNo: newCert.trim(),
      status: newStatus,
      traceChain: [
        {
          nodeType: 'Cảng cá & Tiếp nhận cá cơm than',
          nodeName: 'Cảng An Thới, Phú Quốc',
          date: newStartDate,
          quantity: newTotalBottles
        },
        {
          nodeType: 'Vào chượp thùng gỗ bời lời',
          nodeName: newBarrel.trim(),
          date: newStartDate,
          quantity: newTotalBottles
        },
        {
          nodeType: 'Rút nỏ cốt nhĩ & Đóng chai chiết rót',
          nodeName: newFactory.trim(),
          date: newBottlingDate,
          quantity: newTotalBottles
        },
        {
          nodeType: 'Phân phối tới tổng kho miền',
          nodeName: 'Kho Phân Phối TP.HCM & Hà Nội',
          date: newBottlingDate,
          quantity: newDistributed
        }
      ]
    };

    const nextList = [newBatch, ...batches];
    setBatches(nextList);
    setSelectedBatch(newBatch);
    if (onAddBatch) onAddBatch(newBatch);
    setShowAddModal(false);
    showToast(`Đã thêm mới thành công lô sản xuất: ${newBatch.batchCode}!`);
  };

  const handleSaveEditBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    const currentWarehouse = Math.max(0, editingBatch.totalBottlesProduced - editingBatch.distributedBottles);
    const updated = { ...editingBatch, currentWarehouseBottles: currentWarehouse };

    setBatches(prev => prev.map(b => b.id === updated.id ? updated : b));
    if (selectedBatch?.id === updated.id) setSelectedBatch(updated);
    if (onUpdateBatch) onUpdateBatch(updated);
    showToast(`Đã lưu cập nhật cho lô [${updated.batchCode}]!`);
    setEditingBatch(null);
  };

  const handleConfirmDeleteBatch = () => {
    if (!deletingBatch) return;
    const nextList = batches.filter(b => b.id !== deletingBatch.id);
    setBatches(nextList);
    if (selectedBatch?.id === deletingBatch.id) {
      setSelectedBatch(nextList[0] || null);
    }
    if (onDeleteBatch) onDeleteBatch(deletingBatch.id);
    showToast(`Đã xóa lô mẻ [${deletingBatch.batchCode}]!`);
    setDeletingBatch(null);
  };

  const handleOpenDispatch = (batch: BatchLot) => {
    setDispatchBatch(batch);
    const available = batch.currentWarehouseBottles || 0;
    setDispatchQty(Math.min(500, available > 0 ? available : 100));
    
    if (stores.length > 0) {
      setDispatchStoreId(stores[0].id);
      setDispatchReceiverContact(`${stores[0].contactPerson} (${stores[0].phone})`);
    } else {
      setDispatchStoreId('CUSTOM');
      setDispatchReceiverContact('');
    }
    setDispatchCustomDest('');
    setDispatchNotes('Xuất bổ sung quầy kệ theo lịch nhập hàng định kỳ');
    
    const warehouseStaff = staff.find(s => s.role === 'Quản Lý Kho Vận') || staff[0];
    if (warehouseStaff) {
      setDispatchStaff(`${warehouseStaff.name} (${warehouseStaff.role})`);
    }
    setShowDispatchModal(true);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchBatch) return;

    if (dispatchQty <= 0) {
      showToast('Số lượng xuất kho phải lớn hơn 0!');
      return;
    }

    if (dispatchQty > dispatchBatch.currentWarehouseBottles) {
      showToast(`Không thể xuất quá số chai còn tồn kho (${dispatchBatch.currentWarehouseBottles.toLocaleString()} chai)!`);
      return;
    }

    const targetStore = stores.find(s => s.id === dispatchStoreId);
    const destName = dispatchStoreId === 'CUSTOM'
      ? (dispatchCustomDest.trim() || 'Đối tác phân phối B2B')
      : (targetStore?.name || 'Điểm bán chuỗi');

    const destType: BatchDispatchRecord['destinationType'] = targetStore 
      ? (targetStore.type === 'NHA_MAY' ? 'KHO_TONG' : targetStore.type) 
      : (destName.toLowerCase().includes('npp') ? 'NPP' : destName.toLowerCase().includes('kho') ? 'KHO_TONG' : 'CUA_HANG');

    const newDispatch: BatchDispatchRecord = {
      id: `disp-${Date.now()}`,
      dispatchCode: `XK-${dispatchBatch.batchCode.replace('LOT-', '')}-${Math.floor(10 + Math.random() * 90)}`,
      date: dispatchDate,
      destinationStoreId: dispatchStoreId !== 'CUSTOM' ? dispatchStoreId : undefined,
      destinationName: destName,
      destinationType: destType,
      quantityBottles: dispatchQty,
      receiverContact: dispatchReceiverContact.trim() || targetStore?.phone || '',
      dispatchedBy: dispatchStaff,
      notes: dispatchNotes.trim()
    };

    const currentDispatches = dispatchBatch.dispatches || [];
    const updatedDispatches = [newDispatch, ...currentDispatches];
    const newDistributed = updatedDispatches.reduce((sum, d) => sum + d.quantityBottles, 0);
    const newWarehouseBottles = Math.max(0, dispatchBatch.totalBottlesProduced - newDistributed);

    const updatedTrace = [
      ...dispatchBatch.traceChain,
      {
        nodeType: targetStore ? (targetStore.type === 'CUA_HANG' ? 'Cửa Hàng Chuỗi' : targetStore.type === 'NPP' ? 'Nhà Phân Phối' : 'Đại Lý') : 'Điểm Bán / Đối Tác',
        nodeName: destName,
        date: dispatchDate,
        quantity: dispatchQty
      }
    ];

    const updatedBatch: BatchLot = {
      ...dispatchBatch,
      dispatches: updatedDispatches,
      distributedBottles: newDistributed,
      currentWarehouseBottles: newWarehouseBottles,
      traceChain: updatedTrace
    };

    setBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
    if (selectedBatch?.id === updatedBatch.id) {
      setSelectedBatch(updatedBatch);
    }
    if (onUpdateBatch) onUpdateBatch(updatedBatch);

    // If destination was a store in our chain, increase its stock and update restock day!
    if (targetStore && onUpdateStore) {
      const updatedStore: StoreNode = {
        ...targetStore,
        totalStockBottles: targetStore.totalStockBottles + dispatchQty,
        daysSinceLastRestock: 0,
        stockStatus: 'Đầy đủ'
      };
      onUpdateStore(updatedStore);
    }

    setShowDispatchModal(false);
    showToast(`Đã xuất ${dispatchQty.toLocaleString()} chai cho [${destName}]. Tồn kho đã được đồng bộ chuẩn xác!`);
  };

  return (
    <div id="batch-management-view" className="space-y-6 pb-12">
      {/* Header Banner with Mascot Artisan */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4 text-amber-400" />
            <span>BATCH 360 & TRACEABILITY - MINH BẠCH NGUỒN GỐC Ủ CHƯỢP</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Quản Lý Lô Sản Xuất & Mẻ Thùng Gỗ
          </h2>
          <p className="text-amber-200/80 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
            Truy xuất hành trình từng giọt nước mắm: từ con cá cơm than tươi, hạt muối lưu kho, thùng ủ gỗ bời lời cho tới bàn ăn người tiêu dùng.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowQrVerifier(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>Mô Phỏng Quét Mã QR Truy Xuất Nguồn Gốc</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-700/80 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-amber-500/40 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Lô Mẻ Mới</span>
            </button>
          </div>
        </div>

        {/* Mascot Artisan in Header */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-amber-500/30 shrink-0 self-start md:self-auto">
          <div className="w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
            <HuongGiotBienMascot pose="standing" size="lg" speechBubble="Ủ 18 tháng!" />
          </div>
          <div className="text-left pr-2">
            <div className="text-xs font-bold text-amber-300 font-serif">Giám Sát Ủ Chượp</div>
            <div className="text-[11px] text-amber-100/90 leading-tight mt-0.5 max-w-[170px]">
              "Hương Giọt Biển cam kết tỉ lệ vàng 3 Cá Cơm : 1 Muối tinh khiết"
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Batch List & Right Batch 360 Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-sm text-amber-950">Lô Mẻ Đang Lưu Hành ({filteredBatches.length})</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Lô</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã lô (LOT), số thùng chượp, chứng nhận..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Batch items */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredBatches.map((b) => {
                const isSelected = selectedBatch?.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBatch(b)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs' 
                        : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-amber-950">{b.batchCode}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-700 text-white">
                            {b.nitrogenDegreeTested}°N Thực tế
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-1 font-medium">{b.barrelId}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                        b.status === 'Sắp hết hạn' ? 'bg-rose-100 text-rose-800' :
                        b.status === 'Lưu kho đối chứng' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs flex justify-between text-gray-500 border-t border-gray-100 pt-2">
                      <span>Ủ: <strong>{b.fermentationDurationMonths} tháng</strong></span>
                      <span>Đã xuất: <strong>{b.distributedBottles.toLocaleString()} / {b.totalBottlesProduced.toLocaleString()} chai</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Detail: Batch 360 Full Traceability (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedBatch ? (
            <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-5">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold font-mono">
                      MÃ LÔ: {selectedBatch.batchCode}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{selectedBatch.qualityCertificateNo}</span>
                    </span>

                    {/* Quick status dropdown */}
                    <div className="flex items-center gap-1.5 ml-1">
                      <span className="text-[11px] text-gray-500">Trạng thái:</span>
                      <select
                        value={selectedBatch.status}
                        onChange={(e) => handleQuickStatusChange(selectedBatch, e.target.value as any)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-colors cursor-pointer ${
                          selectedBatch.status === 'Sắp hết hạn' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          selectedBatch.status === 'Lưu kho đối chứng' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          selectedBatch.status === 'Đang phân phối chuỗi' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                          'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="Đã kiểm định ISO/HACCP">Đã kiểm định ISO/HACCP</option>
                        <option value="Đang phân phối chuỗi">Đang phân phối chuỗi</option>
                        <option value="Sắp hết hạn">Sắp hết hạn</option>
                        <option value="Lưu kho đối chứng">Lưu kho đối chứng</option>
                      </select>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-amber-950 mt-1">
                    {selectedBatch.barrelId}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {selectedBatch.factoryName}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col gap-3 shrink-0">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center w-full">
                    <div className="text-[10px] uppercase font-bold text-amber-800">Kiểm Nghiệm Đạm</div>
                    <div className="text-2xl font-serif font-bold text-amber-950 mt-0.5">
                      {selectedBatch.nitrogenDegreeTested}°N
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold">Chuẩn mắm nhĩ tự nhiên</div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenDispatch(selectedBatch)}
                      className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-bold shadow-md shadow-amber-900/10 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Xuất Kho Lô Này</span>
                    </button>
                    <button
                      type="button"
                      title="Chỉnh sửa thông tin lô mẻ"
                      onClick={() => setEditingBatch({ ...selectedBatch })}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Xóa lô mẻ"
                      onClick={() => setDeletingBatch(selectedBatch)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Raw Materials & Fermentation Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-amber-700" />
                    <span>Nguồn Gốc Cá Cơm & Muối Tinh</span>
                  </div>
                  <div className="text-gray-600">
                    <strong>Cá cơm:</strong> {selectedBatch.fishOrigin}
                  </div>
                  <div className="text-gray-600">
                    <strong>Muối ủ:</strong> {selectedBatch.saltOrigin}
                  </div>
                  <div className="text-gray-600 pt-1 border-t border-gray-200/60 flex justify-between">
                    <span>Tổng chai sản xuất:</span>
                    <strong className="text-amber-950 font-bold">{selectedBatch.totalBottlesProduced.toLocaleString()} chai</strong>
                  </div>
                  <div className="text-gray-600 flex justify-between">
                    <span>Đã phân phối chuỗi:</span>
                    <strong className="text-blue-900 font-bold">{selectedBatch.distributedBottles.toLocaleString()} chai</strong>
                  </div>
                  <div className="text-gray-600 flex justify-between">
                    <span>Còn tồn kho:</span>
                    <strong className="text-emerald-800 font-bold">{selectedBatch.currentWarehouseBottles.toLocaleString()} chai</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Thời Gian Ủ Chượp & Đóng Chai</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ngày vào chượp:</span>
                    <strong className="text-gray-900">{selectedBatch.fermentationStartDate}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thời gian ủ gài nén:</span>
                    <strong className="text-amber-900">{selectedBatch.fermentationDurationMonths} Tháng</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ngày rút cốt nhĩ:</span>
                    <strong className="text-gray-900">{selectedBatch.extractionDate}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ngày đóng chai:</span>
                    <strong className="text-gray-900">{selectedBatch.bottlingDate}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-200/60">
                    <span>Hạn sử dụng (HSD):</span>
                    <strong className="text-emerald-800 font-bold">{selectedBatch.expiryDate}</strong>
                  </div>
                </div>
              </div>

              {/* Traceability Flow Steps (Section IX in doc) */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>Chuỗi Hành Trình Phân Phối (Traceability Flow)</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {selectedBatch.traceChain.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-amber-950">{step.nodeName}</div>
                          <span className="text-[11px] text-gray-500">{step.nodeType}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-amber-900">{step.quantity.toLocaleString()} Chai</div>
                        <span className="text-[11px] text-gray-400">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Dispatches History: Xuất cho ai & bao nhiêu chai */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-700" />
                      <span>Nhật Ký Xuất Kho & Đối Tác Tiếp Nhận Lô Này</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Minh bạch chi tiết: Xuất đi bao nhiêu chai, xuất cho ai, ngày xuất và nhân sự lập phiếu
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenDispatch(selectedBatch)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Phiếu Xuất Kho Tiếp</span>
                  </button>
                </div>

                {selectedBatch.dispatches && selectedBatch.dispatches.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBatch.dispatches.map((disp) => {
                      const pct = Math.round((disp.quantityBottles / selectedBatch.totalBottlesProduced) * 100);
                      return (
                        <div
                          key={disp.id}
                          className="p-3.5 rounded-xl border border-gray-200/80 bg-white hover:border-amber-300 transition-colors space-y-2 shadow-2xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
                                {disp.dispatchCode}
                              </span>
                              <span className="font-bold text-xs text-amber-950">
                                {disp.destinationName}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                disp.destinationType === 'CUA_HANG' ? 'bg-amber-100 text-amber-900' :
                                disp.destinationType === 'NPP' ? 'bg-purple-100 text-purple-900' :
                                disp.destinationType === 'KHO_TONG' ? 'bg-blue-100 text-blue-900' :
                                'bg-emerald-100 text-emerald-900'
                              }`}>
                                {disp.destinationType === 'CUA_HANG' ? 'Cửa Hàng Chuỗi' :
                                 disp.destinationType === 'NPP' ? 'Nhà Phân Phối' :
                                 disp.destinationType === 'KHO_TONG' ? 'Tổng Kho' : 'Đại Lý'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-bold text-amber-900 text-sm">
                                {disp.quantityBottles.toLocaleString()} Chai
                              </span>
                              <span className="text-[11px] text-gray-400">({pct}% mẻ)</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100 gap-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <span>Ngày xuất: <strong className="text-gray-700">{disp.date}</strong></span>
                              <span>Người lập phiếu: <strong className="text-amber-900">{disp.dispatchedBy}</strong></span>
                              {disp.receiverContact && (
                                <span>Liên hệ nhận: <span className="text-gray-700">{disp.receiverContact}</span></span>
                              )}
                            </div>
                            {disp.notes && (
                              <span className="italic text-gray-600 bg-gray-50 px-2 py-0.5 rounded">"{disp.notes}"</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-center text-xs text-gray-500">
                    Lô hàng mới đóng chai, chưa có phiếu xuất kho nào. Nhấn <strong>"Tạo Phiếu Xuất Kho Tiếp"</strong> để phân phối hàng cho điểm bán.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400">
              Chọn lô mẻ để xem chi tiết Batch 360
            </div>
          )}
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Thêm Mẻ / Lô Sản Xuất Mới</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã Lô (Lot code) *</label>
                  <input
                    type="text"
                    required
                    value={newBatchCode}
                    onChange={(e) => setNewBatchCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trạng thái lô mẻ</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-semibold"
                  >
                    <option value="Đã kiểm định ISO/HACCP">Đã kiểm định ISO/HACCP</option>
                    <option value="Đang phân phối chuỗi">Đang phân phối chuỗi</option>
                    <option value="Sắp hết hạn">Sắp hết hạn</option>
                    <option value="Lưu kho đối chứng">Lưu kho đối chứng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tên nhà thùng / Phân xưởng *</label>
                  <input
                    type="text"
                    required
                    value={newFactory}
                    onChange={(e) => setNewFactory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Thùng gỗ ủ chượp *</label>
                  <input
                    type="text"
                    required
                    value={newBarrel}
                    onChange={(e) => setNewBarrel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nguồn gốc cá cơm than</label>
                  <input
                    type="text"
                    value={newFishOrigin}
                    onChange={(e) => setNewFishOrigin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nguồn gốc muối ủ</label>
                  <input
                    type="text"
                    value={newSaltOrigin}
                    onChange={(e) => setNewSaltOrigin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày vào chượp</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Thời gian ủ (tháng)</label>
                  <input
                    type="number"
                    min={6}
                    max={36}
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 12)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Độ đạm test (°N)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={20}
                    max={70}
                    value={newDegree}
                    onChange={(e) => setNewDegree(parseFloat(e.target.value) || 40)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold text-amber-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày rút cốt nhĩ</label>
                  <input
                    type="date"
                    value={newExtractionDate}
                    onChange={(e) => setNewExtractionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày đóng chai</label>
                  <input
                    type="date"
                    value={newBottlingDate}
                    onChange={(e) => setNewBottlingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Hạn sử dụng</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tổng sản lượng (chai)</label>
                  <input
                    type="number"
                    min={100}
                    value={newTotalBottles}
                    onChange={(e) => setNewTotalBottles(parseInt(e.target.value) || 1000)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Đã phân phối chuỗi (chai)</label>
                  <input
                    type="number"
                    min={0}
                    value={newDistributed}
                    onChange={(e) => setNewDistributed(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Số chứng nhận an toàn / Kiểm định</label>
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono"
                />
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
                  <span>Lưu Lô Mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Chỉnh Sửa Lô Mẻ: {editingBatch.batchCode}</h3>
              </div>
              <button 
                onClick={() => setEditingBatch(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBatch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã Lô *</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.batchCode}
                    onChange={(e) => setEditingBatch({ ...editingBatch, batchCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trạng thái lô</label>
                  <select
                    value={editingBatch.status}
                    onChange={(e) => setEditingBatch({ ...editingBatch, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-semibold"
                  >
                    <option value="Đã kiểm định ISO/HACCP">Đã kiểm định ISO/HACCP</option>
                    <option value="Đang phân phối chuỗi">Đang phân phối chuỗi</option>
                    <option value="Sắp hết hạn">Sắp hết hạn</option>
                    <option value="Lưu kho đối chứng">Lưu kho đối chứng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tên nhà thùng / Phân xưởng *</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.factoryName}
                    onChange={(e) => setEditingBatch({ ...editingBatch, factoryName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Thùng gỗ ủ chượp *</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.barrelId}
                    onChange={(e) => setEditingBatch({ ...editingBatch, barrelId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nguồn gốc cá cơm than</label>
                  <input
                    type="text"
                    value={editingBatch.fishOrigin}
                    onChange={(e) => setEditingBatch({ ...editingBatch, fishOrigin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nguồn gốc muối ủ</label>
                  <input
                    type="text"
                    value={editingBatch.saltOrigin}
                    onChange={(e) => setEditingBatch({ ...editingBatch, saltOrigin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày vào chượp</label>
                  <input
                    type="date"
                    value={editingBatch.fermentationStartDate}
                    onChange={(e) => setEditingBatch({ ...editingBatch, fermentationStartDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Thời gian ủ (tháng)</label>
                  <input
                    type="number"
                    min={6}
                    max={36}
                    value={editingBatch.fermentationDurationMonths}
                    onChange={(e) => setEditingBatch({ ...editingBatch, fermentationDurationMonths: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Độ đạm test (°N)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={20}
                    max={70}
                    value={editingBatch.nitrogenDegreeTested}
                    onChange={(e) => setEditingBatch({ ...editingBatch, nitrogenDegreeTested: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold text-amber-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày rút cốt nhĩ</label>
                  <input
                    type="date"
                    value={editingBatch.extractionDate}
                    onChange={(e) => setEditingBatch({ ...editingBatch, extractionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày đóng chai</label>
                  <input
                    type="date"
                    value={editingBatch.bottlingDate}
                    onChange={(e) => setEditingBatch({ ...editingBatch, bottlingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Hạn sử dụng</label>
                  <input
                    type="date"
                    value={editingBatch.expiryDate}
                    onChange={(e) => setEditingBatch({ ...editingBatch, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tổng sản xuất (chai)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingBatch.totalBottlesProduced}
                    onChange={(e) => setEditingBatch({ ...editingBatch, totalBottlesProduced: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Đã phân phối chuỗi (chai)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingBatch.distributedBottles}
                    onChange={(e) => setEditingBatch({ ...editingBatch, distributedBottles: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Số chứng nhận kiểm nghiệm</label>
                <input
                  type="text"
                  value={editingBatch.qualityCertificateNo}
                  onChange={(e) => setEditingBatch({ ...editingBatch, qualityCertificateNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Cập Nhật Lô Mẻ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Batch Confirmation Modal */}
      {deletingBatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-rose-950">Xóa Lô Sản Xuất</h3>
                <p className="text-xs text-rose-700">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-gray-700 space-y-1">
              <p>Mã Lô: <strong className="text-amber-950 font-mono">{deletingBatch.batchCode}</strong></p>
              <p>Thùng gỗ: <strong className="text-amber-950">{deletingBatch.barrelId}</strong></p>
              <p>Sản lượng: {deletingBatch.totalBottlesProduced.toLocaleString()} chai</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingBatch(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBatch}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Lô</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lập Phiếu Xuất Kho Phân Phối */}
      {showDispatchModal && dispatchBatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-amber-950">Lập Phiếu Xuất Kho Phân Phối</h3>
                  <p className="text-[11px] text-gray-500 font-mono">Lô hàng: {dispatchBatch.batchCode}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inventory status pill */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-gray-600">Tồn kho lô mẻ tại nhà thùng:</span>
                <div className="text-sm font-bold text-emerald-800">
                  {dispatchBatch.currentWarehouseBottles.toLocaleString()} Chai sẵn sàng xuất
                </div>
              </div>
              <div className="text-right text-[11px] text-gray-500">
                <span>Tổng mẻ: {dispatchBatch.totalBottlesProduced.toLocaleString()} chai</span>
                <div>Đã xuất: {dispatchBatch.distributedBottles.toLocaleString()} chai</div>
              </div>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3.5 text-xs">
              {/* Chọn điểm tiếp nhận */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Đơn vị / Điểm bán tiếp nhận hàng *
                </label>
                <select
                  value={dispatchStoreId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDispatchStoreId(val);
                    if (val !== 'CUSTOM') {
                      const st = stores.find(s => s.id === val);
                      if (st) {
                        setDispatchReceiverContact(`${st.contactPerson} (${st.phone})`);
                      }
                    } else {
                      setDispatchReceiverContact('');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                >
                  <optgroup label="Hệ Thống Điểm Bán & NPP Chuỗi">
                    {stores.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.type === 'CUA_HANG' ? 'Cửa Hàng' : st.type === 'NPP' ? 'NPP' : 'Đại Lý'}) - Tồn hiện tại: {st.totalStockBottles.toLocaleString()} chai
                      </option>
                    ))}
                  </optgroup>
                  <option value="CUSTOM">Khác (Nhập tên đối tác / nhà phân phối bên ngoài)</option>
                </select>
              </div>

              {dispatchStoreId === 'CUSTOM' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tên đơn vị tiếp nhận bên ngoài *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đại Lý Tân Bình, Khách sạn Mường Thanh..."
                    value={dispatchCustomDest}
                    onChange={(e) => setDispatchCustomDest(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Số lượng chai xuất kho *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={dispatchBatch.currentWarehouseBottles}
                    value={dispatchQty}
                    onChange={(e) => setDispatchQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold text-amber-900"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Tối đa: {dispatchBatch.currentWarehouseBottles.toLocaleString()} chai
                  </span>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày xuất kho</label>
                  <input
                    type="date"
                    required
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nhân sự phụ trách xuất kho</label>
                  <select
                    value={dispatchStaff}
                    onChange={(e) => setDispatchStaff(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    {staff.length > 0 ? (
                      staff.map(s => (
                        <option key={s.id} value={`${s.name} (${s.role})`}>
                          {s.name} ({s.role})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Trịnh Kim Chi (Quản Lý Kho Vận)">Trịnh Kim Chi (Quản Lý Kho Vận)</option>
                        <option value="Phan Quốc Đạt (Sales Horeca)">Phan Quốc Đạt (Sales Horeca)</option>
                        <option value="Hoàng Hải Đăng (Sales Chuỗi)">Hoàng Hải Đăng (Sales Chuỗi)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Người nhận & SĐT</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A - 090..."
                    value={dispatchReceiverContact}
                    onChange={(e) => setDispatchReceiverContact(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Ghi chú điều chuyển & vận tải</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về xe chở, tuyến đường, kiện hàng..."
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                />
              </div>

              {/* Real-time Math Summary Card */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                <div className="font-bold text-gray-700 mb-1">Kiểm tra cân đối tồn kho tự động:</div>
                <div className="flex justify-between text-gray-600">
                  <span>Tồn kho mẻ trước xuất:</span>
                  <span className="font-mono">{dispatchBatch.currentWarehouseBottles.toLocaleString()} chai</span>
                </div>
                <div className="flex justify-between text-amber-800 font-semibold">
                  <span>Số chai xuất đợt này:</span>
                  <span className="font-mono">- {dispatchQty.toLocaleString()} chai</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold pt-1 border-t border-gray-200">
                  <span>Tồn kho mẻ sau xuất:</span>
                  <span className="font-mono">
                    {Math.max(0, dispatchBatch.currentWarehouseBottles - dispatchQty).toLocaleString()} chai
                  </span>
                </div>
                {dispatchStoreId !== 'CUSTOM' && (
                  <div className="text-[11px] text-blue-700 mt-1 pt-1 border-t border-gray-200">
                    * Tồn kho của điểm bán tiếp nhận sẽ được tự động cộng thêm <strong>{dispatchQty.toLocaleString()} chai</strong> và cập nhật lần nhập mới nhất.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Xác Nhận Xuất Kho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Traceability Simulator Modal */}
      {showQrVerifier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4 text-center">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowQrVerifier(false)}
                className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
              <QrCode className="w-9 h-9 text-amber-800" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">MÃ QR TRUY XUẤT CHÍNH HÃNG</span>
              <h3 className="font-serif text-xl font-bold text-amber-950 mt-1">
                Chứng Thư Nước Mắm Truyền Thống
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Dành cho người tiêu dùng quét bằng điện thoại trên thân chai nước mắm.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã lô sản xuất:</span>
                <strong className="font-mono text-amber-950">{selectedBatch.batchCode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thùng gỗ ủ:</span>
                <strong className="text-amber-950">{selectedBatch.barrelId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian ủ gài nén:</span>
                <strong className="text-amber-950">{selectedBatch.fermentationDurationMonths} tháng</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Độ đạm kiểm nghiệm:</span>
                <strong className="text-emerald-700 font-bold">{selectedBatch.nitrogenDegreeTested}°N Cốt Nhĩ</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hạn sử dụng:</span>
                <strong className="text-gray-900">{selectedBatch.expiryDate}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center justify-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sản phẩm chính hãng - Không hương liệu hóa học</span>
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
