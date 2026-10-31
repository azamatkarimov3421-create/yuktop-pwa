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
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-slate-200 active:scale-95 transition-all group"
            title="YUKTOP Asosiy sahifa"
          >
            <img 
              src="/assets/yuktop_logo_3d.jpg" 
              alt="YUKTOP Logo" 
              className="w-full h-full object-cover"
            />
          </button>
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            YUKTOP
          </span>
        </div>

        {/* Clean Apple-Style Segmented Role Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (activeRole !== 'yuk_beruvchi') onRoleToggle();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              activeRole === 'yuk_beruvchi'
                ? 'bg-white text-slate-900 shadow-xs'
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              activeRole === 'yuk_tashuvchi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Haydovchi</span>
          </button>
        </div>

        {/* Right Actions: Notifications & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 active:scale-95 transition-all shadow-2xs"
            title="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 shadow-2xs active:scale-95 transition-all shrink-0"
            title="Profil"
          >
            <img 
              src="/assets/3d_driver_avatar.jpg" 
              alt="Profil avatar" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
