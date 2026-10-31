import React from 'react';
import { CargoItem, Order, UserProfile } from '../types';
import { formatMoneyUz } from '../services/routingService';
import { storageService } from '../services/storageService';
import { 
  Package, 
  Plus, 
  Truck, 
  ChevronRight, 
  Trash2,
  MapPin
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
  return (
    <div className="space-y-4 pb-32 max-w-md md:max-w-xl mx-auto px-3 xs:px-4 w-full animate-in fade-in duration-200">
      {/* 1. Asosiy Boshqaruv Kartasi (Shaffof oyna uslubida) */}
      <div className="p-5 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Assalomu alaykum, {profile.fullName.split(' ')[0]}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Yuk jo'natish uchun e'lon bering yoki takliflarni ko'ring
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-2xs">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPostCargo}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-900 font-black text-xs flex items-center justify-center gap-2 border border-slate-200/80 shadow-2xs active:scale-[0.99] transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Yangi yuk e'lon qilish</span>
        </button>
      </div>

      {/* 2. Yo'ldagi Faol Buyurtmalar (Agar mavjud bo'lsa) */}
      {activeOrders.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-700" />
              Yo'ldagi yukingiz ({activeOrders.length})
            </h2>
          </div>

          <div className="space-y-2">
            {activeOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <span>{order.pickupLocation.city}</span>
                    <span className="text-slate-400">➔</span>
                    <span>{order.deliveryLocation.city}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Yo'lda
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Haydovchi: <strong className="text-slate-800 font-semibold">{order.driverName}</strong></span>
                  <span className="text-slate-800 font-bold hover:underline flex items-center gap-0.5">
                    Xaritada ko'rish <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Mening E'lonlarim (Toza va soda ro'yxat) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-slate-700" />
            Mening e'lonlarim ({cargos.length})
          </h2>
          {cargos.length > 0 && (
            <span className="text-xs font-semibold text-slate-500">
              Jami takliflar: {cargos.reduce((a, c) => a + (c.bidsCount || 0), 0)} ta
            </span>
          )}
        </div>

        {cargos.length === 0 ? (
          <div className="p-8 text-center bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Hozircha e'lonlaringiz yo'q</p>
              <p className="text-xs text-slate-500 mt-1">Yukingizni jo'natish uchun yangi e'lon bering.</p>
            </div>
            <button
              type="button"
              onClick={onOpenPostCargo}
              className="px-4 py-2 bg-slate-100/90 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-200 transition-all shadow-xs"
            >
              + Yuk e'lon qilish
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {cargos.map(cargo => (
              <div
                key={cargo.id}
                onClick={() => onSelectCargo(cargo)}
                className="p-4 bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/90 shadow-2xs hover:border-slate-300 cursor-pointer transition-all space-y-2.5"
              >
                {/* 1. Yo'nalish va Narx */}
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

                {/* 2. Yuk haqida qisqa ma'lumot */}
                <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                  <span className="text-slate-700 font-medium">{cargo.title}</span>
                  <span>•</span>
                  <span>{cargo.weightKg >= 1000 ? `${(cargo.weightKg / 1000).toFixed(1)} t` : `${cargo.weightKg} kg`}</span>
                  <span>•</span>
                  <span>{cargo.category}</span>
                </div>

                {/* 3. Takliflar va Harakatlar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className={`font-semibold ${
                    (cargo.bidsCount || 0) > 0 ? 'text-emerald-800' : 'text-slate-400'
                  }`}>
                    {(cargo.bidsCount || 0) > 0 
                      ? `${cargo.bidsCount} ta haydovchi taklif berdi`
                      : "Takliflar kutilmoqda"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Ushbu e'lon o'chirilsinmi?")) {
                          storageService.deleteCargo(cargo.id);
                        }
                      }}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-900 font-bold hover:underline flex items-center gap-0.5">
                      Batafsil <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
