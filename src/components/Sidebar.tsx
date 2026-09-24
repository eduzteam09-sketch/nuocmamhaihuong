import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  Store, 
  Package, 
  Database, 
  ShoppingCart, 
  Target, 
  Sparkles, 
  Bot,
  Layers,
  ChevronRight,
  X,
  Heart,
  UserCheck,
  LogOut,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { HaiHuongLogo } from './brand/HaiHuongLogo';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';
import { AppUser, NavTab } from '../types/auth';

export type { NavTab };

interface SidebarProps {
  currentTab?: NavTab;
  activeTab?: string;
  onSelectTab: (tab: any) => void;
  alertCount?: number;
  companyName?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenCopilot?: () => void;
  currentUser?: AppUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  activeTab, 
  onSelectTab, 
  alertCount = 0,
  isMobileOpen = false,
  onCloseMobile,
  onOpenCopilot,
  currentUser,
  onLogout,
}) => {
  const selectedTab = (activeTab || currentTab || 'dashboard') as NavTab;

  const allNavItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Tổng Quan',
      subtitle: 'Ban Lãnh Đạo & Kinh Doanh',
      icon: LayoutDashboard,
    },
    {
      id: 'ai_business_center' as NavTab,
      label: 'AI Business Center',
      subtitle: 'Bộ não phân tích & cảnh báo',
      icon: BrainCircuit,
      badge: alertCount > 0 ? `${alertCount}` : undefined,
      badgeColor: 'bg-[#FFA31A] text-[#3D1B00] animate-pulse font-bold',
    },
    {
      id: 'customers' as NavTab,
      label: 'Khách Hàng & Đối Tác',
      subtitle: 'Customer 360 & Khẩu vị mắm',
      icon: Users,
    },
    {
      id: 'chain' as NavTab,
      label: 'Quản Lý Chuỗi',
      subtitle: 'Mạng lưới phân phối & Điểm bán',
      icon: Store,
    },
    {
      id: 'leads' as NavTab,
      label: 'Leads & Bán Hàng',
      subtitle: 'Pipeline tiếp cận & Báo giá',
      icon: Target,
    },
    {
      id: 'orders' as NavTab,
      label: 'Đơn Hàng Toàn Chuỗi',
      subtitle: 'Điều phối & Tiến độ giao',
      icon: ShoppingCart,
    },
    {
      id: 'products' as NavTab,
      label: 'Sản Phẩm & Độ Đạm',
      subtitle: 'Product 360 & Giá 3 cấp',
      icon: Package,
    },
    {
      id: 'batches' as NavTab,
      label: 'Lô Sản Xuất & Mẻ Chượp',
      subtitle: 'Batch 360 & Truy xuất nguồn gốc',
      icon: Database,
    },
    {
      id: 'staff' as NavTab,
      label: 'Đội Ngũ Nhân Sự',
      subtitle: 'Sales B2B, Chuỗi & Kho vận',
      icon: UserCheck,
    }
  ];

  // RBAC Filtering: If currentUser is defined, only show tabs they are authorized to view
  const navItems = currentUser?.allowedTabs
    ? allNavItems.filter(item => currentUser.allowedTabs.includes(item.id))
    : allNavItems;

  const handleItemClick = (id: NavTab) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-gradient-to-b from-[#3D1B00] via-[#4A1E00] to-[#2E1200] text-amber-50">
      {/* Top Header & Brand */}
      <div>
        <div id="sidebar-brand" className="p-4 sm:p-5 border-b border-[#FFA31A]/20 bg-black/20 flex items-center justify-between">
          <HaiHuongLogo size="lg" />
          {/* Mobile close button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#FFA31A] hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mascot Greeting Banner */}
        <div 
          onClick={onOpenCopilot}
          className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-[#FFA31A]/20 to-[#FFC407]/10 border border-[#FFA31A]/30 flex items-center gap-3 cursor-pointer hover:border-[#FFA31A]/60 transition-all group"
        >
          <div className="w-11 h-11 shrink-0 bg-[#FFF9ED] rounded-xl p-1 flex items-center justify-center border border-[#FFA31A]/40 shadow-xs group-hover:scale-105 transition-transform">
            <HuongGiotBienMascot pose="avatar" size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#FFC407] font-serif">Hương Giọt Biển</span>
              <span className="text-[9px] bg-[#FFA31A] text-[#3D1B00] px-1.5 py-0.2 rounded font-bold">Mascot AI</span>
            </div>
            <p className="text-[11px] text-amber-200/90 truncate mt-0.5">
              "Người bạn tận tâm cùng gia đình Việt"
            </p>
          </div>
        </div>

        {/* Network quick stats */}
        <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-[11px] text-amber-200/80">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#FFA31A]" />
            Mạng lưới chuỗi
          </span>
          <span className="font-semibold text-white">05 Điểm Mạng Lưới</span>
        </div>
      </div>

      {/* Main Nav Items List */}
      <nav id="sidebar-nav" className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#FFA31A]/80">
          Phân Hệ Quản Trị
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-[#3D1B00] font-bold shadow-md shadow-black/20'
                  : 'text-amber-100/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#3D1B00]' : 'text-[#FFC407] group-hover:text-white'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm truncate leading-tight">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-[#FFA31A] text-[#3D1B00]'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className={`text-[10px] sm:text-[11px] truncate mt-0.5 ${isActive ? 'text-[#4A1E00] font-medium' : 'text-amber-300/60'}`}>
                  {item.subtitle}
                </div>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-[#3D1B00] shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout Section */}
      {currentUser && (
        <div className="p-3 border-t border-[#FFA31A]/20 bg-black/40">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                currentUser.isSuperAdmin
                  ? 'bg-gradient-to-br from-[#FFA31A] to-[#FF8C00] text-[#3D1B00] shadow-sm'
                  : 'bg-amber-900/80 text-amber-200 border border-amber-500/30'
              }`}>
                {currentUser.isSuperAdmin ? <Crown className="w-4 h-4" /> : currentUser.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-100 truncate flex items-center gap-1">
                  <span>{currentUser.displayName}</span>
                </div>
                <div className="text-[10px] text-[#FFA31A] font-medium truncate">
                  {currentUser.roleTitle}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                  onLogout();
                }}
                title="Đăng xuất khỏi hệ thống"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-500/40 transition-all cursor-pointer shrink-0 text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Thoát</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Footer Status & AI Hotline */}
      <div id="sidebar-footer" className="p-3 border-t border-[#FFA31A]/20 bg-black/30 text-[11px] text-amber-200/80 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-300 font-semibold">Trực Tuyến</span>
          </div>
          <span className="text-amber-400/80 font-mono text-[10px]">Hải Hương v2.8</span>
        </div>
        <div className="text-[10px] text-amber-300/60 text-center pt-0.5">
          Ủ chượp cá cơm truyền thống Phú Quốc
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Hidden on mobile/tablet < 1024px) */}
      <aside id="app-sidebar" className="hidden lg:flex w-72 h-full shrink-0 flex-col border-r border-[#FFA31A]/20 select-none z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay (for screens < 1024px) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          {/* Sliding Content */}
          <div className="relative w-72 sm:w-80 h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
