import { TruckItem, BookingItem, PayoutItem, DriverInfo } from '../types';

export const TRUCKS_DATA: TruckItem[] = [
  {
    id: 'truck-1',
    name: 'Small Truck',
    category: 'small',
    capacity: '3.5 t • 12 m³',
    tonnage: 3.5,
    badge: 'Best for small loads',
    badgeColor: 'green',
    price: 320,
    rateUnit: 'per trip',
    imageColor: '#2563EB',
    description: 'Ideal for city deliveries, small cargo and quick freight transportation.',
    dimensions: '4.2m x 2.1m x 2.2m'
  },
  {
    id: 'truck-2',
    name: 'Medium Truck',
    category: 'medium',
    capacity: '10 t • 40 m³',
    tonnage: 10,
    badge: 'Most popular',
    badgeColor: 'green',
    price: 580,
    rateUnit: 'per trip',
    imageColor: '#FFFFFF',
    description: 'Perfect for commercial goods, palletized cargo and medium intercity routes.',
    dimensions: '7.5m x 2.45m x 2.6m'
  },
  {
    id: 'truck-3',
    name: 'Large Truck',
    category: 'large',
    capacity: '20 t • 86 m³',
    tonnage: 20,
    badge: 'For heavy cargo',
    badgeColor: 'orange',
    price: 890,
    rateUnit: 'per trip',
    imageColor: '#FF7A00',
    description: 'Heavy duty articulated semi-trailer for industrial, bulk and long-haul freight.',
    dimensions: '13.6m x 2.48m x 2.7m'
  }
];

export const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'YKP-4587',
    from: 'Tashkent',
    to: 'Samarkand',
    date: '12 May 2025',
    time: '10:30',
    status: 'In Transit',
    price: 580,
    truckType: 'Volvo FH',
    truckPlate: 'AB 1234 AA',
    cargoType: 'General Cargo',
    weight: '12,000 kg',
    driverName: 'Azizbek Rakhimov',
    progressStep: 2,
    eta: '2h 45m'
  },
  {
    id: 'YKP-4521',
    from: 'Bukhara',
    to: 'Tashkent',
    date: '8 May 2025',
    time: '14:20',
    status: 'Delivered',
    price: 420,
    truckType: 'MAN TGX',
    truckPlate: '01 987 BBB',
    cargoType: 'Construction Material',
    weight: '9,500 kg',
    driverName: 'Jamshid Aliyev',
    progressStep: 3,
    eta: 'Delivered'
  },
  {
    id: 'YKP-4478',
    from: 'Andijan',
    to: 'Tashkent',
    date: '3 May 2025',
    time: '09:15',
    status: 'Completed',
    price: 360,
    truckType: 'Isuzu FTR',
    truckPlate: '60 555 CCC',
    cargoType: 'Food & Beverage',
    weight: '6,200 kg',
    driverName: 'Sardor Karimov',
    progressStep: 3,
    eta: 'Completed'
  },
  {
    id: 'YKP-4390',
    from: 'Nukus',
    to: 'Tashkent',
    date: '28 Apr 2025',
    time: '16:40',
    status: 'Cancelled',
    price: 510,
    truckType: 'Scania R500',
    truckPlate: '95 333 DDD',
    cargoType: 'Industrial Equipment',
    weight: '15,000 kg',
    driverName: 'Davron Rustamov',
    progressStep: 1,
    eta: 'Cancelled'
  }
];

export const DRIVER_DATA: DriverInfo = {
  name: 'Azizbek Rakhimov',
  email: 'azizbek@example.com',
  phone: '+998 90 123 45 67',
  rating: 4.9,
  totalTrips: 124,
  verified: true,
  experienceYears: 5,
  onTimeRate: 98,
  about: 'Professional truck driver with over 5 years of experience in long-distance transportation. Safe, reliable and always on time.',
  vehicle: {
    model: 'Volvo FH',
    plate: 'AB 1234 AA',
    capacity: '10 t • 40 m³'
  }
};

export const EARNINGS_DATA = {
  total: 2480,
  growthPercent: 12,
  periodText: 'vs last 30 days',
  chartBars: [
    { label: 'Apr 20', amount: 320, heightPercent: 45, isHighlight: false },
    { label: 'Apr 23', amount: 420, heightPercent: 60, isHighlight: false },
    { label: 'Apr 27', amount: 580, heightPercent: 80, isHighlight: true },
    { label: 'Apr 30', amount: 360, heightPercent: 50, isHighlight: false },
    { label: 'May 4', amount: 720, heightPercent: 95, isHighlight: true },
    { label: 'May 8', amount: 420, heightPercent: 60, isHighlight: false },
    { label: 'May 11', amount: 580, heightPercent: 82, isHighlight: false }
  ],
  payouts: [
    { id: 'Trip #YKP-4587', date: '12 May 2025', amount: 580, status: 'Completed' },
    { id: 'Trip #YKP-4521', date: '8 May 2025', amount: 420, status: 'Completed' },
    { id: 'Trip #YKP-4478', date: '3 May 2025', amount: 360, status: 'Completed' }
  ] as PayoutItem[]
};

export const UZBEKISTAN_CITIES = [
  'Tashkent',
  'Samarkand',
  'Bukhara',
  'Andijan',
  'Namangan',
  'Fergana',
  'Nukus',
  'Urgench',
  'Navoi',
  'Qarshi',
  'Termez',
  'Jizzakh',
  'Guliston'
];

export const CARGO_TYPES = [
  'General Cargo',
  'Refrigerated Cargo',
  'Construction Materials',
  'Heavy Machinery',
  'Agricultural Products',
  'Household & Furniture',
  'Fragile / Electronics'
];
