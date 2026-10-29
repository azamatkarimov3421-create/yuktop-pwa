import { CargoItem, Vehicle, Bid, Order, UserProfile, NotificationItem } from '../types';
import { UZBEKISTAN_CITIES } from './uzbekistanLocations';

export const INITIAL_CARGOS: CargoItem[] = [
  {
    id: 'crg-101',
    ownerId: 'usr-shipper-1',
    ownerName: 'Farhod Aliyev',
    ownerPhone: '+998901234567',
    ownerTelegram: 'farhod_logist',
    title: 'Pishgan qizil g\'isht (10,000 dona)',
    category: 'Qurilish mollari',
    imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
    weightKg: 18000,
    volumeM3: 32,
    pickupLocation: UZBEKISTAN_CITIES[0], // Toshkent Chilonzor
    deliveryLocation: UZBEKISTAN_CITIES[3], // Samarqand Siyob
    pickupDate: '2026-10-28',
    deliveryDate: '2026-10-29',
    priceUzs: 4200000,
    paymentMethod: 'Naqd pul',
    urgency: 'Shoshilinch (Bugun)',
    hasDocuments: true,
    distanceKm: 315,
    durationMinutes: 280,
    specialNotes: 'Ortish texnikasi bor, tushirish joyida kran mavjud. Tentli fura kerak.',
    status: 'taklif_kutilmoqda',
    createdAt: '2026-10-27T08:30:00Z',
    bidsCount: 2
  },
  {
    id: 'crg-102',
    ownerId: 'usr-shipper-2',
    ownerName: 'Nodira Karimova',
    ownerPhone: '+998939876543',
    ownerTelegram: 'nodira_agro',
    title: 'Muzlatilgan mevalar va uzum (Eksport)',
    category: 'Meva va sabzavotlar',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    weightKg: 8500,
    volumeM3: 26,
    pickupLocation: UZBEKISTAN_CITIES[6], // Andijon
    deliveryLocation: UZBEKISTAN_CITIES[1], // Toshkent Sergeli logistika
    pickupDate: '2026-10-29',
    deliveryDate: '2026-10-30',
    priceUzs: 3800000,
    paymentMethod: 'Karta (Click / Payme / Humo)',
    urgency: 'Oddiy',
    hasDocuments: true,
    distanceKm: 350,
    durationMinutes: 320,
    specialNotes: '+2°C harorat rejimini saqlash shart (Refrijerator talab qilinadi).',
    status: 'taklif_kutilmoqda',
    createdAt: '2026-10-27T09:15:00Z',
    bidsCount: 1
  },
  {
    id: 'crg-103',
    ownerId: 'usr-shipper-3',
    ownerName: 'Otabek Zokirov',
    ownerPhone: '+998971122334',
    title: 'Yangi ofis mebellari va kreslolar',
    category: 'Mebel va jihozlar',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    weightKg: 3200,
    volumeM3: 22,
    pickupLocation: UZBEKISTAN_CITIES[2], // Toshkent Yunusobod
    deliveryLocation: UZBEKISTAN_CITIES[5], // Buxoro
    pickupDate: '2026-10-30',
    deliveryDate: '2026-10-31',
    priceUzs: 3500000,
    paymentMethod: 'Hisob-raqam (Perechisleniye)',
    urgency: 'Oddiy',
    hasDocuments: false,
    distanceKm: 570,
    durationMinutes: 480,
    specialNotes: 'Qadoqlangan, ehtiyotkorlik bilan tashish kerak. Isuzu yoki Gazel ma\'qul.',
    status: 'yangi',
    createdAt: '2026-10-27T10:00:00Z',
    bidsCount: 0
  },
  {
    id: 'crg-104',
    ownerId: 'usr-shipper-1',
    ownerName: 'Farhod Aliyev',
    ownerPhone: '+998901234567',
    ownerTelegram: 'farhod_logist',
    title: 'Paxta yog\'i va oziq-ovqat mahsulotlari',
    category: 'Oziq-ovqat mahsulotlari',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    weightKg: 12000,
    volumeM3: 28,
    pickupLocation: UZBEKISTAN_CITIES[8], // Qo'qon
    deliveryLocation: UZBEKISTAN_CITIES[10], // Qarshi
    pickupDate: '2026-11-01',
    deliveryDate: '2026-11-02',
    priceUzs: 5400000,
    paymentMethod: 'Naqd pul',
    urgency: 'Oddiy',
    hasDocuments: true,
    distanceKm: 620,
    durationMinutes: 530,
    specialNotes: 'Poddonlarda joylashgan. Bortli yuk mashinasi.',
    status: 'yangi',
    createdAt: '2026-10-27T11:20:00Z',
    bidsCount: 0
  }
];

