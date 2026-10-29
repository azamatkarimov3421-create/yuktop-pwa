import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  CargoItem, 
  Order, 
  Bid, 
  NotificationItem, 
  UserProfile, 
  OrderStatus,
  LocationPoint 
} from './types';
import { storageService } from './services/storageService';

// Components & Screens
import { Navbar } from './components/Navbar';
import { BottomNavigation, MainTab } from './components/BottomNavigation';
import { ShipperHomeScreen } from './screens/ShipperHomeScreen';
import { CarrierMarketplaceScreen } from './screens/CarrierMarketplaceScreen';
import { OrdersListScreen } from './screens/OrdersListScreen';
import { MapScreen } from './screens/MapScreen';
import { ProfileScreen } from './screens/ProfileScreen';

// Modals
import { PostCargoModal } from './screens/PostCargoModal';
import { CargoDetailModal } from './screens/CargoDetailModal';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { ChatScreen } from './screens/ChatScreen';
import { CarrierVehicleModal } from './screens/CarrierVehicleModal';
import { NotificationsModal } from './screens/NotificationsModal';
import { AppwriteSettingsModal } from './screens/AppwriteSettingsModal';
import { ReviewModal } from './screens/ReviewModal';
import { WaybillModal } from './components/WaybillModal';
import { ProfitCalculatorModal } from './components/ProfitCalculatorModal';
import { App as CapApp } from '@capacitor/app';
import { locationService } from './services/locationService';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>(storageService.getActiveRole());
  const [currentTab, setCurrentTab] = useState<MainTab>(
    storageService.getActiveRole() === 'yuk_beruvchi' ? 'home' : 'marketplace'
  );

  const [cargos, setCargos] = useState<CargoItem[]>(storageService.getCargos());
  const [orders, setOrders] = useState<Order[]>(storageService.getOrders());
  const [notifications, setNotifications] = useState<NotificationItem[]>(storageService.getNotifications());
  const [profile, setProfile] = useState<UserProfile>(storageService.getCurrentProfile());

  // Modals & Active Views
  const [showPostCargoModal, setShowPostCargoModal] = useState(false);
  const [selectedCargoForDetail, setSelectedCargoForDetail] = useState<CargoItem | null>(null);
  const [detailPickupDistanceKm, setDetailPickupDistanceKm] = useState<number | undefined>(undefined);
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showAppwriteModal, setShowAppwriteModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  // Waybill and Profit Calculator
  const [waybillCargo, setWaybillCargo] = useState<CargoItem | null>(null);
  const [waybillOrder, setWaybillOrder] = useState<Order | null>(null);
  const [showProfitCalculator, setShowProfitCalculator] = useState(false);
  const [calcDistanceKm, setCalcDistanceKm] = useState(300);
  const [calcPriceUzs, setCalcPriceUzs] = useState(4000000);
  const [showExitToast, setShowExitToast] = useState(false);

  // Ilova ochilganda foydalanuvchidan GPS ruxsatini darhol so'rash
  useEffect(() => {
    locationService.requestGpsPermission().catch(() => {});
  }, []);

  // Android Qurilma Jismoniy / Jest "Orqaga" Tugmasi Integratsiyasi (Capacitor App BackButton)
  useEffect(() => {
    let backPressCount = 0;
    let backPressTimer: any = null;

    const backListener = CapApp.addListener('backButton', () => {
      // 1-daraja: Agar kalkulyator ochiq bo'lsa
      if (showProfitCalculator) {
        setShowProfitCalculator(false);
        return;
      }
      // 2-daraja: Agar TTN / Nakladnoy ochiq bo'lsa
      if (waybillCargo || waybillOrder) {
        setWaybillCargo(null);
        setWaybillOrder(null);
        return;
      }
      // 3-daraja: Agar sharh/baho oynasi ochiq bo'lsa
      if (reviewOrder) {
        setReviewOrder(null);
        return;
      }
      // 4-daraja: Agar Appwrite sozlamalari ochiq bo'lsa
      if (showAppwriteModal) {
        setShowAppwriteModal(false);
        return;
      }
      // 5-daraja: Agar bildirishnomalar ochiq bo'lsa
      if (showNotificationsModal) {
        setShowNotificationsModal(false);
        return;
      }
      // 6-daraja: Agar haydovchi transport sozlamalari ochiq bo'lsa
      if (showVehicleModal) {
        setShowVehicleModal(false);
        return;
      }
      // 7-daraja: Agar yuk e'lon qilish modal oynasi ochiq bo'lsa
      if (showPostCargoModal) {
        setShowPostCargoModal(false);
        return;
      }
      // 8-daraja: Agar yuk batafsil ko'rish oynasi ochiq bo'lsa
      if (selectedCargoForDetail) {
        setSelectedCargoForDetail(null);
        return;
      }
      // 9-daraja: Agar faol chat ochiq bo'lsa
      if (activeChatOrderId) {
        setActiveChatOrderId(null);
        return;
      }
      // 10-daraja: Agar faol buyurtma kuzatuv ekrani ochiq bo'lsa
      if (activeOrderForTracking) {
        setActiveOrderForTracking(null);
        return;
      }

      // 11-daraja: Agar modal ochiq bo'lmasa, lekin boshqa tabda bo'lsa (Masalan: Buyurtmalar, Xarita, Profil)
      const rootTab: MainTab = activeRole === 'yuk_beruvchi' ? 'home' : 'marketplace';
      if (currentTab !== rootTab) {
        setCurrentTab(rootTab);
        return;
      }

      // 12-daraja: Agar bosh sahifada bo'lsa, ilovadan chiqish uchun 2 marta bosish
      backPressCount++;
      if (backPressCount === 1) {
        setShowExitToast(true);
        clearTimeout(backPressTimer);
        backPressTimer = setTimeout(() => {
          backPressCount = 0;
          setShowExitToast(false);
        }, 2200);
      } else if (backPressCount >= 2) {
        clearTimeout(backPressTimer);
        CapApp.exitApp();
      }
    });

    return () => {
      backListener.then(l => l.remove());
      if (backPressTimer) clearTimeout(backPressTimer);
    };
  }, [
    showProfitCalculator,
    waybillCargo,
    waybillOrder,
    reviewOrder,
    showAppwriteModal,
    showNotificationsModal,
    showVehicleModal,
    showPostCargoModal,
    selectedCargoForDetail,
    activeChatOrderId,
    activeOrderForTracking,
    currentTab,
    activeRole
  ]);

  const handleOpenCalculator = (distanceKm: number, priceUzs: number) => {
    setCalcDistanceKm(distanceKm);
    setCalcPriceUzs(priceUzs);
    setShowProfitCalculator(true);
  };

  // Sync state from storage service
  const refreshState = () => {
    setActiveRole(storageService.getActiveRole());
    setCargos(storageService.getCargos());
    setOrders(storageService.getOrders());
    setNotifications(storageService.getNotifications());
    setProfile(storageService.getCurrentProfile());

    if (activeOrderForTracking) {
      const updated = storageService.getOrderById(activeOrderForTracking.id);
      if (updated) setActiveOrderForTracking(updated);
    }
  };

  useEffect(() => {
    const unsub = storageService.subscribe(refreshState);
    return unsub;
  }, [activeOrderForTracking?.id]);

  // Handle Role Toggle
  const handleRoleToggle = () => {
    const nextRole: UserRole = activeRole === 'yuk_beruvchi' ? 'yuk_tashuvchi' : 'yuk_beruvchi';
    storageService.setActiveRole(nextRole);
    setActiveRole(nextRole);
    setProfile(storageService.getCurrentProfile());
    setCurrentTab(nextRole === 'yuk_beruvchi' ? 'home' : 'marketplace');
  };

  // Shipper adds new cargo
  const handlePostCargo = (cargoData: any) => {
    const newCargo = storageService.addCargo({
      ...cargoData,
      ownerId: profile.id,
      ownerName: profile.fullName,
      ownerPhone: profile.phone
    });
    refreshState();
  };

  // Shipper accepts carrier bid
  const handleAcceptBid = (bidId: string) => {
    const newOrder = storageService.acceptBid(bidId);
    refreshState();
    setSelectedCargoForDetail(null);
    if (newOrder) {
      setActiveOrderForTracking(newOrder);
    }
  };

  // Shipper counters carrier bid
  const handleCounterBid = (bidId: string, counterPrice: number, note?: string) => {
    storageService.counterBid(bidId, counterPrice, note);
    refreshState();
  };

  // Shipper rejects carrier bid
  const handleRejectBid = (bidId: string) => {
    storageService.rejectBid(bidId);
    refreshState();
  };

  // Carrier submits offer/bid for cargo
  const handleCarrierSubmitBid = (cargoId: string, price: number, note?: string) => {
    storageService.addBid(cargoId, price, note);
    refreshState();
  };

  // Update order status (kelishildi -> yuklashda -> yolda -> yetkazildi)
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    storageService.updateOrderStatus(orderId, status);
    refreshState();
  };

  // Open Chat for order
  const handleOpenChat = (orderId: string) => {
    setActiveChatOrderId(orderId);
  };

  const activeOrders = orders.filter(
    o => o.status !== 'yetkazildi' && o.status !== 'bekor_qilindi'
  );

  const activeChatOrder = activeChatOrderId
    ? orders.find(o => o.id === activeChatOrderId) || null
    : null;

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-800 flex flex-col antialiased relative">
      {/* Top Header */}
      <Navbar
        activeRole={activeRole}
        onRoleToggle={handleRoleToggle}
        unreadNotificationsCount={storageService.getUnreadNotificationCount()}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenAppwriteSettings={() => setShowAppwriteModal(true)}
        onOpenProfile={() => setCurrentTab('profile')}
        userRating={profile.rating}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto py-3 xs:py-4 px-0">
        {/* Fullscreen Chat Overlay if active */}
        {activeChatOrder ? (
          <div className="px-3 xs:px-4 w-full">
            <ChatScreen
              order={activeChatOrder}
              activeRole={activeRole}
              onBack={() => setActiveChatOrderId(null)}
            />
          </div>
        ) : activeOrderForTracking ? (
          <OrderTrackingScreen
            order={activeOrderForTracking}
            activeRole={activeRole}
            onUpdateStatus={handleUpdateOrderStatus}
            onOpenChat={handleOpenChat}
            onOpenReviewModal={(ord) => setReviewOrder(ord)}
            onOpenWaybill={(ord) => setWaybillOrder(ord)}
            onBack={() => setActiveOrderForTracking(null)}
          />
        ) : (
          <>
            {/* Tab: Home (Yuk beruvchi) */}
            {currentTab === 'home' && activeRole === 'yuk_beruvchi' && (
              <ShipperHomeScreen
                cargos={cargos}
                activeOrders={activeOrders}
                profile={profile}
                onOpenPostCargo={() => setShowPostCargoModal(true)}
                onSelectCargo={(cargo) => {
                  setSelectedCargoForDetail(cargo);
                  setDetailPickupDistanceKm(undefined);
                }}
                onSelectOrder={(order) => setActiveOrderForTracking(order)}
              />
            )}

            {/* Tab: Marketplace (Yuk tashuvchi) */}
            {currentTab === 'marketplace' && activeRole === 'yuk_tashuvchi' && (
              <CarrierMarketplaceScreen
                vehicle={profile.vehicle}
                activeOrders={activeOrders}
                onSelectOrder={(order) => setActiveOrderForTracking(order)}
                onSelectCargo={(cargo, dist) => {
                  setSelectedCargoForDetail(cargo);
                  setDetailPickupDistanceKm(dist);
                }}
                onOpenVehicleSettings={() => setShowVehicleModal(true)}
                onOpenCalculator={handleOpenCalculator}
              />
            )}

            {/* Tab: Orders (Both roles) */}
            {currentTab === 'orders' && (
              <OrdersListScreen
                orders={orders}
                activeRole={activeRole}
                onSelectOrder={(order) => setActiveOrderForTracking(order)}
                onOpenChat={handleOpenChat}
              />
            )}

            {/* Tab: Map */}
            {currentTab === 'map' && (
              <MapScreen
                activeRole={activeRole}
                activeOrders={activeOrders}
                onSelectOrder={(order) => setActiveOrderForTracking(order)}
              />
            )}

            {/* Tab: Profile */}
            {currentTab === 'profile' && (
              <ProfileScreen
                profile={profile}
                activeRole={activeRole}
                onRoleToggle={handleRoleToggle}
                onOpenVehicleModal={() => setShowVehicleModal(true)}
                onOpenAppwriteSettings={() => setShowAppwriteModal(true)}
                onOpenCalculator={() => handleOpenCalculator(350, 4200000)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Ergonomic Navigation Bar */}
      {!activeChatOrder && !activeOrderForTracking && (
        <BottomNavigation
          activeRole={activeRole}
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenPostCargo={() => setShowPostCargoModal(true)}
          onOpenVehicleModal={() => setShowVehicleModal(true)}
          activeOrdersCount={activeOrders.length}
        />
      )}

      {/* MODALS */}

      {/* 1. Post Cargo Modal */}
      <PostCargoModal
        isOpen={showPostCargoModal}
        onClose={() => setShowPostCargoModal(false)}
        onSubmit={handlePostCargo}
      />

      {/* 2. Cargo Detail & Bidding Modal */}
      <CargoDetailModal
        cargo={selectedCargoForDetail}
        isOpen={!!selectedCargoForDetail}
        onClose={() => setSelectedCargoForDetail(null)}
        activeRole={activeRole}
        bids={selectedCargoForDetail ? storageService.getBidsForCargo(selectedCargoForDetail.id) : []}
        distanceToPickupKm={detailPickupDistanceKm}
        onAcceptBid={handleAcceptBid}
        onCounterBid={handleCounterBid}
        onRejectBid={handleRejectBid}
        onSubmitCarrierBid={handleCarrierSubmitBid}
        onOpenWaybill={(c) => setWaybillCargo(c)}
        onOpenCalculator={handleOpenCalculator}
      />

      {/* 3. Carrier Vehicle Settings Modal */}
      {profile.vehicle && (
        <CarrierVehicleModal
          isOpen={showVehicleModal}
          onClose={() => setShowVehicleModal(false)}
          vehicle={profile.vehicle}
          onSave={(data) => {
            storageService.updateCarrierVehicle(data);
            refreshState();
          }}
        />
      )}

      {/* 4. Notifications Modal */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onSelectOrder={(ordId) => {
          const ord = storageService.getOrderById(ordId);
          if (ord) setActiveOrderForTracking(ord);
        }}
      />

      {/* 5. Appwrite Cloud Settings Modal */}
      <AppwriteSettingsModal
        isOpen={showAppwriteModal}
        onClose={() => setShowAppwriteModal(false)}
        onConfigUpdated={refreshState}
      />

      {/* 6. Review Modal */}
      <ReviewModal
        order={reviewOrder}
        isOpen={!!reviewOrder}
        onClose={() => setReviewOrder(null)}
        onSubmitSuccess={refreshState}
      />

      {/* 7. Elektron Yuk Xati (TTN / Nakladnoy) Modal */}
      <WaybillModal
        isOpen={!!waybillCargo || !!waybillOrder}
        onClose={() => {
          setWaybillCargo(null);
          setWaybillOrder(null);
        }}
        cargo={waybillCargo}
        order={waybillOrder}
      />

      {/* 8. Haydovchi Sof Foyda va Yoqilg'i Kalkulyatori Modal */}
      <ProfitCalculatorModal
        isOpen={showProfitCalculator}
        onClose={() => setShowProfitCalculator(false)}
        initialDistanceKm={calcDistanceKm}
        initialPriceUzs={calcPriceUzs}
      />

      {/* 9. Chiqish uchun tasdiqlash xabarnomasi (Double Back to Exit Toast) */}
      {showExitToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-xl text-white text-xs font-bold border border-white/20 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Ilovadan chiqish uchun yana bir bor bosing</span>
        </div>
      )}
    </div>
  );
}
