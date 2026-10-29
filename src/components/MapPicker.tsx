import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPoint, RouteGeometry } from '../types';
import { UZBEKISTAN_CITIES } from '../data/uzbekistanLocations';
import { getRoute, formatDurationUz } from '../services/routingService';
import { locationService } from '../services/locationService';
import { Crosshair, Loader2 } from 'lucide-react';

interface MapPickerProps {
  initialPointA?: LocationPoint;
  initialPointB?: LocationPoint;
  onPointsSelected?: (pointA: LocationPoint, pointB: LocationPoint, route: RouteGeometry) => void;
  readOnly?: boolean;
  routeToShow?: RouteGeometry;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  initialPointA = UZBEKISTAN_CITIES[0], // Toshkent
  initialPointB = UZBEKISTAN_CITIES[3], // Samarqand
  onPointsSelected,
  readOnly = false,
  routeToShow
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerARef = useRef<L.Marker | null>(null);
  const markerBRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [pointA, setPointA] = useState<LocationPoint>(initialPointA);
  const [pointB, setPointB] = useState<LocationPoint>(initialPointB);
  const [activeSelectMode, setActiveSelectMode] = useState<'A' | 'B'>('A');
  const activeSelectModeRef = useRef<'A' | 'B'>('A');
  activeSelectModeRef.current = activeSelectMode;

