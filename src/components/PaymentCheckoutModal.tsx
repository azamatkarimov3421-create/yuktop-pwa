import React, { useState } from 'react';
import { Order } from '../types';
import { formatMoneyUz } from '../services/routingService';
import { storageService } from '../services/storageService';
import { 
  X, 
  CreditCard, 
  Banknote, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PaymentCheckoutModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'Click' | 'Payme' | 'Naqd pul' | 'Hisob-raqam'>('Click');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);

    if (selectedMethod === 'Click') {
      // In real merchant setup, this opens Click redirect
      // window.open(`https://my.click.uz/services/pay?service_id=YOUR_ID&merchant_id=YOUR_ID&amount=${order.agreedPriceUzs}&transaction_param=${order.orderCode}`, '_blank');
    } else if (selectedMethod === 'Payme') {
      // In real merchant setup, this opens Payme checkout
      // window.open(`https://checkout.paycom.uz/...`, '_blank');
    }

    // Simulate completion
    setTimeout(() => {
      storageService.updateOrderPayment(order.id, selectedMethod, 'tolandi');
      setIsProcessing(false);
      setIsSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/25 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-y-auto shadow-2xl border border-white/90 animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/60 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Xavfsiz To'lov</h3>
              <p className="text-[10px] text-slate-500 font-mono">Buyurtma: {order.orderCode}</p>
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

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">To'lov muvaffaqiyatli amalga oshirildi!</h3>
              <p className="text-xs text-slate-500 mt-1">
                {formatMoneyUz(order.agreedPriceUzs)} miqdoridagi to'lov {selectedMethod} orqali qabul qilindi.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Buyurtma kodi:</span>
                <strong className="text-slate-800 font-mono">{order.orderCode}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Haydovchi:</span>
                <strong className="text-slate-800">{order.driverName}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>To'lov usuli:</span>
                <strong className="text-slate-800">{selectedMethod}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-200 shadow-2xs"
            >
              Yopish
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4 text-xs text-slate-800">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                To'lanadigan summa
              </span>
              <div className="text-xl font-black text-slate-900">
                {formatMoneyUz(order.agreedPriceUzs)}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {order.pickupLocation.city} ➔ {order.deliveryLocation.city} • {order.cargoTitle}
              </p>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200/70 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="text-teal-900 block font-bold">Xavfsiz bitim (Escrow) kafolati</strong>
                <span className="text-teal-700">Mablag' haydovchi yukni to'liq topshirgunga qadar tizimda saqlanadi.</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                To'lov usulini tanlang
              </label>

              {/* Click */}
              <div
                onClick={() => setSelectedMethod('Click')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === 'Click'
                    ? 'bg-slate-100/90 border-slate-400 shadow-2xs ring-1 ring-slate-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-black text-sky-600 text-xs shrink-0">
                    CLICK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Click Up / Click ilovasi</h4>
                    <p className="text-[10px] text-slate-500">Uzcard / Humo orqali tezkor to'lov</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'Click' ? 'border-slate-800 bg-slate-800' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'Click' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Payme */}
              <div
                onClick={() => setSelectedMethod('Payme')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === 'Payme'
                    ? 'bg-slate-100/90 border-slate-400 shadow-2xs ring-1 ring-slate-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-600 text-xs shrink-0">
                    PAYME
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Payme Business</h4>
                    <p className="text-[10px] text-slate-500">Barcha bank kartalari qabul qilinadi</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'Payme' ? 'border-slate-800 bg-slate-800' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'Payme' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Naqd pul */}
              <div
                onClick={() => setSelectedMethod('Naqd pul')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === 'Naqd pul'
                    ? 'bg-slate-100/90 border-slate-400 shadow-2xs ring-1 ring-slate-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Naqd pul bilan hisob-kitob</h4>
                    <p className="text-[10px] text-slate-500">Haydovchiga to'g'ridan-to'g'ri topshiriladi</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'Naqd pul' ? 'border-slate-800 bg-slate-800' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'Naqd pul' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Hisob-raqam */}
              <div
                onClick={() => setSelectedMethod('Hisob-raqam')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === 'Hisob-raqam'
                    ? 'bg-slate-100/90 border-slate-400 shadow-2xs ring-1 ring-slate-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Hisob-raqam (Perechisleniye)</h4>
                    <p className="text-[10px] text-slate-500">Yuridik shaxslar va korxonalar uchun</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'Hisob-raqam' ? 'border-slate-800 bg-slate-800' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'Hisob-raqam' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-900 font-black text-xs border border-slate-200/90 shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>To'lov o'tkazilmoqda...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{selectedMethod} orqali to'lovni tasdiqlash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