export const INITIAL_BIDS: Bid[] = [
  {
    id: 'bid-201',
    cargoId: 'crg-101',
    driverId: 'drv-1',
    driverName: 'Sherzod Qodirov',
    driverPhone: '+998912345678',
    driverTelegram: 'sherzod_fura',
    driverRating: 4.9,
    vehicleModel: 'MAN TGX 18.440',
    vehiclePlate: '01 456 AAA',
    transportType: 'Fura (Tentli)',
    vehicleCapacityTon: 22,
    offeredPriceUzs: 4000000,
    proposedDate: '2026-10-28',
    status: 'pending',
    createdAt: '2026-10-27T09:00:00Z'
  },
  {
    id: 'bid-202',
    cargoId: 'crg-101',
    driverId: 'drv-2',
    driverName: 'Azizbek To\'rayev',
    driverPhone: '+998935557799',
    driverRating: 4.8,
    vehicleModel: 'Volvo FH16',
    vehiclePlate: '10 888 BBB',
    transportType: 'Fura (Tentli)',
    vehicleCapacityTon: 20,
    offeredPriceUzs: 4500000,
    proposedDate: '2026-10-28',
    counterPriceUzs: 4300000,
    counterNote: '4.3 mln so\'m qilsangiz hoziroq shartnoma tuzamiz',
    status: 'countered',
    createdAt: '2026-10-27T09:40:00Z'
  },
  {
    id: 'bid-203',
    cargoId: 'crg-102',
    driverId: 'drv-3',
    driverName: 'Jasur Mirzayev',
    driverPhone: '+998907771122',
    driverRating: 5.0,
    vehicleModel: 'Isuzu FVR 34',
    vehiclePlate: '60 700 VVA',
    transportType: 'Fura (Refrijerator)',
    vehicleCapacityTon: 10,
    offeredPriceUzs: 3800000,
    proposedDate: '2026-10-29',
    status: 'pending',
    createdAt: '2026-10-27T10:10:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-301',
    orderCode: 'UZ-8941',
    cargoId: 'crg-demo-active',
    cargoTitle: 'Sergeli metall profillari va armatura',
    category: 'Qurilish mollari',
    weightKg: 14000,
    volumeM3: 20,
    paymentMethod: 'Naqd pul',
    urgency: 'Shoshilinch (Bugun)',
    hasDocuments: true,
    ownerId: 'usr-shipper-1',
    ownerName: 'Farhod Aliyev',
    ownerPhone: '+998901234567',
    ownerTelegram: 'farhod_logist',
    driverId: 'drv-current',
    driverName: 'Akmal Rustamov',
    driverPhone: '+998946001122',
    driverTelegram: 'akmal_tir',
    driverRating: 4.95,
    vehicleModel: 'KamAZ 5490 Neo',
    vehiclePlate: '01 777 UZB',
    transportType: 'Fura (Tentli)',
    pickupLocation: UZBEKISTAN_CITIES[1], // Sergeli
    deliveryLocation: UZBEKISTAN_CITIES[3], // Samarqand Siyob
    pickupDate: '2026-10-27',
    deliveryDate: '2026-10-28',
    agreedPriceUzs: 3700000,
    distanceKm: 310,
    durationMinutes: 275,
    status: 'yolda',
    carrierGpsEnabled: true,
    driverCurrentLocation: {
      lat: 40.5200,
      lng: 68.3000,
      speedKmH: 72,
      updatedAt: new Date().toISOString()
    },
    createdAt: '2026-10-27T06:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

export const CURRENT_USER_SHIPPER: UserProfile = {
  id: 'usr-shipper-1',
  fullName: 'Farhod Aliyev',
  phone: '+998 90 123 45 67',
  telegram: 'farhod_logist',
  activeRole: 'yuk_beruvchi',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  rating: 4.9,
  totalOrders: 28,
  verified: true
};

export const CURRENT_USER_CARRIER: UserProfile = {
  id: 'drv-current',
  fullName: 'Akmal Rustamov',
  phone: '+998 94 600 11 22',
  telegram: 'akmal_tir',
  activeRole: 'yuk_tashuvchi',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  rating: 4.95,
  totalOrders: 64,
  verified: true,
  totalEarningsUzs: 48600000,
  vehicle: {
    id: 'veh-current',
    driverId: 'drv-current',
    transportType: 'Fura (Tentli)',
    model: 'KamAZ 5490 Neo / Schmitz',
    plateNumber: '01 777 UZB',
    capacityTon: 22,
    volumeM3: 86,
    currentLocation: UZBEKISTAN_CITIES[0], // Toshkent
    destinationRoute: 'Toshkent -> Samarqand -> Buxoro',
    isAvailable: true,
    gpsTrackingEnabled: true,
    rating: 4.95,
    totalTrips: 64
  }
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Yangi narx taklifi tushdi',
    message: 'Sherzod Qodirov "Pishgan qizil g\'isht" yukingizga 4,000,000 so\'m taklif qildi.',
    type: 'bid',
    createdAt: '15 daqiqa oldin',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Buyurtma yo\'lga chiqdi',
    message: 'Akmal Rustamov "UZ-8941" raqamli buyurtmani yuklab, Samarqand yo\'nalishida harakatlanmoqda.',
    type: 'order',
    relatedOrderId: 'ord-301',
    createdAt: '1 soat oldin',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Xush kelibsiz!',
    message: 'YUKTOP O\'zbekiston yuk tashish tizimidan foydalanishni boshlaganingiz bilan tabriklaymiz.',
    type: 'system',
    createdAt: '1 kun oldin',
    isRead: true
  }
];
