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
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 xs:px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-1 pointer-events-none w-full">
      <div className="max-w-md md:max-w-xl mx-auto pointer-events-auto w-full">
        <div className="rounded-[28px] p-1.5 flex items-center justify-around shadow-[0_16px_40px_-6px_rgba(15,23,42,0.12)] border border-white/90 bg-white/85 backdrop-blur-2xl w-full">
          {/* Tab 1: Asosiy / Bozor */}
          <button
            type="button"
            onClick={() => onTabChange(activeRole === 'yuk_beruvchi' ? 'home' : 'marketplace')}
            className={`flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
              isHomeOrMarket
                ? 'bg-white text-slate-900 border border-slate-200/80 shadow-xs font-black'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {activeRole === 'yuk_beruvchi' ? (
              <Package className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Truck className="w-5 h-5 stroke-[2.2]" />
            )}
            <span className="text-[10px] mt-1 tracking-tight">
              {activeRole === 'yuk_beruvchi' ? 'E\'lonlarim' : 'Bozor'}
            </span>
          </button>

          {/* Tab 2: Buyurtmalar */}
          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className={`flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
              currentTab === 'orders'
                ? 'bg-white text-slate-900 border border-slate-200/80 shadow-xs font-black'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <ClipboardList className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] mt-1 tracking-tight">Buyurtmalar</span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-1.5 right-1/4 w-2 h-2 rounded-full bg-slate-400 ring-2 ring-white" />
            )}
          </button>

          {/* Tab 3: Xarita */}
          <button
            type="button"
            onClick={() => onTabChange('map')}
            className={`flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
              currentTab === 'map'
                ? 'bg-white text-slate-900 border border-slate-200/80 shadow-xs font-black'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Map className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] mt-1 tracking-tight">Xarita</span>
          </button>

          {/* Tab 4: Profil */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
              currentTab === 'profile'
                ? 'bg-white text-slate-900 border border-slate-200/80 shadow-xs font-black'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] mt-1 tracking-tight">Profil</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
