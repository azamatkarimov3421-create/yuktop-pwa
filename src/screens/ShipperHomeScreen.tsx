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
  Layers,
  Trash2
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
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full animate-in fade-in duration-200">
      {/* 1. Primary Action Glass Banner */}
      <div className="rounded-[32px] bg-gradient-to-br from-teal-800/95 via-teal-900/95 to-slate-900/95 backdrop-blur-2xl text-white p-4 xs:p-5 shadow-xl border border-teal-500/30">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
              Yuk beruvchi paneli
            </span>
            <h1 className="text-xl font-black tracking-tight mt-0.5">
              Assalomu alaykum, {profile.fullName.split(' ')[0]}!
            </h1>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-200 border border-white/20 shadow-inner">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPostCargo}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
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

          <div className="space-y-2.5">
            {activeOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/85 shadow-lg hover:border-teal-400/80 cursor-pointer transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={order.status} size="sm" />
                  <span className="text-xs font-mono font-extrabold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/60">
                    {order.orderCode}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 truncate">
                    {order.cargoTitle}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-bold">
                    <span>{order.pickupLocation.city}</span>
                    <span className="text-teal-600 font-extrabold">➔</span>
                    <span>{order.deliveryLocation.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
                  <span className="text-slate-500 font-medium">
                    Haydovchi: <strong className="text-slate-800 font-bold">{order.driverName}</strong>
                  </span>
                  <span className="text-teal-800 font-extrabold flex items-center gap-0.5 text-xs bg-teal-500/15 border border-teal-200/80 px-3 py-1 rounded-full shadow-2xs">
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
            <span className="text-[11px] font-extrabold text-teal-800 bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-200/60">
              Jami takliflar: {cargos.reduce((a, c) => a + (c.bidsCount || 0), 0)} ta
            </span>
          )}
        </div>

        {cargos.length === 0 ? (
          <div className="p-8 text-center bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/85 shadow-lg space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/15 text-teal-700 flex items-center justify-center border border-teal-200/60">
              <Package className="w-7 h-7" />
            </div>
            <p className="text-sm font-black text-slate-800">
              Hozircha faol yuk e'loningiz yo'q
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
              Yukingizni qulay narxda yetkazish uchun hoziroq yangi e'lon bering.
            </p>
            <button
              type="button"
              onClick={onOpenPostCargo}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all"
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
                className="p-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/85 shadow-lg hover:border-teal-400/80 cursor-pointer transition-all space-y-2.5"
              >
                {/* Route Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 truncate">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{cargo.pickupLocation.city}</span>
                    <span className="text-teal-600 font-extrabold">➔</span>
                    <span>{cargo.deliveryLocation.city}</span>
                    {cargo.stops && cargo.stops.length > 2 && (
                      <span className="text-[10px] bg-rose-500/15 text-rose-800 font-black px-2 py-0.5 rounded-full border border-rose-200/60 shrink-0">
                        {cargo.stops.length} ta manzil
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-black text-teal-800 bg-teal-500/15 px-2.5 py-1 rounded-full border border-teal-200/60">
                      {formatMoneyUz(cargo.priceUzs)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Rostdan ham ushbu e'lonni o'chirmoqchimisiz?")) {
                          storageService.deleteCargo(cargo.id);
                        }
                      }}
                      className="p-1 rounded-full text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="E'lonni o'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold flex-wrap">
                  <span className="bg-slate-100/90 px-2 py-0.5 rounded-lg text-slate-700">
                    {cargo.category}
                  </span>
                  <span>•</span>
                  <span>{(cargo.weightKg / 1000).toFixed(1)} tonna</span>
                  <span>•</span>
                  <span>{cargo.volumeM3} m³</span>
                  <span>•</span>
                  <span className={cargo.loadType === 'yigma_yuk' ? 'text-amber-800 font-extrabold' : 'text-sky-800 font-extrabold'}>
                    {cargo.loadType === 'yigma_yuk' ? "📦 Yig'ma yuk (LTL)" : "🚚 Butun fura"}
                  </span>
                </div>

                {/* Time & Bids Status */}
                <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {cargo.pickupDate} {cargo.pickupTimeWindow ? `(${cargo.pickupTimeWindow})` : ''}
                  </span>

                  {cargo.bidsCount > 0 ? (
                    <span className="text-[11px] font-black text-amber-900 bg-amber-400/25 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
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
          <span className="text-[11px] font-extrabold text-emerald-900 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            Arzon narxda yuk berish
          </span>
        </div>

        <div className="space-y-3">
          {carrierTrips.map(trip => (
            <div
              key={trip.id}
              className="p-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/85 shadow-lg space-y-3"
            >
              {/* Driver & Space */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{trip.driverName}</h3>
                  <div className="text-xs text-slate-400 font-medium">{trip.vehicleModel} ({trip.vehiclePlate})</div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-300/80">
                    {trip.availableCapacityTon} t bo'sh joy
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">5 kishigacha yig'ma</div>
                </div>
              </div>

              {/* Route & Price */}
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

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {trip.departureDate} ({trip.departureTimeWindow})
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
          ))}
        </div>
      </div>
    </div>
  );
};
