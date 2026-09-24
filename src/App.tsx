import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AIBusinessCenter } from './components/AIBusinessCenter';
import { CustomerManagement } from './components/CustomerManagement';
import { Customer360Modal } from './components/Customer360Modal';
import { ChainManagement } from './components/ChainManagement';
import { ProductManagement } from './components/ProductManagement';
import { BatchManagement } from './components/BatchManagement';
import { LeadsAndOrders } from './components/LeadsAndOrders';
import { StaffManagement } from './components/StaffManagement';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { FirebaseSyncModal } from './components/FirebaseSyncModal';
import { LoginView } from './components/auth/LoginView';
import { HaiHuongLogo } from './components/brand/HaiHuongLogo';
import { 
  saveDocumentToFirestore, 
  deleteDocumentFromFirestore, 
  fetchCollectionFromFirestore,
  subscribeToAuthChanges,
  resolveAppUser,
  signOutAppUser
} from './firebase';
import { 
  mockCustomers, 
  mockStores, 
  mockProducts, 
  mockBatches, 
  mockOrders, 
  mockLeads, 
  mockStaff, 
  mockAIAlerts,
  companyProfile
} from './data/mockData';
import { 
  Customer, 
  StoreNode, 
  OrderRecord, 
  ProductSKU, 
  BatchLot, 
  LeadRecord, 
  StaffMember,
  AppNotification,
  AITaskExecution
} from './types';
import { AppUser, NavTab } from './types/auth';
import { INITIAL_NOTIFICATIONS } from './data/notificationsData';
import { generateAIBusinessTasks } from './utils/aiBusinessTasks';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [stores, setStores] = useState<StoreNode[]>(mockStores);
  const [orders, setOrders] = useState<OrderRecord[]>(mockOrders);
  const [products, setProducts] = useState<ProductSKU[]>(mockProducts);
  const [batches, setBatches] = useState<BatchLot[]>(mockBatches);
  const [leads, setLeads] = useState<LeadRecord[]>(mockLeads);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [selectedCustomerFor360, setSelectedCustomerFor360] = useState<Customer | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);

  // System notifications & AI task executions state
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [executedTaskIds, setExecutedTaskIds] = useState<string[]>([]);
  const [taskExecutions, setTaskExecutions] = useState<Record<string, AITaskExecution>>({});

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((fbUser) => {
      if (fbUser) {
        const resolved = resolveAppUser(fbUser, staff);
        setCurrentUser(resolved);
        if (resolved && !resolved.allowedTabs.includes(activeTab)) {
          setActiveTab(resolved.allowedTabs[0] || 'leads');
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [staff]);

  const handleLogout = async () => {
    try {
      await signOutAppUser();
      setCurrentUser(null);
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Logout error:', err);
      setCurrentUser(null);
    }
  };

  const handleMarkNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotifsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSaveTaskExecution = (execution: AITaskExecution) => {
    setTaskExecutions(prev => ({
      ...prev,
      [execution.taskId]: execution
    }));

    if (execution.status === 'completed') {
      setExecutedTaskIds(prev => prev.includes(execution.taskId) ? prev : [...prev, execution.taskId]);

      // Automatically mark related notification as read
      setNotifications(prev => prev.map(n => {
        if ((execution.taskId.includes('churn') && n.id === 'notif-01') ||
            (execution.taskId.includes('store') && n.id === 'notif-02') ||
            (execution.taskId.includes('debt') && n.id === 'notif-03') ||
            (execution.taskId.includes('growth') && n.id === 'notif-04')) {
          return { ...n, isRead: true };
        }
        return n;
      }));
    } else {
      // If reverted to in_progress, remove from completed ids
      setExecutedTaskIds(prev => prev.filter(id => id !== execution.taskId));
    }

    // Real business side effects on customer data (saving feedback/empathy record)
    if (execution.taskId === 'task-churn-agency-coba' || execution.taskId === 'task-urg-churn-custs') {
      setCustomers(prev => prev.map(c => {
        if (c.name.includes('Cô Ba') || (execution.taskId === 'task-urg-churn-custs' && (c.churnRisk === 'High' || c.daysSinceLastPurchase > c.purchaseCycleDays))) {
          const newFeedback = {
            date: new Date().toISOString().split('T')[0],
            rating: 5,
            comment: `[Thực thi AI]: ${execution.resultNote} (Phụ trách: ${execution.assignee})`,
            sentiment: 'Tích cực' as const,
            resolved: true
          };
          return {
            ...c,
            churnRisk: execution.status === 'completed' ? 'Low' : 'Medium',
            churnReason: execution.resultNote,
            feedbackHistory: [newFeedback, ...c.feedbackHistory]
          };
        }
        return c;
      }));
    } else if (execution.taskId === 'task-churn-feedback-hung') {
      setCustomers(prev => prev.map(c => {
        if (c.name.includes('Trần Văn Hưng')) {
          const newFeedback = {
            date: new Date().toISOString().split('T')[0],
            rating: 5,
            comment: `[Thực thi AI - Giải thích kết tinh muối]: ${execution.resultNote} (Phụ trách: ${execution.assignee})`,
            sentiment: 'Tích cực' as const,
            resolved: true
          };
          return {
            ...c,
            churnRisk: execution.status === 'completed' ? 'Low' : 'Medium',
            churnReason: execution.resultNote,
            feedbackHistory: [newFeedback, ...c.feedbackHistory]
          };
        }
        return c;
      }));
    } else if (execution.taskId === 'task-churn-horeca-comnieu') {
      setCustomers(prev => prev.map(c => {
        if (c.name.includes('Cơm Niêu')) {
          const newFeedback = {
            date: new Date().toISOString().split('T')[0],
            rating: 5,
            comment: `[Thực thi AI - Hợp đồng Horeca]: ${execution.resultNote} (Phụ trách: ${execution.assignee})`,
            sentiment: 'Tích cực' as const,
            resolved: true
          };
          return {
            ...c,
            churnRisk: execution.status === 'completed' ? 'Low' : 'Medium',
            churnReason: execution.resultNote,
            feedbackHistory: [newFeedback, ...c.feedbackHistory]
          };
        }
        return c;
      }));
    } else if (execution.taskId.startsWith('task-urg-store-')) {
      setStores(prev => prev.map(s => {
        if (s.code === 'STR-HCM001' || s.type === 'CUA_HANG') {
          return {
            ...s,
            stockStatus: 'Đầy đủ',
            totalStockBottles: s.totalStockBottles + 240,
            daysSinceLastRestock: 0
          };
        }
        return s;
      }));
    } else if (execution.taskId === 'task-urg-debts' && execution.status === 'completed') {
      setStores(prev => prev.map(s => ({
        ...s,
        debtAmount: 0
      })));
    }
  };

  const handleExecuteAITask = (taskId: string) => {
    setExecutedTaskIds(prev => prev.includes(taskId) ? prev : [...prev, taskId]);
  };

  // Real-time calculation of active AI business tasks (uncompleted tasks)
  const allAITasks = useMemo(() => {
    return generateAIBusinessTasks(customers, stores, batches, orders, leads, products);
  }, [customers, stores, batches, orders, leads, products]);

  const activeAITaskCount = Math.max(
    0, 
    allAITasks.filter(t => taskExecutions[t.id]?.status !== 'completed' && !executedTaskIds.includes(t.id)).length
  );

  // Load from Firebase Firestore if collections exist
  const handleRefreshFromFirebase = async () => {
    try {
      const [
        remoteProducts, 
        remoteCustomers, 
        remoteStores, 
        remoteBatches, 
        remoteOrders, 
        remoteLeads, 
        remoteStaff
      ] = await Promise.all([
        fetchCollectionFromFirestore<ProductSKU>('products').catch(() => []),
        fetchCollectionFromFirestore<Customer>('customers').catch(() => []),
        fetchCollectionFromFirestore<StoreNode>('stores').catch(() => []),
        fetchCollectionFromFirestore<BatchLot>('batches').catch(() => []),
        fetchCollectionFromFirestore<OrderRecord>('orders').catch(() => []),
        fetchCollectionFromFirestore<LeadRecord>('leads').catch(() => []),
        fetchCollectionFromFirestore<StaffMember>('staff').catch(() => [])
      ]);

      if (remoteProducts && remoteProducts.length > 0) setProducts(remoteProducts);
      if (remoteCustomers && remoteCustomers.length > 0) setCustomers(remoteCustomers);
      if (remoteStores && remoteStores.length > 0) setStores(remoteStores);
      if (remoteBatches && remoteBatches.length > 0) setBatches(remoteBatches);
      if (remoteOrders && remoteOrders.length > 0) setOrders(remoteOrders);
      if (remoteLeads && remoteLeads.length > 0) setLeads(remoteLeads);
      if (remoteStaff && remoteStaff.length > 0) setStaff(remoteStaff);
    } catch (e) {
      console.warn('Đang sử dụng dữ liệu cục bộ:', e);
    }
  };

  useEffect(() => {
    handleRefreshFromFirebase();
  }, []);

  // Customer handlers
  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedCustomerFor360(updated);
    saveDocumentToFirestore('customers', updated).catch(console.error);
  };

  const handleAddCustomer = (newCust: Customer) => {
    setCustomers(prev => [newCust, ...prev]);
    saveDocumentToFirestore('customers', newCust).catch(console.error);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    if (selectedCustomerFor360?.id === id) setSelectedCustomerFor360(null);
    deleteDocumentFromFirestore('customers', id).catch(console.error);
  };

  // Staff handlers
  const handleAddStaff = (newStaff: StaffMember) => {
    setStaff(prev => [newStaff, ...prev]);
    saveDocumentToFirestore('staff', newStaff).catch(console.error);
  };

  const handleUpdateStaff = (updated: StaffMember) => {
    setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
    saveDocumentToFirestore('staff', updated).catch(console.error);
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    deleteDocumentFromFirestore('staff', id).catch(console.error);
  };

  // Store handlers
  const handleAddStore = (newStore: StoreNode) => {
    setStores(prev => [newStore, ...prev]);
    saveDocumentToFirestore('stores', newStore).catch(console.error);
  };

  const handleUpdateStore = (updated: StoreNode) => {
    setStores(prev => prev.map(s => s.id === updated.id ? updated : s));
    saveDocumentToFirestore('stores', updated).catch(console.error);
  };

  const handleDeleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    deleteDocumentFromFirestore('stores', id).catch(console.error);
  };

  // Order handlers
  const handleAddOrder = (newOrd: OrderRecord) => {
    setOrders(prev => [newOrd, ...prev]);
    saveDocumentToFirestore('orders', newOrd).catch(console.error);

    // Synchronize customer cumulative metrics if customer exists
    setCustomers(prev => prev.map(c => {
      if (c.name.toLowerCase() === newOrd.customerName.toLowerCase()) {
        const updatedCust = {
          ...c,
          totalSpend: c.totalSpend + newOrd.finalAmount,
          orderCount: c.orderCount + 1,
          daysSinceLastPurchase: 0,
          lastPurchaseDate: newOrd.createdAt ? newOrd.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        };
        saveDocumentToFirestore('customers', updatedCust).catch(console.error);
        return updatedCust;
      }
      return c;
    }));
  };

  const handleUpdateOrder = (updated: OrderRecord) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    saveDocumentToFirestore('orders', updated).catch(console.error);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    deleteDocumentFromFirestore('orders', id).catch(console.error);
  };

  // Lead handlers
  const handleAddLead = (newLead: LeadRecord) => {
    setLeads(prev => [newLead, ...prev]);
    saveDocumentToFirestore('leads', newLead).catch(console.error);
  };

  const handleUpdateLead = (updated: LeadRecord) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    saveDocumentToFirestore('leads', updated).catch(console.error);
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    deleteDocumentFromFirestore('leads', id).catch(console.error);
  };

  // Product handlers
  const handleAddProduct = (newProd: ProductSKU) => {
    setProducts(prev => [newProd, ...prev]);
    saveDocumentToFirestore('products', newProd).catch(console.error);
  };

  const handleUpdateProduct = (updated: ProductSKU) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    saveDocumentToFirestore('products', updated).catch(console.error);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    deleteDocumentFromFirestore('products', id).catch(console.error);
  };

  // Batch handlers
  const handleAddBatch = (newBatch: BatchLot) => {
    setBatches(prev => [newBatch, ...prev]);
    saveDocumentToFirestore('batches', newBatch).catch(console.error);
  };

  const handleUpdateBatch = (updated: BatchLot) => {
    setBatches(prev => prev.map(b => b.id === updated.id ? updated : b));
    saveDocumentToFirestore('batches', updated).catch(console.error);
  };

  const handleDeleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    deleteDocumentFromFirestore('batches', id).catch(console.error);
  };

  // Show brand loading state while Firebase Auth checks initial session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#2E1200] flex flex-col items-center justify-center text-amber-100 p-4">
        <div className="p-6 bg-black/50 rounded-3xl border border-[#FFA31A]/30 flex flex-col items-center gap-3 shadow-2xl backdrop-blur-md">
          <HaiHuongLogo size="lg" />
          <div className="w-7 h-7 border-3 border-[#FFA31A] border-t-transparent rounded-full animate-spin mt-2" />
          <span className="text-xs text-amber-200/90 font-medium">Đang khởi tạo hệ thống bảo mật Hải Hương...</span>
        </div>
      </div>
    );
  }

  // Not logged in: Show the dedicated Login Screen
  if (!currentUser) {
    return (
      <LoginView 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (!user.allowedTabs.includes(activeTab)) {
            setActiveTab(user.allowedTabs[0] || 'leads');
          }
        }} 
        staffList={staff} 
      />
    );
  }

  // Check if current active tab is permitted for this user role
  const isCurrentTabAllowed = currentUser.isSuperAdmin || currentUser.allowedTabs.includes(activeTab);

  return (
    <div className="flex h-screen bg-[#FDFBF7] font-sans text-stone-900 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }} 
        alertCount={activeAITaskCount}
        companyName={companyProfile.name}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Universal Top Header */}
        <Header 
          alerts={mockAIAlerts}
          notifications={notifications}
          onMarkAsRead={handleMarkNotifAsRead}
          onMarkAllAsRead={handleMarkAllNotifsAsRead}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onNavigate={(tab) => {
            if (currentUser.isSuperAdmin || currentUser.allowedTabs.includes(tab as NavTab)) {
              setActiveTab(tab as NavTab);
              setIsMobileMenuOpen(false);
            }
          }}
          customers={customers}
          onSelectCustomer={(cust: Customer) => setSelectedCustomerFor360(cust)}
          onOpenFirebaseSync={() => {
            if (currentUser.isSuperAdmin) {
              setIsFirebaseModalOpen(true);
            }
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Dynamic Content View Container */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Role Status Banner for Staff Members */}
          {!currentUser.isSuperAdmin && (
            <div className="mb-4 p-2.5 px-3.5 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-amber-950 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>
                  Đang làm việc: <strong>{currentUser.displayName}</strong> • Phân quyền: <strong className="text-amber-800">{currentUser.roleTitle}</strong>
                </span>
              </div>
              <span className="text-[10px] text-amber-800/80 bg-amber-100/70 px-2 py-0.5 rounded-md font-medium self-start sm:self-auto">
                Chế độ phân quyền chuyên trách ({currentUser.allowedTabs.length} phân hệ)
              </span>
            </div>
          )}

          {/* Access Denied Fallback if user navigates to an unauthorized tab */}
          {!isCurrentTabAllowed ? (
            <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-rose-200 shadow-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Giới Hạn Phân Quyền Truy Cập</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Tài khoản của bạn ({currentUser.roleTitle}) chỉ được cấp quyền xem dữ liệu phục vụ trực tiếp cho vị trí công việc.
                  Chỉ quản trị viên <strong>admin@haihuong.vn</strong> mới có toàn quyền trên toàn hệ thống.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab(currentUser.allowedTabs[0] || 'leads')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Về phân hệ được cấp phép</span>
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView 
                  customers={customers}
                  stores={stores}
                  products={products}
                  alerts={mockAIAlerts}
                  orders={orders}
                  onNavigateTab={(tab) => {
                    if (currentUser.isSuperAdmin || currentUser.allowedTabs.includes(tab as NavTab)) {
                      setActiveTab(tab as NavTab);
                    }
                  }}
                  onSelectCustomer={(cust: Customer) => setSelectedCustomerFor360(cust)}
                />
              )}

              {activeTab === 'ai_business_center' && (
                <AIBusinessCenter 
                  alerts={mockAIAlerts}
                  customers={customers}
                  stores={stores}
                  batches={batches}
                  orders={orders}
                  leads={leads}
                  products={products}
                  taskExecutions={taskExecutions}
                  onSaveTaskExecution={handleSaveTaskExecution}
                  executedTasks={executedTaskIds}
                  onExecuteTask={handleExecuteAITask}
                  onOpenCustomer={(cust) => setSelectedCustomerFor360(cust)}
                  onNavigateTab={(tab) => {
                    if (currentUser.isSuperAdmin || currentUser.allowedTabs.includes(tab as NavTab)) {
                      setActiveTab(tab as NavTab);
                    }
                  }}
                  onUpdateStore={handleUpdateStore}
                  onUpdateCustomer={handleUpdateCustomer}
                />
              )}

              {activeTab === 'customers' && (
                <CustomerManagement 
                  customers={customers}
                  onSelectCustomer={(cust) => setSelectedCustomerFor360(cust)}
                  onAddCustomer={handleAddCustomer}
                  onUpdateCustomer={handleUpdateCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                />
              )}

              {activeTab === 'chain' && (
                <ChainManagement 
                  stores={stores}
                  products={products}
                  batches={batches}
                  orders={orders}
                  onAddStore={handleAddStore}
                  onUpdateStore={handleUpdateStore}
                  onDeleteStore={handleDeleteStore}
                  onNavigateToBatches={() => setActiveTab('batches')}
                />
              )}

              {activeTab === 'products' && (
                <ProductManagement 
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === 'batches' && (
                <BatchManagement 
                  batches={batches}
                  stores={stores}
                  staff={staff}
                  onAddBatch={handleAddBatch}
                  onUpdateBatch={handleUpdateBatch}
                  onDeleteBatch={handleDeleteBatch}
                  onUpdateStore={handleUpdateStore}
                />
              )}

              {activeTab === 'leads' && (
                <LeadsAndOrders 
                  initialTab="leads"
                  leads={leads}
                  orders={orders}
                  staff={staff}
                  customers={customers}
                  products={products}
                  stores={stores}
                  onAddOrder={handleAddOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onDeleteOrder={handleDeleteOrder}
                  onAddLead={handleAddLead}
                  onUpdateLead={handleUpdateLead}
                  onDeleteLead={handleDeleteLead}
                  onAddCustomer={handleAddCustomer}
                  onNavigateToStaff={() => {
                    if (currentUser.isSuperAdmin) {
                      setActiveTab('staff');
                    }
                  }}
                />
              )}

              {activeTab === 'orders' && (
                <LeadsAndOrders 
                  initialTab="orders"
                  leads={leads}
                  orders={orders}
                  staff={staff}
                  customers={customers}
                  products={products}
                  stores={stores}
                  onAddOrder={handleAddOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onDeleteOrder={handleDeleteOrder}
                  onAddLead={handleAddLead}
                  onUpdateLead={handleUpdateLead}
                  onDeleteLead={handleDeleteLead}
                  onAddCustomer={handleAddCustomer}
                  onNavigateToStaff={() => {
                    if (currentUser.isSuperAdmin) {
                      setActiveTab('staff');
                    }
                  }}
                />
              )}

              {activeTab === 'staff' && currentUser.isSuperAdmin && (
                <StaffManagement 
                  staff={staff}
                  leads={leads}
                  stores={stores}
                  onAddStaff={handleAddStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onDeleteStaff={handleDeleteStaff}
                  onNavigateToLeads={() => setActiveTab('leads')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Customer 360 Deep Modal */}
      {selectedCustomerFor360 && (
        <Customer360Modal 
          customer={selectedCustomerFor360}
          onClose={() => setSelectedCustomerFor360(null)}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}

      {/* Gemini AI Copilot Chat Drawer */}
      <AICopilotDrawer 
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        customers={customers}
        stores={stores}
      />

      {/* Firebase Sync & Seed Modal (Only for Super Admin) */}
      {currentUser.isSuperAdmin && (
        <FirebaseSyncModal 
          isOpen={isFirebaseModalOpen}
          onClose={() => setIsFirebaseModalOpen(false)}
          onRefreshFromFirebase={handleRefreshFromFirebase}
          onSeedCompleted={handleRefreshFromFirebase}
        />
      )}
    </div>
  );
}
