import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Flame,
  CornerDownLeft
} from 'lucide-react';
import { Customer, StoreNode } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  stores: StoreNode[];
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  customers,
  stores,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-01',
      sender: 'ai',
      text: 'Chào bạn! Mình là **Hương Giọt Biển** – linh vật và người bạn đồng hành thấu cảm của Nước mắm Hải Hương.\n\nMình luôn túc trực để hỗ trợ bạn: phân tích chu kỳ cạn mắm của khách hàng, cảnh báo đứt hàng tại các điểm mạng lưới phân phối, và soạn lời thăm hỏi đượm vị tình thân.\n\nHôm nay bạn muốn cùng mình phân tích điều gì?',
      timestamp: 'Vừa xong'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Phân tích 3 khách hàng VIP có nguy cơ rời bỏ và gợi ý chăm sóc?',
    'Điểm bán nào trong mạng lưới chuỗi sắp hết mắm Cốt Nhĩ 40N?',
    'Dự báo mở chượp lô mới tại nhà thùng cá cơm Phú Quốc?',
    'Soạn tin nhắn Zalo gửi khách trễ chu kỳ mua mắm đượm vị tình thân?'
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          contextData: {
            brandName: 'Nước Mắm Hải Hương - Người Bạn Tận Tâm',
            mascot: 'Hương Giọt Biển',
            totalCustomers: customers.length,
            highChurnCount: customers.filter(c => c.churnRisk === 'High').length,
            sampleCustomers: customers.slice(0, 4).map(c => ({
              name: c.name,
              cycle: c.purchaseCycleDays,
              daysSince: c.daysSinceLastPurchase,
              pref: c.tastePreference.proteinPreference,
              churnRisk: c.churnRisk,
            })),
            storeCount: stores.length,
            outOfStockStores: stores.filter(s => s.stockStatus.includes('Cảnh báo')).map(s => s.name)
          }
        })
      });

      const data = await response.json();

      const replyContent = data.reply || (data.error ? `Lỗi kết nối AI: ${data.error}` : 'Chào bạn! Hương Giọt Biển đã hoàn tất phân tích dữ liệu.');

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Hương Giọt Biển đã kết nối dữ liệu. Bạn vui lòng thử bấm lại câu hỏi để mình phản hồi chi tiết nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-copilot-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150">
      <div 
        id="ai-copilot-drawer"
        className="w-full sm:max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-amber-200 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-[#3D1B00] via-[#5C2700] to-[#2E1200] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9ED] p-1 flex items-center justify-center border border-[#FFA31A] shadow-xs">
              <HuongGiotBienMascot pose="avatar" size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-white">Hương Giọt Biển AI</h3>
                <span className="text-[10px] bg-[#FFA31A]/30 text-[#FFC407] font-bold px-1.5 py-0.2 rounded border border-[#FFA31A]/40">
                  Linh Vật Hải Hương
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-tight">
                Người bạn tận tâm • Trợ lý thấu cảm chuỗi
              </p>
            </div>
          </div>

          <button 
            id="btn-close-copilot-drawer"
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng trợ lý"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot Greeting Banner inside drawer */}
        <div className="bg-[#FFF9ED] px-4 py-2.5 border-b border-[#FFA31A]/20 flex items-center gap-3">
          <div className="w-8 h-8 shrink-0">
            <HuongGiotBienMascot pose="standing" size="sm" />
          </div>
          <p className="text-xs text-[#5C2700] leading-tight font-medium">
            Sẵn sàng hỗ trợ hỏi đáp dữ liệu <strong>khách hàng, kho bãi & điều phối chuỗi</strong> theo thời gian thực.
          </p>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FCF9F2]">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-end justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-full bg-[#FFF9ED] border border-[#FFA31A] p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                    <HuongGiotBienMascot pose="avatar" size="sm" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isAi 
                    ? 'bg-white text-[#2E1200] border border-amber-200/80 rounded-tl-xs' 
                    : 'bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-[#3D1B00] font-medium rounded-tr-xs shadow-xs'
                }`}>
                  {isAi ? (
                    <div className="markdown-body space-y-2 [&>h3]:font-bold [&>h3]:text-stone-900 [&>h3]:text-sm [&>h3]:mt-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:space-y-1 [&>p]:leading-relaxed [&>blockquote]:border-l-2 [&>blockquote]:border-[#FFA31A] [&>blockquote]:pl-2.5 [&>blockquote]:italic [&>blockquote]:text-stone-700">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{msg.text}</div>
                  )}
                  <div className={`text-[10px] mt-1.5 ${isAi ? 'text-stone-400' : 'text-[#3D1B00]/70'} text-right`}>
                    {msg.timestamp}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-7 h-7 rounded-full bg-[#8A3E00] text-amber-100 font-bold text-[11px] flex items-center justify-center shrink-0">
                    Bạn
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#8A3E00] bg-white p-3 rounded-2xl border border-amber-200/80 w-fit shadow-xs">
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-[#FFA31A] border-t-transparent" />
              <span>Hương Giọt Biển đang suy ngẫm dữ liệu...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 bg-white border-t border-amber-100 shrink-0">
          <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFA31A]" />
            <span>Câu hỏi thấu cảm gợi ý:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="text-[11px] bg-amber-50 hover:bg-[#FFA31A]/20 hover:text-[#8A3E00] text-stone-700 px-2.5 py-1 rounded-lg border border-amber-200/60 transition-colors text-left cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-amber-200/80 shrink-0 flex items-center gap-2">
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Hỏi Hương Giọt Biển về khẩu vị, tồn kho, chuỗi điểm bán..."
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-amber-50/50 border border-amber-200 rounded-xl text-[#3D1B00] placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFA31A]/50 transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] hover:brightness-105 disabled:opacity-40 text-[#3D1B00] font-bold shadow-xs transition-all cursor-pointer"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
