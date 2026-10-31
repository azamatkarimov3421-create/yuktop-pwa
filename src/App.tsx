import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  CargoItem, 
  Order, 
  NotificationItem, 
  UserProfile, 
  OrderStatus
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
import { PostTripModal } from './screens/PostTripModal';
import { CargoDetailModal } from './screens/CargoDetailModal';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { ChatScreen } from './screens/ChatScreen';
import { CarrierVehicleModal } from './screens/CarrierVehicleModal';
import { NotificationsModal } from './screens/NotificationsModal';
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
  const [showPostTripModal, setShowPostTripModal] = useState(false);
  const [selectedCargoForDetail, setSelectedCargoForDetail] = useState<CargoItem | null>(null);
  const [detailPickupDistanceKm, setDetailPickupDistanceKm] = useState<number | undefined>(undefined);
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
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
      // 1-daraja: Agar bildirishnomalar ochiq bo'lsa
      if (showNotificationsModal) {
        setShowNotificationsModal(false);
        return;
      }
      // 2-daraja: Agar transport sozlamalari ochiq bo'lsa
      if (showVehicleModal) {
        setShowVehicleModal(false);
        return;
      }
      // 3-daraja: Agar bo'sh reys modal oynasi ochiq bo'lsa
      if (showPostTripModal) {
        setShowPostTripModal(false);
        return;
      }
      // 4-daraja: Agar yuk e'lon qilish modal oynasi ochiq bo'lsa
      if (showPostCargoModal) {
        setShowPostCargoModal(false);
        return;
      }
      // 5-daraja: Agar yuk batafsil ko'rish oynasi ochiq bo'lsa
      if (selectedCargoForDetail) {
        setSelectedCargoForDetail(null);
        return;
      }
      // 6-daraja: Agar faol chat ochiq bo'lsa
      if (activeChatOrderId) {
        setActiveChatOrderId(null);
        return;
      }
      // 7-daraja: Agar faol buyurtma kuzatuv ekrani ochiq bo'lsa
      if (activeOrderForTracking) {
        setActiveOrderForTracking(null);
        return;
      }

      // 8-daraja: Agar boshqa tabda bo'lsa, asosiy tabga qaytish
      const rootTab: MainTab = activeRole === 'yuk_beruvchi' ? 'home' : 'marketplace';
      if (currentTab !== rootTab) {
        setCurrentTab(rootTab);
        return;
      }

      // 9-daraja: Chiqish uchun 2 marta bosish
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
    showNotificationsModal,
    showVehicleModal,
    showPostTripModal,
    showPostCargoModal,
    selectedCargoForDetail,
    activeChatOrderId,
    activeOrderForTracking,
    currentTab,
    activeRole
  ]);

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
    storageService.addCargo({
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

  // Delete cargo (Shipper)
  const handleDeleteCargo = (cargoId: string) => {
    storageService.deleteCargo(cargoId);
    setSelectedCargoForDetail(null);
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col antialiased relative">
      {/* Top Header */}
      <Navbar
        activeRole={activeRole}
        onRoleToggle={handleRoleToggle}
        unreadNotificationsCount={storageService.getUnreadNotificationCount()}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenProfile={() => setCurrentTab('profile')}
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
            onOpenReviewModal={() => {}}
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
                onSelectCargo={(cargo, dist) => {
                  setSelectedCargoForDetail(cargo);
                  setDetailPickupDistanceKm(dist);
                }}
                onOpenVehicleSettings={() => setShowVehicleModal(true)}
                onOpenPostTrip={() => setShowPostTripModal(true)}
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
                onDataCleared={() => refreshState()}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {!activeChatOrder && !activeOrderForTracking && (
        <BottomNavigation
          activeRole={activeRole}
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          activeOrdersCount={activeOrders.length}
        />
      )}

      {/* MODALS */}

      {/* 1. Post Cargo Modal (Yuk beruvchi) */}
      <PostCargoModal
        isOpen={showPostCargoModal}
        onClose={() => setShowPostCargoModal(false)}
        onSubmit={handlePostCargo}
      />

      {/* 2. Post Carrier Trip Modal (Yuk tashuvchi bo'sh mashina / poputniy reys) */}
      <PostTripModal
        isOpen={showPostTripModal}
        onClose={() => setShowPostTripModal(false)}
        vehicle={profile.vehicle}
        onSubmit={(tripData) => {
          storageService.addCarrierTrip({
            ...tripData,
            driverId: profile.id,
            driverName: profile.fullName,
            driverPhone: profile.phone,
            driverRating: profile.rating,
            vehicleModel: profile.vehicle?.model || 'Yuk mashinasi',
            vehiclePlate: profile.vehicle?.plateNumber || "01 A 000 AA",
            transportType: profile.vehicle?.transportType || 'Isuzu (Bortli)'
          });
          refreshState();
        }}
      />

      {/* 3. Cargo Detail & Bidding Modal */}
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
        onDeleteCargo={handleDeleteCargo}
      />

      {/* 4. Carrier Vehicle Settings Modal */}
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

      {/* 5. Notifications Modal */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onSelectOrder={(ordId) => {
          const ord = storageService.getOrderById(ordId);
          if (ord) setActiveOrderForTracking(ord);
        }}
      />

      {/* Exit Toast */}
      {showExitToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-white/95 backdrop-blur-xl text-slate-900 text-xs font-bold border border-slate-200/90 shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Ilovadan chiqish uchun yana bir bor bosing</span>
        </div>
      )}
    </div>
  );
}
