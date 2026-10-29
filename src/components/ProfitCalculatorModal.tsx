import React, { useState, useEffect } from 'react';
import { formatMoneyUz } from '../services/routingService';
import { 
  X, 
  Fuel, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ProfitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDistanceKm?: number;
  initialPriceUzs?: number;
  onApplyPrice?: (priceUzs: number) => void;
}

type FuelType = 'Dizel' | 'Metan gaz' | 'Propan gaz';

interface FuelSpec {
  name: FuelType;
  pricePerUnit: number;
  unit: string;
  defaultConsumption: number; // per 100km
}

const FUEL_TYPES: Record<FuelType, FuelSpec> = {
  'Dizel': {
    name: 'Dizel',
    pricePerUnit: 12500,
    unit: 'litr',
    defaultConsumption: 30
  },
  'Metan gaz': {
    name: 'Metan gaz',
    pricePerUnit: 3950,
    unit: 'm³',
    defaultConsumption: 26
  },
  'Propan gaz': {
    name: 'Propan gaz',
    pricePerUnit: 6500,
    unit: 'litr',
    defaultConsumption: 28
  }
};

export const ProfitCalculatorModal: React.FC<ProfitCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialDistanceKm = 300,
  initialPriceUzs = 4000000,
  onApplyPrice
}) => {
  if (!isOpen) return null;

  const [tripPrice, setTripPrice] = useState<number>(initialPriceUzs);
  const [distanceKm, setDistanceKm] = useState<number>(initialDistanceKm);
  const [selectedFuel, setSelectedFuel] = useState<FuelType>('Dizel');
  const [fuelPricePerUnit, setFuelPricePerUnit] = useState<number>(FUEL_TYPES['Dizel'].pricePerUnit);
  const [consumptionPer100Km, setConsumptionPer100Km] = useState<number>(FUEL_TYPES['Dizel'].defaultConsumption);
  const [otherExpenses, setOtherExpenses] = useState<number>(200000); // Yo'l oziq-ovqat, amortizatsiya, to'xtash joylari

  // Update presets when fuel changes
  const handleSelectFuel = (fuel: FuelType) => {
    setSelectedFuel(fuel);
    setFuelPricePerUnit(FUEL_TYPES[fuel].pricePerUnit);
    setConsumptionPer100Km(FUEL_TYPES[fuel].defaultConsumption);
  };

  useEffect(() => {
    setTripPrice(initialPriceUzs);
    setDistanceKm(initialDistanceKm);
  }, [initialPriceUzs, initialDistanceKm]);

  // Calculations
  const requiredFuelUnits = (distanceKm / 100) * consumptionPer100Km;
  const totalFuelCost = Math.round(requiredFuelUnits * fuelPricePerUnit);
  const totalExpenses = totalFuelCost + otherExpenses;
  const netProfit = tripPrice - totalExpenses;
  const profitMarginPercent = tripPrice > 0 ? Math.round((netProfit / tripPrice) * 100) : 0;
  const profitPerKm = distanceKm > 0 ? Math.round(netProfit / distanceKm) : 0;

  const isHighlyProfitable = profitMarginPercent >= 50;
  const isFair = profitMarginPercent >= 25 && profitMarginPercent < 50;
  const isLowProfit = profitMarginPercent < 25;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col shadow-2xl border border-white/85 overflow-hidden">
        {/* Header */}
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
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wide">HAYDOVCHI SOF FOYDA KALKULYATORI</span>
              <span className="text-[10px] text-teal-300 block">Yoqilg'i va chistiy daromad tahlili</span>
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

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-4 xs:p-5 space-y-4 text-xs">
          {/* Result Card (Chistiy Foyda) */}
          <div className={`p-4 rounded-3xl border text-white transition-all ${
            netProfit <= 0 
              ? 'bg-rose-900/85 backdrop-blur-xl border-rose-500/50 shadow-rose-900/20'
              : isHighlyProfitable 
              ? 'bg-gradient-to-br from-teal-800/85 to-emerald-700/85 backdrop-blur-xl border-emerald-400/40 shadow-emerald-900/20'
              : 'bg-slate-900/85 backdrop-blur-xl border-teal-500/30'
          } shadow-lg space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200">
                Cho'ntakka qoladigan sof foyda:
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isHighlyProfitable ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30' : 'bg-white/15 text-white'
              }`}>
                {profitMarginPercent}% marja
              </span>
            </div>

            <div className="text-2xl xs:text-3xl font-black tracking-tight">
              {formatMoneyUz(netProfit)}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[10px] text-slate-200">
              <div>
                1 km uchun daromad: <strong className="text-white font-mono">{formatMoneyUz(profitPerKm)}</strong>
              </div>
              <div className="flex items-center gap-1 font-bold">
                {isHighlyProfitable && <span className="text-emerald-300">🔥 Yuqori foydali reys</span>}
                {isFair && <span className="text-teal-200">✓ Yaxshi foydali reys</span>}
                {isLowProfit && <span className="text-amber-300">⚠️ Kam daromadli reys</span>}
              </div>
            </div>
          </div>

          {/* Input Controls */}
          <div className="space-y-3">
            {/* Trip Price & Distance */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                  Reys narxi (so'm):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="50000"
                    value={tripPrice}
                    onChange={e => setTripPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-white/80 bg-white/60 backdrop-blur-md font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                  Reys masofasi (km):
                </label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={e => setDistanceKm(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-white/80 bg-white/60 backdrop-blur-md font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
                />
              </div>
            </div>

            {/* Fuel Type Pills */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                Yoqilg'i turi:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Dizel', 'Metan gaz', 'Propan gaz'] as FuelType[]).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleSelectFuel(f)}
                    className={`py-2 px-2 rounded-xl font-bold text-[10px] text-center border transition-all ${
                      selectedFuel === f
                        ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                        : 'bg-white/60 backdrop-blur-md text-slate-700 border-white/80 hover:bg-white/80'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Consumption & Price */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                  100 km sarfi ({FUEL_TYPES[selectedFuel].unit}):
                </label>
                <input
                  type="number"
                  value={consumptionPer100Km}
                  onChange={e => setConsumptionPer100Km(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-white/80 bg-white/60 backdrop-blur-md font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                  Yoqilg'i narxi (1 {FUEL_TYPES[selectedFuel].unit}):
                </label>
                <input
                  type="number"
                  step="100"
                  value={fuelPricePerUnit}
                  onChange={e => setFuelPricePerUnit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-white/80 bg-white/60 backdrop-blur-md font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
                />
              </div>
            </div>

            {/* Other Expenses */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                Boshqa yo'l xarajatlari (Oziq-ovqat, postlar, amortizatsiya):
              </label>
              <input
                type="number"
                step="50000"
                value={otherExpenses}
                onChange={e => setOtherExpenses(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-white/80 bg-white/60 backdrop-blur-md font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
              />
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 space-y-1.5 text-[11px] shadow-2xs">
            <div className="flex justify-between text-slate-500">
              <span>Sarflanadigan yoqilg'i:</span>
              <strong className="text-slate-700 font-mono">
                {requiredFuelUnits.toFixed(1)} {FUEL_TYPES[selectedFuel].unit}
              </strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Yoqilg'i narxi:</span>
              <strong className="text-rose-600 font-mono">-{formatMoneyUz(totalFuelCost)}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Boshqa xarajatlar:</span>
              <strong className="text-rose-600 font-mono">-{formatMoneyUz(otherExpenses)}</strong>
            </div>
            <div className="pt-1.5 border-t border-slate-200/60 flex justify-between font-bold text-slate-800">
              <span>Jami xarajat:</span>
              <span className="text-rose-700 font-mono">{formatMoneyUz(totalExpenses)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-white/70 backdrop-blur-xl border-t border-white/80 flex items-center gap-2">
          {onApplyPrice && (
            <button
              type="button"
              onClick={() => {
                onApplyPrice(tripPrice);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shu narxni taklifga qo'yish</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`${onApplyPrice ? 'px-4' : 'w-full'} py-3 rounded-full bg-white/80 hover:bg-white text-slate-700 font-bold text-xs transition-colors border border-white/80 shadow-2xs`}
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
