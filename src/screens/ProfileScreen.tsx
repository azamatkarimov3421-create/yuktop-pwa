import React from 'react';
import { UserProfile, UserRole } from '../types';
import { 
  User, 
  Phone, 
  Truck, 
  MapPin, 
  Star, 
  Download, 
  Headphones,
  CheckCircle2,
  Send,
  ArrowRightLeft
} from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  activeRole: UserRole;
  onRoleToggle: () => void;
  onOpenVehicleModal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  activeRole,
  onRoleToggle,
  onOpenVehicleModal
}) => {
  const isCarrier = activeRole === 'yuk_tashuvchi';
  const vehicle = profile.vehicle;

  return (
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full">
      {/* 1. Profile Header Card */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 to-sky-700 text-white flex items-center justify-center font-black text-xl shadow-md">
            {profile.fullName.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1">
            <h1 className="text-base font-black text-slate-900 leading-tight">
              {profile.fullName}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{profile.phone}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {isCarrier ? 'Yuk tashuvchi (Haydovchi)' : 'Yuk beruvchi (Mijoz)'}
              </span>
              <div className="flex items-center text-amber-500 font-black text-xs gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{profile.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Toggle Switch */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ArrowRightLeft className="w-4 h-4 text-teal-600" />
            <span>Rejimni o'zgartirish:</span>
          </div>
          <button
            type="button"
            onClick={onRoleToggle}
            className="px-3.5 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-2xs hover:bg-teal-800 active:scale-95 transition-all"
          >
            {isCarrier ? "Yuk beruvchiga o'tish" : "Haydovchiga o'tish"}
          </button>
        </div>
      </div>

      {/* 2. Haydovchi transporti (Agar yuk tashuvchi bo'lsa) */}
      {isCarrier && vehicle && (
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-600" />
              Mening Transportim
            </h2>
            <button
              type="button"
              onClick={onOpenVehicleModal}
              className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full hover:bg-teal-100"
            >
              Tahrirlash
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Model va Davlat raqami</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">{vehicle.model}</strong>
              <div className="font-mono text-teal-700 font-bold text-xs mt-0.5">{vehicle.plateNumber}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Sig'im va Kuzov</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">{vehicle.capacityTon} tonna</strong>
              <div className="text-slate-500 text-[10px] mt-0.5">{vehicle.volumeM3} m³ • {vehicle.transportType}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Joylashuv</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">{vehicle.currentLocation.city}</strong>
              <div className="text-slate-400 text-[10px] truncate">{vehicle.currentLocation.address}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">GPS kuzatuvi</span>
              <strong className="text-emerald-700 text-xs mt-0.5 block">✓ Faol ulangan</strong>
              <div className="text-slate-400 text-[10px]">Real vaqtda joylashuv</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Android APK Faylini Yuklab Olish (Haqiqiy ishlovchi fayl) */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Mobil Ilova (Android)
        </h2>
        <a
          href="/YUKTOP-v2.0.0-appwrite-cloud.apk"
          download="YUKTOP-v2.0.0-appwrite-cloud.apk"
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200/90 flex items-center justify-between text-left transition-all hover:bg-teal-100/50 shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span>Android APK Faylini Yuklab Olish</span>
                <span className="text-[9px] bg-teal-700 text-white font-black px-1.5 py-0.2 rounded-md">
                  v2.0
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Telefoningizga to'g'ridan-to'g'ri o'rnatish (APK fayl)
              </div>
            </div>
          </div>
          <span className="text-xs font-black text-teal-800 bg-white px-3 py-1.5 rounded-xl border border-teal-300 shadow-2xs">
            Yuklash ⬇
          </span>
        </a>
      </div>

      {/* 4. Qo'llab-quvvatlash va Aloqa */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Qo'llab-quvvatlash
        </h2>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Headphones className="w-4 h-4 text-teal-600" />
            <span>Aloqa markazi (24/7):</span>
          </div>
          <a href="tel:+998901234567" className="font-bold text-teal-700 hover:underline">
            +998 (90) 123-45-67
          </a>
        </div>
      </div>
    </div>
  );
};
