import React, { useState } from 'react';
import { 
  Package, 
  Award, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Droplet, 
  CheckCircle2, 
  Search,
  Sparkles,
  ShoppingBag,
  Layers,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import { ProductSKU } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface ProductManagementProps {
  products: ProductSKU[];
  onAddProduct?: (product: ProductSKU) => void;
  onUpdateProduct?: (product: ProductSKU) => void;
  onDeleteProduct?: (id: string) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ 
  products: initialProducts,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct 
}) => {
  const [products, setProducts] = useState<ProductSKU[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductSKU>(products[0] || initialProducts[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLine, setFilterLine] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductSKU | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductSKU | null>(null);

  // New Product form state
  const [newSku, setNewSku] = useState(`NM-CN${Math.floor(30 + Math.random() * 30)}-500`);
  const [newName, setNewName] = useState('');
  const [newLine, setNewLine] = useState<ProductSKU['productLine']>('Dòng Truyền Thống Cốt Nhĩ');
  const [newDegree, setNewDegree] = useState(40);
  const [newCapacity, setNewCapacity] = useState('500ml');
  const [newSpec, setNewSpec] = useState('Thùng 6 chai thủy tinh');
  const [newPriceRetail, setNewPriceRetail] = useState(125000);
  const [newPriceAgency, setNewPriceAgency] = useState(98000);
  const [newPriceNPP, setNewPriceNPP] = useState(82000);
  const [newCostPrice, setNewCostPrice] = useState(48000);
  const [newStatus, setNewStatus] = useState<ProductSKU['status']>('Đang kinh doanh');
  const [newMonthlySales, setNewMonthlySales] = useState(120);
  const [newIngredients, setNewIngredients] = useState('100% Cá cơm than Phú Quốc tươi, muối hạt Bà Rịa');
  const [newDescription, setNewDescription] = useState('Nước mắm truyền thống cốt nhĩ nguyên chất hảo hạng.');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredProducts = products.filter(p => {
    if (filterLine !== 'ALL' && p.productLine !== filterLine) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleQuickStatusChange = (prod: ProductSKU, newStatus: ProductSKU['status']) => {
    const updated = { ...prod, status: newStatus };
    setProducts(prev => prev.map(p => p.id === prod.id ? updated : p));
    if (selectedProduct?.id === prod.id) setSelectedProduct(updated);
    if (onUpdateProduct) onUpdateProduct(updated);
    showToast(`Đã đổi trạng thái của [${prod.name}] sang: ${newStatus}`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const marginPct = Math.round(((newPriceRetail - newCostPrice) / newPriceRetail) * 100);
    const newProd: ProductSKU = {
      id: `prod-${Date.now()}`,
      sku: newSku.trim(),
      name: newName.trim(),
      productLine: newLine,
      nitrogenDegree: newDegree,
      capacity: newCapacity,
      packagingSpec: newSpec,
      priceRetail: newPriceRetail,
      priceAgency: newPriceAgency,
      priceNPP: newPriceNPP,
      costPrice: newCostPrice,
      marginPct,
      monthlySalesBottles: newMonthlySales,
      status: newStatus,
      bestPairsWith: ['Bún chả Hà Nội', 'Chấm thịt luộc', 'Cá chiên giòn'],
      description: newDescription.trim(),
      ingredients: newIngredients.trim()
    };

    const nextList = [newProd, ...products];
    setProducts(nextList);
    setSelectedProduct(newProd);
    if (onAddProduct) onAddProduct(newProd);
    setShowAddModal(false);
    setNewName('');
    showToast(`Đã thêm mới thành công sản phẩm: ${newProd.name}!`);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const marginPct = Math.round(((editingProduct.priceRetail - editingProduct.costPrice) / editingProduct.priceRetail) * 100);
    const updated = { ...editingProduct, marginPct };

    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (selectedProduct?.id === updated.id) setSelectedProduct(updated);
    if (onUpdateProduct) onUpdateProduct(updated);
    showToast(`Đã cập nhật sản phẩm [${updated.name}]!`);
    setEditingProduct(null);
  };

  const handleConfirmDeleteProduct = () => {
    if (!deletingProduct) return;
    const nextList = products.filter(p => p.id !== deletingProduct.id);
    setProducts(nextList);
    if (selectedProduct?.id === deletingProduct.id) {
      setSelectedProduct(nextList[0] || null);
    }
    if (onDeleteProduct) onDeleteProduct(deletingProduct.id);
    showToast(`Đã xóa sản phẩm [${deletingProduct.name}]!`);
    setDeletingProduct(null);
  };

  return (
    <div id="product-management-view" className="space-y-6 pb-12">
      {/* Header Banner with Mascot Ambassador */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>PRODUCT 360 - ĐỘ ĐẠM NGUYÊN CHẤT & BẢNG GIÁ 3 CẤP</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Danh Mục Sản Phẩm & Dữ Liệu Kinh Doanh
          </h2>
          <p className="text-amber-200/80 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
            Quản lý từng dòng sản phẩm nước mắm truyền thống, độ đạm tự nhiên từ 30°N đến 60°N và chính sách giá theo từng tầng phân phối.
          </p>
        </div>

        {/* Mascot Ambassador badge in header */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-amber-500/30 shrink-0 self-start md:self-auto">
          <div className="w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
            <HuongGiotBienMascot pose="standing" size="lg" speechBubble="Cốt Nhĩ 60°N!" />
          </div>
          <div className="text-left pr-2">
            <div className="text-xs font-bold text-amber-300 font-serif">Hương Giọt Biển</div>
            <div className="text-[11px] text-amber-100/90 leading-tight mt-0.5 max-w-[160px]">
              "4 Dòng đạm chuẩn vị nguyên chất từ cá cơm than Phú Quốc"
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Products List & Right Product 360 Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-sm text-amber-950">Dải Sản Phẩm ({filteredProducts.length})</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Sản Phẩm</span>
              </button>
            </div>

            {/* Filter by Product Line */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Lọc theo dòng:</span>
              <select
                value={filterLine}
                onChange={(e) => setFilterLine(e.target.value)}
                className="text-xs px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 font-medium"
              >
                <option value="ALL">Tất cả các dòng</option>
                <option value="Dòng Truyền Thống Cốt Nhĩ">Cốt Nhĩ Truyền Thống</option>
                <option value="Dòng Thượng Hạng Đặc Biệt">Thượng Hạng</option>
                <option value="Dòng Gia Đình Tiết Kiệm">Gia Đình Tiết Kiệm</option>
                <option value="Dòng Bếp Chuyên Nghiệp (Horeca)">Bếp Horeca Can</option>
                <option value="Bộ Quà Tặng Lễ Tết">Bộ Quà Tặng</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã SKU hoặc tên nước mắm..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Product List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs' 
                        : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-amber-950">{p.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-600 text-white">
                            {p.nitrogenDegree}°N
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">[{p.sku}] • {p.capacity}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-xs text-amber-900 block">
                          {p.priceRetail.toLocaleString('vi-VN')} đ
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold inline-block mt-0.5 ${
                          p.status === 'Cháy hàng' ? 'bg-rose-100 text-rose-800' :
                          p.status === 'Mới ra mắt' ? 'bg-purple-100 text-purple-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] flex justify-between text-gray-600 border-t border-gray-100 pt-2">
                      <span>Sản lượng: <strong className="text-amber-950">{p.monthlySalesBottles.toLocaleString()} chai/tháng</strong></span>
                      <span>Biên lợi nhuận: <strong className="text-emerald-700 font-bold">{p.marginPct}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: PRODUCT 360 PROFILE (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedProduct ? (
            <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-xs space-y-5">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {selectedProduct.productLine}
                    </span>
                    <span className="text-xs font-mono text-gray-500">SKU: {selectedProduct.sku}</span>

                    {/* Quick status dropdown */}
                    <div className="flex items-center gap-1.5 ml-1">
                      <span className="text-[11px] text-gray-500">Trạng thái:</span>
                      <select
                        value={selectedProduct.status}
                        onChange={(e) => handleQuickStatusChange(selectedProduct, e.target.value as any)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-colors cursor-pointer ${
                          selectedProduct.status === 'Cháy hàng' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          selectedProduct.status === 'Mới ra mắt' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                          selectedProduct.status === 'Đặt trước' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="Đang kinh doanh">Đang kinh doanh</option>
                        <option value="Cháy hàng">Cháy hàng</option>
                        <option value="Mới ra mắt">Mới ra mắt</option>
                        <option value="Đặt trước">Đặt trước</option>
                      </select>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-amber-950 mt-1">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col gap-3 shrink-0">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center w-full">
                    <div className="text-[10px] uppercase font-bold text-amber-800">Độ Đạm Tự Nhiên</div>
                    <div className="text-2xl font-serif font-bold text-amber-950 mt-0.5">
                      {selectedProduct.nitrogenDegree}°N
                    </div>
                    <div className="text-[10px] text-gray-500">Cá cơm than ủ chượp</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Chỉnh sửa sản phẩm"
                      onClick={() => setEditingProduct({ ...selectedProduct })}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Xóa sản phẩm"
                      onClick={() => setDeletingProduct(selectedProduct)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Tier Pricing Table (3 Cấp Giá) */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Chính Sách Giá 3 Cấp & Biên Lợi Nhuận</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                    <div className="text-gray-500 text-[11px]">Bán Lẻ Niêm Yết</div>
                    <div className="font-serif font-bold text-base text-amber-950 mt-1">
                      {selectedProduct.priceRetail.toLocaleString('vi-VN')} đ
                    </div>
                    <div className="text-[10px] text-amber-700 mt-0.5">Khách tiêu dùng</div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                    <div className="text-gray-500 text-[11px]">Giá Đại Lý Cấp 1</div>
                    <div className="font-serif font-bold text-base text-blue-950 mt-1">
                      {selectedProduct.priceAgency.toLocaleString('vi-VN')} đ
                    </div>
                    <div className="text-[10px] text-blue-700 mt-0.5">Chiết khấu ~22%</div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200">
                    <div className="text-gray-500 text-[11px]">Giá NPP Vùng</div>
                    <div className="font-serif font-bold text-base text-purple-950 mt-1">
                      {selectedProduct.priceNPP.toLocaleString('vi-VN')} đ
                    </div>
                    <div className="text-[10px] text-purple-700 mt-0.5">Chiết khấu ~34%</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <div className="text-gray-500 text-[11px]">Biên Lợi Nhuận</div>
                    <div className="font-serif font-bold text-base text-emerald-800 mt-1">
                      {selectedProduct.marginPct}%
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">Giá vốn: {selectedProduct.costPrice.toLocaleString('vi-VN')} đ</div>
                  </div>
                </div>
              </div>

              {/* Physical Specifications & Pairings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2.5">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>Quy Cách & Thành Phần:</span>
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between border-b border-gray-200/60 pb-1">
                      <span>Dung tích:</span>
                      <strong className="text-gray-900">{selectedProduct.capacity}</strong>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 pb-1">
                      <span>Quy cách đóng thùng:</span>
                      <strong className="text-gray-900">{selectedProduct.packagingSpec}</strong>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span>Thành phần nguyên liệu:</span>
                      <span className="text-gray-800 text-right max-w-[200px] truncate">{selectedProduct.ingredients}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-300/60 bg-gradient-to-r from-amber-50 to-orange-50/40 space-y-2 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 shrink-0">
                      <HuongGiotBienMascot pose="avatar" size="sm" />
                    </div>
                    <div>
                      <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Hương Giọt Biển Khuyên Dùng:</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11px] sm:text-xs">
                    Sản phẩm phát huy trọn vẹn hương vị khi kết hợp với:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedProduct.bestPairsWith.map((pair, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-white border border-amber-200 text-amber-900 font-medium text-[11px]">
                        {pair}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-amber-800 pt-1">
                    Được các gia đình 4-5 người yêu thích và mua kèm nhiều nhất với dòng Nấu Bếp 30N.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400">
              Chọn sản phẩm để xem Product 360
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Thêm Sản Phẩm Mới</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Dòng sản phẩm</label>
                  <select
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="Dòng Truyền Thống Cốt Nhĩ">Cốt Nhĩ Truyền Thống</option>
                    <option value="Dòng Thượng Hạng Đặc Biệt">Thượng Hạng</option>
                    <option value="Dòng Gia Đình Tiết Kiệm">Gia Đình Tiết Kiệm</option>
                    <option value="Dòng Bếp Chuyên Nghiệp (Horeca)">Bếp Horeca Can</option>
                    <option value="Bộ Quà Tặng Lễ Tết">Bộ Quà Tặng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trạng thái kinh doanh</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-semibold"
                  >
                    <option value="Đang kinh doanh">Đang kinh doanh</option>
                    <option value="Cháy hàng">Cháy hàng</option>
                    <option value="Mới ra mắt">Mới ra mắt</option>
                    <option value="Đặt trước">Đặt trước</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nước Mắm Cốt Nhĩ Đặc Biệt 45°N"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Độ đạm (°N)</label>
                  <input
                    type="number"
                    min={20}
                    max={70}
                    value={newDegree}
                    onChange={(e) => setNewDegree(parseInt(e.target.value) || 40)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Dung tích</label>
                  <input
                    type="text"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Quy cách</label>
                  <input
                    type="text"
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá bán lẻ (VNĐ) *</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={newPriceRetail}
                    onChange={(e) => setNewPriceRetail(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold text-amber-950"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá đại lý (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={newPriceAgency}
                    onChange={(e) => setNewPriceAgency(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá NPP (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={newPriceNPP}
                    onChange={(e) => setNewPriceNPP(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá vốn sản xuất (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={newCostPrice}
                    onChange={(e) => setNewCostPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 text-emerald-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Sản lượng tháng (chai)</label>
                  <input
                    type="number"
                    min={0}
                    value={newMonthlySales}
                    onChange={(e) => setNewMonthlySales(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Thành phần</label>
                <input
                  type="text"
                  value={newIngredients}
                  onChange={(e) => setNewIngredients(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
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
                  <span>Lưu Sản Phẩm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-amber-950">Chỉnh Sửa Sản Phẩm: {editingProduct.sku}</h3>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã SKU</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Dòng sản phẩm</label>
                  <select
                    value={editingProduct.productLine}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productLine: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white"
                  >
                    <option value="Dòng Truyền Thống Cốt Nhĩ">Cốt Nhĩ Truyền Thống</option>
                    <option value="Dòng Thượng Hạng Đặc Biệt">Thượng Hạng</option>
                    <option value="Dòng Gia Đình Tiết Kiệm">Gia Đình Tiết Kiệm</option>
                    <option value="Dòng Bếp Chuyên Nghiệp (Horeca)">Bếp Horeca Can</option>
                    <option value="Bộ Quà Tặng Lễ Tết">Bộ Quà Tặng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trạng thái kinh doanh</label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-white font-semibold"
                  >
                    <option value="Đang kinh doanh">Đang kinh doanh</option>
                    <option value="Cháy hàng">Cháy hàng</option>
                    <option value="Mới ra mắt">Mới ra mắt</option>
                    <option value="Đặt trước">Đặt trước</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Độ đạm (°N)</label>
                  <input
                    type="number"
                    min={20}
                    max={70}
                    value={editingProduct.nitrogenDegree}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nitrogenDegree: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Dung tích</label>
                  <input
                    type="text"
                    value={editingProduct.capacity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Quy cách thùng</label>
                  <input
                    type="text"
                    value={editingProduct.packagingSpec}
                    onChange={(e) => setEditingProduct({ ...editingProduct, packagingSpec: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá bán lẻ (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.priceRetail}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceRetail: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold text-amber-950"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá Đại lý (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.priceAgency}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceAgency: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá NPP (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.priceNPP}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceNPP: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá vốn (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600 text-emerald-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Sản lượng tháng (chai)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.monthlySalesBottles}
                    onChange={(e) => setEditingProduct({ ...editingProduct, monthlySalesBottles: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Thành phần</label>
                <input
                  type="text"
                  value={editingProduct.ingredients || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Cập Nhật Sản Phẩm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-rose-950">Xóa Sản Phẩm</h3>
                <p className="text-xs text-rose-700">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-gray-700 space-y-1">
              <p>Mã SKU: <strong className="text-amber-950 font-mono">{deletingProduct.sku}</strong></p>
              <p>Tên: <strong className="text-amber-950">{deletingProduct.name}</strong></p>
              <p>Dòng: {deletingProduct.productLine}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Sản Phẩm</span>
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
