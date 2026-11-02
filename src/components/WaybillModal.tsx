import React, { useState } from 'react';
import { Order } from '../types';
import { formatMoneyUz } from '../services/routingService';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  QrCode, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  Phone,
  Copy,
  Check
} from 'lucide-react';

interface WaybillModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ order, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const validYear = isNaN(createdDate.getFullYear()) ? new Date().getFullYear() : createdDate.getFullYear();
  const waybillNumber = `TTN-${order.orderCode || 'UZ'}-${validYear}`;

  const handleCopyLink = () => {
    const text = `🚚 ELEKTRON YUK XATI (TTN)\nHujjat №: ${waybillNumber}\nYuk: ${order.cargoTitle || ''}\nYo'nalish: ${order.pickupLocation?.city || ''} ➔ ${order.deliveryLocation?.city || ''}\nHaydovchi: ${order.driverName || ''} (${order.vehiclePlate || ''})\nYuk egasi: ${order.ownerName || ''}\nSumma: ${formatMoneyUz(order.agreedPriceUzs || 0)}\nStatus: ${(order.status || '').toUpperCase()}\nTekshirish: https://yuktop-pwa.vercel.app/`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🚚 ELEKTRON YUK XATI (TTN)\n` +
      `№ ${waybillNumber}\n\n` +
      `📍 Yo'nalish: ${order.pickupLocation?.city || ''} ➔ ${order.deliveryLocation?.city || ''}\n` +
      `📦 Yuk: ${order.cargoTitle || ''} (${((order.weightKg || 0) / 1000).toFixed(1)} t • ${order.volumeM3 || 0} m³)\n` +
      `🚛 Haydovchi: ${order.driverName || ''} (${order.vehicleModel || ''}, ${order.vehiclePlate || ''})\n` +
      `📞 Aloqa: ${order.driverPhone || ''}\n` +
      `💰 Summa: ${formatMoneyUz(order.agreedPriceUzs || 0)} (${order.paymentMethod || 'Naqd'})\n` +
      `✅ Holati: ${order.status === 'yetkazildi' ? 'Yetkazildi' : 'Yo\'lda / Faol'}\n\n` +
      `YUKTOP tizimi orqali rasmiylashtirilgan:`
    );
    window.open(`https://t.me/share/url?url=https://yuktop-pwa.vercel.app/&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/25 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-y-auto shadow-2xl border border-white/90 animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle for mobile */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/60 rounded-full" />
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Elektron Yuk Xati (TTN)</h3>
              <p className="text-[10px] text-slate-500 font-mono">{waybillNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Document Body */}
        <div className="p-5 space-y-4 text-xs text-slate-800">
          {/* Official Document Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md inline-block">
                  O'zbekiston Respublikasi • Logistika Hujjati
                </span>
                <h2 className="text-sm font-black text-slate-900 mt-1">
                  YUKTOP Tovarno-Transportnaya Nakladnaya
                </h2>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Rasmiylashtirilgan sana: {isNaN(createdDate.getTime()) ? 'Bugun' : createdDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* QR Code Graphic */}
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 text-center">
                <QrCode className="w-12 h-12 text-slate-800 mx-auto" />
                <span className="text-[8px] font-mono text-slate-400 font-bold block mt-0.5">VERIFIED</span>
              </div>
            </div>

            {/* Official Stamp Badge */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-800 font-bold">
                Tizimda tekshirilgan va raqamli ro'yxatga olingan
              </span>
            </div>
          </div>

          {/* 1. Tomonlar (Yuk egasi & Haydovchi) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Yuk egasi */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1. Yuk yuboruvchi (Shipper)
              </span>
              <p className="text-xs font-black text-slate-900">{order.ownerName}</p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-slate-400" />
                {order.ownerPhone}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {order.pickupLocation.city}, {order.pickupLocation.address}
              </p>
            </div>

            {/* Haydovchi */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                2. Yuk tashuvchi (Carrier)
              </span>
              <p className="text-xs font-black text-slate-900">{order.driverName}</p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                <Truck className="w-3 h-3 text-slate-400" />
                {order.vehicleModel} ({order.vehiclePlate})
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Tel: {order.driverPhone}
              </p>
            </div>
          </div>

          {/* 2. Marshrut & Vaqt */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              3. Yo'nalish va Yetkazish
            </span>

            <div className="flex items-center justify-between text-xs font-bold text-slate-900 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>{order.pickupLocation.city}</span>
              </div>
              <span className="text-slate-400 font-normal">➔</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{order.deliveryLocation.city}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Masofa: <strong className="text-slate-800">{order.distanceKm} km</strong></span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Rejalashtirilgan: {order.deliveryDate}
              </span>
            </div>
          </div>

          {/* 3. Yuk xarakteristikasi */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              4. Yuk Tavsifi
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-400 block">Kategoriya</span>
                <span className="text-[11px] font-bold text-slate-800 truncate block">{order.category}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-400 block">Og'irlik</span>
                <span className="text-[11px] font-bold text-slate-800 block">{(order.weightKg / 1000).toFixed(1)} t</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-400 block">Hajm</span>
                <span className="text-[11px] font-bold text-slate-800 block">{order.volumeM3} m³</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-400 block">Yuk turi</span>
                <span className="text-[11px] font-bold text-slate-800 block">{order.loadType === 'yigma_yuk' ? "Yig'ma" : "To'liq"}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 italic pt-1">
              "{order.cargoTitle}"
            </p>
          </div>

          {/* 4. Moliyaviy qism */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Kelishilgan summa & To'lov
              </span>
              <span className="text-base font-black text-slate-900">
                {formatMoneyUz(order.agreedPriceUzs)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {order.paymentMethod} • {order.paymentStatus === 'tolandi' ? 'To\'langan' : 'Kutilmoqda'}
              </span>
            </div>
            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border ${
                order.status === 'yetkazildi' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {order.status === 'yetkazildi' ? '✓ YETKAZILGAN' : '● YO\'LDA'}
              </span>
            </div>
          </div>

          {/* Pastki Amallar */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareTelegram}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs active:scale-95 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Telegramda yuborish</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs active:scale-95 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Nusxalandi!' : 'Nusxa olish'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-2xs active:scale-95 transition-all"
              title="Chop etish"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
