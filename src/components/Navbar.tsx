import React from 'react';
import { UserRole } from '../types';
import { 
  Truck, 
  Bell, 
  Database, 
  Cloud,
  ArrowRightLeft, 
  Star
} from 'lucide-react';
import { isSupabaseConnected } from '../services/supabaseClient';
import { isAppwriteConnected } from '../services/appwriteClient';

interface NavbarProps {
  activeRole: UserRole;
  onRoleToggle: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenAppwriteSettings?: () => void;
  onOpenSupabaseSettings?: () => void;
  onOpenProfile: () => void;
  userRating: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleToggle,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenAppwriteSettings,
  onOpenSupabaseSettings,
  onOpenProfile,
  userRating
}) => {
  const isAppwrite = isAppwriteConnected();
  const isSupabase = isSupabaseConnected();
  const isCloud = isAppwrite || isSupabase;
  const handleCloudClick = onOpenAppwriteSettings || onOpenSupabaseSettings || (() => {});

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-2.5 xs:px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-2.5 w-full shadow-xs">
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-between gap-1.5 xs:gap-2.5">
        {/* Brand */}
        <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
          <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 active:scale-95 transition-transform shrink-0 border border-white/30">
            <Truck className="w-4 h-4 xs:w-4.5 xs:h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base xs:text-lg font-black tracking-tight text-slate-900 leading-none">
                YUKTOP
              </span>
              <span className="text-[8px] xs:text-[9px] font-black px-1.5 py-0.5 rounded-full bg-teal-100/80 text-teal-800 tracking-wider border border-teal-200/60">
                UZ
              </span>
            </div>
            <div className="text-[9px] xs:text-[10px] text-slate-400 font-semibold tracking-wide leading-none mt-0.5">
              Smart Logistika
            </div>
          </div>
        </div>

        {/* Dynamic Responsive Role Switcher */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onRoleToggle}
            className="flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-1.5 rounded-full bg-white/60 hover:bg-white/80 border border-white/80 backdrop-blur-xl transition-all active:scale-95 shadow-2xs"
            title="Rolni almashtirish"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${activeRole === 'yuk_beruvchi' ? 'bg-teal-600 ring-2 ring-teal-200' : 'bg-sky-600 ring-2 ring-sky-200'}`} />
            <span className="text-[10px] xs:text-[11px] font-bold text-slate-800 whitespace-nowrap">
              <span className="hidden sm-phone:inline">
                {activeRole === 'yuk_beruvchi' ? 'Yuk beruvchi' : 'Yuk tashuvchi'}
              </span>
              <span className="sm-phone:hidden">
                {activeRole === 'yuk_beruvchi' ? 'Yuk' : 'Tashuv'}
              </span>
            </span>
            <ArrowRightLeft className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
          {/* Appwrite / Cloud status icon */}
          <button
            type="button"
            onClick={handleCloudClick}
            className={`w-8 h-8 xs:w-9 xs:h-9 rounded-2xl flex items-center justify-center border transition-all active:scale-95 shrink-0 relative ${
              isAppwrite 
                ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-2xs'
                : isCloud
                ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80 shadow-2xs'
                : 'bg-white/65 hover:bg-white/85 text-slate-500 border-white/80 backdrop-blur-xl shadow-2xs'
            }`}
            title={isAppwrite ? "Appwrite Cloud ulangan (75k bepul)" : isCloud ? "Bulutli baza ulangan" : "Appwrite Cloud sozlamalari"}
          >
            <Cloud className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            {isAppwrite && (
              <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            )}
          </button>

          {/* Notifications button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-8 h-8 xs:w-9 xs:h-9 rounded-2xl flex items-center justify-center border border-white/80 bg-white/65 hover:bg-white/85 text-slate-700 backdrop-blur-xl active:scale-95 transition-all shadow-2xs shrink-0"
            title="Bildirishnomalar"
          >
            <Bell className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-1 p-0.5 xs:pr-2 xs:py-1 rounded-2xl border border-white/80 bg-white/65 hover:bg-white/85 backdrop-blur-xl shadow-2xs active:scale-95 transition-all shrink-0"
            title="Profil"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
              {activeRole === 'yuk_beruvchi' ? 'YB' : 'YT'}
            </div>
            <div className="hidden xs:flex items-center text-amber-500 font-bold text-[10px]">
              <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
              <span>{userRating}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
