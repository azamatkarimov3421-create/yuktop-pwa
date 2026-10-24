import React from 'react';
import { Home, Calendar, MapPin, User } from 'lucide-react';
import { BottomNavTab } from '../types';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  labels: {
    home: string;
    bookings: string;
    map: string;
    profile: string;
  };
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, labels }) => {
  const tabs = [
    { id: 'home' as BottomNavTab, label: labels.home, icon: Home },
    { id: 'bookings' as BottomNavTab, label: labels.bookings, icon: Calendar },
    { id: 'map' as BottomNavTab, label: labels.map, icon: MapPin },
    { id: 'profile' as BottomNavTab, label: labels.profile, icon: User },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2 pb-5 flex items-center justify-around z-30 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 transition-all duration-200 ${
              isActive ? 'text-[#0B63F6] scale-105 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 stroke-[2.2]" />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0B63F6] rounded-full" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
