import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Menu,
  X,
  Check,
  Package,
  Layers,
  ShoppingBag,
  Clock,
  ArrowRight,
  ExternalLink,
  LogOut,
  Crown,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { AIBusinessAlert, Customer, AppNotification } from '../types';
import { AppUser } from '../types/auth';
import { HaiHuongLogo } from './brand/HaiHuongLogo';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  alerts?: AIBusinessAlert[];
  notifications?: AppNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onOpenAlerts?: () => void;
  onOpenCopilot: () => void;
  onNavigate?: (tab: string) => void;
  customers?: Customer[];
  onSelectCustomer?: (cust: Customer) => void;
  onToggleMobileMenu?: () => void;
  onOpenFirebaseSync?: () => void;
  currentUser?: AppUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm: externalSearchTerm,
  onSearchChange: externalOnSearchChange,
  alerts = [],
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenAlerts,
  onOpenCopilot,
  onNavigate,
  customers = [],
  onSelectCustomer,
  onToggleMobileMenu,
  currentUser,
  onLogout,
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'unread' | 'all'>('unread');

  const searchValue = externalSearchTerm !== undefined ? externalSearchTerm : internalSearch;
  const handleSearchChange = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalSearch(val);
    }
    setShowSearchDropdown(val.trim().length > 0);
  };

  const matchingCustomers = customers.filter(c => 
    searchValue.trim() && (
      c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.phone.includes(searchValue) ||
      c.favoriteSku.toLowerCase().includes(searchValue.toLowerCase())
    )
  ).slice(0, 5);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const displayedNotifications = notifFilter === 'unread' 
    ? unreadNotifications 
    : notifications;

  const handleNotificationClick = (n: AppNotification) => {
    if (onMarkAsRead) {
      onMarkAsRead(n.id);
    }
    setShowAlertDropdown(false);
    if (n.targetTab && onNavigate) {
      onNavigate(n.targetTab);
    }
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'AI_ALERT':
        return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
      case 'STOCK':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'DEBT':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'ORDER':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />;
      case 'BATCH':
        return <Package className="w-3.5 h-3.5 text-purple-600" />;
      case 'LEAD':
        return <Layers className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const getNotifBadgeColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'AI_ALERT':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'STOCK':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'DEBT':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'ORDER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BATCH':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'LEAD':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotifTypeName = (type: AppNotification['type']) => {
    switch (type) {
      case 'AI_ALERT':
        return 'Cảnh báo AI';
      case 'STOCK':
        return 'Kho Chuỗi';
      case 'DEBT':
        return 'Công Nợ';
      case 'ORDER':
        return 'Đơn Hàng';
      case 'BATCH':
        return 'Ủ Chượp';
      case 'LEAD':
        return 'Leads B2B';
      default:
        return 'Hệ Thống';
    }
  };

  return (
    <header id="app-header" className="h-16 bg-white/95 backdrop-blur-md border-b border-amber-900/10 px-2 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile/Tablet Hamburger & Brand Logo */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#3D1B00] hover:text-[#8A3E00] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300/40 transition-colors cursor-pointer flex items-center justify-center shrink-0"
          title="Mở menu quản trị"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5 text-[#8A3E00]" />
        </button>

        {/* Brand in Header (Mobile/Tablet only) */}
        <div className="lg:hidden flex items-center">
          <HaiHuongLogo size="sm" className="max-w-[90px] sm:max-w-none" />
        </div>
      </div>

      {/* Desktop & Tablet Search Bar */}
      <div className="flex-1 max-w-xl relative hidden sm:block mx-1">
        <Search className="w-4 h-4 text-[#8A3E00]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="global-search-input"
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowSearchDropdown(searchValue.trim().length > 0)}
          placeholder="Tìm khách hàng, NPP, đại lý, mã đơn, độ đạm, số lô chượp..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-amber-50/50 border border-amber-200/80 rounded-xl text-[#3D1B00] placeholder-amber-800/40 focus:outline-hidden focus:ring-2 focus:ring-[#FFA31A]/40 focus:border-[#FFA31A] transition-all"
        />

        {/* Live Search Results Dropdown */}
        {showSearchDropdown && matchingCustomers.length > 0 && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-amber-200 overflow-hidden z-50 p-2 space-y-1">
            <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 flex items-center justify-between">
              <span>Khách hàng phù hợp ({matchingCustomers.length})</span>
              <button onClick={() => setShowSearchDropdown(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {matchingCustomers.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  if (onSelectCustomer) onSelectCustomer(c);
                  setShowSearchDropdown(false);
                }}
                className="p-2 hover:bg-amber-50 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors"
              >
                <div>
                  <strong className="text-[#3D1B00]">{c.name}</strong>
                  <span className="text-gray-500 text-[11px] ml-2 font-mono">{c.phone} • {c.type}</span>
                </div>
                <span className="text-[10px] text-[#8A3E00] font-bold bg-[#FFA31A]/20 px-2 py-0.5 rounded">
                  {c.favoriteSku}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Actions: Mobile search toggle, AI Copilot Mascot Button, Alert Bell, User Badge & Logout */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile search icon button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="sm:hidden p-1.5 rounded-xl text-[#8A3E00] hover:bg-[#FFA31A]/10 transition-colors"
          aria-label="Tìm kiếm"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Copilot Quick Button with Hương Giọt Biển Mascot */}
        <button
          id="btn-quick-ai-copilot"
          onClick={onOpenCopilot}
          title="Trợ lý Hương Giọt Biển AI"
          className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#FFA31A] via-[#FF9400] to-[#E67E00] hover:brightness-105 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
        >
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-white p-0.5 shrink-0 flex items-center justify-center shadow-xs">
            <HuongGiotBienMascot pose="avatar" size="sm" />
          </div>
          <span className="hidden md:inline font-serif font-bold">Hương Giọt Biển AI</span>
          <span className="hidden sm:inline md:hidden text-[11px] font-bold">AI Copilot</span>
        </button>

        {/* Alert Bell with Real-time Dropdown */}
        <div className="relative">
          <button
            id="btn-alert-bell"
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
            className="p-1.5 sm:p-2 rounded-xl text-[#8A3E00] hover:bg-amber-100/70 transition-colors relative cursor-pointer"
            title={`Thông báo hệ thống (${unreadCount} chưa đọc)`}
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Alerts & Notifications Dropdown Modal */}
          {showAlertDropdown && (
            <div 
              id="alert-dropdown-panel"
              className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Header with Title and "Đánh dấu tất cả đã đọc" button */}
              <div className="p-3.5 bg-gradient-to-r from-[#3D1B00] to-[#4A1E00] text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#FFC407]" />
                    <span className="font-bold text-xs sm:text-sm">Thông Báo Hệ Thống</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} chưa đọc
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && onMarkAllAsRead && (
                    <button
                      type="button"
                      onClick={onMarkAllAsRead}
                      className="text-[11px] text-[#FFC407] hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Đánh dấu đã đọc</span>
                    </button>
                  )}
                </div>

                {/* Filter Tabs: Chưa đọc vs Tất cả */}
                <div className="mt-3 flex items-center gap-1 border-t border-white/10 pt-2 text-xs">
                  <button
                    onClick={() => setNotifFilter('unread')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      notifFilter === 'unread' 
                        ? 'bg-[#FFA31A] text-[#3D1B00] shadow-xs' 
                        : 'text-amber-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Chưa đọc ({unreadCount})
                  </button>
                  <button
                    onClick={() => setNotifFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      notifFilter === 'all' 
                        ? 'bg-[#FFA31A] text-[#3D1B00] shadow-xs' 
                        : 'text-amber-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Tất cả ({notifications.length})
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-amber-100">
                {displayedNotifications.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 text-xs flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-stone-800">
                      {notifFilter === 'unread' 
                        ? 'Tuyệt vời! Không còn thông báo chưa đọc nào.' 
                        : 'Chưa có thông báo nào trong hệ thống.'}
                    </div>
                    <p className="text-[11px] text-stone-400 max-w-xs leading-relaxed">
                      {notifFilter === 'unread' 
                        ? 'Các cảnh báo và cập nhật mới sẽ tự động hiển thị ở đây khi phát sinh.'
                        : ''}
                    </p>
                  </div>
                ) : (
                  displayedNotifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 transition-all text-xs cursor-pointer relative group ${
                        n.isRead 
                          ? 'bg-white hover:bg-amber-50/50 opacity-75' 
                          : 'bg-amber-50/70 hover:bg-amber-100/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getNotifBadgeColor(n.type)}`}>
                            {getNotifIcon(n.type)}
                            <span>{getNotifTypeName(n.type)}</span>
                          </span>

                          {n.severity === 'high' && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-bold">
                              Khẩn cấp
                            </span>
                          )}

                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" title="Chưa đọc" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{n.time}</span>
                          </span>

                          {/* Individual mark as read button */}
                          {!n.isRead && onMarkAsRead && (
                            <button
                              type="button"
                              title="Đánh dấu đã đọc"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(n.id);
                              }}
                              className="p-1 rounded-md hover:bg-amber-200 text-stone-400 hover:text-stone-700 transition-colors ml-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-1.5 font-bold text-stone-900 text-[13px] leading-snug">
                        {n.title}
                      </div>

                      <p className="text-stone-600 mt-1 line-clamp-2 text-xs leading-relaxed">
                        {n.description}
                      </p>

                      {n.actionLabel && (
                        <div className="mt-2 text-[11px] text-[#8A3E00] font-semibold flex items-center gap-1 group-hover:text-[#3D1B00] transition-colors">
                          <span>{n.actionLabel}</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Quick Link */}
              <div className="p-2.5 bg-stone-50 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 text-[11px]">Đồng bộ thời gian thực</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowAlertDropdown(false);
                    if (onNavigate) onNavigate('ai_business_center');
                  }}
                  className="font-bold text-[#8A3E00] hover:text-[#3D1B00] flex items-center gap-1 cursor-pointer text-xs"
                >
                  <span>Xem AI Business Center</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Logout */}
        <div id="user-profile-badge" className="flex items-center gap-1 sm:gap-2 pl-1.5 sm:pl-2 border-l border-amber-200/80 shrink-0">
          <div 
            title={currentUser ? `${currentUser.displayName} (${currentUser.roleTitle})` : 'Tài khoản'}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs flex items-center justify-center border-2 shrink-0 ${
              currentUser?.isSuperAdmin
                ? 'bg-gradient-to-tr from-[#8A3E00] to-[#FFA31A] text-white border-[#FFA31A] shadow-xs'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {currentUser?.isSuperAdmin ? (
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
              ) : (
                <span>{(currentUser?.displayName || 'NV').slice(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-[#3D1B00] leading-tight flex items-center gap-1.5">
                <span>{currentUser?.displayName || 'Hải Hương'}</span>
                {currentUser?.isSuperAdmin ? (
                  <span className="text-[9px] bg-amber-500/20 text-[#8A3E00] font-bold px-1.5 py-0.2 rounded border border-amber-400/50">
                    Super Admin
                  </span>
                ) : (
                  <span className="text-[9px] bg-stone-100 text-stone-700 font-semibold px-1.5 py-0.2 rounded border border-stone-200">
                    {currentUser?.role || 'Nhân sự'}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-stone-500 leading-tight font-mono truncate max-w-[130px]">
                {currentUser?.email || 'admin@haihuong.vn'}
              </div>
            </div>
          </div>

          {/* Direct Logout Button - ALWAYS VISIBLE on mobile, tablet & desktop */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Đăng xuất khỏi hệ thống"
              className="flex items-center justify-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {showMobileSearch && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white p-3 border-b border-amber-200 shadow-md z-30">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A3E00]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm khách hàng, đại lý, SKU..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-amber-50 border border-amber-200 rounded-xl text-[#3D1B00] focus:outline-hidden"
            />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
