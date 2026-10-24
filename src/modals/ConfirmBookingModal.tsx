import React from 'react';
import { TruckItem } from '../types';
import { TruckIllustration } from '../components/TruckIllustration';
import { Check, X, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfirmBookingModalProps {
  truck: TruckItem;
  fromCity: string;
  toCity: string;
  weight: string;
  cargoType: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({
  truck,
  fromCity,
  toCity,
  weight,
  cargoType,
  onConfirm,
  onClose
}) => {
  const handleConfirmClick = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
    onConfirm();
  };

  return (
    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Buyurtmani Tasdiqlash</h3>
            <span className="text-xs text-slate-400">YUKTOP Kafolati bilan</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Truck Card */}
        <div className="my-4 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center space-x-3.5">
          <div className="w-16 h-12 bg-white rounded-xl flex items-center justify-center p-1 border border-blue-100">
            <TruckIllustration type={truck.category} className="w-14 h-10 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">{truck.name}</h4>
              <span className="font-extrabold text-[#0B63F6] text-base">${truck.price}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">{truck.capacity}</span>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-2 py-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> Yo'nalish:
            </span>
            <span className="font-bold text-slate-800">{fromCity} → {toCity}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-orange-500" /> Yuk / Og'irlik:
            </span>
            <span className="font-bold text-slate-800">{cargoType} • {weight} kg</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Sug'urta:
            </span>
            <span className="font-bold text-emerald-600">Bepul ta'minlangan ($50,000)</span>
          </div>
        </div>

        {/* Confirm Action Button */}
        <button
          onClick={handleConfirmClick}
          className="w-full mt-4 py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7A00] active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Buyurtmani Rasmiylashtirish (${truck.price})</span>
        </button>
      </div>
    </div>
  );
};
