import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPoint, RouteGeometry } from '../types';
import { UZBEKISTAN_CITIES } from '../data/uzbekistanLocations';
import { getRoute, getMultiPointRoute, formatDurationUz } from '../services/routingService';
import { locationService } from '../services/locationService';
import { Crosshair, Loader2, Navigation, MapPin } from 'lucide-react';

interface MapPickerProps {
  initialPointA?: LocationPoint;
  initialPointB?: LocationPoint;
  initialPointC?: LocationPoint | null;
  onPointsSelected?: (pointA: LocationPoint, pointB: LocationPoint, pointC: LocationPoint | null, route: RouteGeometry) => void;
  readOnly?: boolean;
  routeToShow?: RouteGeometry;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  initialPointA = UZBEKISTAN_CITIES[0], // Toshkent
  initialPointB = UZBEKISTAN_CITIES[3], // Samarqand
  initialPointC = null,
  onPointsSelected,
  readOnly = false,
  routeToShow
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerARef = useRef<L.Marker | null>(null);
  const markerBRef = useRef<L.Marker | null>(null);
  const markerCRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [pointA, setPointA] = useState<LocationPoint>(initialPointA);
  const [pointB, setPointB] = useState<LocationPoint>(initialPointB);
  const [pointC, setPointC] = useState<LocationPoint | null>(initialPointC);

  const [activeSelectMode, setActiveSelectMode] = useState<'A' | 'B' | 'C'>('A');
  const activeSelectModeRef = useRef<'A' | 'B' | 'C'>('A');
  activeSelectModeRef.current = activeSelectMode;

  const [routeInfo, setRouteInfo] = useState<RouteGeometry | null>(routeToShow || null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState<string | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  useEffect(() => {
    if (initialPointA && (initialPointA.lat !== pointA.lat || initialPointA.lng !== pointA.lng || initialPointA.city !== pointA.city)) {
      setPointA(initialPointA);
    }
  }, [initialPointA.lat, initialPointA.lng, initialPointA.city, initialPointA.address]);

  useEffect(() => {
    if (initialPointB && (initialPointB.lat !== pointB.lat || initialPointB.lng !== pointB.lng || initialPointB.city !== pointB.city)) {
      setPointB(initialPointB);
    }
  }, [initialPointB.lat, initialPointB.lng, initialPointB.city, initialPointB.address]);

  useEffect(() => {
    setPointC(initialPointC || null);
  }, [initialPointC?.lat, initialPointC?.lng, initialPointC?.city, initialPointC?.address]);

  const createCustomIcon = (label: string, color: string) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          width: 34px;
          height: 34px;
          background: ${color};
          border: 2.5px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-weight: 900;
          font-size: 13px;
          font-family: system-ui, sans-serif;
          cursor: pointer;
          transform: translateY(-5px);
          transition: transform 0.15s ease;
        ">
          ${label}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
  };

  // Initialize Map ONCE
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [pointA.lat, pointA.lng],
      zoom: 7,
      zoomControl: !readOnly,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    if (!readOnly) {
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setIsResolvingAddress(true);

        try {
          const geo = await locationService.reverseGeocode(lat, lng);
          const newPoint: LocationPoint = {
            city: geo.city,
            district: geo.district,
            address: geo.address,
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6))
          };

