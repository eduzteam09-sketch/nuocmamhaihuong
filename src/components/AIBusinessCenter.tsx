import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, 
  AlertTriangle, 
  TrendingUp, 
  UserX, 
  Repeat, 
  ShoppingBag, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Package,
  ShieldAlert,
  Flame,
  ExternalLink,
  Store,
  Users,
  Layers,
  Check,
  Clock,
  Filter,
  FileText,
  User,
  MapPin,
  Edit3
} from 'lucide-react';
import { 
  AIBusinessAlert, 
  Customer, 
  StoreNode, 
  BatchLot, 
  OrderRecord, 
  LeadRecord, 
  ProductSKU,
  AITaskExecution
} from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';
import { generateAIBusinessTasks, DynamicAITask } from '../utils/aiBusinessTasks';
import { AITaskExecutionModal } from './AITaskExecutionModal';

interface AIBusinessCenterProps {
  alerts?: AIBusinessAlert[];
  customers: Customer[];
  stores: StoreNode[];
  batches?: BatchLot[];
  orders?: OrderRecord[];
  leads?: LeadRecord[];
  products?: ProductSKU[];
  taskExecutions?: Record<string, AITaskExecution>;
  onSaveTaskExecution?: (execution: AITaskExecution) => void;
  // Fallbacks for backward compatibility
  executedTasks?: string[];
  onExecuteTask?: (taskId: string) => void;
  onOpenCustomer?: (cust: Customer) => void;
  onNavigateTab?: (tab: any) => void;
  onUpdateStore?: (store: StoreNode) => void;
  onUpdateCustomer?: (cust: Customer) => void;
}

