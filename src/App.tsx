import React, { useState, useEffect } from 'react';
import { ScreenType, BottomNavTab, Language, TruckItem, BookingItem } from './types';
import { TRANSLATIONS } from './translations';
import { INITIAL_BOOKINGS } from './data/mockData';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { BookingScreen } from './screens/BookingScreen';
import { TruckSelectionScreen } from './screens/TruckSelectionScreen';
import { TrackingScreen } from './screens/TrackingScreen';
import { DriverProfileScreen } from './screens/DriverProfileScreen';
import { BookingsScreen } from './screens/BookingsScreen';
import { EarningsScreen } from './screens/EarningsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

// Modals & Components
import { ConfirmBookingModal } from './modals/ConfirmBookingModal';
import { Smartphone, Monitor, Layers, Globe, Download } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [bottomNavTab, setBottomNavTab] = useState<BottomNavTab>('home');
  const [language, setLanguage] = useState<Language>('en'); // Matches Figma reference design by default
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [activeBooking, setActiveBooking] = useState<BookingItem>(INITIAL_BOOKINGS[0]);
  const [selectedTruck, setSelectedTruck] = useState<TruckItem | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [showDevSwitcher, setShowDevSwitcher] = useState(false);

  // Booking form state
  const [bookingFormData, setBookingFormData] = useState({
    from: 'Tashkent',
    to: 'Samarkand',
    cargoType: 'General Cargo',
    weight: '12,000'
  });

  // Attach programmatic screen switcher to window for testing & automated screenshot capture
  useEffect(() => {
    (window as any).setYuktopScreen = (screen: ScreenType) => {
      setCurrentScreen(screen);
      if (screen === 'booking') setBottomNavTab('home');
      if (screen === 'bookings') setBottomNavTab('bookings');
      if (screen === 'tracking') setBottomNavTab('map');
      if (screen === 'profile') setBottomNavTab('profile');
    };
    (window as any).setYuktopLanguage = (lang: Language) => {
      setLanguage(lang);
    };
  }, []);

  const t = TRANSLATIONS[language];

  // Sync bottom nav tab with screens
  const handleBottomTabChange = (tab: BottomNavTab) => {
    setBottomNavTab(tab);
    if (tab === 'home') setCurrentScreen('booking');
    if (tab === 'bookings') setCurrentScreen('bookings');
    if (tab === 'map') setCurrentScreen('tracking');
    if (tab === 'profile') setCurrentScreen('profile');
  };

  // Flow handlers
  const handleGetStarted = () => {
    setCurrentScreen('booking');
    setBottomNavTab('home');
  };

  const handleLogIn = () => {
    setCurrentScreen('booking');
    setBottomNavTab('home');
  };

  const handleFindTrucks = (details: { from: string; to: string; cargoType: string; weight: string }) => {
    setBookingFormData(details);
    setCurrentScreen('trucks');
  };

  const handleSelectTruck = (truck: TruckItem) => {
    setSelectedTruck(truck);
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedTruck) return;
    
    const newBooking: BookingItem = {
      id: `YKP-${Math.floor(1000 + Math.random() * 9000)}`,
      from: bookingFormData.from,
      to: bookingFormData.to,
      date: '12 May 2025',
      time: '10:30',
      status: 'In Transit',
      price: selectedTruck.price,
      truckType: selectedTruck.name === 'Small Truck' ? 'Isuzu Light' : selectedTruck.name === 'Medium Truck' ? 'Volvo FH' : 'Scania R500',
      truckPlate: 'AB 1234 AA',
      cargoType: bookingFormData.cargoType,
      weight: `${bookingFormData.weight} kg`,
      driverName: 'Azizbek Rakhimov',
      progressStep: 2,
      eta: '2h 45m'
    };

    setBookings([newBooking, ...bookings]);
    setActiveBooking(newBooking);
    setShowConfirmModal(false);
    setCurrentScreen('tracking');
    setBottomNavTab('map');
  };

  const handleSelectBookingItem = (item: BookingItem) => {
    setActiveBooking(item);
    setCurrentScreen('tracking');
    setBottomNavTab('map');
  };

  const handleInstallPWA = () => {
    alert("YUKTOP PWA / APK:\nIlovani mobil qurilmangizga o'rnatish uchun brauzer menyusidan 'Add to Home Screen' (Bosh ekranga qo'shish) tugmasini bosing.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans antialiased text-slate-800 p-0 sm:p-4 selection:bg-blue-500 selection:text-white">
      {/* Top Floating Control Bar for Demo / Verification */}
      <div className="w-full max-w-md mb-2 px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDevSwitcher(!showDevSwitcher)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 font-bold hover:bg-blue-600/30 transition-all"
            title="Switch Screen"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="capitalize">Screen: {currentScreen}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Switcher Quick Pill */}
          <button
            onClick={() => {
              const langs: Language[] = ['en', 'uz', 'ru'];
              const nextIndex = (langs.indexOf(language) + 1) % langs.length;
              setLanguage(langs[nextIndex]);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase transition-colors"
            title="Change Language"
          >
            <Globe className="w-3 h-3 text-blue-400" />
            <span>{language}</span>
          </button>

          {/* PWA Install Quick Button */}
          <button
            onClick={handleInstallPWA}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#FF6B00]/20 text-[#FF7A00] hover:bg-[#FF6B00]/30 font-bold transition-colors"
            title="Install PWA / APK"
          >
            <Download className="w-3 h-3" />
            <span>PWA</span>
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isMobileFrame ? 'Full Viewport Mode' : 'Mobile Frame Mode'}
          >
            {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Screen Quick Selector Dropdown */}
      {showDevSwitcher && (
        <div className="w-full max-w-md mb-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-wrap gap-1.5 text-xs animate-in fade-in duration-150">
          {[
            { id: 'splash' as ScreenType, label: '1. Splash / Welcome' },
            { id: 'booking' as ScreenType, label: '2. Cargo Booking' },
            { id: 'trucks' as ScreenType, label: '3. Available Trucks' },
            { id: 'tracking' as ScreenType, label: '4. Real-Time Tracking' },
            { id: 'driver' as ScreenType, label: '5. Driver Profile' },
            { id: 'bookings' as ScreenType, label: '6. My Bookings' },
            { id: 'earnings' as ScreenType, label: '7. Earnings & Analytics' },
            { id: 'profile' as ScreenType, label: '8. Profile & Settings' },
          ].map((screen) => (
            <button
              key={screen.id}
              onClick={() => {
                setCurrentScreen(screen.id);
                setShowDevSwitcher(false);
                if (screen.id === 'booking') setBottomNavTab('home');
                if (screen.id === 'bookings') setBottomNavTab('bookings');
                if (screen.id === 'tracking') setBottomNavTab('map');
                if (screen.id === 'profile') setBottomNavTab('profile');
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                currentScreen === screen.id
                  ? 'bg-[#0B63F6] text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Mobile App Frame / Container */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 relative shadow-2xl ${
          isMobileFrame
            ? 'max-w-[390px] h-[844px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 ring-1 ring-slate-700/50'
            : 'max-w-none min-h-screen rounded-none'
        }`}
      >
        {/* Dynamic Island / Mobile Notch on iPhone style */}
        {isMobileFrame && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 hidden sm:flex items-center justify-center pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></span>
          </div>
        )}

        {/* Active Screen Rendering */}
        <div className="w-full h-full relative overflow-y-auto no-scrollbar">
          {currentScreen === 'splash' && (
            <SplashScreen
              onGetStarted={handleGetStarted}
              onLogIn={handleLogIn}
              langText={{
                welcomeTitle1: t.welcomeTitle1,
                welcomeTitle2: t.welcomeTitle2,
                welcomeSubtitle: t.welcomeSubtitle,
                getStarted: t.getStarted,
                logIn: t.logIn
              }}
            />
          )}

          {currentScreen === 'booking' && (
            <BookingScreen
              onBack={() => setCurrentScreen('splash')}
              onFindTrucks={handleFindTrucks}
              activeTab={bottomNavTab}
              onTabChange={handleBottomTabChange}
              langText={{
                bookTruck: t.bookTruck,
                bookSubtitle: t.bookSubtitle,
                from: t.from,
                to: t.to,
                cargoType: t.cargoType,
                weight: t.weight,
                findTrucks: t.findTrucks,
                home: t.home,
                bookingsTab: t.bookingsTab,
                mapTab: t.mapTab,
                profileTab: t.profileTab
              }}
            />
          )}

          {currentScreen === 'trucks' && (
            <TruckSelectionScreen
              onBack={() => setCurrentScreen('booking')}
              onSelectTruck={handleSelectTruck}
              langText={{
                availableTrucks: t.availableTrucks,
                all: t.all,
                small: t.small,
                medium: t.medium,
                large: t.large,
                perTrip: t.perTrip,
                applyFilters: t.applyFilters
              }}
            />
          )}

          {currentScreen === 'tracking' && (
            <TrackingScreen
              onBack={() => setCurrentScreen('booking')}
              booking={activeBooking}
              onViewDriver={() => setCurrentScreen('driver')}
              langText={{
                trackShipment: t.trackShipment,
                inTransit: t.inTransit,
                loading: t.loading,
                delivered: t.delivered
              }}
            />
          )}

          {currentScreen === 'driver' && (
            <DriverProfileScreen
              onBack={() => setCurrentScreen('tracking')}
              langText={{
                driverProfile: t.driverProfile,
                verifiedDriver: t.verifiedDriver,
                yearsExp: t.yearsExp,
                completedTrips: t.completedTrips,
                onTimeRate: t.onTimeRate,
                about: t.about,
                vehicle: t.vehicle,
                message: t.message,
                call: t.call
              }}
            />
          )}

          {currentScreen === 'bookings' && (
            <BookingsScreen
              bookings={bookings}
              onSelectBooking={handleSelectBookingItem}
              activeTab={bottomNavTab}
              onTabChange={handleBottomTabChange}
              langText={{
                myBookings: t.myBookings,
                all: t.all,
                active: t.active,
                completed: t.completed,
                cancelled: t.cancelled,
                home: t.home,
                bookingsTab: t.bookingsTab,
                mapTab: t.mapTab,
                profileTab: t.profileTab
              }}
            />
          )}

          {currentScreen === 'earnings' && (
            <EarningsScreen
              activeTab={bottomNavTab}
              onTabChange={handleBottomTabChange}
              langText={{
                earnings: t.earnings,
                totalEarnings: t.totalEarnings,
                vsLast30Days: t.vsLast30Days,
                recentPayouts: t.recentPayouts,
                viewAll: t.viewAll,
                home: t.home,
                bookingsTab: t.bookingsTab,
                mapTab: t.mapTab,
                profileTab: t.profileTab
              }}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              activeTab={bottomNavTab}
              onTabChange={handleBottomTabChange}
              currentLang={language}
              onLanguageChange={setLanguage}
              onLogOut={() => {
                setCurrentScreen('splash');
                alert("Logged out successfully!");
              }}
              langText={{
                profile: t.profile,
                personalInfo: t.personalInfo,
                documents: t.documents,
                paymentMethods: t.paymentMethods,
                notifications: t.notifications,
                language: t.language,
                helpSupport: t.helpSupport,
                settings: t.settings,
                logOut: t.logOut,
                home: t.home,
                bookingsTab: t.bookingsTab,
                mapTab: t.mapTab,
                profileTab: t.profileTab
              }}
            />
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedTruck && (
          <ConfirmBookingModal
            truck={selectedTruck}
            fromCity={bookingFormData.from}
            toCity={bookingFormData.to}
            weight={bookingFormData.weight}
            cargoType={bookingFormData.cargoType}
            onConfirm={handleConfirmBooking}
            onClose={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </div>
  );
}
