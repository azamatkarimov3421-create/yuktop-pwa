import { CargoItem, Vehicle, Bid, Order, UserProfile, NotificationItem, CarrierTripAd } from '../types';
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
    loadType: 'tolik_mashina',
    imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
    weightKg: 18000,
    volumeM3: 32,
    pickupLocation: UZBEKISTAN_CITIES[0], // Toshkent Chilonzor
    deliveryLocation: UZBEKISTAN_CITIES[3], // Samarqand Siyob
    pickupDate: '2026-10-30',
    pickupTimeWindow: '08:00 - 12:00 (Ertalab)',
    deliveryDate: '2026-10-31',
    deliveryTimeWindow: '18:00 gacha',
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
    loadType: 'yigma_yuk',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    weightKg: 3500,
    volumeM3: 12,
    pickupLocation: UZBEKISTAN_CITIES[6], // Andijon
    deliveryLocation: UZBEKISTAN_CITIES[1], // Toshkent Sergeli logistika
    pickupDate: '2026-10-30',
    pickupTimeWindow: '14:00 - 18:00 (Tushdan keyin)',
    deliveryDate: '2026-10-31',
    deliveryTimeWindow: 'Ertasi kuni 12:00 gacha',
    priceUzs: 1800000,
    paymentMethod: 'Karta (Click / Payme / Humo)',
    urgency: 'Oddiy',
    hasDocuments: true,
    distanceKm: 350,
    durationMinutes: 320,
    specialNotes: 'Yig\'ma yuk! Mashinada boshqa yuklar bo\'lsa ham bo\'ladi (+2°C rejim).',
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

export const INITIAL_CARRIER_TRIPS: CarrierTripAd[] = [
  {
    id: 'trip-201',
    driverId: 'drv-current',
    driverName: 'Akmal Rustamov',
    driverPhone: '+998912345678',
    driverTelegram: 'akmal_trans',
    driverRating: 4.95,
    vehicleModel: 'Isuzu FVR 34 (Tentli)',
    vehiclePlate: '01 777 AAA',
    transportType: 'Isuzu (Bortli)',
    totalCapacityTon: 10,
    availableCapacityTon: 5.5, // 4.5t band, 5.5t bo'sh
    totalVolumeM3: 36,
    availableVolumeM3: 19,
    departureLocation: UZBEKISTAN_CITIES[0], // Toshkent
    destinationLocation: UZBEKISTAN_CITIES[3], // Samarqand
    departureDate: '2026-10-30',
    departureTimeWindow: '08:00 - 11:00 oralig\'ida',
    deliveryDate: '2026-10-30',
    deliveryTimeWindow: '18:00 gacha yetkazish',
    pricePerTonUzs: 380000,
    totalTripPriceUzs: 3800000,
    isConsolidated: true, // Bir nechta kishi yuki olinadi
    maxShippersCount: 5,
    currentShippersCount: 2, // Hozir 2 kishidan yuk olingan
    specialNotes: 'Mashinada 5.5 tonna bo\'sh joy bor! 100 kg dan 5.5 tonnagacha yig\'ma yuklar qabul qilinadi.',
    createdAt: '2026-10-29T10:00:00Z',
    status: 'faol'
  },
  {
    id: 'trip-202',
    driverId: 'drv-sherzod',
    driverName: 'Sherzod Qodirov',
    driverPhone: '+998905554433',
    driverTelegram: 'sherzod_fura',
    driverRating: 4.88,
    vehicleModel: 'MAN TGX 18.440 (Fura)',
    vehiclePlate: '30 888 BBB',
    transportType: 'Fura (Tentli)',
    totalCapacityTon: 22,
    availableCapacityTon: 11.0, // 11t band, 11t bo'sh
    totalVolumeM3: 86,
    availableVolumeM3: 42,
    departureLocation: UZBEKISTAN_CITIES[6], // Andijon
    destinationLocation: UZBEKISTAN_CITIES[0], // Toshkent
    departureDate: '2026-10-31',
    departureTimeWindow: '07:00 - 10:00 oralig\'ida',
    deliveryDate: '2026-10-31',
    deliveryTimeWindow: '20:00 gacha',
    pricePerTonUzs: 240000,
    totalTripPriceUzs: 5000000,
    isConsolidated: true,
    maxShippersCount: 5,
    currentShippersCount: 1,
    specialNotes: 'Qamchiq dovoni orqali Toshkentga qaytish reysi. 11 tonnagacha bo\'sh joy mavjud.',
    createdAt: '2026-10-29T14:30:00Z',
    status: 'faol'
  },
  {
    id: 'trip-203',
    driverId: 'drv-jamshid',
    driverName: 'Jamshid Karimov',
    driverPhone: '+998971112233',
    driverTelegram: 'jamshid_gazel',
    driverRating: 4.9,
    vehicleModel: 'Gazel NEXT (Kuzov 4.2m)',
    vehiclePlate: '20 456 CCC',
    transportType: 'Gazel (Tentli)',
    totalCapacityTon: 3.5,
    availableCapacityTon: 2.0, // 1.5t band, 2.0t bo'sh
    totalVolumeM3: 16,
    availableVolumeM3: 9,
    departureLocation: UZBEKISTAN_CITIES[3], // Samarqand
    destinationLocation: UZBEKISTAN_CITIES[4], // Buxoro
    departureDate: '2026-10-30',
    departureTimeWindow: '12:00 - 15:00 oralig\'ida',
    deliveryDate: '2026-10-30',
    deliveryTimeWindow: '21:00 gacha',
    pricePerTonUzs: 450000,
    totalTripPriceUzs: 1500000,
    isConsolidated: true,
    maxShippersCount: 4,
    currentShippersCount: 1,
    specialNotes: 'Mebel, maishiy texnika va qutilar uchun bo\'sh joy bor.',
    createdAt: '2026-10-29T16:00:00Z',
    status: 'faol'
  }
];
