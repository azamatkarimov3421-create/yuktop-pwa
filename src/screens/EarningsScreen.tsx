import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomNav } from '../components/BottomNav';
import { BottomNavTab } from '../types';
import { EARNINGS_DATA } from '../data/mockData';

interface EarningsScreenProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  langText: {
    earnings: string;
    totalEarnings: string;
    vsLast30Days: string;
    recentPayouts: string;
    viewAll: string;
    home: string;
    bookingsTab: string;
    mapTab: string;
    profileTab: string;
  };
}

export const EarningsScreen: React.FC<EarningsScreenProps> = ({
  activeTab,
  onTabChange,
  langText
}) => {
  const [activeBarIndex, setActiveBarIndex] = useState<number>(4); // Default to May 4 ($720)

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between bg-[#F8FAFC] text-slate-800">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Mobile Status Bar */}
        <StatusBar darkText={true} />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-2 pb-3">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {langText.earnings}
          </h1>

          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 transition-all">
            <Download className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content Container */}
        <div className="px-6 space-y-4 pb-12">
          {/* Total Earnings Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              {langText.totalEarnings}
            </span>

            <div className="flex items-center space-x-3 mt-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ${EARNINGS_DATA.total.toLocaleString()}
              </span>

              <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+{EARNINGS_DATA.growthPercent}%</span>
              </div>
            </div>

            <span className="text-xs text-slate-400 mt-1 block font-medium">
              {langText.vsLast30Days}
            </span>

            {/* Interactive Earnings Bar Chart */}
            <div className="mt-6 pt-4 border-t border-slate-50">
              <div className="h-36 flex items-end justify-between px-2 gap-2">
                {EARNINGS_DATA.chartBars.map((bar, index) => {
                  const isSelected = activeBarIndex === index;
                  const barColor = bar.isHighlight
                    ? isSelected ? 'bg-[#FF7A00]' : 'bg-[#FF7A00]/80'
                    : isSelected ? 'bg-[#0B63F6]' : 'bg-[#0B63F6]/70';

                  return (
                    <div
                      key={index}
                      onClick={() => setActiveBarIndex(index)}
                      className="flex-1 flex flex-col items-center cursor-pointer group"
                    >
                      {/* Tooltip on hover/active */}
                      {isSelected && (
                        <div className="mb-1.5 px-1.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-md animate-in fade-in zoom-in-95">
                          ${bar.amount}
                        </div>
                      )}
                      
                      {/* Bar Pillar */}
                      <div className="w-full flex justify-center h-28 items-end">
                        <div
                          style={{ height: `${bar.heightPercent}%` }}
                          className={`w-full max-w-[14px] rounded-t-lg transition-all duration-300 ${barColor} group-hover:opacity-100`}
                        />
                      </div>

                      {/* Date label */}
                      <span className={`text-[10px] mt-2 font-semibold block whitespace-nowrap transition-colors ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}>
                        {bar.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Payouts Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {langText.recentPayouts}
              </h3>
              <button className="text-xs font-bold text-[#0B63F6] hover:underline flex items-center space-x-0.5">
                <span>{langText.viewAll}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {EARNINGS_DATA.payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0B63F6] flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {payout.id}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {payout.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 block leading-tight">
                      ${payout.amount}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                      {payout.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
