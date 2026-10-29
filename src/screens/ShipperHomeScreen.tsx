import React from 'react';
import { CargoItem, Order, UserProfile } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatMoneyUz } from '../services/routingService';
import { storageService } from '../services/storageService';
import { 
  Package, 
  Plus, 
  Truck, 
  MapPin, 
  ChevronRight, 
  Clock, 
  Phone, 
  Send,
  Calendar,
  Layers
} from 'lucide-react';

interface ShipperHomeScreenProps {
  cargos: CargoItem[];
  activeOrders: Order[];
  profile: UserProfile;
  onOpenPostCargo: () => void;
  onSelectCargo: (cargo: CargoItem) => void;
  onSelectOrder: (order: Order) => void;
}

export const ShipperHomeScreen: React.FC<ShipperHomeScreenProps> = ({
  cargos,
  activeOrders,
  profile,
  onOpenPostCargo,
  onSelectCargo,
  onSelectOrder
}) => {
  const carrierTrips = storageService.getCarrierTrips();

  return (
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full">
      {/* 1. Primary Action: Post New Cargo */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-sky-950 text-white p-4 xs:p-5 shadow-lg border border-teal-700/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
              Yuk beruvchi paneli
            </span>
            <h1 className="text-xl font-black tracking-tight mt-0.5">
              Assalomu alaykum, {profile.fullName.split(' ')[0]}!
            </h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/20">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPostCargo}
          className="w-full py-3.5 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>+ Yangi yuk e'lon qilish</span>
        </button>
      </div>

      {/* 2. Yo'ldagi Faol Buyurtmalar (agar mavjud bo'lsa) */}
      {activeOrders.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-1">
            <Truck className="w-4 h-4 text-teal-600" />
            Yo'ldagi yuklaringiz ({activeOrders.length})
          </h2>

          <div className="space-y-2">
            {activeOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 cursor-pointer transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={order.status} size="sm" />
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {order.orderCode}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {order.cargoTitle}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-semibold">
                    <span>{order.pickupLocation.city}</span>
                    <span className="text-teal-600 font-bold">➔</span>
                    <span>{order.deliveryLocation.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Haydovchi: <strong className="text-slate-800">{order.driverName}</strong>
                  </span>
                  <span className="text-teal-700 font-bold flex items-center gap-0.5 text-xs bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                    Kuzatish <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. E'lon Qilingan Yuklarim */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-teal-600" />
            Mening e'lonlarim ({cargos.length})
          </h2>
          {cargos.length > 0 && (
            <span className="text-[11px] font-bold text-teal-700">
              Jami takliflar: {cargos.reduce((a, c) => a + (c.bidsCount || 0), 0)} ta
            </span>
          )}
        </div>

        {cargos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">
              Hozircha faol yuk e'loningiz yo'q
            </p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Yukingizni tez va qulay narxda yetkazish uchun hoziroq e'lon bering.
            </p>
            <button
              type="button"
              onClick={onOpenPostCargo}
              className="px-4 py-2 bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              + Yuk e'lon qilish
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cargos.map(cargo => (
              <div
                key={cargo.id}
                onClick={() => onSelectCargo(cargo)}
                className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-400 cursor-pointer transition-all space-y-2.5"
              >
                {/* Route Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 truncate">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{cargo.pickupLocation.city}</span>
                    <span className="text-teal-600 font-extrabold">➔</span>
                    <span>{cargo.deliveryLocation.city}</span>
                  </div>

                  <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 shrink-0">
                    {formatMoneyUz(cargo.priceUzs)}
                  </span>
                </div>

                {/* Cargo Details */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold flex-wrap">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                    {cargo.category}
                  </span>
                  <span>•</span>
                  <span>{(cargo.weightKg / 1000).toFixed(1)} tonna</span>
                  <span>•</span>
                  <span>{cargo.volumeM3} m³</span>
                  <span>•</span>
                  <span className={cargo.loadType === 'yigma_yuk' ? 'text-amber-700 font-bold' : 'text-sky-700 font-bold'}>
                    {cargo.loadType === 'yigma_yuk' ? "📦 Yig'ma yuk (LTL)" : "🚚 Butun fura"}
                  </span>
                </div>

                {/* Time & Bids Status */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {cargo.pickupDate} {cargo.pickupTimeWindow ? `(${cargo.pickupTimeWindow})` : ''}
                  </span>

                  {cargo.bidsCount > 0 ? (
                    <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                      🔥 {cargo.bidsCount} ta taklif tushdi
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Haydovchilar ko'rmoqda
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Bo'sh Qaytayotgan Mashinalar (Poputniy / Yig'ma yuk oluvchilar) */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-teal-600" />
            Bo'sh mashinalar (Poputniy reyslar)
          </h2>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Arzon narxda yuk berish
          </span>
        </div>

        <div className="space-y-3">
          {carrierTrips.map(trip => (
            <div
              key={trip.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              {/* Driver & Space */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{trip.driverName}</h3>
                  <div className="text-xs text-slate-400 font-medium">{trip.vehicleModel} ({trip.vehiclePlate})</div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {trip.availableCapacityTon} t bo'sh joy
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">5 kishigacha yig'ma</div>
                </div>
              </div>

              {/* Route & Price */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>{trip.departureLocation.city}</span>
                  <span className="text-teal-600 font-extrabold">➔</span>
                  <span>{trip.destinationLocation.city}</span>
                </div>
                <span className="font-black text-teal-700 text-sm">
                  {formatMoneyUz(trip.pricePerTonUzs || 350000)} / t
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
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
                    className="px-3.5 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-teal-800"
                  >
                    <Phone className="w-3 h-3" /> Qo'ng'iroq
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
