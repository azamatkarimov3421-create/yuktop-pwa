import React, { useState } from 'react';
import { CargoItem, Vehicle } from '../types';
import { storageService } from '../services/storageService';
import { formatMoneyUz } from '../services/routingService';
import { 
  Search, 
  MapPin, 
  Truck, 
  Clock, 
  Phone, 
  Send,
  Plus,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  Trash2
} from 'lucide-react';

interface CarrierMarketplaceScreenProps {
  vehicle?: Vehicle;
  onSelectCargo: (cargo: CargoItem, distanceToPickupKm?: number) => void;
  onOpenVehicleSettings: () => void;
  onOpenPostTrip?: () => void;
}

export const CarrierMarketplaceScreen: React.FC<CarrierMarketplaceScreenProps> = ({
  vehicle,
  onSelectCargo,
  onOpenVehicleSettings,
  onOpenPostTrip
}) => {
  const [activeMarketTab, setActiveMarketTab] = useState<'cargos' | 'trips'>('cargos');
  const [filterCity, setFilterCity] = useState('');
  const [filterLoadType, setFilterLoadType] = useState<'all' | 'yigma_yuk' | 'tolik_mashina'>('all');

  const matchedItems = storageService.getMatchedCargosForCarrier();
  const carrierTrips = storageService.getCarrierTrips();

  // Filter cargos by city search and loadType
  const filteredCargos = matchedItems.filter(item => {
    const c = item.cargo;
    if (filterCity.trim()) {
      const q = filterCity.toLowerCase();
      const matchPickup = c.pickupLocation.city.toLowerCase().includes(q);
      const matchDelivery = c.deliveryLocation.city.toLowerCase().includes(q);
      if (!matchPickup && !matchDelivery) return false;
    }
    if (filterLoadType !== 'all') {
      if (filterLoadType === 'yigma_yuk' && c.loadType !== 'yigma_yuk') return false;
      if (filterLoadType === 'tolik_mashina' && c.loadType === 'yigma_yuk') return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full animate-in fade-in duration-200">
      {/* 1. Haydovchi transporti va Bo'sh reys e'lon qilish kartochkasi */}
      <div className="p-4 bg-gradient-to-br from-slate-900/95 via-sky-950/95 to-slate-900/95 backdrop-blur-2xl text-white rounded-[32px] border border-sky-500/30 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30 shadow-inner">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">
                {vehicle?.model || 'KamAZ 5490 Neo'}
              </h2>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-lg text-slate-200 font-bold border border-white/10">
                {vehicle?.plateNumber || '01 777 UZB'}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">
              Sig'im: {vehicle?.capacityTon || 22} tonna • {vehicle?.volumeM3 || 86} m³
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPostTrip}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-black text-xs shadow-md flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Bo'sh reys</span>
        </button>
      </div>

      {/* 2. Asosiy Tablar: [ Yuklar bozori ] | [ Bo'sh mashinalar (Poputniy) ] */}
      <div className="flex bg-white/70 backdrop-blur-xl p-1.5 rounded-[24px] border border-white/80 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveMarketTab('cargos')}
          className={`flex-1 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeMarketTab === 'cargos'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4 text-sky-700" />
          <span>Yuklar bozori ({filteredCargos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMarketTab('trips')}
          className={`flex-1 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeMarketTab === 'trips'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-700" />
          <span>Bo'sh mashinalar ({carrierTrips.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: YUKLAR BOZORI */}
      {activeMarketTab === 'cargos' && (
        <div className="space-y-3">
          {/* Shahar qidiruv va LTL/FTL filterlari */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Shahar bo'yicha qidirish (Toshkent, Samarqand...)"
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterLoadType('all')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  filterLoadType === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white/80 text-slate-600 border border-white/80'
                }`}
              >
                Barcha yuklar
              </button>

              <button
                type="button"
                onClick={() => setFilterLoadType('yigma_yuk')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 flex items-center gap-1 ${
                  filterLoadType === 'yigma_yuk'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white/80 text-slate-600 border border-white/80'
                }`}
              >
                <span>📦 Yig'ma yuklar (LTL)</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterLoadType('tolik_mashina')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 flex items-center gap-1 ${
                  filterLoadType === 'tolik_mashina'
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'bg-white/80 text-slate-600 border border-white/80'
                }`}
              >
                <span>🚚 To'liq fura (FTL)</span>
              </button>
            </div>
          </div>

          {/* Yuklar ro'yxati */}
          {filteredCargos.length === 0 ? (
            <div className="p-8 text-center bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/85 shadow-lg space-y-2">
              <p className="text-sm font-black text-slate-800">Ushbu parametr bo'yicha yuk topilmadi</p>
              <p className="text-xs text-slate-500 font-medium">Boshqa shahar nomini qidiring yoki filterni tozalang.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCargos.map(({ cargo, distanceToPickupKm }) => (
                <div
                  key={cargo.id}
                  onClick={() => onSelectCargo(cargo, distanceToPickupKm)}
                  className="p-4 xs:p-5 bg-white/85 backdrop-blur-2xl rounded-[30px] border border-white/95 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.05)] hover:border-sky-400/80 cursor-pointer transition-all space-y-3 group"
                >
                  {/* Top Bar: Category & Price */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-500/15 px-2.5 py-1 rounded-full border border-sky-200/60">
                        {cargo.category}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        cargo.loadType === 'yigma_yuk' 
                          ? 'bg-amber-500/15 text-amber-900 border-amber-300/60' 
                          : 'bg-teal-500/15 text-teal-900 border-teal-300/60'
                      }`}>
                        {cargo.loadType === 'yigma_yuk' ? "📦 Yig'ma (LTL)" : "🚚 Butun fura (FTL)"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm xs:text-base font-black text-slate-900 block leading-tight">
                        {formatMoneyUz(cargo.priceUzs)}
                      </span>
                      {distanceToPickupKm !== undefined && (
                        <span className="text-[10px] text-sky-700 font-bold">
                          📍 {distanceToPickupKm} km yaqin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cargo Title */}
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-sky-800 transition-colors">
                    {cargo.title}
                  </h3>

                  {/* Route Visual Timeline */}
                  <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100/90 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-600 ring-4 ring-sky-100 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <strong className="text-xs font-black text-slate-800 truncate block">{cargo.pickupLocation.city}</strong>
                        <p className="text-[10px] text-slate-500 truncate">{cargo.pickupLocation.address || "Yuklash manzili"}</p>
                      </div>
                    </div>

                    <div className="pl-1 flex items-center gap-2">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-sky-500 to-rose-500 ml-1 rounded-full" />
                      <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                        {cargo.distanceKm} km
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-4 ring-rose-100 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <strong className="text-xs font-black text-slate-800 truncate block">{cargo.deliveryLocation.city}</strong>
                        <p className="text-[10px] text-slate-500 truncate">{cargo.deliveryLocation.address || "Yetkazish manzili"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Specs & Actions Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {(cargo.weightKg / 1000).toFixed(1)} t
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {cargo.volumeM3} m³
                      </span>
                      <span className="text-slate-400 font-medium">• {cargo.pickupDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${cargo.ownerPhone}`}
                        onClick={e => e.stopPropagation()}
                        className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Qo'ng'iroq</span>
                      </a>

                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-full bg-sky-700 hover:bg-sky-800 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-sky-700/20 active:scale-95 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Taklif berish</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: BO'SH MASHINALAR (POPUTNIY REYSLAR) */}
      {activeMarketTab === 'trips' && (
        <div className="space-y-3">
          {carrierTrips.length === 0 ? (
            <div className="p-8 text-center bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/85 shadow-lg space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-500/15 text-sky-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <p className="text-sm font-black text-slate-800">Hozircha bo'sh mashinalar yo'q</p>
              <p className="text-xs text-slate-500 font-medium">O'zingizning bo'sh reysingizni e'lon qiling.</p>
              <button
                type="button"
                onClick={onOpenPostTrip}
                className="px-4 py-2 bg-sky-600 text-white font-extrabold text-xs rounded-2xl shadow-xs"
              >
                + Bo'sh reys e'lon qilish
              </button>
            </div>
          ) : (
            carrierTrips.map(trip => (
              <div
                key={trip.id}
                className="p-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/85 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{trip.driverName}</h3>
                    <div className="text-xs text-slate-400 font-medium">{trip.vehicleModel} ({trip.vehiclePlate})</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-300/80">
                        {trip.availableCapacityTon} t bo'sh joy
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Ushbu reys o'chirilsinmi?")) {
                          storageService.deleteCarrierTrip(trip.id);
                        }
                      }}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white/70 rounded-2xl border border-white/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-black text-slate-800">
                    <span>{trip.departureLocation.city}</span>
                    <span className="text-teal-600 font-extrabold">➔</span>
                    <span>{trip.destinationLocation.city}</span>
                  </div>

                  <span className="font-black text-teal-800">
                    {formatMoneyUz(trip.pricePerTonUzs)} / tonna
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Jo'nash: {trip.departureDate} ({trip.departureTimeWindow})
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://t.me/${(trip.driverTelegram || trip.driverPhone.replace(/[^0-9]/g, '')).replace(/^@/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-500/15 text-sky-800 border border-sky-200/80 font-bold text-[11px] active:scale-95 transition-all shadow-2xs"
                    >
                      <Send className="w-3 h-3 text-sky-600" />
                      <span>Telegram</span>
                    </a>

                    <a
                      href={`tel:${trip.driverPhone}`}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-[11px] active:scale-95 transition-all shadow-md shadow-teal-700/20"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Qo'ng'iroq</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
