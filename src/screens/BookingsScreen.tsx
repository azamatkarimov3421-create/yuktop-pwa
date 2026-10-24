import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomNav } from '../components/BottomNav';
import { TruckIllustration } from '../components/TruckIllustration';
import { BookingItem, BottomNavTab } from '../types';

interface BookingsScreenProps {
  bookings: BookingItem[];
  onSelectBooking: (booking: BookingItem) => void;
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  langText: {
    myBookings: string;
    all: string;
    active: string;
    completed: string;
    cancelled: string;
    home: string;
    bookingsTab: string;
    mapTab: string;
    profileTab: string;
  };
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  bookings,
  onSelectBooking,
  activeTab,
  onTabChange,
  langText
}) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Cancelled'>('All');

  const filteredBookings = bookings.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return item.status === 'In Transit';
    if (filter === 'Completed') return item.status === 'Completed' || item.status === 'Delivered';
    if (filter === 'Cancelled') return item.status === 'Cancelled';
    return true;
  });

  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>In Transit</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Delivered</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-600 border border-sky-100">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between bg-[#F8FAFC] text-slate-800">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Status Bar */}
        <StatusBar darkText={true} />

        {/* Title Header */}
        <div className="px-6 pt-2 pb-3">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {langText.myBookings}
          </h1>
        </div>

        {/* Tabs Filter Bar */}
        <div className="px-6 flex items-center space-x-2 overflow-x-auto no-scrollbar pb-3">
          {[
            { id: 'All' as const, label: langText.all },
            { id: 'Active' as const, label: langText.active },
            { id: 'Completed' as const, label: langText.completed },
            { id: 'Cancelled' as const, label: langText.cancelled },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0B63F6] text-white shadow-xs'
                    : 'bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="px-6 py-2 space-y-3 pb-12">
          {filteredBookings.map((booking) => {
            return (
              <div
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-blue-200 cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center space-x-3.5">
                  {/* Truck Thumbnail */}
                  <div className="w-14 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-1 shrink-0 border border-slate-100/80">
                    <TruckIllustration
                      type={booking.status === 'In Transit' ? 'medium' : 'small'}
                      className="w-12 h-10 object-contain"
                    />
                  </div>

                  {/* Route & Date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                        {booking.from}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                        {booking.to}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                      {booking.date} • {booking.time}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      {getStatusBadge(booking.status)}
                      <span className="font-extrabold text-slate-900 text-sm">
                        ${booking.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Hozircha buyurtmalar yo'q</p>
            </div>
          )}
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
    </div>
  );
};
