import { Capacitor } from '@capacitor/core';
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
   * Android va Brauzerda GPS ruxsatini xavfsiz tekshirish va so'rash
   */
  async requestGpsPermission(): Promise<boolean> {
    // 1. Agar Capacitor orqali haqiqiy Android/iOS da ishlayotgan bo'lsa
    if (Capacitor.isNativePlatform()) {
      try {
        const check = await Geolocation.checkPermissions();
        if (check.location === 'granted' || check.coarseLocation === 'granted') {
          return true;
        }
        const req = await Geolocation.requestPermissions();
        return req.location === 'granted' || req.coarseLocation === 'granted';
      } catch (e) {
        console.warn('Native GPS permission error:', e);
        return false;
      }
    }

    // 2. Agar Web / PWA / Brauzerda ishlayotgan bo'lsa
    if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        return status.state === 'granted' || status.state === 'prompt';
      } catch {
        return true;
      }
    }

    return true;
  },

  /**
   * Haqiqiy koordinatalarni O'zbekistonning aniq inson tushunadigan manziliga aylantirish
   * (BigDataCloud Client API + OpenStreetMap Nominatim orqali eng tezkor va aniq natija)
   */
  async reverseGeocode(lat: number, lng: number): Promise<{ city: string; district: string; address: string }> {
    let resolvedCity = '';
    let resolvedDistrict = '';
    let resolvedRoad = '';

    // 1. Eng yaqin rasmiy O'zbekiston shahrini topib qo'yamiz (tayanch nuqta)
    let closestCity = UZBEKISTAN_CITIES[0];
    let minDistance = calculateDirectDistanceKm(lat, lng, closestCity.lat, closestCity.lng);
    for (const c of UZBEKISTAN_CITIES) {
      const d = calculateDirectDistanceKm(lat, lng, c.lat, c.lng);
      if (d < minDistance) {
        minDistance = d;
        closestCity = c;
      }
    }

    // 2. Tezkor BigDataCloud API (CORS yoqilgan, O'zbek tili, o'ta tezkor ~300ms)
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3500);
      const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=uz`;
      const res = await fetch(bdcUrl, { signal: ctrl.signal });
      clearTimeout(t);

      if (res.ok) {
        const data = await res.json();
        resolvedCity = data.city || data.locality || data.principalSubdivision || '';
        resolvedDistrict = data.locality || data.city || data.principalSubdivision || '';
      }
    } catch {
      // BigDataCloud vaqtinchalik javob bermasa davom etamiz
    }

    // 3. OpenStreetMap Nominatim orqali aniq ko'cha va tuman ma'lumotlarini olish
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3500);
      const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`;
      const res = await fetch(nomUrl, {
        signal: ctrl.signal,
        headers: {
          'Accept-Language': 'uz,ru,en'
        }
      });
      clearTimeout(t);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.street || addr.pedestrian || addr.residential || '';
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.district || '';
        const city = addr.city || addr.town || addr.village || addr.state || '';

        if (road) resolvedRoad = road;
        if (suburb && !resolvedDistrict) resolvedDistrict = suburb;
        if (city && !resolvedCity) resolvedCity = city;
      }
    } catch {
      // Nominatim timeout bo'lsa
    }

    // Shahar nomini tozalash va chiroyli formatlash
    const finalCity = resolvedCity || closestCity.city;
    const finalDistrict = resolvedDistrict || closestCity.district || "Markaziy hudud";
    
    // Aniq manzil satri
    let finalAddress = '';
    if (resolvedRoad) {
      finalAddress = `${resolvedRoad}, ${finalDistrict}, ${finalCity}`;
    } else if (finalDistrict && finalDistrict !== finalCity) {
      finalAddress = `${finalDistrict}, ${finalCity}`;
    } else {
      finalAddress = `${finalCity} (GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }

    return {
      city: finalCity,
      district: finalDistrict,
      address: finalAddress
    };
  },

  /**
   * Foydalanuvchining haqiqiy GPS / Tarmoq joylashuvini bir zumda aniqlash
   */
  async getCurrentLocation(): Promise<GpsLocationResult> {
    let lat: number | null = null;
    let lng: number | null = null;
    let accuracy = 20;
    let provider: GpsLocationResult['provider'] = 'default';

    // Ruxsat so'rash (Native bo'lsa)
    if (Capacitor.isNativePlatform()) {
      try {
        await Geolocation.requestPermissions();
      } catch {}
    }

    // 1-QADAM: Brauzer / Qurilma HTML5 Geolocation (barcha zamonaviy telefonlar va brauzerlar uchun 1-o'rinda)
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        const navPos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 9000,
              maximumAge: 5000
            }
          );
        });

        if (navPos && navPos.coords) {
          lat = navPos.coords.latitude;
          lng = navPos.coords.longitude;
          accuracy = Math.round(navPos.coords.accuracy || 15);
          provider = 'gps_fine';
        }
      } catch (err: any) {
        // High accuracy bo'lmasa, tezkor coarse/network sinab ko'ramiz
        try {
          const quickPos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 60000
              }
            );
          });
          if (quickPos && quickPos.coords) {
            lat = quickPos.coords.latitude;
            lng = quickPos.coords.longitude;
            accuracy = Math.round(quickPos.coords.accuracy || 40);
            provider = 'network_coarse';
          }
        } catch {}
      }
    }

    // 2-QADAM: Agar yuqoridagi ishlamasa va Native Capacitor mavjud bo'lsa
    if (lat === null && Capacitor.isNativePlatform()) {
      try {
        const capPos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 10000
        });
        if (capPos && capPos.coords) {
          lat = capPos.coords.latitude;
          lng = capPos.coords.longitude;
          accuracy = Math.round(capPos.coords.accuracy || 20);
          provider = 'gps_fine';
        }
      } catch {}
    }

    // 3-QADAM: Agar GPS butunlay o'chirilgan bo'lsa, IP orqali taxminiy koordinata olish
    if (lat === null) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3000);
        const ipRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', { signal: ctrl.signal });
        clearTimeout(t);
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.latitude && ipData.longitude) {
            lat = Number(ipData.latitude);
            lng = Number(ipData.longitude);
            accuracy = 1000;
            provider = 'ip';
          }
        }
      } catch {}
    }

    // 4-QADAM: Koordinatalar topildi — haqiqiy manzilga aylantiramiz
    if (lat !== null && lng !== null) {
      const geo = await this.reverseGeocode(lat, lng);

      const point: LocationPoint = {
        city: geo.city,
        district: geo.district,
        address: geo.address,
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6))
      };

      return {
        point,
        accuracyMeters: accuracy,
        isGps: provider === 'gps_fine' || provider === 'network_coarse',
        provider,
        message: provider === 'ip' ? "Tarmoq orqali aniqlandi" : `Aniqlandi: ${geo.address}`
      };
    }

    // GPS butunlay o'chiq va internetsiz bo'lsa
    return {
      point: {
        city: "Toshkent shahri",
        district: "Markaziy hudud",
        address: "Joylashuvni aniqlash uchun telefon GPS-ini yoqing",
        lat: 41.2995,
        lng: 69.2401
      },
      accuracyMeters: 50,
      isGps: false,
      provider: 'default',
      message: "Telefon sozlamalarida 'Joylashuv' (GPS) yoqilganligiga ishonch hosil qiling"
    };
  }
};
