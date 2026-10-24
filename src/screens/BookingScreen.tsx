import React, { useState } from 'react';
import { ArrowLeft, Bell, ArrowUpDown, Package, Scale, ChevronDown, Check } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomNav } from '../components/BottomNav';
import { BottomNavTab } from '../types';
import { UZBEKISTAN_CITIES, CARGO_TYPES } from '../data/mockData';

interface BookingScreenProps {
  onBack: () => void;
  onFindTrucks: (bookingDetails: {
    from: string;
    to: string;
    cargoType: string;
    weight: string;
  }) => void;
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  langText: {
    bookTruck: string;
    bookSubtitle: string;
    from: string;
    to: string;
    cargoType: string;
    weight: string;
    findTrucks: string;
    home: string;
    bookingsTab: string;
    mapTab: string;
    profileTab: string;
  };
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  onBack,
  onFindTrucks,
  activeTab,
  onTabChange,
  langText
}) => {
  const [fromCity, setFromCity] = useState('Tashkent');
  const [toCity, setToCity] = useState('Samarkand');
  const [cargoType, setCargoType] = useState('General Cargo');
  const [weight, setWeight] = useState('12,000');
  
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showCargoPicker, setShowCargoPicker] = useState(false);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleFind = () => {
    onFindTrucks({
      from: fromCity,
      to: toCity,
      cargoType,
      weight
    });
  };

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between bg-[#F8FAFC] text-slate-800">
      <div>
        {/* Mobile Status Bar */}
        <StatusBar darkText={true} />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          </button>
          
          <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
        </div>

        {/* Content Container */}
        <div className="px-6 pt-2 pb-4 space-y-4">
          {/* Title Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {langText.bookTruck}
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
              {langText.bookSubtitle}
            </p>
          </div>

          {/* Route Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative">
            {/* Origin "From" */}
            <div
              onClick={() => setShowFromPicker(true)}
              className="flex items-center space-x-3 cursor-pointer py-1 group"
            >
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#0B63F6] ring-4 ring-blue-100" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {langText.from}
                </span>
                <span className="text-base font-bold text-slate-800 group-hover:text-[#0B63F6] transition-colors">
                  {fromCity}
                </span>
                <span className="text-xs text-slate-400 block font-normal">Uzbekistan</span>
              </div>
            </div>

            {/* Divider with Swap Button */}
            <div className="relative py-2 pl-3">
              <div className="border-l-2 border-dashed border-slate-200 h-6 ml-0.5" />
              <button
                onClick={handleSwapCities}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 active:scale-90 text-[#0B63F6] flex items-center justify-center transition-all shadow-xs"
                title="Swap routes"
              >
                <ArrowUpDown className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Destination "To" */}
            <div
              onClick={() => setShowToPicker(true)}
              className="flex items-center space-x-3 cursor-pointer py-1 group"
            >
              <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#FF7A00] ring-4 ring-orange-100" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {langText.to}
                </span>
                <span className="text-base font-bold text-slate-800 group-hover:text-[#FF7A00] transition-colors">
                  {toCity}
                </span>
                <span className="text-xs text-slate-400 block font-normal">Uzbekistan</span>
              </div>
            </div>
          </div>

          {/* Cargo Type Field */}
          <div
            onClick={() => setShowCargoPicker(true)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-blue-200 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B63F6]">
                <Package className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {langText.cargoType}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {cargoType}
                </span>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </div>

          {/* Weight Field */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B63F6]">
                <Scale className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {langText.weight}
                </span>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent"
                  placeholder="e.g. 12,000"
                />
              </div>
            </div>
            
            {/* Quick weight presets */}
            <div className="flex space-x-1 text-xs">
              {['3.5k', '12k', '20k'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setWeight(preset === '3.5k' ? '3,500' : preset === '12k' ? '12,000' : '20,000')}
                  className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 text-[11px] font-medium transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Find Trucks Button */}
          <button
            onClick={handleFind}
            className="w-full py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7A00] active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-orange-500/20 transition-all duration-200 text-center flex items-center justify-center space-x-2"
          >
            <span>{langText.findTrucks}</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        labels={{
          home: langText.home,
          bookings: langText.bookingsTab,
          map: langText.mapTab,
          profile: langText.profileTab
        }}
      />

      {/* From City Modal Picker */}
      {showFromPicker && (
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">{langText.from} (Uzbekistan)</h3>
              <button onClick={() => setShowFromPicker(false)} className="text-slate-400 text-sm font-semibold">Yopish</button>
            </div>
            <div className="overflow-y-auto py-2 divide-y divide-slate-50">
              {UZBEKISTAN_CITIES.map((city) => (
                <div
                  key={city}
                  onClick={() => { setFromCity(city); setShowFromPicker(false); }}
                  className="py-3 px-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl"
                >
                  <span className={`text-sm ${fromCity === city ? 'font-bold text-[#0B63F6]' : 'text-slate-700'}`}>{city}</span>
                  {fromCity === city && <Check className="w-4 h-4 text-[#0B63F6]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* To City Modal Picker */}
      {showToPicker && (
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">{langText.to} (Uzbekistan)</h3>
              <button onClick={() => setShowToPicker(false)} className="text-slate-400 text-sm font-semibold">Yopish</button>
            </div>
            <div className="overflow-y-auto py-2 divide-y divide-slate-50">
              {UZBEKISTAN_CITIES.map((city) => (
                <div
                  key={city}
                  onClick={() => { setToCity(city); setShowToPicker(false); }}
                  className="py-3 px-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl"
                >
                  <span className={`text-sm ${toCity === city ? 'font-bold text-[#FF7A00]' : 'text-slate-700'}`}>{city}</span>
                  {toCity === city && <Check className="w-4 h-4 text-[#FF7A00]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cargo Type Picker */}
      {showCargoPicker && (
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[60vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">{langText.cargoType}</h3>
              <button onClick={() => setShowCargoPicker(false)} className="text-slate-400 text-sm font-semibold">Yopish</button>
            </div>
            <div className="overflow-y-auto py-2 divide-y divide-slate-50">
              {CARGO_TYPES.map((type) => (
                <div
                  key={type}
                  onClick={() => { setCargoType(type); setShowCargoPicker(false); }}
                  className="py-3 px-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl"
                >
                  <span className={`text-sm ${cargoType === type ? 'font-bold text-[#0B63F6]' : 'text-slate-700'}`}>{type}</span>
                  {cargoType === type && <Check className="w-4 h-4 text-[#0B63F6]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
