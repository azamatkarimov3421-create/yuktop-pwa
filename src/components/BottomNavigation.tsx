import React from 'react';
import { UserRole } from '../types';
import { 
  Package, 
  ClipboardList, 
  Map, 
  User, 
  Truck
} from 'lucide-react';

export type MainTab = 'home' | 'marketplace' | 'orders' | 'map' | 'profile';

interface BottomNavigationProps {
  activeRole: UserRole;
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  activeOrdersCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeRole,
  currentTab,
  onTabChange,
  activeOrdersCount
}) => {
  const isHomeOrMarket = currentTab === 'home' || currentTab === 'marketplace';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 xs:px-4 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-1 pointer-events-none w-full">
      <div className="max-w-md md:max-w-xl mx-auto pointer-events-auto w-full">
        <div className="rounded-2xl px-2 py-1.5 flex items-center justify-around shadow-xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl w-full">
          {/* Tab 1: Asosiy / Bozor */}
          <button
            type="button"
            onClick={() => onTabChange(activeRole === 'yuk_beruvchi' ? 'home' : 'marketplace')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              isHomeOrMarket
                ? activeRole === 'yuk_beruvchi'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'bg-sky-50 text-sky-800 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeRole === 'yuk_beruvchi' ? (
              <Package className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Truck className="w-5 h-5 stroke-[2.2]" />
            )}
            <span className="text-[11px] mt-1">
              {activeRole === 'yuk_beruvchi' ? 'E\'lonlarim' : 'Yuklar bozori'}
            </span>
          </button>

          {/* Tab 2: Buyurtmalar */}
          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className={`flex-1 relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === 'orders'
                ? activeRole === 'yuk_beruvchi'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'bg-sky-50 text-sky-800 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ClipboardList className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] mt-1">Buyurtmalar</span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Tab 3: Xarita */}
          <button
            type="button"
            onClick={() => onTabChange('map')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === 'map'
                ? activeRole === 'yuk_beruvchi'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'bg-sky-50 text-sky-800 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Map className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] mt-1">Xarita</span>
          </button>

          {/* Tab 4: Profil */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              currentTab === 'profile'
                ? activeRole === 'yuk_beruvchi'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'bg-sky-50 text-sky-800 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] mt-1">Profil</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
