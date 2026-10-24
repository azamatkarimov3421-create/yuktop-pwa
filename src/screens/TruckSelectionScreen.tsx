import React, { useState } from 'react';
import { SlidersHorizontal, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { TruckIllustration } from '../components/TruckIllustration';
import { TruckItem } from '../types';
import { TRUCKS_DATA } from '../data/mockData';

interface TruckSelectionScreenProps {
  onBack: () => void;
  onSelectTruck: (truck: TruckItem) => void;
  langText: {
    availableTrucks: string;
    all: string;
    small: string;
    medium: string;
    large: string;
    perTrip: string;
    applyFilters: string;
  };
}

export const TruckSelectionScreen: React.FC<TruckSelectionScreenProps> = ({
  onBack,
  onSelectTruck,
  langText
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [selectedTruckId, setSelectedTruckId] = useState<string>('truck-2');

  const filteredTrucks = TRUCKS_DATA.filter((truck) => {
    if (selectedFilter === 'all') return true;
    return truck.category === selectedFilter;
  });

  const handleApply = () => {
    const chosen = TRUCKS_DATA.find((t) => t.id === selectedTruckId) || TRUCKS_DATA[1];
    onSelectTruck(chosen);
  };

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between bg-[#F8FAFC] text-slate-800">
      <div>
        {/* Mobile Status Bar */}
        <StatusBar darkText={true} />

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          </button>
          
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            {langText.availableTrucks}
          </h1>

          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 transition-all">
            <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="px-6 py-3 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all' as const, label: langText.all },
            { id: 'small' as const, label: langText.small },
            { id: 'medium' as const, label: langText.medium },
            { id: 'large' as const, label: langText.large },
          ].map((chip) => {
            const isActive = selectedFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedFilter(chip.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0B63F6] text-white shadow-sm shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Truck Cards List */}
        <div className="px-6 py-2 space-y-3">
          {filteredTrucks.map((truck) => {
            const isSelected = selectedTruckId === truck.id;
            const badgeClasses =
              truck.badgeColor === 'green'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-orange-50 text-orange-600 border border-orange-100';

            return (
              <div
                key={truck.id}
                onClick={() => setSelectedTruckId(truck.id)}
                className={`w-full bg-white rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'border-[#0B63F6] shadow-md shadow-blue-500/10 ring-2 ring-blue-500/10'
                    : 'border-slate-100 hover:border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  {/* Truck Illustration */}
                  <div className="w-20 h-16 bg-slate-50 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden border border-slate-100/60">
                    <TruckIllustration
                      type={truck.category}
                      className="w-18 h-12 object-contain"
                    />
                  </div>

                  {/* Truck Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate">
                        {truck.name}
                      </h3>
                      <div className="text-right">
                        <span className="font-extrabold text-[#0B63F6] text-base leading-none">
                          ${truck.price}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {langText.perTrip}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {truck.capacity}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${badgeClasses}`}>
                        {truck.badge}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-6 pt-2 bg-white/60 backdrop-blur-xs border-t border-slate-100">
        <button
          onClick={handleApply}
          className="w-full py-3.5 rounded-2xl border-2 border-[#0B63F6] text-[#0B63F6] hover:bg-blue-50 active:scale-[0.98] font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{langText.applyFilters}</span>
        </button>
      </div>
    </div>
  );
};
