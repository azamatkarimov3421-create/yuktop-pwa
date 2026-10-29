import React, { useState } from 'react';
import { CargoItem, Vehicle, PaymentMethod } from '../types';
import { storageService } from '../services/storageService';
import { formatMoneyUz } from '../services/routingService';
import { 
  Search, 
  MapPin, 
  Truck, 
  Sparkles, 
  ChevronRight,
  Navigation,
  Zap,
  FileCheck,
  CreditCard,
  Banknote,
  FileText,
  Calculator
} from 'lucide-react';

interface CarrierMarketplaceScreenProps {
  vehicle?: Vehicle;
  activeOrders?: import('../types').Order[];
  onSelectCargo: (cargo: CargoItem, distanceToPickupKm?: number) => void;
  onOpenVehicleSettings: () => void;
  onOpenCalculator?: (distanceKm: number, priceUzs: number) => void;
  onSelectOrder?: (order: import('../types').Order) => void;
}

export const CarrierMarketplaceScreen: React.FC<CarrierMarketplaceScreenProps> = ({
  vehicle,
  activeOrders = [],
  onSelectCargo,
  onOpenVehicleSettings,
  onOpenCalculator,
  onSelectOrder
}) => {
  const [filterCity, setFilterCity] = useState('');
  const [onlySmartMatches, setOnlySmartMatches] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<boolean>(false);
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterDocuments, setFilterDocuments] = useState<boolean>(false);

  const matchedItems = storageService.getMatchedCargosForCarrier();

  const filtered = matchedItems.filter(item => {
    const c = item.cargo;
    if (onlySmartMatches && item.matchScore < 70) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (filterUrgency && c.urgency !== 'Shoshilinch (Bugun)') return false;
    if (filterDocuments && !c.hasDocuments) return false;
    if (filterPayment !== 'all') {
      if (filterPayment === 'naqd' && c.paymentMethod !== 'Naqd pul') return false;
      if (filterPayment === 'karta' && !c.paymentMethod.includes('Karta')) return false;
      if (filterPayment === 'perechisleniye' && !c.paymentMethod.includes('Hisob-raqam')) return false;
    }
    if (filterCity.trim()) {
      const q = filterCity.toLowerCase();
      const matchA = c.pickupLocation.city.toLowerCase().includes(q);
      const matchB = c.deliveryLocation.city.toLowerCase().includes(q);
      if (!matchA && !matchB) return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full">
      {/* Carrier Vehicle Hero Card */}
      {vehicle && (
        <div className="p-3.5 xs:p-4 bg-slate-900/80 backdrop-blur-2xl text-white rounded-[28px] border border-white/15 shadow-xl shadow-slate-950/20 space-y-2.5 w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 xs:gap-2.5 min-w-0">
              <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-2xl bg-white/10 text-teal-400 border border-white/15 backdrop-blur-md flex items-center justify-center font-bold shrink-0">
                <Truck className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold flex items-center gap-1.5 truncate">
                  <span className="truncate">{vehicle.model}</span>
                  <span className="font-mono bg-white/15 px-1.5 py-0.5 rounded text-[9px] text-teal-300 font-bold shrink-0">
                    {vehicle.plateNumber}
                  </span>
                </div>
                <div className="text-[10px] xs:text-[11px] text-slate-300 mt-0.5 truncate">
                  Sig'im: <strong className="text-white font-bold">{vehicle.capacityTon}t</strong> • {vehicle.volumeM3}m³
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenVehicleSettings}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all border border-white/20 text-white shrink-0"
            >
              Sozlash
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] xs:text-[11px] gap-2">
            <div className="flex items-center gap-1 text-slate-300 truncate">
              <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
              <span className="truncate">Joylashuv: <strong>{vehicle.currentLocation.city.split(' ')[0]}</strong></span>
            </div>
            <div className="text-teal-300 font-semibold truncate shrink-0 max-w-[130px]">
              {vehicle.destinationRoute.split('->')[0]}...
            </div>
          </div>
        </div>
      )}

      {/* Active In-Transit Trip Banner for Carrier */}
      {activeOrders.length > 0 && onSelectOrder && (
        <div 
          onClick={() => onSelectOrder(activeOrders[0])}
          className="p-3.5 xs:p-4 rounded-2xl bg-gradient-to-r from-teal-800 to-sky-900 text-white border border-teal-700 shadow-sm cursor-pointer flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-teal-200 border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-teal-200 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>Faol reysingiz yo'lda ({activeOrders[0].orderCode})</span>
              </div>
              <h3 className="text-xs xs:text-sm font-black truncate text-white mt-0.5">
                {activeOrders[0].cargoTitle}
              </h3>
              <div className="text-[10px] text-teal-100/90 truncate flex items-center gap-1">
                <span>{activeOrders[0].pickupLocation.city.split(' ')[0]}</span>
                <span>➔</span>
                <span>{activeOrders[0].deliveryLocation.city.split(' ')[0]}</span>
                <span className="text-white/60">•</span>
                <span className="font-bold text-white capitalize">{activeOrders[0].status}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-extrabold text-[10px] xs:text-[11px] shrink-0 border border-white/25">
            <span>Boshqarish</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Search Bar & Smart Match Button */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              placeholder="Shahar qidirish (Toshkent, Samarqand...)"
              className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/85 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlySmartMatches(!onlySmartMatches)}
            className={`px-3 py-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 shrink-0 ${
              onlySmartMatches
                ? 'bg-teal-700 text-white ring-2 ring-teal-200 shadow-sm'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">Mos yuklar</span>
          </button>
        </div>

        {/* Quick Modern Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-[10px] xs:text-[11px]">
          <button
            type="button"
            onClick={() => {
              setFilterUrgency(false);
              setFilterPayment('all');
              setFilterDocuments(false);
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all font-bold shrink-0 ${
              !filterUrgency && filterPayment === 'all' && !filterDocuments
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-600 hover:bg-white/90'
            }`}
          >
            Barchasi
          </button>

          <button
            type="button"
            onClick={() => setFilterUrgency(!filterUrgency)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-bold flex items-center gap-1 shrink-0 ${
              filterUrgency
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-500 fill-current" />
            <span>⚡ Shoshilinch</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterPayment(filterPayment === 'naqd' ? 'all' : 'naqd')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-bold flex items-center gap-1 shrink-0 ${
              filterPayment === 'naqd'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <Banknote className="w-3 h-3" />
            <span>Naqd to'lov</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterPayment(filterPayment === 'karta' ? 'all' : 'karta')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-bold flex items-center gap-1 shrink-0 ${
              filterPayment === 'karta'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            <span>Karta (Humo/Click)</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterPayment(filterPayment === 'perechisleniye' ? 'all' : 'perechisleniye')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-bold flex items-center gap-1 shrink-0 ${
              filterPayment === 'perechisleniye'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Perechisleniye</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterDocuments(!filterDocuments)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-bold flex items-center gap-1 shrink-0 ${
              filterDocuments
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <FileCheck className="w-3 h-3" />
            <span>Rasmiy TTN</span>
          </button>
        </div>

        {/* Category horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all text-[10px] font-semibold shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white/60 backdrop-blur-md text-slate-600 border border-white/70 hover:bg-white/80'
            }`}
          >
            Barcha toifalar
          </button>
          {['Qurilish mollari', 'Oziq-ovqat mahsulotlari', 'Meva va sabzavotlar', 'Mebel va jihozlar'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all text-[10px] font-semibold shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white/60 backdrop-blur-md text-slate-600 border border-white/70 hover:bg-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cargo Cards List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span className="text-[11px]">Topilgan yuklar: <strong className="text-slate-700">{filtered.length} ta</strong></span>
          <span className="text-[10px] text-teal-700 font-bold">Yo'nalish va masofaga ko'ra</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-7 text-center bg-white/70 backdrop-blur-xl rounded-[26px] border border-white/85 space-y-2 text-xs text-slate-400 shadow-2xs">
            Kiritilgan filtr bo'yicha yuklar topilmadi.
          </div>
        ) : (
          filtered.map(({ cargo, matchScore, distanceToPickupKm }) => (
            <div
              key={cargo.id}
              onClick={() => onSelectCargo(cargo, distanceToPickupKm)}
              className="p-3.5 xs:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-400 cursor-pointer space-y-2.5"
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[8px] xs:text-[9px] font-bold uppercase tracking-wider text-teal-700 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-200/60 truncate">
                    {cargo.category}
                  </span>

                  {cargo.urgency === 'Shoshilinch (Bugun)' && (
                    <span className="text-[8px] xs:text-[9px] font-extrabold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      Shoshilinch
                    </span>
                  )}

                  <span className="text-[8px] xs:text-[9px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-white/80">
                    {cargo.paymentMethod.split(' ')[0]}
                  </span>

                  {cargo.hasDocuments && (
                    <span className="text-[8px] xs:text-[9px] font-bold text-teal-700 bg-teal-500/15 px-1.5 py-0.5 rounded-full border border-teal-200/60">
                      TTN ✓
                    </span>
                  )}
                </div>

                <span className="text-[9px] xs:text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-300/60 flex items-center gap-1 shrink-0 backdrop-blur-md">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> {matchScore}% mos
                </span>
              </div>

              {/* Body */}
              <div className="flex items-start gap-2.5 xs:gap-3">
                <img
                  src={cargo.imageUrl}
                  alt={cargo.title}
                  className="w-16 h-16 xs:w-20 xs:h-20 rounded-2xl object-cover border border-white/80 shrink-0 shadow-2xs"
                />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="text-xs xs:text-sm font-bold text-slate-900 truncate">
                    {cargo.title}
                  </h3>

                  <div className="text-[10px] xs:text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-slate-700">
                      {(cargo.weightKg / 1000).toFixed(1)}t
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{cargo.volumeM3} m³</span>
                    <span className="text-slate-300">•</span>
                    <span>{cargo.distanceKm} km</span>
                  </div>

                  <div className="text-[10px] xs:text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
                    <span className="text-teal-700 font-bold">{cargo.pickupLocation.city.split(' ')[0]}</span>
                    <span>➔</span>
                    <span className="text-rose-600 font-bold">{cargo.deliveryLocation.city.split(' ')[0]}</span>
                  </div>

                  <div className="pt-0.5 flex items-center gap-1 text-[10px] xs:text-[11px] font-semibold text-sky-700 truncate">
                    <Navigation className="w-3 h-3 text-sky-600 shrink-0" />
                    <span className="truncate">Yuklashgacha: <strong>{distanceToPickupKm} km</strong></span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between gap-1">
                <div className="truncate">
                  <span className="text-[9px] text-slate-400 block font-medium">Egasi taklifi:</span>
                  <span className="text-xs xs:text-sm font-black text-teal-700 truncate">
                    {formatMoneyUz(cargo.priceUzs)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {onOpenCalculator && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCalculator(cargo.distanceKm, cargo.priceUzs);
                      }}
                      className="p-1.5 rounded-full bg-white/80 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-white/80 backdrop-blur-md transition-colors"
                      title="Sof foydani hisoblash"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="flex items-center gap-1 text-teal-800 font-bold text-[10px] xs:text-[11px] bg-teal-500/15 px-3 py-1.5 rounded-full border border-teal-200/60 backdrop-blur-md transition-colors shrink-0">
                    <span>Taklif berish</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