export const AIBusinessCenter: React.FC<AIBusinessCenterProps> = ({
  alerts: initialAlerts,
  customers,
  stores,
  batches = [],
  orders = [],
  leads = [],
  products = [],
  taskExecutions: externalTaskExecutions,
  onSaveTaskExecution: externalOnSaveTaskExecution,
  executedTasks = [],
  onExecuteTask,
  onOpenCustomer,
  onNavigateTab,
  onUpdateStore,
  onUpdateCustomer,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'urgent' | 'opportunity' | 'churn' | 'chain'>('all');
  const [statusFilter, setStatusFilter] = useState<'unprocessed' | 'in_progress' | 'completed' | 'all'>('unprocessed');
  const [localExecutions, setLocalExecutions] = useState<Record<string, AITaskExecution>>({});
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);

  // Active task for popup modal
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<DynamicAITask | null>(null);

  const executions = externalTaskExecutions !== undefined ? externalTaskExecutions : localExecutions;

  // Generate all dynamic AI tasks from system data
  const allTasks = useMemo(() => {
    return generateAIBusinessTasks(customers, stores, batches, orders, leads, products);
  }, [customers, stores, batches, orders, leads, products]);

  // Counts based on execution state
  const completedCount = useMemo(() => {
    return allTasks.filter(t => executions[t.id]?.status === 'completed' || executedTasks.includes(t.id)).length;
  }, [allTasks, executions, executedTasks]);

  const inProgressCount = useMemo(() => {
    return allTasks.filter(t => executions[t.id]?.status === 'in_progress').length;
  }, [allTasks, executions]);

  const unprocessedCount = useMemo(() => {
    return Math.max(0, allTasks.length - completedCount - inProgressCount);
  }, [allTasks.length, completedCount, inProgressCount]);

  // Remaining active tasks (all tasks that are not completed)
  const remainingTotal = useMemo(() => {
    return Math.max(0, allTasks.filter(t => executions[t.id]?.status !== 'completed' && !executedTasks.includes(t.id)).length);
  }, [allTasks, executions, executedTasks]);

  const urgentTasks = useMemo(() => allTasks.filter(t => t.category === 'urgent'), [allTasks]);
  const opportunityTasks = useMemo(() => allTasks.filter(t => t.category === 'opportunity'), [allTasks]);
  const churnTasks = useMemo(() => allTasks.filter(t => t.category === 'churn'), [allTasks]);
  const chainTasks = useMemo(() => allTasks.filter(t => t.category === 'chain'), [allTasks]);

  const remainingUrgent = useMemo(() => urgentTasks.filter(t => executions[t.id]?.status !== 'completed').length, [urgentTasks, executions]);
  const remainingOpportunity = useMemo(() => opportunityTasks.filter(t => executions[t.id]?.status !== 'completed').length, [opportunityTasks, executions]);
  const remainingChurn = useMemo(() => churnTasks.filter(t => executions[t.id]?.status !== 'completed').length, [churnTasks, executions]);
  const remainingChain = useMemo(() => chainTasks.filter(t => executions[t.id]?.status !== 'completed').length, [chainTasks, executions]);

  // Handle saving execution from modal
  const handleSaveExecution = (execution: AITaskExecution) => {
    if (externalOnSaveTaskExecution) {
      externalOnSaveTaskExecution(execution);
    } else {
      setLocalExecutions(prev => ({
        ...prev,
        [execution.taskId]: execution
      }));
    }

    if (onExecuteTask && execution.status === 'completed') {
      onExecuteTask(execution.taskId);
    }

    // Real business side-effects on underlying objects
    if (execution.taskId === 'task-urg-churn-custs' && onUpdateCustomer) {
      const overdueCust = customers.find(c => c.daysSinceLastPurchase > c.purchaseCycleDays || c.churnRisk === 'High');
      if (overdueCust) {
        onUpdateCustomer({
          ...overdueCust,
          churnRisk: execution.status === 'completed' ? 'Low' : 'Medium',
          churnReason: execution.resultNote,
          feedbackHistory: [
            {
              date: new Date().toISOString().split('T')[0],
              rating: 5,
              comment: `[Thực thi AI]: ${execution.resultNote}`,
              sentiment: 'Tích cực',
              resolved: true
            },
            ...overdueCust.feedbackHistory
          ]
        });
      }
    } else if (execution.taskId.startsWith('task-urg-store-') && onUpdateStore) {
      const targetStore = stores.find(s => s.code === 'STR-HCM001' || s.type === 'CUA_HANG');
      if (targetStore) {
        onUpdateStore({
          ...targetStore,
          stockStatus: 'Đầy đủ',
          totalStockBottles: targetStore.totalStockBottles + 240,
          daysSinceLastRestock: 0
        });
      }
    } else if (execution.taskId === 'task-churn-feedback-hung' && onUpdateCustomer) {
      const hung = customers.find(c => c.name.includes('Trần Văn Hưng'));
      if (hung) {
        onUpdateCustomer({
          ...hung,
          churnRisk: execution.status === 'completed' ? 'Low' : 'Medium',
          churnReason: execution.resultNote,
          feedbackHistory: [
            {
              date: new Date().toISOString().split('T')[0],
              rating: 5,
              comment: `[Thực thi AI - Giải thích kết tinh muối]: ${execution.resultNote}`,
              sentiment: 'Tích cực',
              resolved: true
            },
            ...hung.feedbackHistory
          ]
        });
      }
    } else if (execution.taskId === 'task-churn-agency-coba' && onUpdateCustomer) {
      const coba = customers.find(c => c.name.includes('Cô Ba'));
      if (coba) {
        onUpdateCustomer({
          ...coba,
          churnRisk: execution.status === 'completed' ? 'Low' : 'Medium',
          churnReason: execution.resultNote,
          feedbackHistory: [
            {
              date: new Date().toISOString().split('T')[0],
              rating: 5,
              comment: `[Thực thi AI - Đổi tồn kho]: ${execution.resultNote}`,
              sentiment: 'Tích cực',
              resolved: true
            },
            ...coba.feedbackHistory
          ]
        });
      }
    } else if (execution.taskId === 'task-churn-horeca-comnieu' && onUpdateCustomer) {
      const comNieu = customers.find(c => c.name.includes('Cơm Niêu'));
      if (comNieu) {
        onUpdateCustomer({
          ...comNieu,
          churnRisk: execution.status === 'completed' ? 'Low' : 'Medium',
          churnReason: execution.resultNote,
          feedbackHistory: [
            {
              date: new Date().toISOString().split('T')[0],
              rating: 5,
              comment: `[Thực thi AI - Tài trợ khay gỗ]: ${execution.resultNote}`,
              sentiment: 'Tích cực',
              resolved: true
            },
            ...comNieu.feedbackHistory
          ]
        });
      }
    }

    setToastMessage({
      title: execution.status === 'completed' 
        ? '✓ Đã hoàn tất nhiệm vụ & lưu biên bản thành công!' 
        : '⏳ Đã lưu tiến độ nhiệm vụ: Đang xử lý',
      subtitle: `Kết quả đã được đồng bộ vào: ${execution.targetDestination || 'Hồ sơ hệ thống'}`
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Filter tasks based on category and status
  const displayedTasks = useMemo(() => {
    let list = allTasks;
    if (activeCategory === 'urgent') list = urgentTasks;
    else if (activeCategory === 'opportunity') list = opportunityTasks;
    else if (activeCategory === 'churn') list = churnTasks;
    else if (activeCategory === 'chain') list = chainTasks;

    if (statusFilter === 'unprocessed') {
      return list.filter(t => !executions[t.id] && !executedTasks.includes(t.id));
    } else if (statusFilter === 'in_progress') {
      return list.filter(t => executions[t.id]?.status === 'in_progress');
    } else if (statusFilter === 'completed') {
      return list.filter(t => executions[t.id]?.status === 'completed' || executedTasks.includes(t.id));
    }
    return list;
  }, [allTasks, activeCategory, statusFilter, executions, executedTasks, urgentTasks, opportunityTasks, churnTasks, chainTasks]);

  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'AlertTriangle': return AlertTriangle;
      case 'ShieldAlert': return ShieldAlert;
      case 'TrendingUp': return TrendingUp;
      case 'ShoppingBag': return ShoppingBag;
      case 'PlusCircle': return PlusCircle;
      case 'UserX': return UserX;
      case 'Repeat': return Repeat;
      case 'BrainCircuit': return BrainCircuit;
      case 'Package': return Package;
      case 'Layers': return Layers;
      default: return BrainCircuit;
    }
  };

  return (
    <div id="ai-business-center" className="space-y-5 sm:space-y-6 pb-20 lg:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#3D1B00] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#FFA31A] flex items-center gap-3 animate-in slide-in-from-top duration-200 max-w-md">
          <div className="w-8 h-8 rounded-full bg-[#FFA31A] text-[#3D1B00] flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-5 h-5 text-[#3D1B00]" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold leading-tight">{toastMessage.title}</p>
            {toastMessage.subtitle && (
              <p className="text-[11px] text-amber-200 mt-0.5 leading-snug">{toastMessage.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Execution Modal */}
      {selectedTaskForModal && (
        <AITaskExecutionModal
          task={selectedTaskForModal}
          existingExecution={executions[selectedTaskForModal.id]}
          onClose={() => setSelectedTaskForModal(null)}
          onSaveExecution={handleSaveExecution}
          onOpenCustomerProfile={onOpenCustomer}
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#3D1B00] via-[#5C2700] to-[#2E1200] text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFF9ED] p-1 shrink-0 flex items-center justify-center border border-[#FFA31A] shadow-md relative">
              <HuongGiotBienMascot pose="winking" size="lg" speechBubble="Đại sứ AI!" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[#FFC407] text-xs font-bold uppercase tracking-wider mb-1">
                <BrainCircuit className="w-4 h-4 text-[#FFC407]" />
                <span>HƯƠNG GIỌT BIỂN • TRUNG TÂM ĐIỀU HÀNH THẤU CẢM</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                Bộ Não Ra Quyết Định Kinh Doanh & Điều Phối Chuỗi
              </h2>
              <p className="text-amber-100/85 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Tự động quét toàn bộ {stores.length} điểm mạng lưới chuỗi phân phối, {customers.length} khách hàng và {batches.length} lô ủ chượp để đưa ra cảnh báo - nhiệm vụ điều hành thời gian thực.
              </p>
            </div>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-[#FFA31A]/30 text-xs shrink-0 self-start sm:self-auto">
            <div className="text-[#FFC407] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tiến Độ Điều Hành Chuỗi</span>
            </div>
            <div className="text-stone-300 text-[11px] mt-1 space-y-0.5">
              <div>Chưa xử lý: <strong className="text-white font-extrabold">{unprocessedCount}</strong></div>
              <div>Đang xử lý: <strong className="text-amber-300 font-extrabold">{inProgressCount}</strong></div>
              <div>Đã hoàn tất: <strong className="text-emerald-400 font-extrabold">{completedCount}</strong></div>
            </div>
          </div>
        </div>

        {/* Filter Categories Tabs */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all' 
                ? 'bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-[#3D1B00] shadow-sm' 
                : 'bg-white/10 text-amber-100 hover:text-white'
            }`}
          >
            Tất cả danh mục ({remainingTotal})
          </button>
          <button
            onClick={() => setActiveCategory('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'urgent' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'bg-white/10 text-rose-300 hover:text-white'
            }`}
          >
            Cần xử lý ngay ({remainingUrgent})
          </button>
          <button
            onClick={() => setActiveCategory('opportunity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'opportunity' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white/10 text-emerald-300 hover:text-white'
            }`}
          >
            Cơ hội kinh doanh ({remainingOpportunity})
          </button>
          <button
            onClick={() => setActiveCategory('churn')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'churn' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white/10 text-amber-200 hover:text-white'
            }`}
          >
            Nguy cơ rời bỏ & Thấu cảm ({remainingChurn})
          </button>
          <button
            onClick={() => setActiveCategory('chain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'chain' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'bg-white/10 text-purple-300 hover:text-white'
            }`}
          >
            Dự báo chuỗi & Sản xuất ({remainingChain})
          </button>
        </div>
      </div>

      {/* Subheader: Status Filter Tabs (Chưa xử lý vs Đang xử lý vs Đã hoàn thành vs Tất cả) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:px-4 rounded-xl border border-amber-900/10 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8A3E00]" />
          <span className="text-xs font-bold text-[#3D1B00]">Bộ lọc trạng thái nhiệm vụ:</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setStatusFilter('unprocessed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'unprocessed'
                ? 'bg-[#FFA31A] text-[#3D1B00] shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Chưa xử lý ({unprocessedCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'in_progress'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-stone-100 text-amber-800 hover:bg-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Đang xử lý ({inProgressCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-emerald-800 hover:bg-stone-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã hoàn thành ({completedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-[#3D1B00] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tất cả ({allTasks.length})
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedTasks.length === 0 ? (
          <div className="col-span-full bg-white p-10 rounded-2xl border border-amber-900/10 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-stone-800">
              {statusFilter === 'unprocessed' 
                ? 'Tuyệt vời! Không còn nhiệm vụ nào chưa xử lý trong danh mục này.'
                : statusFilter === 'in_progress'
                ? 'Chưa có nhiệm vụ nào đang ở trạng thái đang xử lý.'
                : 'Chưa có nhiệm vụ nào trong trạng thái này.'}
            </div>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              Hệ thống tự động theo dõi liên tục dữ liệu chuỗi, kho vận và khách hàng để phát hiện các tín hiệu mới.
            </p>
          </div>
        ) : (
          displayedTasks.map((item) => {
            const execution = executions[item.id];
            const isCompleted = execution?.status === 'completed' || executedTasks.includes(item.id);
            const isInProgress = execution?.status === 'in_progress';
            const Icon = getTaskIcon(item.iconName);

            return (
              <div 
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted 
                    ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs' 
                    : isInProgress
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                    : 'bg-white border-amber-900/10 hover:border-[#FFA31A]/60 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Badge, Source & Status Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${item.tagColor}`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-stone-600 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                        {item.dataSource}
                      </span>

                      {/* Explicit Task Status Badge */}
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đã hoàn thành</span>
                        </span>
                      )}

                      {isInProgress && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Đang xử lý</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Hương Giọt Biển gợi ý</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      item.category === 'urgent' ? 'bg-rose-100 text-rose-700' :
                      item.category === 'opportunity' ? 'bg-emerald-100 text-emerald-700' :
                      item.category === 'chain' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-[#8A3E00]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#3D1B00] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-xs">
                    <div className="text-[#8A3E00] font-semibold">Tác động kinh doanh & vận hành:</div>
                    <div className="text-[#3D1B00] font-extrabold text-sm mt-0.5">{item.impact}</div>
                  </div>

                  {/* SAVED EXECUTION RESULT CARD (Shows exactly where results are saved and who did what) */}
                  {execution && (
                    <div className={`mt-3 p-3.5 rounded-xl border text-xs space-y-2 ${
                      isCompleted 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                        : 'bg-amber-50/90 border-amber-200 text-amber-950'
                    }`}>
                      <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-1.5">
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-900">Biên Bản Kết Quả Thực Thi Đã Lưu:</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span className="text-amber-900">Tiến Độ Đang Triển Khai:</span>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {execution.updatedAt}
                        </span>
                      </div>

                      <p className="text-stone-700 italic text-xs leading-relaxed">
                        "{execution.resultNote}"
                      </p>

                      <div className="pt-1 text-[11px] text-stone-600 flex flex-wrap items-center justify-between gap-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" />
                          <span>Phụ trách: <strong>{execution.assignee}</strong></span>
                        </span>
                        <span className="font-semibold text-[#8A3E00]">
                          📍 Lưu tại: {execution.targetDestination || item.targetDestination}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Optional Quick Link to Entity */}
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    {item.linkedCustomer && onOpenCustomer && (
                      <button
                        type="button"
                        onClick={() => onOpenCustomer(item.linkedCustomer!)}
                        className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/60 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Users className="w-3 h-3" />
                        <span>Xem Hồ Sơ 360: {item.linkedCustomer.name}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}

                    {item.linkedStore && onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab('chain')}
                        className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/60 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Store className="w-3 h-3" />
                        <span>Xem Điểm Bán: {item.linkedStore.name}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  {isCompleted ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTaskForModal(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                        <span>Xem lại / Chỉnh sửa biên bản</span>
                      </button>

                      {item.linkedCustomer && onOpenCustomer ? (
                        <button
                          type="button"
                          onClick={() => onOpenCustomer(item.linkedCustomer!)}
                          className="py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Xem Hồ Sơ 360°</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : null}
                    </div>
                  ) : isInProgress ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTaskForModal(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-105 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-white" />
                        <span>Cập nhật kết quả / Hoàn tất</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedTaskForModal(item)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] hover:brightness-105 text-[#3D1B00] text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#3D1B00]" />
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
