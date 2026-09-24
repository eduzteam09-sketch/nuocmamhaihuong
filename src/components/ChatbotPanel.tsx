import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronDown,
  Compass,
  Cpu,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NoteName } from '../utils/musicTheory.ts';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'scale' | 'chord';
    root: NoteName;
    name: string;
  };
}

interface ChatbotPanelProps {
  onVisualizeRequest: (type: 'scale' | 'chord', root: NoteName, name: string) => void;
  currentRoot: NoteName;
  currentName: string;
  currentType: 'scale' | 'chord';
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({
  onVisualizeRequest,
  currentRoot,
  currentName,
  currentType,
}) => {
  // Required models per user prompt:
  // gemini-3.1-pro-preview for particularly complex tasks,
  // gemini-3.5-flash for general tasks,
  // gemini-3.1-flash-lite for tasks that should happen fast.
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');

  // Roles for system instruction
  const [selectedRole, setSelectedRole] = useState<'professor' | 'jazz' | 'composer' | 'lite'>('professor');

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Multi-turn conversation history maintained in state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I'm your **Music Theory AI Mentor**. We're currently exploring **${currentRoot} ${currentName}** (${currentType}). 

Feel free to ask about:
- Voice leading and reharmonization
- Tritone substitutions and modal interchange
- How to solo over this with scales & modes
- Emotional chord progressions for songwriting

What would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const rolesConfig = {
    professor: {
      name: 'Dr. Cadence',
      label: 'Theory Professor',
      desc: 'Deep voice leading, modal interchange, Roman numeral analysis',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      recommendedModel: 'gemini-3.1-pro-preview',
    },
    jazz: {
      name: 'Miles',
      label: 'Jazz Coach',
      desc: 'Tritone substitutions, Coltrane matrices, altered jazz scales',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      recommendedModel: 'gemini-3.1-pro-preview',
    },
    composer: {
      name: 'Lyra',
      label: 'Songwriting Mentor',
      desc: 'Emotional resonance, tension and release, pop & film progressions',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      recommendedModel: 'gemini-3.5-flash',
    },
    lite: {
      name: 'Max',
      label: 'Fast Assistant',
      desc: 'Direct, rapid formulas, chord spellings, and interval lookup',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      recommendedModel: 'gemini-3.1-flash-lite',
    },
  };

  const handleRoleChange = (newRole: 'professor' | 'jazz' | 'composer' | 'lite') => {
    setSelectedRole(newRole);
    // Optionally auto-suggest recommended model
    setSelectedModel(rolesConfig[newRole].recommendedModel);
  };

  const parseSuggestedAction = (content: string) => {
    const match = content.match(/\[\[VISUALIZE:\s*({.*?})\]\]/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send conversation history to server
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          model: selectedModel,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get chat response');
      }

      const rawReply = data.reply || '';
      const action = parseSuggestedAction(rawReply);
      const cleanReply = rawReply.replace(/\[\[VISUALIZE:.*?\]\]/g, '').trim();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an issue: ${err.message}. Please check your Gemini API key in Settings > Secrets.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: 'new-start',
        role: 'assistant',
        content: `Conversation reset. Ask me anything about harmony, scales, or chord substitutions!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const promptStarters = [
    `What scales work best when soloing over ${currentRoot} ${currentName}?`,
    `Give me 3 chord substitutions for ${currentRoot} ${currentName}`,
    `Explain the harmonic function and voice leading of ${currentRoot} ${currentName}`,
    `Create a 4-chord progression using ${currentRoot} ${currentName}`,
  ];

  return (
    <div
      id="gemini-chatbot-panel"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md flex flex-col h-[650px] overflow-hidden"
    >
      {/* Top Header: Role & Model Configuration */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-400 rounded-xl">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{rolesConfig[selectedRole].name}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${rolesConfig[selectedRole].badgeColor}`}>
                {rolesConfig[selectedRole].label}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {rolesConfig[selectedRole].desc}
            </p>
          </div>
        </div>

        {/* Role Selector & Model Selector */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Persona selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
            <span className="text-slate-400 mr-1.5 hidden sm:inline">Role:</span>
            <select
              id="chatbot-role-select"
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value as any)}
              className="bg-transparent text-amber-300 font-medium outline-none cursor-pointer"
            >
              <option value="professor" className="bg-slate-900 text-slate-200">
                Dr. Cadence (Theory Professor)
              </option>
              <option value="jazz" className="bg-slate-900 text-slate-200">
                Miles (Jazz Coach)
              </option>
              <option value="composer" className="bg-slate-900 text-slate-200">
                Lyra (Songwriting Mentor)
              </option>
              <option value="lite" className="bg-slate-900 text-slate-200">
                Max (Fast Assistant)
              </option>
            </select>
          </div>

          {/* Model Selector per requirement */}
          <div className="flex items-center bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
            <select
              id="chatbot-model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-indigo-300 font-mono text-[11px] outline-none cursor-pointer"
            >
              <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-slate-200">
                gemini-3.1-pro-preview (Complex)
              </option>
              <option value="gemini-3.5-flash" className="bg-slate-900 text-slate-200">
                gemini-3.5-flash (General)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-slate-200">
                gemini-3.1-flash-lite (Fast)
              </option>
            </select>
          </div>

          <button
            id="clear-chat-history-btn"
            onClick={clearHistory}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div
        id="chatbot-messages-thread"
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shrink-0 mt-0.5 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 shadow-md ${
                  isUser
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Message Body with Markdown */}
                <div className="markdown-body space-y-2 leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Suggested Action Pill if AI mentioned a chord/scale */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-400 font-medium">
                      Suggested visualizer target:
                    </span>
                    <button
                      onClick={() =>
                        onVisualizeRequest(
                          msg.suggestedAction!.type,
                          msg.suggestedAction!.root,
                          msg.suggestedAction!.name
                        )
                      }
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        Show {msg.suggestedAction.root} {msg.suggestedAction.name}
                      </span>
                    </button>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    isUser ? 'text-slate-900/70' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{rolesConfig[selectedRole].name} is analyzing harmonic theory...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
        {promptStarters.map((starter, sIdx) => (
          <button
            key={sIdx}
            type="button"
            onClick={() => handleSendMessage(starter)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-amber-300 transition-colors shrink-0 disabled:opacity-40"
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          id="chat-user-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask ${rolesConfig[selectedRole].name} about scales, chords, substitutions...`}
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
        />
        <button
          id="chat-send-btn"
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
