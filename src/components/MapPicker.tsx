import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPoint, RouteGeometry } from '../types';
import { UZBEKISTAN_CITIES } from '../data/uzbekistanLocations';
import { getRoute, getMultiPointRoute, formatDurationUz } from '../services/routingService';
import { locationService } from '../services/locationService';
import { Crosshair, Loader2 } from 'lucide-react';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    setPointC(initialPointC || null);
  }, [initialPointC?.lat, initialPointC?.lng, initialPointC?.city]);

  const createCustomIcon = (label: string, color: string) => {
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

  // Initialize Map ONCE
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
        } else if (activeSelectModeRef.current === 'B') {
          setPointB(newPoint);
        } else if (activeSelectModeRef.current === 'C') {
          setPointC(newPoint);
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
    markerA.bindTooltip(`<b>1. Yuklash joyi (A):</b> ${pointA.city}`);
    markerARef.current = markerA;

    if (!readOnly) {
      markerA.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setPointA(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
      });
    }

    // Marker B (1-Tushirish)
    const bColor = pointC ? '#F59E0B' : '#E11D48';
    const markerB = L.marker([pointB.lat, pointB.lng], {
      icon: createCustomIcon('B', bColor),
      draggable: !readOnly
    }).addTo(map);
    markerB.bindTooltip(`<b>${pointC ? '2. 1-Tushirish joyi (B)' : '2. Yetkazish manzili (B)'}:</b> ${pointB.city}`);
    markerBRef.current = markerB;

    if (!readOnly) {
      markerB.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setPointB(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
      });
    }

    // Marker C (2-Tushirish agar mavjud bo'lsa)
    if (pointC) {
      const markerC = L.marker([pointC.lat, pointC.lng], {
        icon: createCustomIcon('C', '#E11D48'),
        draggable: !readOnly
      }).addTo(map);
      markerC.bindTooltip(`<b>3. Yakuniy tushirish joyi (C):</b> ${pointC.city}`);
      markerCRef.current = markerC;

      if (!readOnly) {
        markerC.on('dragend', (e) => {
          const pos = e.target.getLatLng();
          setPointC(prev => prev ? ({ ...prev, lat: pos.lat, lng: pos.lng }) : null);
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
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstanceRef.current);
        polylineRef.current = polyline;

        const bounds = L.latLngBounds(route.coordinates);
        mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
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
      setGpsStatusText(`Aniqlandi: ${res.point.city}`);
      setTimeout(() => setGpsStatusText(null), 3000);
    } catch {
      setGpsStatusText("GPS aniqlab bo'lmadi");
      setTimeout(() => setGpsStatusText(null), 3000);
    } finally {
      setIsLocatingGps(false);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white">
      {/* Route Summary Floating Badge */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between gap-1.5 p-2 rounded-xl bg-white/95 border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
          <span className="font-bold text-slate-800 truncate">{pointA.city}</span>
          <span className="text-teal-600 font-extrabold">➔</span>
          <span className="font-bold text-slate-800 truncate">{pointB.city}</span>
          {pointC && (
            <>
              <span className="text-amber-600 font-extrabold">➔</span>
              <span className="font-bold text-slate-800 truncate">{pointC.city}</span>
            </>
          )}
        </div>

        {routeInfo && (
          <div className="flex items-center gap-1 shrink-0 font-bold text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
              {routeInfo.distanceKm} km
            </span>
            <span className="text-slate-400 font-normal">
              {formatDurationUz(routeInfo.durationMinutes)}
            </span>
          </div>
        )}
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-56 xs:h-64 z-0 bg-slate-100" />

      {/* Mode selection buttons on bottom of map */}
      {!readOnly && (
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSelectMode('A')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeSelectMode === 'A'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nuqta A (Yuklash)
            </button>
            <button
              type="button"
              onClick={() => setActiveSelectMode('B')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeSelectMode === 'B'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nuqta B (Tushirish)
            </button>
            {pointC && (
              <button
                type="button"
                onClick={() => setActiveSelectMode('C')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeSelectMode === 'C'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1 hover:bg-teal-100"
          >
            {isLocatingGps ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5" />
            )}
            <span>{gpsStatusText || 'GPS'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
