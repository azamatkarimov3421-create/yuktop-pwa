import React, { useState } from 'react';
import { Vehicle, TransportType, LocationPoint } from '../types';
import { UZBEKISTAN_CITIES } from '../data/uzbekistanLocations';
import { 
  X, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Check,
  ArrowLeft
} from 'lucide-react';

interface CarrierVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onSave: (data: Partial<Vehicle>) => void;
}

export const CarrierVehicleModal: React.FC<CarrierVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSave
}) => {
  if (!isOpen) return null;

  const [transportType, setTransportType] = useState<TransportType>(vehicle.transportType);
  const [model, setModel] = useState(vehicle.model);
  const [plateNumber, setPlateNumber] = useState(vehicle.plateNumber);
  const [capacityTon, setCapacityTon] = useState(vehicle.capacityTon.toString());
  const [volumeM3, setVolumeM3] = useState(vehicle.volumeM3.toString());
  const [selectedCityName, setSelectedCityName] = useState(vehicle.currentLocation.city);
  const [destinationRoute, setDestinationRoute] = useState(vehicle.destinationRoute);
  const [gpsTrackingEnabled, setGpsTrackingEnabled] = useState(vehicle.gpsTrackingEnabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cityObj = UZBEKISTAN_CITIES.find(c => c.city === selectedCityName) || vehicle.currentLocation;

    onSave({
      transportType,
      model: model.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      capacityTon: parseFloat(capacityTon) || 20,
      volumeM3: parseFloat(volumeM3) || 80,
      currentLocation: cityObj,
      destinationRoute: destinationRoute.trim(),
      gpsTrackingEnabled
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-y-auto shadow-2xl border border-white/85 animate-in slide-in-from-bottom duration-200">
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/60 rounded-full" />
        </div>

        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/80 backdrop-blur-2xl border-b border-white/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 hover:bg-white text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Orqaga qaytish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-800 flex items-center justify-center font-bold border border-teal-200/60">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Transport Sozlamalari</h2>
              <p className="text-[10px] text-slate-500">Mos yuklarni saralash parametrlari</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <span className="text-slate-500 mb-1 block font-medium text-[11px]">Transport turi:</span>
            <select
              value={transportType}
              onChange={e => setTransportType(e.target.value as TransportType)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
            >
              <option value="Fura (Tentli)">Fura (Tentli)</option>
              <option value="Fura (Refrijerator)">Fura (Refrijerator)</option>
              <option value="Isuzu (Bortli)">Isuzu (Bortli)</option>
              <option value="Isuzu (Budkali)">Isuzu (Budkali)</option>
              <option value="Gazel (Tentli)">Gazel (Tentli)</option>
              <option value="Gazel (Ochiq bort)">Gazel (Ochiq bort)</option>
              <option value="Samosval">Samosval</option>
              <option value="Konteyner tashuvchi">Konteyner tashuvchi</option>
              <option value="Evakuator">Evakuator</option>
              <option value="Kichik furgon (Labo/Damás)">Kichik furgon (Labo/Damás)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-slate-500 mb-1 block font-medium text-[11px]">Mashina modeli:</span>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="MAN TGX 18.440"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
                required
              />
            </div>
            <div>
              <span className="text-slate-500 mb-1 block font-medium text-[11px]">Davlat raqami:</span>
              <input
                type="text"
                value={plateNumber}
                onChange={e => setPlateNumber(e.target.value)}
                placeholder="01 A 777 AA"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-slate-500 mb-1 block font-medium text-[11px]">Yuk ko'tarish (Tonna):</span>
              <input
                type="number"
                step="0.5"
                value={capacityTon}
                onChange={e => setCapacityTon(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
                required
              />
            </div>
            <div>
              <span className="text-slate-500 mb-1 block font-medium text-[11px]">Kuzov sig'imi (m³):</span>
              <input
                type="number"
                value={volumeM3}
                onChange={e => setVolumeM3(e.target.value)}
                placeholder="86"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
                required
              />
            </div>
          </div>

          <div>
            <span className="text-slate-500 mb-1 block font-medium text-[11px]">Hozirgi joylashuvingiz:</span>
            <select
              value={selectedCityName}
              onChange={e => setSelectedCityName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
            >
              {UZBEKISTAN_CITIES.map(c => (
                <option key={c.city + c.district} value={c.city}>
                  {c.city} - {c.district || c.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-slate-500 mb-1 block font-medium text-[11px]">Borish yo'nalishi (Marshrut):</span>
            <input
              type="text"
              value={destinationRoute}
              onChange={e => setDestinationRoute(e.target.value)}
              placeholder="Toshkent -> Samarqand -> Buxoro"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
              required
            />
          </div>

          {/* GPS Tracking Permission */}
          <div className="p-3.5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 flex items-center justify-between shadow-2xs">
            <div className="space-y-0.5 pr-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Jonli GPS kuzatuviga ruxsat</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Faol reys vaqtida yuk egasiga joylashuvingiz ko'rsatiladi.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={gpsTrackingEnabled}
                onChange={e => setGpsTrackingEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="pt-2 pb-1">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-800 hover:to-sky-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Saqlash va Yangilash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
