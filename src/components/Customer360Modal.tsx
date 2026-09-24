import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  HeartHandshake, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Award, 
  User, 
  MessageSquare,
  Bot,
  RefreshCw,
  Gift
} from 'lucide-react';
import { Customer } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface Customer360ModalProps {
  customer: Customer | null;
  onClose: () => void;
  onUpdateCustomer: (updated: Customer) => void;
}

export const Customer360Modal: React.FC<Customer360ModalProps> = ({
  customer,
  onClose,
  onUpdateCustomer,
}) => {
  const [analyzingWithGemini, setAnalyzingWithGemini] = useState(false);
  const [liveEmpathyResult, setLiveEmpathyResult] = useState<any>(null);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [activeTab, setActiveTab] = useState<'360' | 'behavior' | 'recommendation' | 'feedback'>('360');

  if (!customer) return null;

  // Trigger real server-side Gemini Empathy analysis
  const handleRunGeminiAnalysis = async () => {
    setAnalyzingWithGemini(true);
    try {
      const res = await fetch('/api/ai/empathy-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          history: [
            { date: customer.lastPurchaseDate, sku: customer.favoriteSku, amount: customer.avgOrderValue }
          ],
          feedback: customer.feedbackHistory.map(f => f.comment).join('; ')
        })
      });
      const data = await res.json();
      setLiveEmpathyResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingWithGemini(false);
    }
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      rating: 5,
      comment: newFeedbackText.trim(),
      sentiment: 'Tích cực' as const,
      resolved: true
    };

    const updatedCustomer: Customer = {
      ...customer,
      feedbackHistory: [newEntry, ...customer.feedbackHistory]
    };

    onUpdateCustomer(updatedCustomer);
    setNewFeedbackText('');
  };

  const handleToggleRisk = () => {
    const nextRisk: Record<string, 'Low' | 'Medium' | 'High'> = {
      'Low': 'Medium',
      'Medium': 'High',
      'High': 'Low'
    };
    const updated: Customer = {
      ...customer,
      churnRisk: nextRisk[customer.churnRisk] || 'Low'
    };
    onUpdateCustomer(updated);
  };

  const daysRemaining = customer.purchaseCycleDays - customer.daysSinceLastPurchase;
  const isOverdue = daysRemaining < 0;

  return (
    <div id="customer-360-backdrop" className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6 z-50 animate-in fade-in duration-150">
      <div 
        id="customer-360-modal" 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-amber-200"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#3D1B00] via-[#5C2700] to-[#2E1200] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFA31A] text-[#3D1B00] flex items-center justify-center font-extrabold text-sm sm:text-base shadow-md shrink-0">
              {customer.type}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg sm:text-xl text-white">{customer.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-[#FFC407] font-semibold">
                  {customer.subType || customer.type}
                </span>
                <button
                  type="button"
                  title="Bấm để đổi nhanh nguy cơ rời bỏ"
                  onClick={handleToggleRisk}
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-transform hover:scale-105 cursor-pointer flex items-center gap-1 ${
                    customer.churnRisk === 'High' ? 'bg-rose-500 text-white' :
                    customer.churnRisk === 'Medium' ? 'bg-amber-500 text-amber-950' :
                    'bg-emerald-500 text-white'
                  }`}
                >
                  <span>Đổi trạng thái Churn: {customer.churnRisk}</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-200/80 mt-0.5 flex flex-wrap items-center gap-2">
                <span>Mã: #{customer.id}</span>
                <span>•</span>
                <span>Khu vực: {customer.region}</span>
                <span>•</span>
                <span>Điểm bán: {customer.assignedStore || 'Chuỗi Hải Hương'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <button
              onClick={handleRunGeminiAnalysis}
              disabled={analyzingWithGemini}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] hover:brightness-105 text-[#3D1B00] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${analyzingWithGemini ? 'animate-spin' : ''}`} />
              <span>{analyzingWithGemini ? 'Hương Giọt Biển Đang Thấu Cảm...' : 'AI Thấu Cảm (Gemini)'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs (Mobile-friendly horizontal scroll) */}
        <div className="flex items-center border-b border-amber-100 bg-[#FFFDF9] px-3 sm:px-6 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('360')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === '360' 
                ? 'border-[#FFA31A] text-[#8A3E00]' 
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Hồ Sơ Toàn Diện 360°
          </button>
          <button
            onClick={() => setActiveTab('behavior')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'behavior' 
                ? 'border-[#FFA31A] text-[#8A3E00]' 
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Chu Kỳ Tiêu Thụ & Tần Suất
          </button>
          <button
            onClick={() => setActiveTab('recommendation')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'recommendation' 
                ? 'border-[#FFA31A] text-[#8A3E00]' 
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Gợi Ý Sản Phẩm Cá Nhân Hóa
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'feedback' 
                ? 'border-[#FFA31A] text-[#8A3E00]' 
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Phản Hồi & Lịch Sử Tương Tác ({customer.feedbackHistory.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Live AI Empathy Banner if generated */}
          {liveEmpathyResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-[#FFF9ED] to-amber-50 border border-[#FFA31A]/40 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFF9ED] p-0.5 border border-[#FFA31A] flex items-center justify-center">
                    <HuongGiotBienMascot pose="avatar" size="sm" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#3D1B00]">
                      Hương Giọt Biển: Kết Quả Thấu Cảm Thời Gian Thực
                    </h4>
                    <span className="text-[10px] text-[#8A3E00] font-semibold">Mô hình phân tích tâm lý & khẩu vị ẩm thực</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Phân tích thành công
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
                <div className="p-3 bg-white rounded-xl border border-amber-200/70">
                  <div className="text-stone-500 font-medium">Trạng thái tâm lý & Điểm đau:</div>
                  <p className="text-[#3D1B00] font-semibold mt-1">
                    {liveEmpathyResult.emotionalState || 'Khách hàng có tâm lý gắn bó với nước mắm truyền thống, tuy nhiên cần chăm sóc kỹ về hiện tượng muối kết tinh.'}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200/70">
                  <div className="text-stone-500 font-medium">Hành động AI đề xuất ngay:</div>
                  <p className="text-[#8A3E00] font-bold mt-1">
                    {liveEmpathyResult.suggestedAction || 'Gửi tin nhắn tri ân kèm tài liệu giải thích độ đạm tự nhiên và tặng voucher Freeship.'}
                  </p>
                </div>
              </div>

              {liveEmpathyResult.personalizedZaloMessage && (
                <div className="p-3 bg-white rounded-xl border border-amber-200/70">
                  <div className="text-stone-500 font-medium flex items-center justify-between">
                    <span>Mẫu tin nhắn Zalo thấu cảm gợi ý:</span>
                    <button 
                      onClick={() => navigator.clipboard?.writeText(liveEmpathyResult.personalizedZaloMessage)}
                      className="text-[10px] text-[#8A3E00] font-bold hover:underline cursor-pointer"
                    >
                      Sao chép nội dung
                    </button>
                  </div>
                  <p className="text-stone-700 italic mt-1 font-serif text-xs bg-amber-50/50 p-2 rounded-lg">
                    "{liveEmpathyResult.personalizedZaloMessage}"
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === '360' && (
            <div className="space-y-4">
              {/* Basic Info & Taste Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <h4 className="font-bold text-[#3D1B00] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#8A3E00]" />
                    <span>Thông Tin Liên Hệ & Phân Khúc</span>
                  </h4>
                  <div className="space-y-1 text-stone-600">
                    <div className="flex justify-between">
                      <span>Số điện thoại:</span>
                      <strong className="text-stone-900 font-mono">{customer.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Địa chỉ nhận mắm:</span>
                      <span className="text-stone-900 font-medium text-right max-w-[200px] truncate">{customer.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phân khúc RFM:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{customer.rfmSegment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng chi tiêu tích lũy:</span>
                      <strong className="text-[#3D1B00] font-bold">{(customer.totalSpend).toLocaleString('vi-VN')} đ</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Nhân viên phụ trách:</span>
                      <span className="text-stone-900 font-medium">{customer.assignedSalesStaff || 'CSKH Chuỗi Hải Hương'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                  <h4 className="font-bold text-[#3D1B00] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <HeartHandshake className="w-4 h-4 text-[#8A3E00]" />
                    <span>Hồ Sơ Khẩu Vị & Nhu Cầu (Taste 360)</span>
                  </h4>
                  <div className="space-y-1 text-stone-700">
                    <div className="flex justify-between">
                      <span>Độ đạm yêu thích:</span>
                      <strong className="text-[#8A3E00] bg-amber-100 px-2 py-0.5 rounded font-bold">{customer.tastePreference.proteinPreference}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Gu mặn / Độ đầm:</span>
                      <span className="text-stone-900 font-medium">{customer.tastePreference.saltinessLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mục đích sử dụng chính:</span>
                      <span className="text-stone-900 font-medium">{customer.tastePreference.consumptionPurpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dung tích quen thuộc:</span>
                      <span className="text-stone-900 font-medium">{customer.favoriteVolume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sản phẩm chủ lực:</span>
                      <span className="text-[#3D1B00] font-bold">{customer.favoriteSku}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Churn Diagnostic Box */}
              <div className="p-4 rounded-xl border border-amber-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${customer.churnRisk === 'High' ? 'text-rose-600' : 'text-amber-600'}`} />
                    <span className="font-bold text-[#3D1B00]">Đánh Giá Nguy Cơ Rời Bỏ (Churn Prediction)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                    customer.churnRisk === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Mức độ: {customer.churnRisk}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {customer.churnReason || 'Khách hàng có lịch sử mua hàng đều đặn. Không phát hiện rủi ro chuyển dịch sang thương hiệu khác.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <div className="text-stone-500">Chu kỳ sử dụng dự tính</div>
                  <div className="text-2xl font-extrabold text-[#3D1B00] mt-1">{customer.purchaseCycleDays} ngày</div>
                  <div className="text-[11px] text-[#8A3E00] mt-0.5">Dung tích {customer.favoriteVolume}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <div className="text-stone-500">Đã trôi qua từ lần cuối</div>
                  <div className={`text-2xl font-extrabold mt-1 ${isOverdue ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {customer.daysSinceLastPurchase} ngày
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Mua ngày {customer.lastPurchaseDate}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <div className="text-stone-500">Dự báo ngày hết mắm</div>
                  <div className="text-lg font-bold text-[#8A3E00] mt-2">{customer.nextPredictedPurchase}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Xác suất mua lại: {customer.repurchaseProbability}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendation' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                <h4 className="font-bold text-[#3D1B00] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#FFA31A]" />
                  <span>Sản Phẩm Được Hương Giọt Biển Đề Xuất Riêng</span>
                </h4>
                <p className="text-stone-600 mt-1">
                  Dựa trên khẩu vị <strong>{customer.tastePreference.proteinPreference}</strong> và mục đích <strong>{customer.tastePreference.consumptionPurpose}</strong>.
                </p>
                <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <strong className="text-sm text-[#3D1B00]">{customer.aiRecommendation?.recommendedCombo || customer.favoriteSku}</strong>
                    <div className="text-xs text-stone-500 mt-0.5">{customer.aiRecommendation?.personalizedReason || 'Mắm cốt nhĩ truyền thống Hải Hương'}</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-[#FFA31A] text-[#3D1B00] font-bold text-xs hover:bg-[#FF8C00] cursor-pointer">
                    Gợi ý khách mua
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {/* Add Feedback Form */}
              <form onSubmit={handleAddFeedback} className="flex gap-2">
                <input
                  type="text"
                  value={newFeedbackText}
                  onChange={(e) => setNewFeedbackText(e.target.value)}
                  placeholder="Ghi nhận phản hồi mới của khách hàng (vị mặn, độ trong, mùi hương...)..."
                  className="flex-1 px-3.5 py-2 text-xs border border-amber-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFA31A]/40"
                />
                <button
                  type="submit"
                  disabled={!newFeedbackText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#FFA31A] text-[#3D1B00] font-bold text-xs hover:bg-[#FF8C00] disabled:opacity-40 cursor-pointer"
                >
                  Lưu Ghi Chú
                </button>
              </form>

              {/* Feedback History List */}
              <div className="space-y-2">
                {customer.feedbackHistory.map((fb, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-stone-200 bg-white flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#3D1B00]">{fb.date}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          fb.sentiment === 'Tích cực' ? 'bg-emerald-100 text-emerald-800' :
                          fb.sentiment === 'Cần hỗ trợ' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {fb.sentiment}
                        </span>
                      </div>
                      <p className="text-stone-700 mt-1">{fb.comment}</p>
                    </div>
                    <span className="text-amber-500 font-bold">{'★'.repeat(fb.rating)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-amber-100 flex items-center justify-between shrink-0">
          <span className="text-stone-500 text-[11px]">Dữ liệu thấu cảm được đồng bộ thời gian thực</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
