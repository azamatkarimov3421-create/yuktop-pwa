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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-3 xs:px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-2.5 w-full shadow-xs">
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 shrink-0">
            <Truck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                YUKTOP
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 tracking-wider">
                UZ
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">
              Smart Logistika
            </div>
          </div>
        </div>

        {/* Clear Segmented Role Switcher: [ Yuk beruvchi ] | [ Haydovchi ] */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => {
              if (activeRole !== 'yuk_beruvchi') onRoleToggle();
            }}
            className={`flex items-center gap-1 px-2.5 xs:px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeRole === 'yuk_beruvchi'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Yukchi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (activeRole !== 'yuk_tashuvchi') onRoleToggle();
            }}
            className={`flex items-center gap-1 px-2.5 xs:px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeRole === 'yuk_tashuvchi'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Haydovchi</span>
          </button>
        </div>

        {/* Right Actions: Notifications & Profile */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Notifications button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-95 transition-all shadow-2xs shrink-0"
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
            className="w-9 h-9 rounded-2xl border border-slate-200 bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center text-xs font-black shadow-2xs active:scale-95 transition-all shrink-0"
            title="Profil"
          >
            {activeRole === 'yuk_beruvchi' ? 'YB' : 'HD'}
          </button>
        </div>
      </div>
    </header>
  );
};
