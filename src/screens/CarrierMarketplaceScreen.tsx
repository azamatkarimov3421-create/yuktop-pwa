import React, { useState } from 'react';
import { CargoItem, Vehicle, PaymentMethod, CarrierTripAd } from '../types';
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
  Calculator,
  Plus,
  Clock,
  Layers,
  Users,
  Phone,
  Send,
  Scale
} from 'lucide-react';

interface CarrierMarketplaceScreenProps {
  vehicle?: Vehicle;
  activeOrders?: import('../types').Order[];
  onSelectCargo: (cargo: CargoItem, distanceToPickupKm?: number) => void;
  onOpenVehicleSettings: () => void;
  onOpenCalculator?: (distanceKm: number, priceUzs: number) => void;
  onSelectOrder?: (order: import('../types').Order) => void;
  onOpenPostTrip?: () => void;
}

export const CarrierMarketplaceScreen: React.FC<CarrierMarketplaceScreenProps> = ({
  vehicle,
  activeOrders = [],
  onSelectCargo,
  onOpenVehicleSettings,
  onOpenCalculator,
  onSelectOrder,
  onOpenPostTrip
}) => {
  const [activeMarketTab, setActiveMarketTab] = useState<'cargos' | 'trips'>('cargos');
  const [filterCity, setFilterCity] = useState('');
  const [onlySmartMatches, setOnlySmartMatches] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<boolean>(false);
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterDocuments, setFilterDocuments] = useState<boolean>(false);
  const [filterLoadType, setFilterLoadType] = useState<'all' | 'yigma_yuk' | 'tolik_mashina'>('all');

  const matchedItems = storageService.getMatchedCargosForCarrier();
  const carrierTrips = storageService.getCarrierTrips();

  const filtered = matchedItems.filter(item => {
    const c = item.cargo;
    if (onlySmartMatches && item.matchScore < 70) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (filterUrgency && c.urgency !== 'Shoshilinch (Bugun)') return false;
    if (filterDocuments && !c.hasDocuments) return false;
    if (filterLoadType !== 'all' && c.loadType && c.loadType !== filterLoadType) return false;
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
                  Sig'im: <strong className="text-white font-bold">{vehicle.capacityTon}t</strong> • {vehicle.volumeM3}m³ • <span className="text-emerald-400 font-bold">5 kishigacha yig'ma yuk</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onOpenPostTrip && (
                <button
                  type="button"
                  onClick={onOpenPostTrip}
                  className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-teal-600 hover:bg-teal-500 active:scale-95 transition-all text-white flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bo'sh reys</span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenVehicleSettings}
                className="text-[11px] font-bold px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all border border-white/20 text-white shrink-0"
              >
                Sozlash
              </button>
            </div>
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

      {/* Modern Market Switcher Tabs: Yuklar vs Bo'sh Reyslar */}
      <div className="p-1 bg-white/70 backdrop-blur-xl rounded-full border border-white/85 shadow-2xs flex items-center text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveMarketTab('cargos')}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeMarketTab === 'cargos'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Yuklar bozori ({filtered.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMarketTab('trips')}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeMarketTab === 'trips'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Bo'sh mashinalar & Poputniy ({carrierTrips.length})</span>
        </button>
      </div>

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
              setFilterLoadType('all');
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all font-bold shrink-0 ${
              !filterUrgency && filterPayment === 'all' && !filterDocuments && filterLoadType === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-600 hover:bg-white/90'
            }`}
          >
            Barchasi
          </button>

          {/* Yig'ma yuk filtri (LTL) */}
          <button
            type="button"
            onClick={() => setFilterLoadType(filterLoadType === 'yigma_yuk' ? 'all' : 'yigma_yuk')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-bold flex items-center gap-1 shrink-0 ${
              filterLoadType === 'yigma_yuk'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>📦 Yig'ma yuklar (LTL)</span>
          </button>

          {/* To'liq mashina filtri (FTL) */}
          <button
            type="button"
            onClick={() => setFilterLoadType(filterLoadType === 'tolik_mashina' ? 'all' : 'tolik_mashina')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-bold flex items-center gap-1 shrink-0 ${
              filterLoadType === 'tolik_mashina'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-white/70 backdrop-blur-xl border border-white/85 text-slate-700 hover:bg-white/90'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>🚚 To'liq fura (FTL)</span>
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

      {/* Content based on Active Market Tab */}
      {activeMarketTab === 'cargos' ? (
        /* Cargo Cards List */
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

                    {/* Yig'ma yuk vs To'liq mashina nishoni */}
                    {cargo.loadType === 'yigma_yuk' ? (
                      <span className="text-[8px] xs:text-[9px] font-extrabold text-emerald-800 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-300/60 flex items-center gap-0.5">
                        <Layers className="w-2.5 h-2.5" />
                        <span>📦 Yig'ma yuk</span>
                      </span>
                    ) : (
                      <span className="text-[8px] xs:text-[9px] font-extrabold text-sky-800 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-300/60 flex items-center gap-0.5">
                        <Truck className="w-2.5 h-2.5" />
                        <span>🚚 To'liq fura</span>
                      </span>
                    )}

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

                    {/* Qaysi paytdan qaysi paytgacha yetkazish oralig'i */}
                    <div className="mt-1 pt-1 border-t border-slate-100 flex items-center gap-1.5 text-[9px] xs:text-[10px] text-teal-800 font-semibold truncate">
                      <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate">
                        Yuklash: <strong>{cargo.pickupDate}</strong> ({cargo.pickupTimeWindow || 'Ertalab'}) ➔ <strong>{cargo.deliveryDate}</strong> ({cargo.deliveryTimeWindow || '18:00 gacha'})
                      </span>
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
      ) : (
        /* Carrier Trips List (Bo'sh Mashinalar & Poputniy Reyslar) */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span className="text-[11px]">Faol bo'sh transportlar: <strong className="text-slate-700">{carrierTrips.length} ta</strong></span>
            {onOpenPostTrip && (
              <button
                type="button"
                onClick={onOpenPostTrip}
                className="text-teal-700 font-bold text-[11px] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Mening reysimni qo'shish</span>
              </button>
            )}
          </div>

          {carrierTrips.map(trip => {
            const usedTon = Number((trip.totalCapacityTon - trip.availableCapacityTon).toFixed(1));
            const usedPercent = Math.min(100, Math.round((usedTon / trip.totalCapacityTon) * 100));
            const availableSlots = Math.max(0, trip.maxShippersCount - trip.currentShippersCount);

            return (
              <div
                key={trip.id}
                className="p-4 bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-sm space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-800 flex items-center justify-center font-bold">
                      <Truck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{trip.driverName}</span>
                        <span className="text-[10px] font-bold text-amber-500">★ {trip.driverRating}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {trip.vehicleModel} ({trip.vehiclePlate})
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-300/60">
                    {trip.isConsolidated ? `📦 5 kishigacha yig'ma yuk` : `🚚 To'liq reys`}
                  </span>
                </div>

                {/* Route */}
                <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 ring-2 ring-teal-100" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Jo'nash:</span>
                      <strong className="text-slate-900 text-xs">{trip.departureLocation.city}</strong>
                    </div>
                  </div>

                  <span className="text-slate-300 font-bold">➔</span>

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Yetkazish:</span>
                      <strong className="text-slate-900 text-xs">{trip.destinationLocation.city}</strong>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-rose-100" />
                  </div>
                </div>

                {/* Capacity Progress Bar (Bir nechta yuk beruvchilar joyi) */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-gradient-to-r from-teal-500/10 to-sky-500/10 border border-teal-200/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-teal-600" />
                      Bo'sh joy: <strong className="text-teal-700">{trip.availableCapacityTon} tonna</strong>
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      Jami: {trip.totalCapacityTon}t ({trip.totalVolumeM3} m³)
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden border border-white">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${100 - usedPercent}%` }}
                    />
                  </div>

                  {/* Multi-shipper info */}
                  <div className="flex items-center justify-between text-[10px] text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Users className="w-3 h-3 text-amber-500" />
                      Band: <strong>{trip.currentShippersCount} kishi</strong> yuki ortilgan
                    </span>
                    <span className="font-bold text-emerald-700">
                      Yana {availableSlots} kishi yuk berishi mumkin!
                    </span>
                  </div>
                </div>

                {/* Time Window */}
                <div className="flex items-center gap-1.5 text-[10px] text-teal-900 font-semibold bg-white/70 p-2.5 rounded-xl border border-white/90">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>
                    Jo'nash: <strong>{trip.departureDate}</strong> ({trip.departureTimeWindow}) ➔ Yetkazish: <strong>{trip.deliveryDate}</strong> ({trip.deliveryTimeWindow})
                  </span>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-medium">Narxi:</span>
                    <strong className="text-xs xs:text-sm font-black text-teal-700">
                      {formatMoneyUz(trip.pricePerTonUzs || 350000)} / tonna
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {trip.driverTelegram && (
                      <a
                        href={`https://t.me/${trip.driverTelegram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1 hover:bg-sky-100"
                      >
                        <Send className="w-3 h-3" />
                        <span>Telegram</span>
                      </a>
                    )}
                    <a
                      href={`tel:${trip.driverPhone}`}
                      className="px-3.5 py-1.5 rounded-full bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs hover:bg-teal-800"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Qo'ng'iroq</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
