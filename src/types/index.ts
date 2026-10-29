export type UserRole = 'yuk_beruvchi' | 'yuk_tashuvchi';

export type OrderStatus = 
  | 'yangi' 
  | 'taklif_kutilmoqda' 
  | 'kelishildi' 
  | 'yuklashda' 
  | 'yolda' 
  | 'yetkazildi' 
  | 'bekor_qilindi';

export type PaymentMethod = 
  | 'Naqd pul'
  | 'Karta (Click / Payme / Humo)'
  | 'Hisob-raqam (Perechisleniye)';

export type UrgencyLevel = 'Oddiy' | 'Shoshilinch (Bugun)';

export type LoadType = 'tolik_mashina' | 'yigma_yuk';

export interface LocationPoint {
  city: string;
  district?: string;
  address: string;
  lat: number;
  lng: number;
}

export type CargoCategory = 
  | 'Qurilish mollari'
  | 'Oziq-ovqat mahsulotlari'
  | 'Meva va sabzavotlar'
  | 'Don va un mahsulotlari'
  | 'Mebel va jihozlar'
  | 'Maishiy texnika'
  | 'Kiyim va to\'qimachilik'
  | 'Suyuqlik va sisterna'
  | 'Xavfli yuk (ADR)'
  | 'Boshqa yuklar';

export interface CargoItem {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerTelegram?: string;
  title: string;
  category: CargoCategory;
  loadType?: LoadType; // To'liq mashina (FTL) yoki Yig'ma / Poputniy yuk (LTL)
  imageUrl: string;
  weightKg: number;
  volumeM3: number;
  pickupLocation: LocationPoint;
  deliveryLocation: LocationPoint;
  pickupDate: string;
  pickupTimeWindow?: string; // e.g. "08:00 - 12:00 (Ertalab)"
  deliveryDate: string;
  deliveryTimeWindow?: string; // e.g. "Ertasi kuni 18:00 gacha"
  priceUzs: number;
  paymentMethod: PaymentMethod;
  urgency: UrgencyLevel;
  hasDocuments: boolean; // TTN / Hisob-faktura
  distanceKm: number;
  durationMinutes: number;
  specialNotes?: string;
  status: OrderStatus;
  createdAt: string;
  bidsCount: number;
}

export type TransportType = 
  | 'Fura (Tentli)'
  | 'Fura (Refrijerator)'
  | 'Isuzu (Bortli)'
  | 'Isuzu (Budkali)'
  | 'Gazel (Tentli)'
  | 'Gazel (Ochiq bort)'
  | 'Samosval'
  | 'Konteyner tashuvchi'
  | 'Evakuator'
  | 'Kichik furgon (Labo/Damás)';

export interface Vehicle {
  id: string;
  driverId: string;
  transportType: TransportType;
  model: string;
  plateNumber: string;
  capacityTon: number;
  volumeM3: number;
  currentLocation: LocationPoint;
  destinationRoute: string; // e.g. "Toshkent -> Samarqand -> Buxoro"
  isAvailable: boolean;
  gpsTrackingEnabled: boolean;
  rating: number;
  totalTrips: number;
}

export interface Bid {
  id: string;
  cargoId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverTelegram?: string;
  driverRating: number;
  vehicleModel: string;
  vehiclePlate: string;
  transportType: TransportType;
  vehicleCapacityTon: number;
  offeredPriceUzs: number;
  proposedDate: string;
  counterPriceUzs?: number;
  counterNote?: string;
  status: 'pending' | 'countered' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. "UZ-7892"
  cargoId: string;
  cargoTitle: string;
  category: CargoCategory;
  loadType?: LoadType; // To'liq mashina (FTL) yoki Yig'ma yuk (LTL)
  weightKg: number;
  volumeM3: number;
  paymentMethod: PaymentMethod;
  urgency: UrgencyLevel;
  hasDocuments: boolean;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerTelegram?: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverTelegram?: string;
  driverRating: number;
  vehicleModel: string;
  vehiclePlate: string;
  transportType: TransportType;
  pickupLocation: LocationPoint;
  deliveryLocation: LocationPoint;
  pickupDate: string;
  pickupTimeWindow?: string;
  deliveryDate: string;
  deliveryTimeWindow?: string;
  agreedPriceUzs: number;
  distanceKm: number;
  durationMinutes: number;
  status: OrderStatus;
  carrierGpsEnabled: boolean;
  driverCurrentLocation: {
    lat: number;
    lng: number;
    speedKmH: number;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CarrierTripAd {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverTelegram?: string;
  driverRating: number;
  vehicleModel: string;
  vehiclePlate: string;
  transportType: TransportType;
  totalCapacityTon: number;
  availableCapacityTon: number; // Qolgan bo'sh tonna
  totalVolumeM3: number;
  availableVolumeM3: number;    // Qolgan bo'sh m³
  departureLocation: LocationPoint;
  destinationLocation: LocationPoint;
  departureDate: string;
  departureTimeWindow: string; // Masalan: "08:00 - 12:00"
  deliveryDate: string;
  deliveryTimeWindow: string;  // Masalan: "Ertasi kuni 18:00 gacha"
  pricePerTonUzs?: number;
  totalTripPriceUzs?: number;
  isConsolidated: boolean;     // Yig'ma yuk (bir nechta kishi yukini olish) ruxsati
  maxShippersCount: number;    // Masalan: 5 kishigacha yuk qabul qilish
  currentShippersCount: number; // Hozir nechta yuk olingan
  specialNotes?: string;
  createdAt: string;
  status: 'faol' | 'yolda' | 'yakunlandi';
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'bid' | 'order' | 'chat' | 'system';
  relatedOrderId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface UserReview {
  id: string;
  orderId: string;
  reviewerName: string;
  reviewerRole: UserRole;
  rating: number; // 1-5
  comment: string;
  tags: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  telegram?: string;
  activeRole: UserRole;
  avatarUrl: string;
  rating: number;
  totalOrders: number;
  verified: boolean;
  totalEarningsUzs?: number;
  vehicle?: Vehicle;
}

export interface RouteGeometry {
  coordinates: [number, number][]; // [lat, lng]
  distanceKm: number;
  durationMinutes: number;
}
