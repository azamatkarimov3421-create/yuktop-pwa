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
  Trash2,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles
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
      {/* 1. World-Class Bento Hero Banner */}
      <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white p-5 xs:p-6 shadow-[0_20px_50px_-10px_rgba(13,148,136,0.25)] border border-white/15">
        {/* Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Row: User Greeting & Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
                  Yuk Beruvchi Paneli
                </span>
              </div>
              <h1 className="text-xl xs:text-2xl font-black tracking-tight mt-1 text-white">
                Assalomu alaykum, {profile.fullName.split(' ')[0]}!
              </h1>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-teal-300 shadow-inner">
              <Package className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          {/* High-Impact Action Button (iOS Action Style) */}
          <button
            type="button"
            onClick={onOpenPostCargo}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-[0_8px_25px_rgba(20,184,166,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
          >
            <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center font-black group-hover:rotate-90 transition-transform">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="tracking-tight">Yangi yuk e'lon qilish</span>
          </button>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-white/5 backdrop-blur-md">
              <span className="block text-[10px] text-teal-200/70 font-semibold">Faol haydovchilar</span>
              <strong className="text-xs font-black text-white">120+ ta</strong>
            </div>
            <div className="p-2 rounded-xl bg-white/5 backdrop-blur-md">
              <span className="block text-[10px] text-teal-200/70 font-semibold">O'rtacha taklif</span>
              <strong className="text-xs font-black text-teal-300">~8 daqiqa</strong>
            </div>
            <div className="p-2 rounded-xl bg-white/5 backdrop-blur-md">
              <span className="block text-[10px] text-teal-200/70 font-semibold">Xavfsizlik</span>
              <strong className="text-xs font-black text-emerald-400">100% GPS</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Yo'ldagi Faol Buyurtmalar (Jonli GPS monitoring) */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-600" />
              Yo'ldagi yuklaringiz ({activeOrders.length})
            </h2>
            <span className="text-[11px] font-extrabold text-teal-700 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-200/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping" />
              Jonli GPS faol
            </span>
          </div>

          <div className="space-y-3">
            {activeOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-4 bg-white/85 backdrop-blur-2xl rounded-[28px] border border-white/95 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.05)] hover:border-teal-400/80 cursor-pointer transition-all space-y-3"
              >
                {/* Header Status & Code */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={order.status} size="sm" />
                  <span className="text-xs font-mono font-black text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                    {order.orderCode}
                  </span>
                </div>

                {/* Cargo Title */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {order.cargoTitle}
                  </h3>
                </div>

                {/* Route Visual Timeline */}
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-600 ring-4 ring-teal-100" />
                    <span className="font-extrabold text-slate-800">{order.pickupLocation.city}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 font-bold px-2">
                    <span className="w-8 border-t-2 border-dashed border-teal-400/60" />
                    <Truck className="w-3.5 h-3.5 text-teal-600" />
                    <span className="w-8 border-t-2 border-dashed border-teal-400/60" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800">{order.deliveryLocation.city}</span>
                    <span className="w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100" />
                  </div>
                </div>

                {/* Footer: Driver & Action */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-[10px]">
                      {order.driverName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block leading-none">Haydovchi:</span>
                      <strong className="text-slate-900 font-bold leading-tight">{order.driverName}</strong>
                    </div>
                  </div>

                  <span className="text-teal-800 font-black flex items-center gap-1 text-xs bg-teal-500/15 border border-teal-200/80 px-3.5 py-1.5 rounded-full shadow-2xs hover:bg-teal-500/25 transition-all">
                    <span>Xaritada kuzatish</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Mening E'lonlarim (Bespoke Human-Designed Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-teal-600" />
            Mening e'lonlarim ({cargos.length})
          </h2>
          {cargos.length > 0 && (
            <span className="text-[11px] font-black text-teal-800 bg-teal-500/15 px-3 py-0.5 rounded-full border border-teal-200/60">
              Jami takliflar: {cargos.reduce((a, c) => a + (c.bidsCount || 0), 0)} ta
            </span>
          )}
        </div>

        {cargos.length === 0 ? (
          <div className="p-8 text-center bg-white/85 backdrop-blur-2xl rounded-[32px] border border-white/95 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.04)] space-y-3">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-teal-500/15 text-teal-700 flex items-center justify-center border border-teal-200/60 shadow-inner">
              <Package className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900">
                Hozircha e'lonlaringiz yo'q
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium mt-1">
                Yukingizni qulay narxda yetkazish uchun hoziroq yangi e'lon bering.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPostCargo}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all"
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
                className="p-4 xs:p-5 bg-white/85 backdrop-blur-2xl rounded-[30px] border border-white/95 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.05)] hover:border-teal-400/80 cursor-pointer transition-all space-y-3 group"
              >
                {/* Header: Category & Price */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-500/15 px-2.5 py-1 rounded-full border border-teal-200/60">
                      {cargo.category}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                      cargo.loadType === 'yigma_yuk' 
                        ? 'bg-amber-500/15 text-amber-900 border-amber-300/60' 
                        : 'bg-sky-500/15 text-sky-900 border-sky-300/60'
                    }`}>
                      {cargo.loadType === 'yigma_yuk' ? "📦 Yig'ma (LTL)" : "🚚 Butun fura (FTL)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm xs:text-base font-black text-slate-900">
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
                      className="p-1.5 rounded-full text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cargo Title */}
                <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-800 transition-colors">
                  {cargo.title}
                </h3>

                {/* Visual Route Timeline Graphic */}
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100/90 space-y-2">
                  {/* Point A */}
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-teal-100 shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-black text-slate-800 truncate">{cargo.pickupLocation.city}</strong>
                        <span className="text-[10px] text-slate-400 font-medium">Yuklash</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{cargo.pickupLocation.address || "Manzil ko'rsatilmagan"}</p>
                    </div>
                  </div>

                  {/* Connecting Line with Distance */}
                  <div className="pl-1 flex items-center gap-2">
                    <div className="w-0.5 h-5 bg-gradient-to-b from-teal-500 to-rose-500 ml-1 rounded-full" />
                    <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                      {cargo.distanceKm} km
                    </span>
                  </div>

                  {/* Point B */}
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-4 ring-rose-100 shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-black text-slate-800 truncate">{cargo.deliveryLocation.city}</strong>
                        <span className="text-[10px] text-slate-400 font-medium">Yetkazish</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{cargo.deliveryLocation.address || "Manzil ko'rsatilmagan"}</p>
                    </div>
                  </div>

                  {/* Multi-stop tag if 3 stops */}
                  {cargo.stops && cargo.stops.length > 2 && (
                    <div className="pt-1 border-t border-slate-200/50 flex items-center gap-1 text-[10px] font-bold text-rose-700">
                      <span>📍 3-manzil kiritilgan: {cargo.stops[2].city}</span>
                    </div>
                  )}
                </div>

                {/* Specs & Status */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      {(cargo.weightKg / 1000).toFixed(1)} t
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      {cargo.volumeM3} m³
                    </span>
                    <span className="text-slate-400 font-medium">• {cargo.pickupDate}</span>
                  </div>

                  {cargo.bidsCount > 0 ? (
                    <span className="text-[11px] font-black text-amber-950 bg-amber-400/30 px-3 py-1 rounded-full border border-amber-300 animate-pulse flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-600 text-amber-600" />
                      <span>{cargo.bidsCount} ta taklif tushdi</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Haydovchilar ko'rmoqda</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Bo'sh Qaytayotgan Mashinalar (Poputniy / LTL Reyslar) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-teal-600" />
            Bo'sh mashinalar (Poputniy reyslar)
          </h2>
          <span className="text-[11px] font-black text-emerald-900 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-300/60">
            Arzon narxda yuk berish
          </span>
        </div>

        <div className="space-y-3">
          {carrierTrips.map(trip => (
            <div
              key={trip.id}
              className="p-4 xs:p-5 bg-white/85 backdrop-blur-2xl rounded-[30px] border border-white/95 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.05)] space-y-3"
            >
              {/* Driver Info & Available Capacity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-sky-700 text-white flex items-center justify-center font-black text-xs shadow-md">
                    {trip.driverName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{trip.driverName}</h3>
                    <div className="text-xs text-slate-400 font-semibold">{trip.vehicleModel} • {trip.vehiclePlate}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-300/80">
                    {trip.availableCapacityTon} t bo'sh joy
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-bold">5 kishigacha yig'ma</div>
                </div>
              </div>

              {/* Route & Price Pill */}
              <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-black text-slate-900">
                  <span>{trip.departureLocation.city}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600 stroke-[3]" />
                  <span>{trip.destinationLocation.city}</span>
                </div>

                <span className="font-black text-teal-800 text-xs">
                  {formatMoneyUz(trip.pricePerTonUzs)} / tonna
                </span>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {trip.departureDate} ({trip.departureTimeWindow})
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://t.me/${(trip.driverTelegram || trip.driverPhone.replace(/[^0-9]/g, '')).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/15 hover:bg-sky-500/25 text-sky-800 border border-sky-200/80 font-bold text-[11px] active:scale-95 transition-all shadow-2xs"
                  >
                    <Send className="w-3 h-3 text-sky-600" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={`tel:${trip.driverPhone}`}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-black text-[11px] active:scale-95 transition-all shadow-md shadow-teal-700/25"
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
