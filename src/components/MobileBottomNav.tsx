import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  BrainCircuit, 
  Sparkles,
  Package,
  ShoppingCart
} from 'lucide-react';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onOpenCopilot: () => void;
  alertCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCopilot,
  alertCount = 4,
}) => {
  return (
    <div 
      id="mobile-bottom-nav" 
      className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-amber-900/10 shadow-lg z-40 px-2 flex items-center justify-around select-none"
    >
      {/* 1. Tổng quan */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
          activeTab === 'dashboard' ? 'text-[#8A3E00]' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#FFA31A]/20' : ''}`}>
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <span className={`text-[10px] mt-0.5 ${activeTab === 'dashboard' ? 'font-bold text-[#8A3E00]' : 'font-medium'}`}>
          Tổng quan
        </span>
      </button>

      {/* 2. Chuỗi Điểm Bán */}
      <button
        onClick={() => onSelectTab('chain')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
          activeTab === 'chain' ? 'text-[#8A3E00]' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeTab === 'chain' ? 'bg-[#FFA31A]/20' : ''}`}>
          <Store className="w-5 h-5" />
        </div>
        <span className={`text-[10px] mt-0.5 ${activeTab === 'chain' ? 'font-bold text-[#8A3E00]' : 'font-medium'}`}>
          Điểm bán
        </span>
      </button>

      {/* 3. Center Special Mascot: Trợ Lý Hương Giọt Biển */}
      <button
        onClick={onOpenCopilot}
        className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFA31A] to-[#FFC407] p-0.5 shadow-lg shadow-[#FFA31A]/40 flex items-center justify-center group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-[#FFF9ED] p-1 flex items-center justify-center">
            <HuongGiotBienMascot pose="avatar" size="sm" />
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-[#8A3E00] mt-0.5">
          AI Copilot
        </span>
      </button>

      {/* 4. Khách hàng 360 */}
      <button
        onClick={() => onSelectTab('customers')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
          activeTab === 'customers' ? 'text-[#8A3E00]' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeTab === 'customers' ? 'bg-[#FFA31A]/20' : ''}`}>
          <Users className="w-5 h-5" />
        </div>
        <span className={`text-[10px] mt-0.5 ${activeTab === 'customers' ? 'font-bold text-[#8A3E00]' : 'font-medium'}`}>
          Khách hàng
        </span>
      </button>

      {/* 5. Cảnh báo AI Business */}
      <button
        onClick={() => onSelectTab('ai_business_center')}
        className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors relative ${
          activeTab === 'ai_business_center' ? 'text-[#8A3E00]' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className={`p-1 rounded-lg relative ${activeTab === 'ai_business_center' ? 'bg-[#FFA31A]/20' : ''}`}>
          <BrainCircuit className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </div>
        <span className={`text-[10px] mt-0.5 ${activeTab === 'ai_business_center' ? 'font-bold text-[#8A3E00]' : 'font-medium'}`}>
          Cảnh báo
        </span>
      </button>
    </div>
  );
};
