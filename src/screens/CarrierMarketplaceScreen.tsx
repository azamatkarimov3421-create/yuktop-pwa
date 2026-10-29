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
  ArrowRight
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
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full">
      {/* 1. Haydovchi transporti va Bo'sh reys e'lon qilish kartochkasi */}
      <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">
                {vehicle?.model || 'KamAZ 5490 Neo'}
              </h2>
              <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-300 font-bold">
                {vehicle?.plateNumber || '01 777 UZB'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              Sig'im: {vehicle?.capacityTon || 22} tonna • {vehicle?.volumeM3 || 86} m³
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPostTrip}
          className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Bo'sh reys</span>
        </button>
      </div>

      {/* 2. Asosiy Tablar: [ Yuklar bozori ] | [ Bo'sh mashinalar (Poputniy) ] */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveMarketTab('cargos')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeMarketTab === 'cargos'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4 text-sky-700" />
          <span>Yuklar bozori ({matchedItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMarketTab('trips')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeMarketTab === 'trips'
              ? 'bg-white text-slate-900 shadow-xs'
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterLoadType('all')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  filterLoadType === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200'
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
                    : 'bg-white text-slate-600 border border-slate-200'
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
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                <span>🚚 To'liq fura (FTL)</span>
              </button>
            </div>
          </div>

          {/* Yuklar ro'yxati */}
          <div className="space-y-3">
            {filteredCargos.map(({ cargo, distanceToPickupKm }) => (
              <div
                key={cargo.id}
                onClick={() => onSelectCargo(cargo, distanceToPickupKm)}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 cursor-pointer transition-all space-y-3"
              >
                {/* Marshrut va Narx */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-base font-black text-slate-900">
                    <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>{cargo.pickupLocation.city}</span>
                    <ArrowRight className="w-4 h-4 text-sky-600 stroke-[3]" />
                    <span>{cargo.deliveryLocation.city}</span>
                  </div>

                  <span className="text-base font-black text-emerald-700 shrink-0">
                    {formatMoneyUz(cargo.priceUzs)}
                  </span>
                </div>

                {/* Parametrlar: Tonna, Toifa, Yuk turi */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold">
                    {(cargo.weightKg / 1000).toFixed(1)} tonna
                  </span>
                  <span>•</span>
                  <span>{cargo.volumeM3} m³</span>
                  <span>•</span>
                  <span>{cargo.category}</span>
                  <span>•</span>
                  <span className={cargo.loadType === 'yigma_yuk' ? 'text-amber-700 font-bold' : 'text-sky-700 font-bold'}>
                    {cargo.loadType === 'yigma_yuk' ? "📦 Yig'ma yuk" : "🚚 Butun mashina"}
                  </span>
                </div>

                {/* Vaqti va Harakat tugmalari */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 text-[11px] font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {cargo.pickupDate} {cargo.pickupTimeWindow ? `(${cargo.pickupTimeWindow})` : ''}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cargo.ownerPhone}`}
                      onClick={e => e.stopPropagation()}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" /> Qo'ng'iroq
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCargo(cargo, distanceToPickupKm);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs"
                    >
                      Taklif berish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: BO'SH MASHINALAR (POPUTNIY) */}
      {activeMarketTab === 'trips' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Yo'ldagi bo'sh mashinalar
            </h3>
            <button
              type="button"
              onClick={onOpenPostTrip}
              className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> O'z reysimni qo'shish
            </button>
          </div>

          <div className="space-y-3">
            {carrierTrips.map(trip => (
              <div
                key={trip.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                {/* Haydovchi va Bo'sh joy sig'imi */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{trip.driverName}</h4>
                    <div className="text-xs text-slate-400 font-medium">
                      {trip.vehicleModel} ({trip.vehiclePlate})
                    </div>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {trip.availableCapacityTon} t bo'sh joy
                  </span>
                </div>

                {/* Marshrut va Narx */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>{trip.departureLocation.city}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                    <span>{trip.destinationLocation.city}</span>
                  </div>
                  <span className="font-black text-teal-700 text-sm">
                    {formatMoneyUz(trip.pricePerTonUzs || 350000)} / t
                  </span>
                </div>

                {/* 5 kishigacha yig'ma yuk holati */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    Jami sig'im: {trip.totalCapacityTon} tonna
                  </span>
                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {trip.currentShippersCount} kishi yuki bor (yana {trip.maxShippersCount - trip.currentShippersCount} ta olishi mumkin)
                  </span>
                </div>

                {/* Qo'ng'iroq va Telegram */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {trip.departureDate} ({trip.departureTimeWindow})
                  </span>

                  <div className="flex items-center gap-2">
                    {trip.driverTelegram && (
                      <a
                        href={`https://t.me/${trip.driverTelegram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs flex items-center gap-1 hover:bg-sky-100"
                      >
                        <Send className="w-3 h-3" /> Telegram
                      </a>
                    )}
                    <a
                      href={`tel:${trip.driverPhone}`}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" /> Bog'lanish
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
