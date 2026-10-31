import React from 'react';
import { NotificationItem } from '../types';
import { storageService } from '../services/storageService';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Truck, 
  DollarSign, 
  Info,
  ArrowLeft
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onSelectOrder?: (orderId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectOrder
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    storageService.markNotificationsRead();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'bid':
        return <DollarSign className="w-3.5 h-3.5 text-amber-600" />;
      case 'order':
        return <Truck className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/25 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-md bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] p-5 shadow-2xl border border-white/85 animate-in slide-in-from-bottom duration-200 max-h-[85vh] flex flex-col">
        <div className="pt-1 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/60 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 hover:bg-white text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Orqaga qaytish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-800 flex items-center justify-center border border-teal-200/50">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Bildirishnomalar</h2>
              <p className="text-[10px] text-slate-500">Takliflar va yangiliklar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="py-2.5 flex items-center justify-between text-xs px-1">
          <span className="text-slate-500 font-medium text-[11px]">Jami: {notifications.length} ta</span>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 text-[11px]"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Barchasini o'qilgan qilish
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Yangi bildirishnomalar yo'q.
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.relatedOrderId && onSelectOrder) {
                    onSelectOrder(notif.relatedOrderId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1 ${
                  !notif.isRead
                    ? 'bg-teal-500/15 border-teal-200/80 shadow-2xs backdrop-blur-md'
                    : 'bg-white/60 backdrop-blur-md border-white/80 hover:bg-white/85 shadow-2xs'
                } ${notif.relatedOrderId ? 'cursor-pointer active:scale-99' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                    {getIcon(notif.type)}
                    <span>{notif.title}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {notif.createdAt}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed pl-5">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
