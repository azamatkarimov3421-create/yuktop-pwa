import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { AppwriteCloudCard } from '../components/AppwriteCloudCard';
import { 
  Download, 
  Headphones,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  ArrowRightLeft
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
  const cargosCount = storageService.getCargos().length;
  const tripsCount = storageService.getCarrierTrips().length;

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
    <div className="space-y-4 pb-32 max-w-md md:max-w-xl mx-auto px-3 xs:px-4 w-full animate-in fade-in duration-200">
      {/* 1. Foydalanuvchi Profili */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs shrink-0">
              <img 
                src="/assets/3d_driver_avatar.jpg" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {fullName}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Tasdiqlangan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{phone}</p>
              {telegram && (
                <p className="text-[11px] text-slate-600 font-medium">@{telegram}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-xs font-semibold flex items-center gap-1"
            title="Tahrirlash"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="text-xs">Tahrirlash</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Saqlandi!</span>
          </div>
        )}

        {/* Profil tahrirlash formasi */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Ism va familiya:</span>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Telefon:</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Telegram:</span>
              <input
                type="text"
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                placeholder="masalan: alisher_logist"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-200"
              >
                Saqlash
              </button>
            </div>
          </form>
        )}

        {/* Rolni o'zgartirish */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Ilova rejimi:</span>
          </div>
          <button
            type="button"
            onClick={onRoleToggle}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-200 transition-all shadow-2xs"
          >
            {isCarrier ? "Yuk beruvchiga o'tish" : "Haydovchiga o'tish"}
          </button>
        </div>
      </div>

      {/* 2. Appwrite Cloud Baza Markazi */}
      <AppwriteCloudCard cargosCount={cargosCount} tripsCount={tripsCount} />

      {/* 3. Transport (Agar haydovchi bo'lsa) */}
      {isCarrier && vehicle && (
        <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mening Transportim
            </h2>
            <button
              type="button"
              onClick={onOpenVehicleModal}
              className="text-xs font-bold text-slate-700 hover:underline"
            >
              Tahrirlash
            </button>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
            <strong className="text-slate-900">{vehicle.model}</strong>
            <span className="text-slate-500 ml-2">({vehicle.plateNumber})</span>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Sig'im: {vehicle.capacityTon} t • {vehicle.volumeM3} m³ • {vehicle.transportType}
            </div>
          </div>
        </div>
      )}

      {/* 4. Demo Ma'lumotlarni Tozalash */}
      <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xs space-y-2 text-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Haqiqiy foydalanish
        </h2>
        <p className="text-slate-500 text-[11px]">
          Sinov yuklarni o'chirib, o'z haqiqiy yuklaringiz bilan toza boshlashingiz mumkin.
        </p>

        {confirmClear ? (
          <div className="p-3 rounded-xl bg-slate-100 space-y-2">
            <p className="font-semibold text-slate-800">
              Barcha sinov e'lonlar o'chirilsinmi?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearDemoData}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
              >
                Ha, tozalansin
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-medium text-xs"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sinov (demo) yuklarni tozalash</span>
          </button>
        )}
      </div>

      {/* 5. Android APK */}
      <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-900">Android APK Fayli (v2.0)</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Telefoningizga to'g'ridan-to'g'ri o'rnatish</p>
        </div>
        <a
          href="/YUKTOP-v2.0.0-appwrite-cloud.apk"
          download="YUKTOP-v2.0.0-appwrite-cloud.apk"
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1.5 border border-slate-200 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Yuklash</span>
        </a>
      </div>

      {/* 6. Qo'llab-quvvatlash */}
      <div className="p-4 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Headphones className="w-4 h-4 text-slate-700" />
          <span>Aloqa markazi (24/7):</span>
        </div>
        <a href="tel:+998901234567" className="font-bold text-slate-900 hover:underline">
          +998 (90) 123-45-67
        </a>
      </div>
    </div>
  );
};
