export type ScreenType = 
  | 'splash'
  | 'booking'
  | 'trucks'
  | 'tracking'
  | 'driver'
  | 'bookings'
  | 'earnings'
  | 'profile';

export type BottomNavTab = 'home' | 'bookings' | 'map' | 'profile';

export type Language = 'uz' | 'en' | 'ru';

export interface TruckItem {
  id: string;
  name: string;
  category: 'small' | 'medium' | 'large';
  capacity: string; // e.g. "3.5 t • 12 m³"
  tonnage: number;
  badge: string;
  badgeColor: 'green' | 'orange' | 'blue';
  price: number;
  rateUnit: string;
  imageColor: string;
  description: string;
  dimensions: string;
}

export interface BookingItem {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: 'In Transit' | 'Delivered' | 'Completed' | 'Cancelled';
  price: number;
  truckType: string;
  truckPlate: string;
  cargoType: string;
  weight: string;
  driverName: string;
  progressStep: number; // 1 = Loading, 2 = In Transit, 3 = Delivered
  eta: string;
}

export interface PayoutItem {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending';
}

export interface DriverInfo {
  name: string;
  email: string;
  phone: string;
  rating: number;
  totalTrips: number;
  verified: boolean;
  experienceYears: number;
  onTimeRate: number;
  about: string;
  vehicle: {
    model: string;
    plate: string;
    capacity: string;
  };
}
