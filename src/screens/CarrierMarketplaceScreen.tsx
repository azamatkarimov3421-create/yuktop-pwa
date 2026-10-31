import React, { useState } from 'react';
import { CargoItem, Vehicle } from '../types';
import { storageService } from '../services/storageService';
import { formatMoneyUz } from '../services/routingService';
import { 
  Search, 
  Truck, 
  Phone, 
  Plus, 
  MapPin, 
  ChevronRight,
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

  const matchedItems = storageService.getMatchedCargosForCarrier();
  const carrierTrips = storageService.getCarrierTrips();

  const filteredCargos = matchedItems.filter(item => {
    const c = item.cargo;
    if (filterCity.trim()) {
      const q = filterCity.toLowerCase();
      const matchPickup = c.pickupLocation.city.toLowerCase().includes(q);
      const matchDelivery = c.deliveryLocation.city.toLowerCase().includes(q);
      if (!matchPickup && !matchDelivery) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-32 max-w-md md:max-w-xl mx-auto px-3 xs:px-4 w-full animate-in fade-in duration-200">
      {/* 1. Haydovchi Transporti & Bo'sh Reys Tugmasi */}
      <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {vehicle?.model || 'Yuk mashinasi'} ({vehicle?.capacityTon || 22} t)
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {vehicle?.plateNumber || '01 777 UZB'} • {vehicle?.volumeM3 || 86} m³
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPostTrip}
          className="px-3.5 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1.5 border border-slate-200/80 transition-all shadow-2xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Bo'sh reys</span>
        </button>
      </div>

      {/* 2. Soddalashtirilgan Tablar */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
        <button
          type="button"
          onClick={() => setActiveMarketTab('cargos')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
            activeMarketTab === 'cargos'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Yuklar bozori ({filteredCargos.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveMarketTab('trips')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
            activeMarketTab === 'trips'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Bo'sh mashinalar ({carrierTrips.length})
        </button>
      </div>

      {/* 3. Shahar qidiruv */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Shahar bo'yicha qidirish (Toshkent, Samarqand...)"
          value={filterCity}
          onChange={e => setFilterCity(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
      </div>

      {/* 4. TAB 1: YUKLAR BOZORI */}
      {activeMarketTab === 'cargos' && (
        <div className="space-y-2.5">
          {filteredCargos.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 space-y-2">
              <p className="text-sm font-bold text-slate-800">Ushbu shahar bo'yicha yuk topilmadi</p>
              <p className="text-xs text-slate-500">Qidiruvni tozalab ko'ring.</p>
            </div>
          ) : (
            filteredCargos.map(({ cargo, distanceToPickupKm }) => (
              <div
                key={cargo.id}
                onClick={() => onSelectCargo(cargo, distanceToPickupKm)}
                className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 cursor-pointer transition-all space-y-2.5"
              >
                {/* Yo'nalish va Narx */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <span>{cargo.pickupLocation.city}</span>
                    <span className="text-slate-400 font-normal">➔</span>
                    <span>{cargo.deliveryLocation.city}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {formatMoneyUz(cargo.priceUzs)}
                  </span>
                </div>

                {/* Yuk tafsilotlari */}
                <div className="text-xs text-slate-500 truncate">
                  <span className="text-slate-700 font-medium">{cargo.title}</span>
                  <span className="mx-1.5">•</span>
                  <span>{cargo.weightKg >= 1000 ? `${(cargo.weightKg / 1000).toFixed(1)} t` : `${cargo.weightKg} kg`}</span>
                  <span className="mx-1.5">•</span>
                  <span>{cargo.distanceKm} km</span>
                  {distanceToPickupKm !== undefined && (
                    <>
                      <span className="mx-1.5">•</span>
                      <span className="text-emerald-700 font-semibold">{distanceToPickupKm} km yaqin</span>
                    </>
                  )}
                </div>

                {/* Amallar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 truncate max-w-[150px]">
                    {cargo.pickupLocation.address || 'Yuklash joyi'}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cargo.ownerPhone}`}
                      onClick={e => e.stopPropagation()}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Qo'ng'iroq</span>
                    </a>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold border border-slate-200/90 shadow-2xs"
                    >
                      Taklif berish
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. TAB 2: BO'SH MASHINALAR (POPUTNIY REYSLAR) */}
      {activeMarketTab === 'trips' && (
        <div className="space-y-2.5">
          {carrierTrips.length === 0 ? (
            <div className="p-8 text-center bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 space-y-2">
              <p className="text-sm font-bold text-slate-800">Hozircha bo'sh reyslar e'lon qilinmagan</p>
              <button
                type="button"
                onClick={onOpenPostTrip}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs"
              >
                + Bo'sh reys e'lon qilish
              </button>
            </div>
          ) : (
            carrierTrips.map(trip => (
              <div
                key={trip.id}
                className="p-4 bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <span>{trip.departureLocation.city}</span>
                    <span className="text-slate-400 font-normal">➔</span>
                    <span>{trip.destinationLocation.city}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {trip.departureDate}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{trip.driverName}</span>
                  <span className="mx-1.5">•</span>
                  <span>{trip.vehicleModel}</span>
                  <span className="mx-1.5">•</span>
                  <span>Bo'sh sig'im: <strong>{trip.availableCapacityTon} t</strong></span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Maks. {trip.maxShippersCount || 3} tagacha yuk oladi</span>
                  <a
                    href={`tel:${trip.driverPhone}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold border border-slate-200 flex items-center gap-1 shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Aloqa</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
