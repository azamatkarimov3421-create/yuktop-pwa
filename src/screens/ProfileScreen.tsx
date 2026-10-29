import React from 'react';
import { UserProfile, UserRole } from '../types';
import { formatMoneyUz } from '../services/routingService';
import { 
  User, 
  Phone, 
  Star, 
  ArrowRightLeft, 
  Truck, 
  Database,
  Cloud,
  CheckCircle2,
  Download,
  DollarSign,
  TrendingUp,
  Calculator,
  Send,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { isAppwriteConnected } from '../services/appwriteClient';

interface ProfileScreenProps {
  profile: UserProfile;
  activeRole: UserRole;
  onRoleToggle: () => void;
  onOpenVehicleModal: () => void;
  onOpenAppwriteSettings?: () => void;
  onOpenSupabaseSettings?: () => void;
  onOpenCalculator?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  activeRole,
  onRoleToggle,
  onOpenVehicleModal,
  onOpenAppwriteSettings,
  onOpenSupabaseSettings,
  onOpenCalculator
}) => {
  const isCarrier = activeRole === 'yuk_tashuvchi';
  const vehicle = profile.vehicle;
  const isAppwrite = isAppwriteConnected();

  return (
    <div className="space-y-3.5 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full">
      {/* Profile Header */}
      <div className="p-4 xs:p-5 bg-white/72 backdrop-blur-xl rounded-[28px] border border-white/85 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-16 h-16 rounded-[22px] object-cover border-2 border-teal-600 shadow-sm"
            />
            {profile.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 truncate">
                {profile.fullName}
              </h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-800 border border-teal-200/60">
                Tasdiqlangan
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{profile.phone}</span>
              </span>
              {profile.telegram && (
                <a
                  href={`https://t.me/${profile.telegram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 hover:underline flex items-center gap-0.5 font-bold text-[11px]"
                >
                  <Send className="w-2.5 h-2.5" />
                  <span>@{profile.telegram}</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-500 text-[11px]">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{profile.rating}</span>
                <span className="text-slate-400 font-normal">reyting</span>
              </div>
              <span className="text-slate-200">•</span>
              <div className="text-slate-500 font-semibold text-[11px]">
                {profile.totalOrders} ta buyurtma
              </div>
            </div>
          </div>
        </div>

        {/* Role Toggle Banner */}
        <div className="p-3.5 bg-gradient-to-r from-teal-500/15 via-sky-500/15 to-emerald-500/15 backdrop-blur-xl rounded-2xl border border-white/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
              <span>Faol rol:</span>
              <strong className="text-teal-700 uppercase">
                {activeRole === 'yuk_beruvchi' ? 'Yuk Beruvchi' : 'Yuk Tashuvchi'}
              </strong>
            </div>
            <p className="text-[10px] text-teal-800/80 mt-0.5">
              {activeRole === 'yuk_beruvchi'
                ? 'Yuk e\'lon qilish va haydovchilarni tanlash'
                : 'Yuklar bozoridan mos yuklarni topish va taklif berish'}
            </p>
          </div>

          <button
            type="button"
            onClick={onRoleToggle}
            className="px-3.5 py-2 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Almashtirish</span>
          </button>
        </div>
      </div>

      {/* Driver Earnings & Analytics Card */}
      {isCarrier && (
        <div className="p-4 bg-slate-900/80 backdrop-blur-2xl text-white rounded-[28px] border border-white/15 shadow-xl shadow-slate-950/20 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">Mening Daromadim</span>
                <div className="text-xs font-medium text-slate-300">Tizimdagi jami tushum</div>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              +18.4% o'sish
            </span>
          </div>

          <div className="text-2xl xs:text-3xl font-black text-white tracking-tight">
            {formatMoneyUz(profile.totalEarningsUzs || 48600000)}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[9px] text-slate-400 block font-medium">Tugallangan reyslar:</span>
              <strong className="text-white text-xs">{profile.totalOrders} ta muvaffaqiyatli</strong>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[9px] text-slate-400 block font-medium">O'rtacha 1 km ga tushum:</span>
              <strong className="text-teal-300 text-xs font-mono">11,800 UZS/km</strong>
            </div>
          </div>

          {/* Calculator quick trigger */}
          {onOpenCalculator && (
            <button
              type="button"
              onClick={onOpenCalculator}
              className="w-full py-2.5 px-3 rounded-2xl bg-teal-600/40 hover:bg-teal-600/60 active:scale-98 transition-all border border-teal-500/40 text-teal-200 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Yoqilg'i & Sof Foyda Kalkulyatorini ochish</span>
            </button>
          )}
        </div>
      )}

      {/* Vehicle Specification Card (for Carrier) */}
      {isCarrier && vehicle && (
        <div className="p-4 bg-white/72 backdrop-blur-xl rounded-[28px] border border-white/85 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-600" />
              Mening Transportim
            </h2>
            <button
              type="button"
              onClick={onOpenVehicleModal}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-500/15 border border-teal-200/50 backdrop-blur-md px-3 py-1 rounded-full"
            >
              Tahrirlash
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Model va raqam</span>
              <strong className="text-slate-800 text-xs">{vehicle.model}</strong>
              <div className="font-mono text-teal-700 font-bold text-xs">{vehicle.plateNumber}</div>
            </div>

            <div className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Sig'im va Kuzov</span>
              <strong className="text-slate-800 text-xs">{vehicle.capacityTon} tonna</strong>
              <div className="text-slate-500 text-[10px]">{vehicle.volumeM3} m³ • {vehicle.transportType}</div>
            </div>

            <div className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Hozirgi joylashuv</span>
              <strong className="text-slate-800 text-xs">{vehicle.currentLocation.city}</strong>
              <div className="text-slate-400 text-[10px] truncate">{vehicle.currentLocation.address}</div>
            </div>

            <div className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Yo'nalish va GPS</span>
              <strong className="text-slate-800 text-xs">{vehicle.destinationRoute.split('->')[0]}...</strong>
              <div className="text-emerald-600 font-bold text-[10px] mt-0.5">
                {vehicle.gpsTrackingEnabled ? '✓ Jonli GPS faol' : 'O\'chiq'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services and Settings */}
      <div className="p-4 bg-white/72 backdrop-blur-xl rounded-[28px] border border-white/85 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-2 text-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
          Tizim va Xizmatlar
        </h2>

        {/* Appwrite Cloud Primary Button */}
        <button
          type="button"
          onClick={onOpenAppwriteSettings}
          className="w-full p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-between text-left transition-colors active:scale-99 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              isAppwrite ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
            }`}>
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Appwrite Cloud Baza</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full">
                  75k Bepul
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {isAppwrite ? 'Faol ulangan (Realtime WebSockets)' : 'Project ID ulab biriktirish'}
              </div>
            </div>
          </div>
          <span className={`text-xs font-bold ${isAppwrite ? 'text-emerald-700' : 'text-teal-700'}`}>
            {isAppwrite ? 'Ulangan ✓' : 'Ulash →'}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenSupabaseSettings}
          className="w-full p-3.5 rounded-2xl bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-between text-left transition-colors active:scale-99 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Supabase / PostgreSQL Sozlamalari</div>
              <div className="text-[10px] text-slate-400">Bulutli baza va Realtime kanallar</div>
            </div>
          </div>
          <span className="text-teal-700 font-bold text-xs">Ochish →</span>
        </button>

        <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-between text-left shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100/70 text-sky-800 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Android APK Fayli</div>
              <div className="text-[10px] text-slate-400">YUKTOP-v1.1.0-release.apk tayyor holda</div>
            </div>
          </div>
          <span className="text-emerald-700 font-bold text-[11px] bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-300/60 backdrop-blur-md">
            Tayyor ✓
          </span>
        </div>
      </div>
    </div>
  );
};
