import { 
  CargoItem, 
  Bid, 
  Order, 
  OrderStatus, 
  UserProfile, 
  ChatMessage, 
  NotificationItem, 
  UserRole,
  Vehicle
} from '../types';
import { 
  INITIAL_CARGOS, 
  INITIAL_BIDS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS,
  CURRENT_USER_SHIPPER,
  CURRENT_USER_CARRIER
} from '../data/initialData';
import { calculateDirectDistanceKm } from './routingService';
import { getSupabase } from './supabaseClient';
import { appwriteService } from './appwriteService';
import { isAppwriteConnected } from './appwriteClient';

const STORAGE_KEYS = {
  CARGOS: 'yuktop_cargos_v2',
  BIDS: 'yuktop_bids_v2',
  ORDERS: 'yuktop_orders_v2',
  NOTIFICATIONS: 'yuktop_notifications_v2',
  MESSAGES: 'yuktop_messages_v2',
  CURRENT_ROLE: 'yuktop_active_role_v2',
  CARRIER_VEHICLE: 'yuktop_carrier_vehicle_v2',
  SHIPPER_PROFILE: 'yuktop_shipper_profile_v2'
};

class StorageService {
  private cargos: CargoItem[] = [];
  private bids: Bid[] = [];
  private orders: Order[] = [];
  private notifications: NotificationItem[] = [];
  private messages: ChatMessage[] = [];
  private activeRole: UserRole = 'yuk_beruvchi';
  private carrierProfile: UserProfile = CURRENT_USER_CARRIER;
  private shipperProfile: UserProfile = CURRENT_USER_SHIPPER;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedCargos = localStorage.getItem(STORAGE_KEYS.CARGOS);
      this.cargos = storedCargos ? JSON.parse(storedCargos) : INITIAL_CARGOS;

      const storedBids = localStorage.getItem(STORAGE_KEYS.BIDS);
      this.bids = storedBids ? JSON.parse(storedBids) : INITIAL_BIDS;

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS;

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : INITIAL_NOTIFICATIONS;

      const storedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
      if (storedRole === 'yuk_beruvchi' || storedRole === 'yuk_tashuvchi') {
        this.activeRole = storedRole;
      }

