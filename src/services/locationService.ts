import { Geolocation } from '@capacitor/geolocation';
import { LocationPoint } from '../types';
import { UZBEKISTAN_CITIES } from '../data/uzbekistanLocations';
import { calculateDirectDistanceKm } from './routingService';

export interface GpsLocationResult {
  point: LocationPoint;
  accuracyMeters: number;
  isGps: boolean;
  provider: 'gps_fine' | 'network_coarse' | 'ip' | 'default';
  message?: string;
}

export const locationService = {
  /**
   * Ilova ochilganda yoki yuk berishda Android tizimidan GPS ruxsatini to'g'ridan-to'g'ri so'rash
   */
  async requestGpsPermission(): Promise<boolean> {
    try {
      const res = await Geolocation.requestPermissions();
      return res.location === 'granted' || res.coarseLocation === 'granted';
    } catch (e) {
      console.warn("GPS ruxsat so'rash xatosi:", e);
      return false;
    }
  },

  /**
   * Foydalanuvchining haqiqiy GPS / Tarmoq joylashuvini tezkor va ishonchli aniqlash
   * (Ko'chada ham, uy/bino ichida ham qotmasdan 1-2 soniyada ishlaydi)
   */
  async getCurrentLocation(): Promise<GpsLocationResult> {
    let lat: number | null = null;
    let lng: number | null = null;
    let accuracy = 20;
    let provider: GpsLocationResult['provider'] = 'default';

    // 1-QADAM: Android tizimidan GPS ruxsatini to'g'ridan-to'g'ri so'rash (dialog chiqarish)
    try {
      await Geolocation.requestPermissions();
    } catch (permErr) {
      console.warn("Ruxsat so'rashda xato:", permErr);
    }

    // 2-QADAM: Eng tezkor tarmoq lokatsiyasi (Wi-Fi / Cell tower / Fused - bino ichida ham bir zumda ishlaydi)
    try {
      const fastPos = await Promise.race([
        Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 4000,
          maximumAge: 60000
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Fast timeout')), 4000))
      ]);

      if (fastPos && fastPos.coords) {
        lat = fastPos.coords.latitude;
        lng = fastPos.coords.longitude;
        accuracy = Math.round(fastPos.coords.accuracy || 30);
        provider = 'network_coarse';
      }
    } catch {
      // Fast location olinmasa, keyingisiga o'tamiz
    }

    // 3-QADAM: Agar aniq GPS kerak bo'lsa (yoki 1-qadam bo'sh qolsa), High Accuracy sinab ko'rish
    if (lat === null) {
      try {
        const finePos = await Promise.race([
          Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 10000
          }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Fine timeout')), 6000))
        ]);

        if (finePos && finePos.coords) {
          lat = finePos.coords.latitude;
          lng = finePos.coords.longitude;
          accuracy = Math.round(finePos.coords.accuracy || 10);
          provider = 'gps_fine';
        }
      } catch {
        // High accuracy ham timeout bo'ldi
      }
    }

    // 4-QADAM: HTML5 brauzer geolokatsiyasi zaxirasi
    if (lat === null && typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const navPos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 4000,
            maximumAge: 60000
          });
        });
        lat = navPos.coords.latitude;
        lng = navPos.coords.longitude;
        accuracy = Math.round(navPos.coords.accuracy || 25);
        provider = 'network_coarse';
      } catch {
        // Browser geoloc ham o'tmadi
      }
    }

    // 5-QADAM: Agar barcha qurilma GPS lari o'chiq bo'lsa, IP orqali shahar aniqlash (1.5s timeout)
    if (lat === null) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const ipRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.latitude && ipData.longitude) {
            lat = Number(ipData.latitude);
            lng = Number(ipData.longitude);
            accuracy = 1000;
            provider = 'ip';
          }
        }
      } catch {
        // IP ham olinmadi
      }
    }

    // 6-QADAM: Agar koordinata topilgan bo'lsa, O'zbekistonning eng yaqin shahrini hisoblash
    if (lat !== null && lng !== null) {
      let closest = UZBEKISTAN_CITIES[0];
      let minDistance = calculateDirectDistanceKm(lat, lng, closest.lat, closest.lng);

      for (const city of UZBEKISTAN_CITIES) {
        const dist = calculateDirectDistanceKm(lat, lng, city.lat, city.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closest = city;
        }
      }

      const point: LocationPoint = {
        city: closest.city,
        district: closest.district || 'Markaziy hudud',
        address: `${closest.city} (GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6))
      };

      return {
        point,
        accuracyMeters: accuracy,
        isGps: provider === 'gps_fine' || provider === 'network_coarse',
        provider,
        message: provider === 'ip' ? "Tarmoq orqali taxminiy shahar aniqlandi" : undefined
      };
    }

    // Barcha usullar ishlamasa (masalan samolyot rejimida yoki internetsiz):
    return {
      point: UZBEKISTAN_CITIES[0],
      accuracyMeters: 50,
      isGps: false,
      provider: 'default',
      message: "Telefon sozlamalarida 'Joylashuv' (GPS) xizmatini yoqing"
    };
  }
};
