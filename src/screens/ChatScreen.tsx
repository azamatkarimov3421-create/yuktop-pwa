import React, { useState, useEffect, useRef } from 'react';
import { Order, ChatMessage, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  CheckCheck, 
  Sparkles
} from 'lucide-react';

interface ChatScreenProps {
  order: Order;
  activeRole: UserRole;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  order,
  activeRole,
  onBack
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCarrier = activeRole === 'yuk_tashuvchi';
  const partnerName = isCarrier ? order.ownerName : order.driverName;
  const partnerPhone = isCarrier ? order.ownerPhone : order.driverPhone;

  useEffect(() => {
    const load = () => {
      setMessages(storageService.getMessagesForOrder(order.id));
    };
    load();
    const unsub = storageService.subscribe(load);
    return unsub;
  }, [order.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    storageService.sendMessage(order.id, text);
    setInputText('');

    setTimeout(() => {
      const mockReplies = [
        'Qabul qildim, rahmat! Hammasi nazorat ostida.',
        'Tushunarli, aytilgan vaqtda manzilga yetib boraman.',
        'Hujjatlar tayyor, yuk ortilgach xabar beraman.',
        'Aloqadaman, marshrut bo\'yicha ketyapman.'
      ];
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      const partnerRole: UserRole = isCarrier ? 'yuk_beruvchi' : 'yuk_tashuvchi';
      storageService.sendMessage(order.id, randomReply, {
        id: isCarrier ? order.ownerId : order.driverId,
        role: partnerRole,
        name: partnerName
      });
    }, 1800);
  };

  const quickReplies = isCarrier
    ? [
        'Yo\'ldaman, tez orada yetib boraman',
        'Yuklash joyidaman, mashinani qo\'ydim',
        'Tushirish joyida odamlar bormi?'
      ]
    : [
        'Yuk tayyor, yuklashni boshlaymiz',
        'Aniq lokatsiya xaritada ko\'rsatilgan',
        'Hujjatlar tayyorlandi'
      ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-md md:max-w-2xl mx-auto bg-white/75 backdrop-blur-2xl rounded-[32px] border border-white/85 shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-2xl border-b border-white/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-600 hover:bg-white transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-800 font-extrabold flex items-center justify-center text-xs border border-teal-200/60">
              {partnerName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>{partnerName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {order.orderCode}
              </div>
            </div>
          </div>
        </div>

        <a
          href={`tel:${partnerPhone}`}
          className="w-9 h-9 rounded-full bg-teal-500/15 text-teal-800 hover:bg-teal-500/25 border border-teal-200/80 flex items-center justify-center transition-colors active:scale-95 shadow-2xs backdrop-blur-md"
          title="Qo'ng'iroq"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-white/30 backdrop-blur-md">
        <div className="text-center my-1">
          <span className="text-[10px] bg-white/80 backdrop-blur-md text-slate-500 px-3 py-1 rounded-full border border-white/80 shadow-2xs font-medium">
            "{order.cargoTitle}" bo'yicha yozishma
          </span>
        </div>

        {messages.map(msg => {
          const isMe = msg.senderRole === activeRole;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                  isMe
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : 'bg-white/85 backdrop-blur-md text-slate-800 border border-white/90 rounded-bl-xs'
                }`}
              >
                <div className="text-[9px] font-bold opacity-75 mb-0.5">
                  {msg.senderName}
                </div>
                <div className="leading-relaxed font-medium">{msg.text}</div>
                <div className="flex items-center justify-end gap-1 text-[8px] opacity-70 mt-1">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-teal-200" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-3 py-2 bg-white/60 backdrop-blur-md border-t border-white/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-1" />
        {quickReplies.map((qr, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(qr)}
            className="px-3 py-1 rounded-full bg-white/70 hover:bg-teal-50 hover:text-teal-800 text-slate-600 whitespace-nowrap transition-colors border border-white/80 active:scale-95 shadow-2xs backdrop-blur-md"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white/75 backdrop-blur-xl border-t border-white/80 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Xabar yozing..."
          className="flex-1 px-4 py-2.5 bg-white/70 backdrop-blur-md rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 border border-white/85 focus:bg-white placeholder:text-slate-400 shadow-2xs"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-teal-700/25 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
