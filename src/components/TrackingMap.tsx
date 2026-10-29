import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Order } from '../types';
import { getRoute, getMultiPointRoute, formatDurationUz } from '../services/routingService';
import { Truck, Navigation, ShieldCheck, Activity } from 'lucide-react';

interface TrackingMapProps {
  order: Order;
  isCarrierView?: boolean;
  onUpdateLocation?: (lat: number, lng: number, speedKmH: number) => void;
  onToggleGps?: (enabled: boolean) => void;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  order,
  isCarrierView = false,
  onUpdateLocation,
  onToggleGps
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(order.driverCurrentLocation.speedKmH || 68);
  const [gpsActive, setGpsActive] = useState(order.carrierGpsEnabled);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [mapUnlocked, setMapUnlocked] = useState(false);

  const createPinIcon = (label: string, color: string) => {
    return L.divIcon({
      className: 'custom-pin-marker',
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
          <span style="transform: rotate(45deg); font-weight: 800; font-size: 13px;">${label}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  };

  const createTruckIcon = () => {
    return L.divIcon({
      className: 'custom-truck-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px;">
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: rgba(13, 148, 136, 0.3);
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            width: 44px;
            height: 44px;
            background: #0D9488;
            border-radius: 50%;
            border: 3px solid #FFFFFF;
            box-shadow: 0 8px 20px rgba(13, 148, 136, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [order.pickupLocation.lat, order.pickupLocation.lng],
      zoom: 8,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    const stops = order.stops && order.stops.length >= 2 
      ? order.stops 
      : [order.pickupLocation, order.deliveryLocation];

    const pinColors = ['#0D9488', '#F59E0B', '#E11D48'];
    const pinLabels = ['A', 'B', 'C', 'D'];

    stops.forEach((stop, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === stops.length - 1;
      const label = pinLabels[idx] || `${idx + 1}`;
      const color = isFirst ? '#0D9488' : isLast ? '#E11D48' : '#F59E0B';
      const roleText = isFirst ? '1. Yuk ortish joyi' : isLast ? `${idx + 1}. Yakuniy manzil` : `${idx + 1}. Oraliq manzil`;

      const m = L.marker([stop.lat, stop.lng], {
        icon: createPinIcon(label, color)
      }).addTo(map);
      m.bindTooltip(`<b>${roleText}:</b><br/>${stop.city} (${stop.address})`);
    });

    const truckMarker = L.marker(
      [order.driverCurrentLocation.lat, order.driverCurrentLocation.lng],
      { icon: createTruckIcon() }
    ).addTo(map);
    truckMarker.bindTooltip(`<b>${order.driverName}</b><br/>${order.vehicleModel}`);
    truckMarkerRef.current = truckMarker;

    getMultiPointRoute(stops).then(route => {
      if (route.coordinates.length > 0) {
        setRouteCoordinates(route.coordinates);
        const polyline = L.polyline(route.coordinates, {
          color: '#0284C7',
          weight: 5,
          opacity: 0.85
        }).addTo(map);
        polylineRef.current = polyline;

        const allLatLngs: [number, number][] = stops.map(s => [s.lat, s.lng] as [number, number]);
        allLatLngs.push([order.driverCurrentLocation.lat, order.driverCurrentLocation.lng]);
        const bounds = L.latLngBounds(allLatLngs);
        map.fitBounds(bounds, { padding: [35, 35] });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (order.status !== 'yolda' || !gpsActive || routeCoordinates.length === 0) return;

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % routeCoordinates.length;
      const [lat, lng] = routeCoordinates[step];

      if (truckMarkerRef.current) {
        truckMarkerRef.current.setLatLng([lat, lng]);
      }

      const randomSpeed = Math.floor(62 + Math.random() * 12);
      setCurrentSpeed(randomSpeed);

      if (onUpdateLocation) {
        onUpdateLocation(lat, lng, randomSpeed);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [order.status, gpsActive, routeCoordinates]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (mapUnlocked) {
      map.dragging.enable();
      map.touchZoom.enable();
    } else {
      map.dragging.disable();
      map.touchZoom.disable();
    }
  }, [mapUnlocked]);

  const handleToggleGps = () => {
    const nextState = !gpsActive;
    setGpsActive(nextState);
    if (onToggleGps) {
      onToggleGps(nextState);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-white">
      {/* Real-time Status Floating Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between gap-2 bg-white/95 p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 truncate">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-[11px] font-black text-slate-900 truncate">
              {order.vehicleModel}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {order.driverName}
            </div>
          </div>
        </div>

        {/* GPS Status & Speed */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full font-bold text-[10px] text-slate-700">
            <Activity className="w-3 h-3 text-teal-600" />
            <span>{currentSpeed} km/h</span>
          </div>

          <button
            type="button"
            onClick={handleToggleGps}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] transition-colors shadow-2xs ${
              gpsActive 
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 border border-slate-200 text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{gpsActive ? 'GPS faol' : 'O\'chiq'}</span>
          </button>
        </div>
      </div>

      {/* Map element */}
      <div ref={mapContainerRef} className="w-full h-72 sm:h-80 z-0 bg-slate-100" />

      {/* Floating map unlock button */}
      <button
        type="button"
        onClick={() => setMapUnlocked(!mapUnlocked)}
        className="absolute bottom-14 right-2.5 z-[1000] px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-slate-700 text-[10px] font-bold shadow-md hover:bg-white"
      >
        {mapUnlocked ? '🔒 Xaritani qulflash' : '🖐️ Xaritani surish'}
      </button>

      {/* Footer */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
          <Navigation className="w-3 h-3 text-teal-600" />
          <span>Masofa: <strong className="text-slate-800">{order.distanceKm} km</strong></span>
        </div>
        <div className="text-[11px] text-slate-600">
          Vaqt: <strong className="text-teal-700">{formatDurationUz(order.durationMinutes)}</strong>
        </div>
      </div>
    </div>
  );
};
