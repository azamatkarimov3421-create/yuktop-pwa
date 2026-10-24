import React, { useState } from 'react';
import { ArrowLeft, Star, ShieldCheck, Phone, MessageSquare, Send } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { TruckIllustration } from '../components/TruckIllustration';
import { DRIVER_DATA } from '../data/mockData';

interface DriverProfileScreenProps {
  onBack: () => void;
  langText: {
    driverProfile: string;
    verifiedDriver: string;
    yearsExp: string;
    completedTrips: string;
    onTimeRate: string;
    about: string;
    vehicle: string;
    message: string;
    call: string;
  };
}

export const DriverProfileScreen: React.FC<DriverProfileScreenProps> = ({ onBack, langText }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatLog, setChatLog] = useState([
    { from: 'driver', text: 'Assalomu alaykum! Yukingiz belgilangan vaqtda yetkaziladi.' }
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setChatLog([...chatLog, { from: 'user', text: messageText }]);
    setMessageText('');
    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        { from: 'driver', text: 'Rahmat, qabul qildim! Yo\'ldamiz.' }
      ]);
    }, 1000);
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
          
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            {langText.driverProfile}
          </h1>

          <a
            href="tel:+998901234567"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0B63F6] hover:bg-blue-50 transition-all"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Driver Header Card */}
        <div className="px-6 pt-3 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-blue-500/10">
              <TruckIllustration type="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-[#0B63F6] border-2 border-white flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {DRIVER_DATA.name}
          </h2>

          {/* Rating & Verified Pill */}
          <div className="flex items-center space-x-2 mt-1.5">
            <div className="flex items-center space-x-1 text-xs font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{DRIVER_DATA.rating}</span>
              <span className="text-slate-400 font-normal">({DRIVER_DATA.totalTrips} trips)</span>
            </div>

            <div className="flex items-center space-x-1 text-xs font-semibold text-[#0B63F6] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              <ShieldCheck className="w-3 h-3 text-[#0B63F6]" />
              <span>{langText.verifiedDriver}</span>
            </div>
          </div>
        </div>

        {/* 3 Stats Columns */}
        <div className="px-6 mt-5">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div className="px-1">
              <span className="text-lg font-extrabold text-slate-900 block leading-tight">5+</span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight block mt-1">
                {langText.yearsExp}
              </span>
            </div>
            <div className="px-1">
              <span className="text-lg font-extrabold text-slate-900 block leading-tight">124</span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight block mt-1">
                {langText.completedTrips}
              </span>
            </div>
            <div className="px-1">
              <span className="text-lg font-extrabold text-slate-900 block leading-tight">98%</span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight block mt-1">
                {langText.onTimeRate}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="px-6 mt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            {langText.about}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal bg-white p-3.5 rounded-2xl border border-slate-100">
            {DRIVER_DATA.about}
          </p>
        </div>

        {/* Vehicle Section */}
        <div className="px-6 mt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            {langText.vehicle}
          </h3>
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 flex items-center space-x-3.5">
            <div className="w-16 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-1 shrink-0 border border-slate-100">
              <TruckIllustration type="medium" className="w-14 h-10 object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {DRIVER_DATA.vehicle.model}
              </h4>
              <span className="text-xs font-bold text-[#0B63F6] block mt-0.5">
                {DRIVER_DATA.vehicle.plate}
              </span>
              <span className="text-[11px] text-slate-400 block font-medium">
                {DRIVER_DATA.vehicle.capacity}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="p-6 pt-2 bg-white/70 backdrop-blur-xs border-t border-slate-100">
        <button
          onClick={() => setShowMessageModal(true)}
          className="w-full py-4 rounded-2xl bg-[#0B63F6] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{langText.message}</span>
        </button>
      </div>

      {/* Live Chat Modal */}
      {showMessageModal && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex flex-col justify-end">
          <div className="w-full bg-white rounded-t-3xl p-5 shadow-2xl h-[80%] flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Chat header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
                  <TruckIllustration type="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Azizbek Rakhimov</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">Online</span>
                </div>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 text-xs font-bold hover:text-slate-600 p-1"
              >
                Yopish
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs font-medium ${
                      msg.from === 'user'
                        ? 'bg-[#0B63F6] text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Row */}
            <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Xabar yozing..."
                className="flex-1 bg-slate-100 text-slate-800 text-xs px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                onClick={handleSendMessage}
                className="w-9 h-9 rounded-full bg-[#0B63F6] text-white flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
