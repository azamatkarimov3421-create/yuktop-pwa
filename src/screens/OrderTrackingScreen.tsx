import React, { useState } from 'react';
import { Order, OrderStatus, UserRole } from '../types';
import { TrackingMap } from '../components/TrackingMap';
import { StatusBadge } from '../components/StatusBadge';
import { formatMoneyUz, formatDurationUz } from '../services/routingService';
import { 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Package, 
  ChevronRight,
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderTrackingScreenProps {
  order: Order;
  activeRole: UserRole;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onOpenChat: (orderId: string) => void;
  onOpenReviewModal: (order: Order) => void;
  onBack: () => void;
  onOpenWaybill?: (order: Order) => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
  order,
  activeRole,
  onUpdateStatus,
  onOpenChat,
  onOpenReviewModal,
  onBack,
  onOpenWaybill
}) => {
  const isCarrier = activeRole === 'yuk_tashuvchi';

  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'kelishildi', label: 'Kelishildi' },
    { key: 'yuklashda', label: 'Yuklashda' },
    { key: 'yolda', label: 'Yo‘lda' },
    { key: 'yetkazildi', label: 'Yetkazildi' }
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'kelishildi': return 0;
      case 'yuklashda': return 1;
      case 'yolda': return 2;
      case 'yetkazildi': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleNextStatus = () => {
    if (order.status === 'kelishildi') {
      onUpdateStatus(order.id, 'yuklashda');
    } else if (order.status === 'yuklashda') {
      onUpdateStatus(order.id, 'yolda');
    } else if (order.status === 'yolda') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onUpdateStatus(order.id, 'yetkazildi');
    }
  };

  const telegramHandle = (isCarrier
    ? (order.ownerTelegram || order.ownerPhone.replace(/[^0-9]/g, ''))
    : (order.driverTelegram || order.driverPhone.replace(/[^0-9]/g, ''))
  ).replace(/^@/, '');

  return (
    <div className="space-y-3.5 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/85 text-xs font-bold text-slate-700 shadow-2xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ortga</span>
        </button>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} size="sm" />
          <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/75 backdrop-blur-md border border-white/85 px-2.5 py-0.5 rounded-full shadow-2xs">
            {order.orderCode}
          </span>
        </div>
      </div>

      {/* Modern Stepper Progress Bar */}
      <div className="p-3.5 xs:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-4 left-7 right-7 h-1 bg-slate-200/60 -z-0" />
          <div 
            className="absolute top-4 left-7 h-1 bg-teal-600 transition-all duration-500 -z-0"
            style={{ width: `${(currentStepIdx / (steps.length - 1)) * 82}%` }}
          />

          {steps.map((st, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={st.key} className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-700/30 ring-4 ring-teal-50/80'
                      : 'bg-white/80 backdrop-blur-md border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${isCurrent ? 'text-teal-900 font-bold' : 'text-slate-400'}`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Map */}
      <TrackingMap
        order={order}
        isCarrierView={isCarrier}
      />

      {/* Quick TTN Button */}
      {onOpenWaybill && (
        <button
          type="button"
          onClick={() => onOpenWaybill(order)}
          className="w-full p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/90 flex items-center justify-between text-left shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                <span>Elektron Yuk Xati (TTN / Nakladnoy)</span>
                <span className="text-[9px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded font-bold">Tekshirish</span>
              </div>
              <div className="text-[10px] text-teal-700/80">
                Rasmiy QR-kodli yuk hujjati va marshrut ma'lumotlari
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-teal-700" />
        </button>
      )}

      {/* Order Info Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-teal-700 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-200/60">
              {order.category}
            </span>
            <span className="text-[9px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-white/80">
              {order.paymentMethod}
            </span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 mt-1">
            {order.cargoTitle}
          </h2>
          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
            <span>{(order.weightKg / 1000).toFixed(1)} tonna</span>
            <span className="text-slate-300">•</span>
            <span>{order.volumeM3} m³</span>
            <span className="text-slate-300">•</span>
            <span className="font-extrabold text-teal-700">{formatMoneyUz(order.agreedPriceUzs)}</span>
          </div>
        </div>

        {/* Counterpart Card with Telegram & Phone */}
        <div className="p-3 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-between border border-white/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0 border border-teal-200/50">
              {isCarrier ? order.ownerName.slice(0, 2).toUpperCase() : order.driverName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                <span className="truncate">{isCarrier ? order.ownerName : order.driverName}</span>
                {!isCarrier && (
                  <span className="flex items-center text-amber-500 text-[10px] font-bold shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" /> {order.driverRating}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {isCarrier ? 'Yuk egasi' : `${order.vehicleModel} (${order.vehiclePlate})`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={`https://t.me/${telegramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 shadow-2xs active:scale-95 transition-all"
              title="Telegram"
            >
              <Send className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => onOpenChat(order.id)}
              className="p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 hover:bg-white shadow-2xs active:scale-95 transition-all"
              title="Chat"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>

            <a
              href={`tel:${isCarrier ? order.ownerPhone : order.driverPhone}`}
              className="p-2.5 rounded-full bg-teal-700 text-white hover:bg-teal-800 shadow-md shadow-teal-700/20 active:scale-95 transition-all"
              title="Qo'ng'iroq"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Status Transition Action Buttons */}
        <div className="pt-1">
          {isCarrier ? (
            <div>
              {order.status === 'kelishildi' && (
                <button
                  type="button"
                  onClick={handleNextStatus}
                  className="w-full py-3.5 px-4 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>1-bosqich: Yuklash joyiga yetib keldim</span>
                </button>
              )}

              {order.status === 'yuklashda' && (
                <button
                  type="button"
                  onClick={handleNextStatus}
                  className="w-full py-3.5 px-4 rounded-full bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>2-bosqich: Yuk ortildi, yo'lga chiqdim (GPS boshlandi)</span>
                </button>
              )}

              {order.status === 'yolda' && (
                <button
                  type="button"
                  onClick={handleNextStatus}
                  className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>3-bosqich: Manzilga yetkazdim va yakunladim</span>
                </button>
              )}

              {order.status === 'yetkazildi' && (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-xs font-bold border border-emerald-200">
                    🎉 Reys muvaffaqiyatli yetkazildi va yakunlandi!
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex-1 py-3 px-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs text-center shadow-md active:scale-95 transition-all"
                    >
                      Bozorga qaytish (Yangi yuklar)
                    </button>
                    {onOpenWaybill && (
                      <button
                        type="button"
                        onClick={() => onOpenWaybill(order)}
                        className="py-3 px-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-2xs"
                      >
                        TTN Hujjati
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {order.status === 'yetkazildi' && (
                <button
                  type="button"
                  onClick={() => onOpenReviewModal(order)}
                  className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-teal-700 to-sky-700 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Yetkazilganligini tasdiqlash va Haydovchini baholash</span>
                </button>
              )}

              {order.status !== 'yetkazildi' && (
                <div className="p-3 bg-sky-50/80 text-sky-800 rounded-2xl text-xs font-medium border border-sky-200/80 flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-sky-600" />
                  <span>Haydovchi faol reysda. Xaritada jonli GPS orqali mashina harakatini kuzatishingiz mumkin.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
