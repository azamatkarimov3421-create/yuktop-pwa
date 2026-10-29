import { LocationPoint, RouteGeometry, CargoCategory } from '../types';

/**
 * Calculates Haversine distance in km between two geographical points
 */
export function calculateDirectDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates road route using OSRM routing service or fallback curve interpolation
 */
export async function getRoute(pointA: LocationPoint, pointB: LocationPoint): Promise<RouteGeometry> {
  const directDist = calculateDirectDistanceKm(pointA.lat, pointA.lng, pointB.lat, pointB.lng);
  
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pointA.lng},${pointA.lat};${pointB.lng},${pointB.lat}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        const durationMinutes = Math.round(route.duration / 60);

        return {
          coordinates,
          distanceKm: distanceKm > 0 ? distanceKm : Math.round(directDist * 1.25),
          durationMinutes: durationMinutes > 0 ? durationMinutes : Math.round(directDist * 1.2)
        };
      }
    }
  } catch {
    // Fallback
  }

  // Realistic highway waypoints
  const pointsCount = 20;
  const coordinates: [number, number][] = [];
  const roadDistKm = Math.round(directDist * 1.25);
  const avgSpeedKmH = 65;
  const durationMinutes = Math.round((roadDistKm / avgSpeedKmH) * 60);

  for (let i = 0; i <= pointsCount; i++) {
    const t = i / pointsCount;
    const curvature = Math.sin(t * Math.PI) * 0.08 * (Math.sin(directDist) > 0 ? 1 : -1);
    const lat = pointA.lat + (pointB.lat - pointA.lat) * t + curvature;
    const lng = pointA.lng + (pointB.lng - pointA.lng) * t + curvature * 0.5;
    coordinates.push([lat, lng]);
  }

  return {
    coordinates,
    distanceKm: roadDistKm,
    durationMinutes
  };
}

/**
 * Modern Smart Price Estimation for Uzbekistan Freight Market
 */
export function calculateRecommendedPrice(
  distanceKm: number,
  weightKg: number,
  category?: CargoCategory
): { economy: number; standard: number; express: number } {
  const dist = Math.max(10, distanceKm);
  const ton = Math.max(0.5, weightKg / 1000);

  // Rate per km in Uzbekistan based on weight
  let ratePerKm = 8000;
  if (ton <= 2) ratePerKm = 6000;       // Labo / Damas / Kichik
  else if (ton <= 5) ratePerKm = 8500;   // Isuzu / Gazel
  else if (ton <= 12) ratePerKm = 11000; // O'rta yuk
  else ratePerKm = 14000;                // Katta Fura 20t

  // Category multiplier
  let catFactor = 1.0;
  if (category === 'Meva va sabzavotlar' || category === 'Suyuqlik va sisterna') catFactor = 1.15;
  if (category === 'Xavfli yuk (ADR)') catFactor = 1.35;

  const standardRaw = Math.round((dist * ratePerKm * catFactor) / 50000) * 50000;
  const standard = Math.max(300000, standardRaw);
  const economy = Math.round((standard * 0.85) / 50000) * 50000;
  const express = Math.round((standard * 1.2) / 50000) * 50000;

  return { economy, standard, express };
}

/**
 * Format duration into human readable Uzbek
 */
export function formatDurationUz(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} daqiqa`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} soat`;
  }
  return `${hours} soat ${remainingMins} daq`;
}

/**
 * Format money into Uzbek Sum (UZS)
 */
export function formatMoneyUz(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}
