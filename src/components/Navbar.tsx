import React from 'react';
import { UserRole } from '../types';
import { 
  Truck, 
  Bell, 
  Package
} from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleToggle: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  userRating?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleToggle,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenProfile
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-white/70 px-3 xs:px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-2.5 w-full shadow-[0_4px_24px_-4px_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 via-teal-950 to-teal-800 flex items-center justify-center text-white shadow-md shadow-teal-950/20 shrink-0 border border-white/20">
            <Truck className="w-5 h-5 stroke-[2.2] text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                YUKTOP
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-teal-500/15 text-teal-800 border border-teal-200/60 tracking-wider">
                UZ
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold leading-none mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Smart Logistika</span>
            </div>
          </div>
        </div>

        {/* Apple iOS-Style Fluid Segmented Role Switcher */}
        <div className="flex items-center bg-slate-900/[0.05] p-1 rounded-full border border-slate-900/[0.04] shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => {
              if (activeRole !== 'yuk_beruvchi') onRoleToggle();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs transition-all duration-200 ${
              activeRole === 'yuk_beruvchi'
                ? 'bg-white text-slate-900 shadow-[0_2px_10px_rgba(15,23,42,0.08)] border border-slate-900/[0.04]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-teal-700" />
            <span>Yukchi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (activeRole !== 'yuk_tashuvchi') onRoleToggle();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs transition-all duration-200 ${
              activeRole === 'yuk_tashuvchi'
                ? 'bg-white text-slate-900 shadow-[0_2px_10px_rgba(15,23,42,0.08)] border border-slate-900/[0.04]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-sky-700" />
            <span>Haydovchi</span>
          </button>
        </div>

        {/* Right Actions: Notifications & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center border border-white/80 bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 active:scale-95 transition-all shadow-[0_2px_8px_rgba(15,23,42,0.04)] shrink-0"
            title="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
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
            className="w-9 h-9 rounded-2xl border border-white/80 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center text-xs font-black shadow-[0_2px_8px_rgba(15,23,42,0.08)] active:scale-95 transition-all shrink-0"
            title="Profil"
          >
            {activeRole === 'yuk_beruvchi' ? 'YB' : 'HD'}
          </button>
        </div>
      </div>
    </header>
  );
};
