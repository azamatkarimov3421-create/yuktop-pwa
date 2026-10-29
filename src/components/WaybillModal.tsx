import React from 'react';
import { Order, CargoItem } from '../types';
import { formatMoneyUz } from '../services/routingService';
import { 
  X, 
  Download, 
  Share2, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Package, 
  Calendar, 
  FileText,
  Building,
  QrCode,
  ArrowLeft
} from 'lucide-react';

interface WaybillModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  cargo?: CargoItem | null;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({
  isOpen,
  onClose,
  order,
  cargo
}) => {
  if (!isOpen || (!order && !cargo)) return null;

  const orderCode = order ? order.orderCode : `CRG-${cargo?.id.slice(-4)}`;
  const title = order ? order.cargoTitle : cargo?.title;
  const category = order ? order.category : cargo?.category;
  const weightKg = order ? order.weightKg : (cargo?.weightKg || 0);
  const volumeM3 = order ? order.volumeM3 : (cargo?.volumeM3 || 0);
  const price = order ? order.agreedPriceUzs : (cargo?.priceUzs || 0);
  const paymentMethod = order ? order.paymentMethod : (cargo?.paymentMethod || 'Naqd pul');
  const pickupLocation = order ? order.pickupLocation : cargo?.pickupLocation;
  const deliveryLocation = order ? order.deliveryLocation : cargo?.deliveryLocation;
  const pickupDate = order ? order.pickupDate : cargo?.pickupDate;
  const deliveryDate = order ? order.deliveryDate : cargo?.deliveryDate;
  const distanceKm = order ? order.distanceKm : (cargo?.distanceKm || 0);
  const ownerName = order ? order.ownerName : cargo?.ownerName;
  const ownerPhone = order ? order.ownerPhone : cargo?.ownerPhone;
  const driverName = order ? order.driverName : 'Biriktirilmoqda';
  const driverPhone = order ? order.driverPhone : '+998 9X XXX-XX-XX';
  const vehicleModel = order ? order.vehicleModel : 'Yuk mashinasi';
  const vehiclePlate = order ? order.vehiclePlate : '---';

  const ttnNumber = `TTN-UZ-${orderCode.replace(/[^0-9]/g, '') || '8941'}/2026`;
  const issueDate = new Date().toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Elektron TTN - ${ttnNumber}`,
        text: `YUKTOP Elektron Yuk Xati #${ttnNumber} (${pickupLocation?.city} -> ${deliveryLocation?.city})`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert(`Elektron Yuk Xati nusxasi havolasi buferga nusxalandi: #${ttnNumber}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col shadow-2xl border border-white/85 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/85 backdrop-blur-2xl text-white border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 active:scale-95"
              title="Orqaga qaytish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-400/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wide">ELEKTRON YUK XATI (TTN)</span>
              <span className="text-[10px] text-teal-300 font-mono block">{ttnNumber}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content - Printable Certificate */}
        <div className="flex-1 overflow-y-auto p-4 xs:p-6 space-y-4 text-slate-800 text-xs">
          {/* Header Seal */}
          <div className="p-3.5 bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-sky-500/15 backdrop-blur-xl rounded-2xl border border-white/85 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-black text-teal-950 uppercase tracking-tight">
                  O'zbekiston Logistika Standarti
                </div>
                <div className="text-[10px] text-teal-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Raqamli ro'yxatdan o'tgan hujjat
                </div>
              </div>
            </div>

            {/* Simulated QR Code */}
            <div className="p-1.5 bg-white/85 backdrop-blur-md rounded-xl border border-white/80 shadow-2xs flex flex-col items-center">
              <QrCode className="w-9 h-9 text-slate-800" />
              <span className="text-[8px] font-mono text-slate-500 mt-0.5">YUKTOP QR</span>
            </div>
          </div>

          {/* Document Meta */}
          <div className="grid grid-cols-2 gap-2 text-[10px] xs:text-[11px]">
            <div className="p-2.5 bg-white/60 backdrop-blur-md rounded-xl border border-white/80 shadow-2xs">
              <span className="text-slate-400 block font-medium">Hujjat raqami:</span>
              <span className="font-mono font-bold text-slate-900">{ttnNumber}</span>
            </div>
            <div className="p-2.5 bg-white/60 backdrop-blur-md rounded-xl border border-white/80 shadow-2xs">
              <span className="text-slate-400 block font-medium">Berilgan sana:</span>
              <span className="font-bold text-slate-900">{issueDate}</span>
            </div>
          </div>

          {/* Parties: Shipper & Carrier */}
          <div className="space-y-2.5">
            {/* Shipper */}
            <div className="p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/85 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-200/60">
                  Yuk Beruvchi (Jo'natuvchi)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{ownerPhone}</span>
              </div>
              <div className="font-bold text-xs text-slate-900">{ownerName}</div>
              <div className="text-[10px] text-slate-500 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Yuklash:</strong> {pickupLocation?.city}, {pickupLocation?.address}</span>
              </div>
            </div>

            {/* Carrier / Driver */}
            <div className="p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/85 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-200/60">
                  Yuk Tashuvchi (Haydovchi)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{driverPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-slate-900">{driverName}</div>
                <div className="font-mono text-[10px] font-bold bg-white/80 backdrop-blur-md px-2 py-0.5 rounded text-slate-700 border border-white/80">
                  {vehiclePlate}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-sky-600 shrink-0" />
                <span>Transport: <strong>{vehicleModel}</strong></span>
              </div>
              <div className="text-[10px] text-slate-500 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Yetkazish:</strong> {deliveryLocation?.city}, {deliveryLocation?.address}</span>
              </div>
            </div>
          </div>

          {/* Cargo Specifications Table */}
          <div className="border border-white/85 bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xs">
            <div className="bg-white/60 px-3 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-white/80">
              Yuk Ko'rsatkichlari va Shartlari
            </div>
            <div className="divide-y divide-slate-100/80 text-[11px]">
              <div className="p-2.5 flex justify-between">
                <span className="text-slate-400">Yuk tavsifi:</span>
                <span className="font-bold text-slate-800 text-right">{title}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-slate-400">Toifasi:</span>
                <span className="font-semibold text-slate-700">{category}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-slate-400">Og'irligi va hajmi:</span>
                <span className="font-bold text-slate-800">
                  {(weightKg / 1000).toFixed(1)} t • {volumeM3} m³
                </span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-slate-400">Masofa:</span>
                <span className="font-bold text-slate-800">{distanceKm} km</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-slate-400">Yuklash / Yetkazish:</span>
                <span className="font-medium text-slate-700">{pickupDate} ➔ {deliveryDate}</span>
              </div>
              <div className="p-2.5 flex justify-between bg-teal-500/10">
                <span className="text-teal-900 font-bold">To'lov usuli:</span>
                <span className="font-extrabold text-teal-800">{paymentMethod}</span>
              </div>
              <div className="p-2.5 flex justify-between bg-teal-500/15 items-center">
                <span className="text-teal-950 font-black">Xizmat qiymati:</span>
                <span className="text-sm font-black text-teal-700">{formatMoneyUz(price)}</span>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <p className="text-[9px] text-slate-400 leading-relaxed text-center px-2">
            Ushbu elektron yuk xati O‘zbekiston Respublikasi Fuqarolik kodeksi hamda transportda yuk tashish qoidalariga muvofiq rasmiylashtirilgan bo‘lib, YUKTOP tizimi orqali raqamli tasdiqlangan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-3.5 bg-white/70 backdrop-blur-xl border-t border-white/80 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-full bg-white/80 border border-white/80 text-slate-700 hover:bg-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all backdrop-blur-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Ulashish</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Saqlash / Chop etish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
