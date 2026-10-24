import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Share2, Navigation, ShieldCheck } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { TruckIllustration } from '../components/TruckIllustration';
import { BookingItem } from '../types';
import L from 'leaflet';

interface TrackingScreenProps {
  onBack: () => void;
  booking: BookingItem;
  onViewDriver: () => void;
  langText: {
    trackShipment: string;
    inTransit: string;
    loading: string;
    delivered: string;
  };
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  onBack,
  booking,
  onViewDriver,
  langText
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Tashkent -> Samarkand road coordinates
  const tashkentCoords: [number, number] = [41.2995, 69.2401];
  const samarkandCoords: [number, number] = [39.6542, 66.9597];
  // Current truck location along M39 highway (near Jizzakh)
  const truckCoords: [number, number] = [40.1158, 67.8422];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered between Tashkent and Samarkand
      const map = L.map(mapContainerRef.current, {
        center: [40.48, 68.10],
        zoom: 7,
        zoomControl: false
      });

      // Standard OSM Tile Layer with zero API keys / zero watermarks
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Route Polyline along M39
      const routePoints: [number, number][] = [
        tashkentCoords,
        [41.11, 68.99], // Yangiyul
        [40.85, 68.66], // Chinaz
        [40.49, 68.78], // Guliston / Syrdarya
        [40.12, 67.84], // Jizzakh
        [39.95, 67.45], // Bulungur
        samarkandCoords
      ];

      // Route shadow glow polyline
      L.polyline(routePoints, {
        color: '#93C5FD',
        weight: 9,
        opacity: 0.5,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Inner vibrant blue polyline
      L.polyline(routePoints, {
        color: '#0B63F6',
        weight: 4.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Start City Marker (Tashkent)
      const startIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: #0B63F6; color: white; border-radius: 9999px; padding: 4px 10px; font-weight: 700; font-size: 11px; box-shadow: 0 4px 8px rgba(11,99,246,0.3); display: flex; align-items: center; gap: 5px; border: 2px solid white; white-space: nowrap;">
            <span style="width: 7px; height: 7px; background-color: white; border-radius: 50%;"></span>
            Tashkent
          </div>
        `,
        iconSize: [86, 26],
        iconAnchor: [43, 13]
      });
      L.marker(tashkentCoords, { icon: startIcon }).addTo(map);

      // Destination City Marker (Samarkand)
      const destIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: #FF7A00; color: white; border-radius: 9999px; padding: 4px 10px; font-weight: 700; font-size: 11px; box-shadow: 0 4px 8px rgba(255,122,0,0.3); display: flex; align-items: center; gap: 5px; border: 2px solid white; white-space: nowrap;">
            <span style="width: 7px; height: 7px; background-color: white; border-radius: 50%;"></span>
            Samarkand
          </div>
        `,
        iconSize: [96, 26],
        iconAnchor: [48, 13]
      });
      L.marker(samarkandCoords, { icon: destIcon }).addTo(map);

      // Truck Marker with pulsing radar ring
      const truckIcon = L.divIcon({
        className: 'truck-marker',
        html: `
          <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background-color: rgba(11, 99, 246, 0.3); animation: radar-pulse 2s infinite;"></div>
            <div style="position: relative; width: 36px; height: 36px; background-color: #0B63F6; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(11, 99, 246, 0.5); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      L.marker(truckCoords, { icon: truckIcon }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup if needed
    };
  }, []);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(truckCoords, 8, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-hidden bg-slate-100 text-slate-800">
      {/* Top Floating Header & Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <StatusBar darkText={true} />
        <div className="px-6 py-2 flex items-center justify-between pointer-events-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          </button>
          
          <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md border border-slate-100/60">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              {langText.trackShipment}
            </h1>
          </div>

          <button className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-slate-800 hover:bg-white transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recenter Button */}
      <div className="absolute right-5 top-20 z-20">
        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center hover:bg-blue-50 hover:text-[#0B63F6] active:scale-95 transition-all"
          title="Recenter to Truck"
        >
          <Navigation className="w-4 h-4 rotate-45" />
        </button>
      </div>

      {/* Fullscreen Interactive Leaflet Map */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-10 flex-1" />

      {/* Floating Bottom Card / Sheet */}
      <div className="relative z-20 -mt-6 bg-white rounded-t-3xl px-6 pt-4 pb-6 shadow-2xl border-t border-slate-100">
        {/* Drag handle pill */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

        {/* Top Status & ETA row */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-600 text-sm tracking-wide">
              {langText.inTransit}
            </span>
          </div>
          
          <div className="text-sm font-extrabold text-slate-900">
            ETA <span className="text-[#0B63F6]">{booking.eta || '2h 45m'}</span>
          </div>
        </div>

        {/* Truck & Driver Info Row */}
        <div
          onClick={onViewDriver}
          className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-10 bg-blue-50 rounded-lg flex items-center justify-center p-1">
              <TruckIllustration type="small" className="w-10 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  {booking.truckPlate || 'AB 1234 AA'}
                </span>
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs text-slate-400 block font-medium">
                {booking.truckType || 'Volvo FH'}
              </span>
            </div>
          </div>

          {/* Quick Call Button */}
          <a
            href="tel:+998901234567"
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-full bg-blue-50 text-[#0B63F6] flex items-center justify-center hover:bg-blue-100 active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* 3-Step Progress Timeline */}
        <div className="pt-2">
          <div className="relative flex items-center justify-between">
            {/* Step 1: Loading */}
            <div className="flex flex-col items-center z-10">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-1">
                {langText.loading}
              </span>
            </div>

            {/* Connecting Line 1 */}
            <div className="flex-1 h-0.5 bg-blue-600 -mt-4 mx-1" />

            {/* Step 2: In Transit (Active) */}
            <div className="flex flex-col items-center z-10">
              <div className="w-5 h-5 rounded-full bg-[#0B63F6] text-white flex items-center justify-center ring-4 ring-blue-100 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              <span className="text-[11px] font-bold text-[#0B63F6] mt-1">
                {langText.inTransit}
              </span>
            </div>

            {/* Connecting Line 2 */}
            <div className="flex-1 h-0.5 bg-slate-200 -mt-4 mx-1" />

            {/* Step 3: Delivered */}
            <div className="flex flex-col items-center z-10">
              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1">
                {langText.delivered}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
