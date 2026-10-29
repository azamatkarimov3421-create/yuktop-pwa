import React from 'react';
import { UserRole } from '../types';
import { 
  Package, 
  Plus, 
  ClipboardList, 
  Map, 
  User, 
  Truck, 
  Search
} from 'lucide-react';

export type MainTab = 'home' | 'marketplace' | 'orders' | 'map' | 'profile';

interface BottomNavigationProps {
  activeRole: UserRole;
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onOpenPostCargo: () => void;
  onOpenVehicleModal?: () => void;
  activeOrdersCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeRole,
  currentTab,
  onTabChange,
  onOpenPostCargo,
  onOpenVehicleModal,
  activeOrdersCount
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none px-2 xs:px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] w-full">
      <div className="max-w-[430px] mx-auto pointer-events-auto w-full">
        <div className="rounded-full px-1.5 xs:px-2 py-1 flex items-center justify-between shadow-lg border border-slate-200 bg-white w-full">
          {/* Tab 1: Home / Marketplace */}
          {activeRole === 'yuk_beruvchi' ? (
            <button
              type="button"
              onClick={() => onTabChange('home')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-full transition-all active:scale-90 ${
                currentTab === 'home'
                  ? 'bg-teal-500/15 text-teal-900 font-extrabold border border-teal-200/60 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Package className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
              <span className="text-[9px] xs:text-[10px] mt-0.5 truncate max-w-[55px] text-center">
                Yuklarim
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onTabChange('marketplace')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-full transition-all active:scale-90 ${
                currentTab === 'marketplace'
                  ? 'bg-teal-500/15 text-teal-900 font-extrabold border border-teal-200/60 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Search className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
              <span className="text-[9px] xs:text-[10px] mt-0.5 truncate max-w-[55px] text-center">
                Bozor
              </span>
            </button>
          )}

          {/* Tab 2: Orders */}
          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className={`flex-1 relative flex flex-col items-center justify-center py-1 rounded-full transition-all active:scale-90 ${
              currentTab === 'orders'
                ? 'bg-teal-500/15 text-teal-900 font-extrabold border border-teal-200/60 shadow-2xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ClipboardList className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
            <span className="text-[9px] xs:text-[10px] mt-0.5 truncate max-w-[55px] text-center">
              {activeRole === 'yuk_beruvchi' ? 'Buyurtma' : 'Reyslar'}
            </span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-1 right-2 xs:right-3 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Center Action Button */}
          <div className="px-1 shrink-0">
            {activeRole === 'yuk_beruvchi' ? (
              <button
                type="button"
                onClick={onOpenPostCargo}
                className="w-11 h-11 xs:w-12 xs:h-12 rounded-full bg-gradient-to-tr from-teal-600 via-teal-700 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-teal-700/35 active:scale-90 transition-transform -my-2 ring-4 ring-white/90 shrink-0 border border-white/40"
                title="Yuk e'lon qilish"
              >
                <Plus className="w-5 h-5 xs:w-6 xs:h-6 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenVehicleModal ? onOpenVehicleModal() : onTabChange('profile')}
                className="w-11 h-11 xs:w-12 xs:h-12 rounded-full bg-gradient-to-tr from-sky-600 via-teal-700 to-teal-800 text-white flex items-center justify-center shadow-lg shadow-sky-700/35 active:scale-90 transition-transform -my-2 ring-4 ring-white/90 shrink-0 border border-white/40"
                title="Transport va marshrut sozlamalari"
              >
                <Truck className="w-5 h-5 stroke-[2.2]" />
              </button>
            )}
          </div>

          {/* Tab 4: Map */}
          <button
            type="button"
            onClick={() => onTabChange('map')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-full transition-all active:scale-90 ${
              currentTab === 'map'
                ? 'bg-teal-500/15 text-teal-900 font-extrabold border border-teal-200/60 shadow-2xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Map className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
            <span className="text-[9px] xs:text-[10px] mt-0.5 truncate max-w-[55px] text-center">
              Xarita
            </span>
          </button>

          {/* Tab 5: Profile */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-full transition-all active:scale-90 ${
              currentTab === 'profile'
                ? 'bg-teal-500/15 text-teal-900 font-extrabold border border-teal-200/60 shadow-2xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
            <span className="text-[9px] xs:text-[10px] mt-0.5 truncate max-w-[55px] text-center">
              Profil
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
