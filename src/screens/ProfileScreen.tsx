import React, { useState } from 'react';
import {
  User,
  FileText,
  CreditCard,
  Bell,
  Globe,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut,
  Check,
  Download,
  Smartphone
} from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomNav } from '../components/BottomNav';
import { TruckIllustration } from '../components/TruckIllustration';
import { BottomNavTab, Language } from '../types';
import { DRIVER_DATA } from '../data/mockData';

interface ProfileScreenProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onLogOut: () => void;
  langText: {
    profile: string;
    personalInfo: string;
    documents: string;
    paymentMethods: string;
    notifications: string;
    language: string;
    helpSupport: string;
    settings: string;
    logOut: string;
    home: string;
    bookingsTab: string;
    mapTab: string;
    profileTab: string;
  };
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  activeTab,
  onTabChange,
  currentLang,
  onLanguageChange,
  onLogOut,
  langText
}) => {
  const [showLangModal, setShowLangModal] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(2);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const getLanguageLabel = (code: Language) => {
    if (code === 'uz') return 'O\'zbekcha';
    if (code === 'ru') return 'Русский';
    return 'English';
  };

  const menuItems = [
    {
      id: 'personal',
      title: langText.personalInfo,
      icon: User,
      action: () => alert(`User: ${DRIVER_DATA.name}\nPhone: ${DRIVER_DATA.phone}\nEmail: ${DRIVER_DATA.email}`)
    },
    {
      id: 'documents',
      title: langText.documents,
      icon: FileText,
      action: () => alert('License: UzTrans #482910\nInsurance: Gross Insurance (Active)')
    },
    {
      id: 'payment',
      title: langText.paymentMethods,
      icon: CreditCard,
      action: () => alert('Payment: Uzcard / Humo / Visa connected')
    },
    {
      id: 'notifications',
      title: langText.notifications,
      icon: Bell,
      badge: notificationsCount > 0 ? notificationsCount : undefined,
      action: () => {
        setShowNotificationModal(true);
        setNotificationsCount(0);
      }
    },
    {
      id: 'language',
      title: langText.language,
      icon: Globe,
      value: getLanguageLabel(currentLang),
      action: () => setShowLangModal(true)
    },
    {
      id: 'help',
      title: langText.helpSupport,
      icon: HelpCircle,
      action: () => alert('Support 24/7: +998 71 200 00 00')
    },
    {
      id: 'settings',
      title: langText.settings,
      icon: Settings,
      action: () => alert('Settings: YUKTOP PWA v1.0.0 (Capacitor / TWA APK ready)')
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between bg-[#F8FAFC] text-slate-800">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Top Curved Banner with Gradient Blue */}
        <div className="bg-gradient-to-b from-[#0B63F6] to-[#1677FF] pt-2 pb-7 px-6 rounded-b-[36px] text-white shadow-md relative">
          <StatusBar darkText={false} />

          {/* User Profile Header */}
          <div className="flex flex-col items-center mt-3 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                <TruckIllustration type="avatar" className="w-full h-full object-cover" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-white mt-2 tracking-tight">
              {DRIVER_DATA.name}
            </h2>
            <span className="text-xs text-blue-100 font-medium">
              {DRIVER_DATA.email}
            </span>

            {/* Driver Role Badge */}
            <div className="mt-2.5 inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Driver</span>
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="px-6 py-4 space-y-2 pb-12">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-xs flex items-center justify-between hover:bg-slate-50 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B63F6] flex items-center justify-center">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.badge !== undefined && (
                    <span className="w-5 h-5 rounded-full bg-[#FF7A00] text-white text-[10px] font-extrabold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {item.value && (
                    <span className="text-xs text-slate-400 font-semibold">
                      {item.value}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </button>
            );
          })}

          {/* PWA / APK Mobile App Info Card */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#0B63F6] text-white flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">YUKTOP Mobile (PWA & APK)</h4>
                <p className="text-[10px] text-slate-500">Android APK / Standalone App</p>
              </div>
            </div>
            <button
              onClick={() => alert("YUKTOP PWA / APK:\nO'rnatish uchun brauzeringiz menyusidan 'Add to Home Screen' bosing yoki Capacitor orqali Android Studio'da APK qiling.")}
              className="px-3 py-1.5 bg-[#0B63F6] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-600 transition-colors flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          </div>

          {/* Log Out Button */}
          <div className="pt-2 pb-2">
            <button
              onClick={onLogOut}
              className="w-full py-3 rounded-2xl border-2 border-orange-500/40 text-[#FF6B00] hover:bg-orange-50 active:scale-[0.98] font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4 stroke-[2.2]" />
              <span>{langText.logOut}</span>
            </button>
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

      {/* Language Selector Modal */}
      {showLangModal && (
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">{langText.language}</h3>
              <button onClick={() => setShowLangModal(false)} className="text-slate-400 text-sm font-semibold">Close</button>
            </div>
            <div className="py-2 space-y-1">
              {[
                { code: 'en' as Language, title: 'English (US)', desc: 'English language' },
                { code: 'uz' as Language, title: 'O\'zbekcha (Lotin)', desc: 'Uzbek language' },
                { code: 'ru' as Language, title: 'Русский', desc: 'Russian language' }
              ].map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLangModal(false);
                  }}
                  className="p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{lang.title}</h4>
                    <span className="text-xs text-slate-400">{lang.desc}</span>
                  </div>
                  {currentLang === lang.code && <Check className="w-5 h-5 text-[#0B63F6]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationModal && (
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[60vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">{langText.notifications}</h3>
              <button onClick={() => setShowNotificationModal(false)} className="text-slate-400 text-sm font-semibold">Close</button>
            </div>
            <div className="py-2 space-y-2 overflow-y-auto">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-[#0B63F6]">New freight request!</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Tashkent → Samarkand, 12,000 kg general cargo. Rate: $580.</p>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-600">Payment received</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Trip #YKP-4587 payout of $580 completed successfully.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