          if (activeSelectModeRef.current === 'A') {
            setPointA(newPoint);
            setActiveSelectMode('B');
          } else if (activeSelectModeRef.current === 'B') {
            setPointB(newPoint);
          } else if (activeSelectModeRef.current === 'C') {
            setPointC(newPoint);
          }
        } finally {
          setIsResolvingAddress(false);
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
    if (markerCRef.current) map.removeLayer(markerCRef.current);
    if (polylineRef.current) map.removeLayer(polylineRef.current);

    // Marker A (Yuklash)
    const markerA = L.marker([pointA.lat, pointA.lng], {
      icon: createCustomIcon('A', '#0D9488'),
      draggable: !readOnly
    }).addTo(map);
    markerA.bindTooltip(`<b>1. Yuklash joyi (A):</b> ${pointA.city} ${pointA.address ? `<br><small>${pointA.address}</small>` : ''}`);
    markerARef.current = markerA;

    if (!readOnly) {
      markerA.on('dragend', async (e) => {
        const pos = e.target.getLatLng();
        const geo = await locationService.reverseGeocode(pos.lat, pos.lng);
        setPointA({
          city: geo.city,
          district: geo.district,
          address: geo.address,
          lat: Number(pos.lat.toFixed(6)),
          lng: Number(pos.lng.toFixed(6))
        });
      });
    }

    // Marker B (1-Tushirish)
    const bColor = pointC ? '#F59E0B' : '#E11D48';
    const markerB = L.marker([pointB.lat, pointB.lng], {
      icon: createCustomIcon('B', bColor),
      draggable: !readOnly
    }).addTo(map);
    markerB.bindTooltip(`<b>${pointC ? '2. 1-Tushirish joyi (B)' : '2. Yetkazish manzili (B)'}:</b> ${pointB.city} ${pointB.address ? `<br><small>${pointB.address}</small>` : ''}`);
    markerBRef.current = markerB;

    if (!readOnly) {
      markerB.on('dragend', async (e) => {
        const pos = e.target.getLatLng();
        const geo = await locationService.reverseGeocode(pos.lat, pos.lng);
        setPointB({
          city: geo.city,
          district: geo.district,
          address: geo.address,
          lat: Number(pos.lat.toFixed(6)),
          lng: Number(pos.lng.toFixed(6))
        });
      });
    }

    // Marker C (2-Tushirish agar mavjud bo'lsa)
    if (pointC) {
      const markerC = L.marker([pointC.lat, pointC.lng], {
        icon: createCustomIcon('C', '#E11D48'),
        draggable: !readOnly
      }).addTo(map);
      markerC.bindTooltip(`<b>3. Yakuniy tushirish joyi (C):</b> ${pointC.city} ${pointC.address ? `<br><small>${pointC.address}</small>` : ''}`);
      markerCRef.current = markerC;

      if (!readOnly) {
        markerC.on('dragend', async (e) => {
          const pos = e.target.getLatLng();
          const geo = await locationService.reverseGeocode(pos.lat, pos.lng);
          setPointC({
            city: geo.city,
            district: geo.district,
            address: geo.address,
            lat: Number(pos.lat.toFixed(6)),
            lng: Number(pos.lng.toFixed(6))
          });
        });
      }
    }

    let isCancelled = false;
    const fetchRouteData = async () => {
      const stops = pointC ? [pointA, pointB, pointC] : [pointA, pointB];
      const route = await getMultiPointRoute(stops);
      if (isCancelled) return;

      setRouteInfo(route);

      if (route.coordinates.length > 0 && mapInstanceRef.current) {
        if (polylineRef.current) mapInstanceRef.current.removeLayer(polylineRef.current);

        const polyline = L.polyline(route.coordinates, {
          color: '#0D9488',
          weight: 4.5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstanceRef.current);
        polylineRef.current = polyline;

        const bounds = L.latLngBounds(route.coordinates);
        mapInstanceRef.current.fitBounds(bounds, { padding: [35, 35] });
      }

      if (onPointsSelected) {
        onPointsSelected(pointA, pointB, pointC, route);
      }
    };

    fetchRouteData();

    return () => {
      isCancelled = true;
    };
  }, [pointA.lat, pointA.lng, pointB.lat, pointB.lng, pointC?.lat, pointC?.lng, readOnly]);

  const handleQuickGps = async () => {
    setIsLocatingGps(true);
    setGpsStatusText('Joylashuv aniqlanmoqda...');
    try {
      const res = await locationService.getCurrentLocation();
      if (activeSelectMode === 'A') {
        setPointA(res.point);
      } else if (activeSelectMode === 'B') {
        setPointB(res.point);
      } else if (activeSelectMode === 'C' && pointC) {
        setPointC(res.point);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([res.point.lat, res.point.lng], 14, { animate: true });
      }

      setGpsStatusText(`Aniqlandi: ${res.point.city}`);
      setTimeout(() => setGpsStatusText(null), 4000);
    } catch {
      setGpsStatusText("GPS aniqlab bo'lmadi");
      setTimeout(() => setGpsStatusText(null), 3500);
    } finally {
      setIsLocatingGps(false);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/85 shadow-lg bg-white/80 backdrop-blur-xl">
      {/* Route Summary Floating Glass Badge */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between gap-1.5 p-2.5 rounded-2xl bg-white/88 backdrop-blur-2xl border border-white/90 shadow-md text-xs">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
          <span className="font-extrabold text-slate-800 truncate">{pointA.city}</span>
          <span className="text-teal-600 font-extrabold">➔</span>
          <span className="font-extrabold text-slate-800 truncate">{pointB.city}</span>
          {pointC && (
            <>
              <span className="text-rose-600 font-extrabold">➔</span>
              <span className="font-extrabold text-slate-800 truncate">{pointC.city}</span>
            </>
          )}
        </div>

        {routeInfo && (
          <div className="flex items-center gap-1 shrink-0 font-extrabold text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-800 border border-teal-200/60">
              {routeInfo.distanceKm} km
            </span>
            <span className="text-slate-500 font-medium">
              {formatDurationUz(routeInfo.durationMinutes)}
            </span>
          </div>
        )}
      </div>

      {/* Address Resolution Loading Toast */}
      {isResolvingAddress && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold flex items-center gap-1.5 border border-slate-200/90 shadow-md">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
          <span>Manzil aniqlanmoqda...</span>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-60 xs:h-72 z-0 bg-slate-100" />

      {/* Mode selection buttons on bottom of map */}
      {!readOnly && (
        <div className="p-3 bg-white/85 backdrop-blur-xl border-t border-white/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSelectMode('A')}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all ${
                activeSelectMode === 'A'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white/80 border border-slate-200/80 text-slate-600 hover:bg-white'
              }`}
            >
              Nuqta A (Yuklash)
            </button>
            <button
              type="button"
              onClick={() => setActiveSelectMode('B')}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all ${
                activeSelectMode === 'B'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/80 border border-slate-200/80 text-slate-600 hover:bg-white'
              }`}
            >
              Nuqta B (Tushirish)
            </button>
            {pointC && (
              <button
                type="button"
                onClick={() => setActiveSelectMode('C')}
                className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all ${
                  activeSelectMode === 'C'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white/80 border border-slate-200/80 text-slate-600 hover:bg-white'
                }`}
              >
                Nuqta C (2-tushirish)
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickGps}
            disabled={isLocatingGps}
            className="px-3 py-1.5 rounded-2xl bg-teal-500/15 text-teal-900 border border-teal-200/80 font-black text-xs flex items-center gap-1.5 hover:bg-teal-500/25 active:scale-95 transition-all shrink-0"
          >
            {isLocatingGps ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-teal-700" />
            )}
            <span>{gpsStatusText || 'Mening GPS joylashuvim'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