      const storedVehicle = localStorage.getItem(STORAGE_KEYS.CARRIER_VEHICLE);
      if (storedVehicle && this.carrierProfile.vehicle) {
        this.carrierProfile.vehicle = { ...this.carrierProfile.vehicle, ...JSON.parse(storedVehicle) };
      }

      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      this.messages = storedMessages ? JSON.parse(storedMessages) : [
        {
          id: 'msg-1',
          orderId: 'ord-301',
          senderId: 'usr-shipper-1',
          senderRole: 'yuk_beruvchi',
          senderName: 'Farhod Aliyev',
          text: 'Assalomu alaykum, Akmal aka! Yuklashga qachon yetib kelasiz?',
          createdAt: '2026-10-27T06:15:00Z',
          isRead: true
        },
        {
          id: 'msg-2',
          orderId: 'ord-301',
          senderId: 'drv-current',
          senderRole: 'yuk_tashuvchi',
          senderName: 'Akmal Rustamov',
          text: 'Va alaykum assalom! Hozir Yo\'ldaman, Jizzax atrofidaman. 1 soatda yetib boraman.',
          createdAt: '2026-10-27T06:18:00Z',
          isRead: true
        }
      ];
    } catch {
      this.cargos = INITIAL_CARGOS;
      this.bids = INITIAL_BIDS;
      this.orders = INITIAL_ORDERS;
      this.notifications = INITIAL_NOTIFICATIONS;
    }

    // Appwrite Cloud background initialization and realtime sync
    if (isAppwriteConnected()) {
      this.syncWithAppwrite().catch(() => {});
      try {
        appwriteService.subscribeToRealtime(() => {
          this.syncWithAppwrite().catch(() => {});
        });
      } catch (e) {
        console.warn('Appwrite realtime init error:', e);
      }
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.CARGOS, JSON.stringify(this.cargos));
      localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(this.bids));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, this.activeRole);
      if (this.carrierProfile.vehicle) {
        localStorage.setItem(STORAGE_KEYS.CARRIER_VEHICLE, JSON.stringify(this.carrierProfile.vehicle));
      }
    } catch {
      // Ignore quota errors
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- ROLE MANAGEMENT ---
  public getActiveRole(): UserRole {
    return this.activeRole;
  }

  public setActiveRole(role: UserRole) {
    this.activeRole = role;
    this.save();
  }

  public getCurrentProfile(): UserProfile {
    return this.activeRole === 'yuk_beruvchi' ? this.shipperProfile : this.carrierProfile;
  }

  public getShipperProfile(): UserProfile {
    return this.shipperProfile;
  }

  public getCarrierProfile(): UserProfile {
    return this.carrierProfile;
  }

  public updateCarrierVehicle(vehicleData: Partial<Vehicle>) {
    if (this.carrierProfile.vehicle) {
      this.carrierProfile.vehicle = { ...this.carrierProfile.vehicle, ...vehicleData };
      this.save();
    }
  }

  // --- CARGOS ---
  public getCargos(): CargoItem[] {
    return [...this.cargos];
  }

  public getCargoById(id: string): CargoItem | undefined {
    return this.cargos.find(c => c.id === id);
  }

  public addCargo(newCargo: Omit<CargoItem, 'id' | 'createdAt' | 'bidsCount' | 'status'>): CargoItem {
    const cargo: CargoItem = {
      ...newCargo,
      id: `crg-${Date.now()}`,
      status: 'taklif_kutilmoqda',
      bidsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.cargos.unshift(cargo);

    this.addNotification({
      title: 'Yangi yuk e\'lon qilindi',
      message: `"${cargo.title}" muvaffaqiyatli joylashtirildi. Tashuvchilardan takliflar kutilmoqda.`,
      type: 'order'
    });

    this.save();

    if (isAppwriteConnected()) {
      appwriteService.createCargo(cargo).catch(err => console.warn('Appwrite createCargo error:', err));
    }

    return cargo;
  }

  // --- BIDS & BARGAINING ---
  public getBidsForCargo(cargoId: string): Bid[] {
    return this.bids.filter(b => b.cargoId === cargoId);
  }

  public addBid(cargoId: string, offeredPriceUzs: number, note?: string): Bid {
    const cargo = this.getCargoById(cargoId);
    const carrier = this.carrierProfile;
    const vehicle = carrier.vehicle!;

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      cargoId,
      driverId: carrier.id,
      driverName: carrier.fullName,
      driverPhone: carrier.phone,
      driverRating: carrier.rating,
      vehicleModel: vehicle.model,
      vehiclePlate: vehicle.plateNumber,
      transportType: vehicle.transportType,
      vehicleCapacityTon: vehicle.capacityTon,
      offeredPriceUzs,
      proposedDate: cargo?.pickupDate || new Date().toISOString().slice(0, 10),
      counterNote: note,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.bids.unshift(newBid);

    // Update cargo bidsCount
    if (cargo) {
      cargo.bidsCount = (cargo.bidsCount || 0) + 1;
      cargo.status = 'taklif_kutilmoqda';
    }

    this.addNotification({
      title: 'Yangi taklif yuborildi',
      message: `"${cargo?.title || 'Yuk'}" uchun ${new Intl.NumberFormat('uz-UZ').format(offeredPriceUzs)} so'm taklif jo'natildi.`,
      type: 'bid'
    });

    this.save();

    if (isAppwriteConnected()) {
      appwriteService.createBid(newBid).catch(err => console.warn('Appwrite createBid error:', err));
    }

    return newBid;
  }

  public counterBid(bidId: string, counterPriceUzs: number, counterNote?: string) {
    const bid = this.bids.find(b => b.id === bidId);
    if (!bid) return;
    bid.counterPriceUzs = counterPriceUzs;
    bid.counterNote = counterNote;
    bid.status = 'countered';

    this.addNotification({
      title: 'Qarshi narx taklifi berildi',
      message: `${bid.driverName} uchun ${new Intl.NumberFormat('uz-UZ').format(counterPriceUzs)} so'm qarshi narx yuborildi.`,
      type: 'bid'
    });

    this.save();
  }

  public rejectBid(bidId: string) {
    const bid = this.bids.find(b => b.id === bidId);
    if (!bid) return;
    bid.status = 'rejected';
    this.save();
  }

  public acceptBid(bidId: string): Order | null {
    const bid = this.bids.find(b => b.id === bidId);
    if (!bid) return null;
    const cargo = this.getCargoById(bid.cargoId);
    if (!cargo) return null;

    bid.status = 'accepted';
    cargo.status = 'kelishildi';

    const orderPrice = bid.counterPriceUzs || bid.offeredPriceUzs;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode: `UZ-${Math.floor(1000 + Math.random() * 9000)}`,
      cargoId: cargo.id,
      cargoTitle: cargo.title,
      category: cargo.category,
      weightKg: cargo.weightKg,
      volumeM3: cargo.volumeM3,
      paymentMethod: cargo.paymentMethod || 'Naqd pul',
      urgency: cargo.urgency || 'Oddiy',
      hasDocuments: cargo.hasDocuments ?? true,
      ownerId: cargo.ownerId,
      ownerName: cargo.ownerName,
      ownerPhone: cargo.ownerPhone,
      ownerTelegram: cargo.ownerTelegram,
      driverId: bid.driverId,
      driverName: bid.driverName,
      driverPhone: bid.driverPhone,
      driverTelegram: bid.driverTelegram,
      driverRating: bid.driverRating,
      vehicleModel: bid.vehicleModel,
      vehiclePlate: bid.vehiclePlate,
      transportType: bid.transportType,
      pickupLocation: cargo.pickupLocation,
      deliveryLocation: cargo.deliveryLocation,
      pickupDate: cargo.pickupDate,
      deliveryDate: cargo.deliveryDate,
      agreedPriceUzs: orderPrice,
      distanceKm: cargo.distanceKm,
      durationMinutes: cargo.durationMinutes,
      status: 'kelishildi',
      carrierGpsEnabled: true,
      driverCurrentLocation: {
        lat: cargo.pickupLocation.lat,
        lng: cargo.pickupLocation.lng,
        speedKmH: 0,
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);

    this.addNotification({
      title: 'Kelishuv tasdiqlandi! Buyurtma yaratildi',
      message: `"${cargo.title}" bo'yicha ${bid.driverName} bilan kelishildi. Buyurtma kodi: ${newOrder.orderCode}`,
      type: 'order',
      relatedOrderId: newOrder.id
    });

    this.save();

    if (isAppwriteConnected()) {
      appwriteService.createOrder(newOrder).catch(err => console.warn('Appwrite createOrder error:', err));
    }

    return newOrder;
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return [...this.orders];
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, customGps?: { lat: number; lng: number; speedKmH: number }) {
    const order = this.getOrderById(orderId);
    if (!order) return;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (customGps) {
      order.driverCurrentLocation = {
        lat: customGps.lat,
        lng: customGps.lng,
        speedKmH: customGps.speedKmH,
        updatedAt: new Date().toISOString()
      };
    }

    if (status === 'yetkazildi') {
      order.completedAt = new Date().toISOString();
    }

    // Also update related cargo status
    const cargo = this.getCargoById(order.cargoId);
    if (cargo) {
      cargo.status = status;
    }

    const statusTexts: Record<OrderStatus, string> = {
      yangi: 'Yangi',
      taklif_kutilmoqda: 'Taklif kutilmoqda',
      kelishildi: 'Kelishildi',
      yuklashda: 'Yuklash boshlandi',
      yolda: 'Yuk mashinasi manzil sari yo\'lga chiqdi',
      yetkazildi: 'Yuk manzilga muvaffaqiyatli yetkazildi',
      bekor_qilindi: 'Buyurtma bekor qilindi'
    };

    this.addNotification({
      title: `Buyurtma holati: ${statusTexts[status]}`,
      message: `Buyurtma ${order.orderCode} - ${statusTexts[status]} holatiga o'tkazildi.`,
      type: 'order',
      relatedOrderId: order.id
    });

    this.save();

    if (isAppwriteConnected()) {
      appwriteService.updateOrderStatus(orderId, status).catch(err => console.warn('Appwrite updateOrderStatus error:', err));
    }
  }

  public updateDriverLocation(orderId: string, lat: number, lng: number, speedKmH = 65) {
    const order = this.getOrderById(orderId);
    if (!order) return;
    order.driverCurrentLocation = {
      lat,
      lng,
      speedKmH,
      updatedAt: new Date().toISOString()
    };
    this.save();
  }

  public toggleCarrierGps(orderId: string, enabled: boolean) {
    const order = this.getOrderById(orderId);
    if (!order) return;
    order.carrierGpsEnabled = enabled;
    this.save();
  }

  // --- SMART MATCHING ---
  public getMatchedCargosForCarrier(): { cargo: CargoItem; matchScore: number; distanceToPickupKm: number }[] {
    const vehicle = this.carrierProfile.vehicle;
    if (!vehicle) {
      return this.cargos.map(c => ({
        cargo: c,
        matchScore: 80,
        distanceToPickupKm: 10
      }));
    }

    return this.cargos
      .filter(c => c.status === 'yangi' || c.status === 'taklif_kutilmoqda')
      .map(cargo => {
        // 1. Distance from carrier to cargo pickup point
        const distanceToPickupKm = calculateDirectDistanceKm(
          vehicle.currentLocation.lat,
          vehicle.currentLocation.lng,
          cargo.pickupLocation.lat,
          cargo.pickupLocation.lng
        );

        // 2. Capacity match
        const capacityMatch = vehicle.capacityTon * 1000 >= cargo.weightKg ? 35 : 0;

        // 3. Distance proximity score (within 20km = 35 points, within 50km = 25 points, etc.)
        let proximityScore = 15;
        if (distanceToPickupKm <= 15) proximityScore = 35;
        else if (distanceToPickupKm <= 50) proximityScore = 28;
        else if (distanceToPickupKm <= 100) proximityScore = 20;

        // 4. Route direction match
        const routeMatch = vehicle.destinationRoute.toLowerCase().includes(cargo.deliveryLocation.city.toLowerCase().split(' ')[0]) ? 30 : 15;

        const totalScore = Math.min(99, capacityMatch + proximityScore + routeMatch);

        return {
          cargo,
          matchScore: totalScore,
          distanceToPickupKm
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  // --- CHAT ---
  public getMessagesForOrder(orderId: string): ChatMessage[] {
    return this.messages.filter(m => m.orderId === orderId);
  }

  public sendMessage(
    orderId: string, 
    text: string, 
    customSender?: { id: string; role: UserRole; name: string }
  ): ChatMessage {
    const profile = this.getCurrentProfile();
    const senderRole = customSender?.role || this.activeRole;
    const senderName = customSender?.name || profile.fullName;
    const senderId = customSender?.id || profile.id;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderId,
      senderId,
      senderRole,
      senderName,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      isRead: true
    };

    this.messages.push(msg);
    this.save();

    if (isAppwriteConnected()) {
      appwriteService.sendMessage(msg).catch(err => console.warn('Appwrite sendMessage error:', err));
    }

    return msg;
  }

  // --- APPWRITE SYNC ---
  public async syncWithAppwrite() {
    if (!isAppwriteConnected()) return;
    try {
      const cloudCargos = await appwriteService.getCargos();
      if (cloudCargos && cloudCargos.length > 0) {
        const localIds = new Set(this.cargos.map(c => c.id));
        const newFromCloud = cloudCargos.filter(c => !localIds.has(c.id));
        if (newFromCloud.length > 0) {
          this.cargos = [...newFromCloud, ...this.cargos];
          this.save();
        }
      }
    } catch (e) {
      console.warn('Appwrite syncWithAppwrite error:', e);
    }
  }

  // --- REVIEWS & RATINGS ---
  public addOrderReview(orderId: string, rating: number, comment?: string, tags: string[] = []) {
    const order = this.getOrderById(orderId);
    if (!order) return;

    // Calculate new carrier rating
    const currentRating = this.carrierProfile.rating || 5.0;
    const totalOrders = (this.carrierProfile.totalOrders || 0) + 1;
    const newRating = Number(((currentRating * 4 + rating) / 5).toFixed(1));

    this.carrierProfile.rating = newRating;
    this.carrierProfile.totalOrders = totalOrders;
    order.driverRating = newRating;

    this.addNotification({
      title: 'Yangi sharh va baho berildi',
      message: `${order.driverName} haydovchiga ${rating} yulduzli baho berildi: "${comment || tags.join(', ') || 'Xizmat a\'lo darajada'}"`,
      type: 'system',
      relatedOrderId: order.id
    });

    this.save();
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public markNotificationsRead() {
    this.notifications.forEach(n => { n.isRead = true; });
    this.save();
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) {
    this.notifications.unshift({
      ...item,
      id: `notif-${Date.now()}`,
      createdAt: 'Hozir',
      isRead: false
    });
    this.save();
  }
}

export const storageService = new StorageService();
