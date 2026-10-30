import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';
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
  ArrowRightLeft,
  Trash2,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  activeRole: UserRole;
  onRoleToggle: () => void;
  onOpenVehicleModal: () => void;
  onDataCleared?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  activeRole,
  onRoleToggle,
  onOpenVehicleModal,
  onDataCleared
}) => {
  const isCarrier = activeRole === 'yuk_tashuvchi';
  const vehicle = profile.vehicle;

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [telegram, setTelegram] = useState(profile.telegram || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateProfile({
      fullName: fullName.trim() || profile.fullName,
      phone: phone.trim() || profile.phone,
      telegram: telegram.trim().replace(/^@/, '')
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearDemoData = () => {
    storageService.clearAllDemoData();
    setConfirmClear(false);
    if (onDataCleared) {
      onDataCleared();
    }
  };

  return (
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-3 xs:px-4 w-full animate-in fade-in duration-200">
      {/* 1. Profile Header Glass Card */}
      <div className="p-5 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-800 to-sky-800 text-white flex items-center justify-center font-black text-xl shadow-md border border-white/30">
              {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>

            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {fullName}
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{phone}</p>
              {telegram && (
                <p className="text-[11px] text-sky-700 font-bold mt-0.5">@{telegram}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2.5 rounded-2xl bg-teal-500/15 border border-teal-200/80 text-teal-800 hover:bg-teal-500/25 transition-all text-xs font-bold flex items-center gap-1 active:scale-95"
            title="Profilni tahrirlash"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden xs:inline">Tahrirlash</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Ma'lumotlaringiz muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        {/* Profile Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
            <h3 className="font-extrabold text-slate-900 text-xs">Shaxsiy ma'lumotlarni o'zgartirish</h3>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block mb-1">Ism va familiyangiz:</span>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ismingiz (masalan: Rustam Karimov)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block mb-1">Telefon raqamingiz:</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998901234567"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block mb-1">Telegram (foydalanuvchi nomi):</span>
              <input
                type="text"
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                placeholder="masalan: rustam_logist"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-xs hover:bg-teal-800"
              >
                Saqlash
              </button>
            </div>
          </form>
        )}

        {/* Role Toggle Switch */}
        <div className="p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800">
            <ArrowRightLeft className="w-4 h-4 text-teal-700" />
            <span>Ilova rejimi:</span>
          </div>
          <button
            type="button"
            onClick={onRoleToggle}
            className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-xs active:scale-95 transition-all"
          >
            {isCarrier ? "📦 Yuk beruvchiga o'tish" : "🚚 Haydovchiga o'tish"}
          </button>
        </div>
      </div>

      {/* 2. Haydovchi transporti (Agar yuk tashuvchi bo'lsa) */}
      {isCarrier && vehicle && (
        <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-lg space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-600" />
              Mening Transportim
            </h2>
            <button
              type="button"
              onClick={onOpenVehicleModal}
              className="text-xs font-extrabold text-teal-800 bg-teal-500/15 border border-teal-200/80 px-3 py-1 rounded-full hover:bg-teal-500/25"
            >
              Tahrirlash
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-white/70 rounded-2xl border border-white/80">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Model va Davlat raqami</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">{vehicle.model}</strong>
              <div className="font-mono text-teal-700 font-extrabold text-xs mt-0.5">{vehicle.plateNumber}</div>
            </div>

            <div className="p-3 bg-white/70 rounded-2xl border border-white/80">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Sig'im va Kuzov</span>
              <strong className="text-slate-900 text-xs mt-0.5 block">{vehicle.capacityTon} tonna</strong>
              <div className="text-slate-500 text-[10px] mt-0.5">{vehicle.volumeM3} m³ • {vehicle.transportType}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Demo Ma'lumotlarni Tozalash (Haqiqiy foydalanish uchun) */}
      <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-lg space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Trash2 className="w-4 h-4 text-rose-600" />
            Haqiqiy foydalanish va tozalash
          </h2>
        </div>

        <p className="text-xs text-slate-600 px-1">
          Agar ilovani o'zingizning haqiqiy yuklaringiz bilan toza boshlamoqchi bo'lsangiz, sinov demo yuklarni bir bosishda tozalashingiz mumkin.
        </p>

        {confirmClear ? (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <p className="text-xs font-bold text-rose-800">
              Barcha sinov e'lonlar va demo buyurtmalar o'chirilsinmi?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearDemoData}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs shadow-xs hover:bg-rose-700 active:scale-95 transition-all"
              >
                Ha, tozalansin
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="w-full py-2.5 px-3 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-50 text-rose-700 text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sinov (demo) yuklarni tozalash / Toza boshlash</span>
          </button>
        )}
      </div>

      {/* 4. Android APK Yuklab Olish */}
      <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-lg space-y-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Mobil Ilova (Android)
        </h2>
        <a
          href="/YUKTOP-v2.0.0-appwrite-cloud.apk"
          download="YUKTOP-v2.0.0-appwrite-cloud.apk"
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-teal-500/15 border border-teal-200/90 flex items-center justify-between text-left transition-all hover:bg-teal-500/20 shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
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

      {/* 5. Qo'llab-quvvatlash */}
      <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-lg space-y-2.5 text-xs">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Qo'llab-quvvatlash
        </h2>
        <div className="flex items-center justify-between p-3 bg-white/70 rounded-2xl border border-white/80">
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
