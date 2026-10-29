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
  Star, 
  Inbox,
  Clock,
  Layers,
  Phone,
  Send,
  Users
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
  const pendingBidsCount = cargos.reduce((acc, c) => acc + (c.bidsCount || 0), 0);

  return (
    <div className="space-y-3.5 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full">
      {/* Modern Hero Banner */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-800/85 via-teal-900/90 to-sky-900/85 backdrop-blur-2xl text-white p-4 xs:p-5 shadow-xl shadow-teal-950/15 border border-white/20 w-full">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-teal-200/90 uppercase">
                Yuk Beruvchi Boshqaruvi
              </span>
              <h1 className="text-lg xs:text-xl font-extrabold tracking-tight mt-0.5">
                Salom, {profile.fullName.split(' ')[0]}!
              </h1>
            </div>
            <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>{profile.rating}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-1.5 xs:gap-2.5 pt-0.5">
            <div className="bg-white/10 backdrop-blur-xl p-2.5 xs:p-3 rounded-2xl border border-white/15 text-center shadow-inner">
              <div className="text-[9px] xs:text-[10px] text-teal-200 font-medium">E'lonlar</div>
              <div className="text-sm xs:text-base font-black mt-0.5">{cargos.length} ta</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-2.5 xs:p-3 rounded-2xl border border-white/15 text-center shadow-inner">
              <div className="text-[9px] xs:text-[10px] text-teal-200 font-medium">Yo'lda</div>
              <div className="text-sm xs:text-base font-black mt-0.5">{activeOrders.length} ta</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-2.5 xs:p-3 rounded-2xl border border-white/15 text-center shadow-inner">
              <div className="text-[9px] xs:text-[10px] text-teal-200 font-medium">Takliflar</div>
              <div className="text-sm xs:text-base font-black mt-0.5 text-amber-300">{pendingBidsCount} ta</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onOpenPostCargo}
            className="w-full py-3 xs:py-3.5 px-4 rounded-full bg-white/95 text-teal-900 font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 hover:bg-white border border-white/80"
          >
            <Plus className="w-4 h-4 text-teal-700 stroke-[3]" />
            <span>Yangi yuk e'lon qilish (A va B marshrut)</span>
          </button>
        </div>
      </div>

      {/* Active In-Transit Orders */}
      {activeOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-teal-600" />
              Yo'ldagi yuklar ({activeOrders.length})
            </h2>
          </div>

          <div className="space-y-2">
            {activeOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-3.5 xs:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-400 cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between gap-1">
                  <StatusBadge status={order.status} size="sm" />
                  <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {order.orderCode}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs xs:text-sm font-bold text-slate-900 truncate">
                    {order.cargoTitle}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium truncate">
                    <span>{order.pickupLocation.city.split(' ')[0]}</span>
                    <span className="text-slate-300">→</span>
                    <span>{order.deliveryLocation.city.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="text-slate-500 text-[10px] xs:text-[11px] truncate max-w-[170px]">
                    Haydovchi: <strong className="text-slate-800">{order.driverName}</strong>
                  </div>
                  <span className="text-teal-700 font-bold flex items-center gap-0.5 text-[10px] xs:text-[11px] bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full shrink-0">
                    Kuzatish <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posted Cargos List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-teal-600" />
            E'lon qilingan yuklarim ({cargos.length})
          </h2>
        </div>

        {cargos.length === 0 ? (
          <div className="p-7 text-center bg-white/70 backdrop-blur-xl rounded-[26px] border border-dashed border-slate-300/80 space-y-2.5 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <Inbox className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs xs:text-sm font-bold text-slate-800">Yuk e'lonlari yo'q</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">
                Birinchi yukingizni e'lon qiling va O'zbekiston bo'ylab takliflarni oling.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPostCargo}
              className="py-2.5 px-5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              + E'lon berish
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {cargos.map(cargo => (
              <div
                key={cargo.id}
                onClick={() => onSelectCargo(cargo)}
                className="p-3.5 xs:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-400 cursor-pointer space-y-2.5"
              >
                <div className="flex items-start gap-2.5 xs:gap-3">
                  <img
                    src={cargo.imageUrl}
                    alt={cargo.title}
                    className="w-16 h-16 xs:w-20 xs:h-20 rounded-2xl object-cover border border-white/80 shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[8px] xs:text-[9px] font-bold uppercase tracking-wider text-teal-700 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-200/60 truncate">
                        {cargo.category}
                      </span>
                      <StatusBadge status={cargo.status} size="sm" />
                    </div>

                    <h3 className="text-xs xs:text-sm font-bold text-slate-900 mt-1 truncate">
                      {cargo.title}
                    </h3>

                    <div className="text-[10px] xs:text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-slate-700">
                        {(cargo.weightKg / 1000).toFixed(1)}t
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{cargo.volumeM3} m³</span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 gap-1">
                      <span className="text-xs xs:text-sm font-black text-teal-700 truncate">
                        {formatMoneyUz(cargo.priceUzs)}
                      </span>
                      {cargo.bidsCount > 0 ? (
                        <span className="text-[9px] xs:text-[10px] font-bold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 shrink-0">
                          🔥 {cargo.bidsCount} taklif
                        </span>
                      ) : (
                        <span className="text-[9px] xs:text-[10px] text-slate-400 font-medium shrink-0">
                          Kutilmoqda
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Route Bar */}
                <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 truncate text-[10px] xs:text-[11px]">
                    <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate font-semibold">{cargo.pickupLocation.city.split(' ')[0]} → {cargo.deliveryLocation.city.split(' ')[0]}</span>
                    <span className="text-slate-400 text-[9px]">({cargo.distanceKm} km)</span>
                  </div>
                  <span className="text-teal-700 font-bold text-[10px] xs:text-[11px] shrink-0 flex items-center gap-0.5">
                    Ko'rish <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Empty Carrier Trips (Poputniy / Yig'ma yuk oluvchilar) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-teal-600" />
            Bo'sh qaytayotgan mashinalar (Poputniy reyslar)
          </h2>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            5 kishigacha yig'ma yuk
          </span>
        </div>

        <div className="space-y-2.5">
          {storageService.getCarrierTrips().map(trip => (
            <div
              key={trip.id}
              className="p-3.5 xs:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 font-extrabold flex items-center justify-center text-xs border border-teal-200">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{trip.driverName}</h3>
                    <div className="text-[10px] text-slate-400">{trip.vehicleModel}</div>
                  </div>
                </div>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-300/60">
                  {trip.availableCapacityTon}t bo'sh joy
                </span>
              </div>

              {/* Route & Time */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-800 font-bold">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  <span>{trip.departureLocation.city} ➔ {trip.destinationLocation.city}</span>
                </div>
                <span className="font-extrabold text-teal-700">{formatMoneyUz(trip.pricePerTonUzs || 350000)}/t</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-teal-600" />
                  {trip.departureDate} ({trip.departureTimeWindow})
                </span>
                <div className="flex items-center gap-2">
                  {trip.driverTelegram && (
                    <a
                      href={`https://t.me/${trip.driverTelegram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Send className="w-2.5 h-2.5" /> Telegram
                    </a>
                  )}
                  <a
                    href={`tel:${trip.driverPhone}`}
                    className="px-2.5 py-1 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                  >
                    <Phone className="w-2.5 h-2.5" /> Qo'ng'iroq
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