  const [routeInfo, setRouteInfo] = useState<RouteGeometry | null>(routeToShow || null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState<string | null>(null);

  // Sync with prop updates smoothly
  useEffect(() => {
    if (initialPointA && (initialPointA.lat !== pointA.lat || initialPointA.lng !== pointA.lng)) {
      setPointA(initialPointA);
    }
  }, [initialPointA.lat, initialPointA.lng, initialPointA.city]);

  useEffect(() => {
    if (initialPointB && (initialPointB.lat !== pointB.lat || initialPointB.lng !== pointB.lng)) {
      setPointB(initialPointB);
    }
  }, [initialPointB.lat, initialPointB.lng, initialPointB.city]);

  const createCustomIcon = (label: 'A' | 'B', color: string) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          background-color: ${color};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          border: 2px solid white;
        ">
          <span style="
            transform: rotate(45deg);
            font-weight: 800;
            font-size: 13px;
          ">${label}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  // Initialize Map ONCE (Never teardown on mode switch)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [40.5, 67.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
      dragging: !readOnly,
      touchZoom: !readOnly,
      scrollWheelZoom: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Smooth resize check
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    if (!readOnly) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        let closestCity = "O'zbekiston";
        let minDist = 999999;
        UZBEKISTAN_CITIES.forEach(c => {
          const d = Math.hypot(c.lat - lat, c.lng - lng);
          if (d < minDist) {
            minDist = d;
            closestCity = c.city;
          }
        });

        const newPoint: LocationPoint = {
          city: closestCity,
          address: `${closestCity} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6))
        };

        if (activeSelectModeRef.current === 'A') {
          setPointA(newPoint);
          setActiveSelectMode('B');
        } else {
          setPointB(newPoint);
        }
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [readOnly]);

  // Update Markers and Polyline when Points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerARef.current) map.removeLayer(markerARef.current);
    if (markerBRef.current) map.removeLayer(markerBRef.current);
    if (polylineRef.current) map.removeLayer(polylineRef.current);

    const markerA = L.marker([pointA.lat, pointA.lng], {
      icon: createCustomIcon('A', '#0D9488'),
      draggable: !readOnly
    }).addTo(map);
    markerA.bindTooltip(`<b>Yuklash (A):</b> ${pointA.city}`);
    markerARef.current = markerA;

    if (!readOnly) {
      markerA.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setPointA(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
      });
    }

    const markerB = L.marker([pointB.lat, pointB.lng], {
      icon: createCustomIcon('B', '#E11D48'),
      draggable: !readOnly
    }).addTo(map);
    markerB.bindTooltip(`<b>Yetkazish (B):</b> ${pointB.city}`);
    markerBRef.current = markerB;

    if (!readOnly) {
      markerB.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setPointB(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
      });
    }

    let isCancelled = false;
    const fetchRouteData = async () => {
      const route = await getRoute(pointA, pointB);
      if (isCancelled) return;

      setRouteInfo(route);

      if (route.coordinates.length > 0 && mapInstanceRef.current) {
        if (polylineRef.current) mapInstanceRef.current.removeLayer(polylineRef.current);

        const polyline = L.polyline(route.coordinates, {
          color: '#0D9488',
          weight: 4.5,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstanceRef.current);

        polylineRef.current = polyline;

        const bounds = L.latLngBounds([
          [pointA.lat, pointA.lng],
          [pointB.lat, pointB.lng]
        ]);
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }

      if (onPointsSelected) {
        onPointsSelected(pointA, pointB, route);
      }
    };

    fetchRouteData();

    return () => {
      isCancelled = true;
    };
  }, [pointA.lat, pointA.lng, pointB.lat, pointB.lng, readOnly]);

  // GPS Locating Handler
  const handleDetectGps = async () => {
    setIsLocatingGps(true);
    setGpsStatusText("Joylashuv aniqlanmoqda...");
    try {
      const res = await locationService.getCurrentLocation();
      setPointA(res.point);
      setGpsStatusText(res.isGps ? `GPS: ${res.point.city} (±${res.accuracyMeters}m)` : (res.message || res.point.city));
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([res.point.lat, res.point.lng], 12, { duration: 1 });
      }
      setTimeout(() => setGpsStatusText(null), 5000);
    } catch {
      setGpsStatusText("Telefon GPS sozlamasini yoqing");
      setTimeout(() => setGpsStatusText(null), 4000);
    } finally {
      setIsLocatingGps(false);
    }
  };

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden border border-white/85 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/72 backdrop-blur-xl">
      {/* Route Info Badge */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between gap-1.5 bg-white/85 backdrop-blur-xl p-2.5 rounded-2xl border border-white/80 shadow-md">
        <div className="flex items-center gap-1.5 text-xs truncate">
          <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
          <span className="font-bold text-slate-800 text-[11px] truncate">{pointA.city.split(' ')[0]}</span>
          <span className="text-slate-400">→</span>
          <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
          <span className="font-bold text-slate-800 text-[11px] truncate">{pointB.city.split(' ')[0]}</span>
        </div>

        {routeInfo && (
          <div className="flex items-center gap-1.5 text-[10px] shrink-0 font-bold">
            <span className="px-2 py-0.5 bg-teal-500/15 text-teal-800 rounded-full border border-teal-200/80">
              {routeInfo.distanceKm} km
            </span>
            <span className="px-2 py-0.5 bg-sky-500/15 text-sky-800 rounded-full border border-sky-200/80">
              {formatDurationUz(routeInfo.durationMinutes)}
            </span>
          </div>
        )}
      </div>

      {/* Floating GPS Button */}
      {!readOnly && (
        <div className="absolute bottom-20 left-3 z-[1000] flex items-center gap-2">
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isLocatingGps}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/85 text-teal-700 hover:text-teal-900 font-extrabold text-[11px] shadow-lg active:scale-95 transition-all disabled:opacity-60"
            title="Mening aniq GPS joylashuvim"
          >
            {isLocatingGps ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-teal-600" />
            )}
            <span>{isLocatingGps ? 'Aniqlanmoqda...' : '📍 Mening joylashuvim'}</span>
          </button>

          {gpsStatusText && (
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md shadow-md animate-in fade-in">
              {gpsStatusText}
            </span>
          )}
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-64 sm:h-72 z-0 bg-slate-100" />

      {!readOnly && (
        <div className="p-3 bg-white/75 backdrop-blur-xl border-t border-white/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium">
              Tanlash rejimi:
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveSelectMode('A')}
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                  activeSelectMode === 'A'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white/60 backdrop-blur-md text-slate-700 border border-white/80 hover:bg-white/90'
                }`}
              >
                A Nuqta (Yuklash)
              </button>
              <button
                type="button"
                onClick={() => setActiveSelectMode('B')}
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                  activeSelectMode === 'B'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white/60 backdrop-blur-md text-slate-700 border border-white/80 hover:bg-white/90'
                }`}
              >
                B Nuqta (Yetkazish)
              </button>
            </div>
          </div>

          {/* Quick city pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-[11px]">
            {UZBEKISTAN_CITIES.slice(0, 8).map((city) => (
              <button
                key={city.city + city.district}
                type="button"
                onClick={() => {
                  if (activeSelectMode === 'A') {
                    setPointA(city);
                    setActiveSelectMode('B');
                  } else {
                    setPointB(city);
                  }
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([city.lat, city.lng], 10, { duration: 0.8 });
                  }
                }}
                className="px-3 py-1 shrink-0 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 hover:bg-white/95 hover:text-teal-800 transition-colors active:scale-95 font-medium shadow-2xs"
              >
                {city.city.replace(' shahri', '')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
