import React, { useState } from 'react';
import { TransportType, LocationPoint, RouteGeometry, CarrierTripAd, Vehicle } from '../types';
import { UZBEKISTAN_CITIES } from '../data/uzbekistanLocations';
import { MapPicker } from '../components/MapPicker';
import { formatMoneyUz, getRoute } from '../services/routingService';
import { locationService } from '../services/locationService';
import { 
  X, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Weight, 
  Box, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Crosshair, 
  Loader2, 
  Navigation,
  Layers,
  Users,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
  onSubmit: (tripData: Omit<CarrierTripAd, 'id' | 'createdAt' | 'status' | 'currentShippersCount'>) => void;
}

export const PostTripModal: React.FC<PostTripModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSubmit
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [model, setModel] = useState(vehicle?.model || 'Isuzu FVR 34');
  const [plateNumber, setPlateNumber] = useState(vehicle?.plateNumber || '01 777 AAA');
  const [transportType, setTransportType] = useState<TransportType>(vehicle?.transportType || 'Isuzu (Bortli)');
  
  const [totalCapacityTon, setTotalCapacityTon] = useState(vehicle?.capacityTon?.toString() || '10');
  const [availableCapacityTon, setAvailableCapacityTon] = useState('6.5');
  const [totalVolumeM3, setTotalVolumeM3] = useState(vehicle?.volumeM3?.toString() || '36');
  const [availableVolumeM3, setAvailableVolumeM3] = useState('22');

  const [isConsolidated, setIsConsolidated] = useState(true);
  const [maxShippersCount, setMaxShippersCount] = useState(5);

  const [pointA, setPointA] = useState<LocationPoint>(vehicle?.currentLocation || UZBEKISTAN_CITIES[0]);
  const [pointB, setPointB] = useState<LocationPoint>(UZBEKISTAN_CITIES[3]); // Samarqand

  const [departureDate, setDepartureDate] = useState(todayStr);
  const [departureTimeWindow, setDepartureTimeWindow] = useState('08:00 - 11:00 oralig\'ida');
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [deliveryTimeWindow, setDeliveryTimeWindow] = useState('18:00 gacha yetkazish');

  const [pricePerTonUzs, setPricePerTonUzs] = useState('350000');
  const [specialNotes, setSpecialNotes] = useState('');

  const [routeData, setRouteData] = useState<RouteGeometry>({
    coordinates: [],
    distanceKm: 315,
    durationMinutes: 280
  });

  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // GPS orqali haydovchi joylashuvini aniqlash
  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    setErrorMsg('');
    try {
      const res = await locationService.getCurrentLocation();
      setPointA(res.point);
      if (res.isGps) {
        setGpsSuccessMessage(`Aniqlandi: ${res.point.city} (${res.point.district}) ±${res.accuracyMeters}m`);
      } else if (res.message) {
        setGpsSuccessMessage(res.message);
      } else {
        setGpsSuccessMessage(`Belgilandi: ${res.point.city}`);
      }
      const newRoute = await getRoute(res.point, pointB);
      setRouteData(newRoute);
      setTimeout(() => setGpsSuccessMessage(''), 8000);
    } catch {
      setErrorMsg("Joylashuvni aniqlab bo'lmadi. Telefon sozlamalarida 'Joylashuv' (GPS) yoqilganligini tekshiring.");
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totCap = parseFloat(totalCapacityTon) || 10;
    const availCap = parseFloat(availableCapacityTon) || 5;

    if (availCap > totCap) {
      setErrorMsg("Mavjud bo'sh joy umumiy sig'imdan katta bo'lishi mumkin emas!");
      return;
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onSubmit({
      driverId: vehicle?.driverId || 'drv-current',
      driverName: 'Akmal Rustamov',
      driverPhone: '+998912345678',
      driverTelegram: 'akmal_trans',
      driverRating: 4.95,
      vehicleModel: model.trim(),
      vehiclePlate: plateNumber.trim(),
      transportType,
      totalCapacityTon: totCap,
      availableCapacityTon: availCap,
      totalVolumeM3: parseFloat(totalVolumeM3) || 30,
      availableVolumeM3: parseFloat(availableVolumeM3) || 15,
      departureLocation: pointA,
      destinationLocation: pointB,
      departureDate,
      departureTimeWindow,
      deliveryDate,
      deliveryTimeWindow,
      pricePerTonUzs: parseFloat(pricePerTonUzs) || 300000,
      isConsolidated,
      maxShippersCount: isConsolidated ? maxShippersCount : 1,
      specialNotes: specialNotes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-xl bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92dvh] overflow-y-auto shadow-2xl border border-white/85 animate-in slide-in-from-bottom duration-200">
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/60 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 xs:px-5 py-3 bg-white/80 backdrop-blur-2xl border-b border-white/80">
          <div className="flex items-center gap-2 xs:gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 hover:bg-white text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Orqaga"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Orqaga</span>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-800 flex items-center justify-center font-bold border border-teal-200/50">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Reys / Bo'sh transport e'lon qilish</h2>
              <p className="text-[10px] text-slate-500">Bo'sh joyingizga bir nechta kishidan yuk yig'ing</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 xs:p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Transport Ma'lumotlari */}
          <div className="p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/85 shadow-2xs space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-teal-600" />
              1. Transportingiz haqida
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Model:</span>
                <input
                  type="text"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="Isuzu, KamAZ, MAN..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Davlat raqami:</span>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value)}
                  placeholder="01 777 AAA"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. Bo'sh Joy va Yig'ma Yuk (Sborny / Consolidation) */}
          <div className="p-3.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-sky-500/10 backdrop-blur-xl rounded-2xl border border-teal-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-700" />
                2. Bo'sh Joy & Yig'ma Yuk (Bir nechta yuk olish)
              </label>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 border border-emerald-300/50">
                LTL Imkoniyati
              </span>
            </div>

            {/* Checkbox: Yig'ma yuk ruxsati */}
            <label className="flex items-start gap-2.5 p-2.5 bg-white/80 backdrop-blur-md rounded-xl border border-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={isConsolidated}
                onChange={e => setIsConsolidated(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5"
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block">
                  Bir nechta kishidan yuk qabul qilish (Yig'ma / Poputniy)
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Mashinangizda joy bor ekan, 2 tadan 5 kishigacha har xil odamlarning yukini birga olib ketishingiz mumkin.
                </span>
              </div>
            </label>

            {/* Capacity Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white/70 backdrop-blur-md rounded-xl border border-white/80">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <Weight className="w-3 h-3 text-teal-600" /> Mavjud bo'sh vazn:
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    step="0.1"
                    value={availableCapacityTon}
                    onChange={e => setAvailableCapacityTon(e.target.value)}
                    className="w-20 px-2 py-1 rounded-lg border border-slate-300 text-xs font-black text-teal-700 bg-white"
                  />
                  <span className="text-xs font-bold text-slate-700">/ {totalCapacityTon} tonna</span>
                </div>
              </div>

              <div className="p-2.5 bg-white/70 backdrop-blur-md rounded-xl border border-white/80">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <Box className="w-3 h-3 text-sky-600" /> Mavjud bo'sh hajm:
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    step="1"
                    value={availableVolumeM3}
                    onChange={e => setAvailableVolumeM3(e.target.value)}
                    className="w-20 px-2 py-1 rounded-lg border border-slate-300 text-xs font-black text-sky-700 bg-white"
                  />
                  <span className="text-xs font-bold text-slate-700">/ {totalVolumeM3} m³</span>
                </div>
              </div>
            </div>

            {/* Max shippers counter */}
            {isConsolidated && (
              <div className="flex items-center justify-between p-2.5 bg-white/70 backdrop-blur-md rounded-xl border border-white/80">
                <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  Maksimal nechta kishidan yuk olasiz?
                </span>
                <div className="flex items-center gap-1">
                  {[2, 3, 4, 5, 8].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMaxShippersCount(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        maxShippersCount === num
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Marshrut va GPS Joylashuv */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                3. Jo'nash va Yetkazish shahri
              </label>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                GPS + Xarita
              </span>
            </div>

            {/* GPS Indicator bar */}
            <div className="p-3 bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-teal-200/80 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
                    <span>Mening hozirgi joylashuvim</span>
                    {gpsSuccessMessage && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 truncate font-medium">
                    {gpsSuccessMessage || `Jo'nash: ${pointA.city}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="px-3.5 py-2 rounded-full bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-xs transition-all shrink-0 disabled:opacity-60"
              >
                {isDetectingGps ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Aniqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Joylashuvni aniqlash</span>
                  </>
                )}
              </button>
            </div>

            <MapPicker
              initialPointA={pointA}
              initialPointB={pointB}
              onPointsSelected={(a, b, _c, route) => {
                setPointA(a);
                setPointB(b);
                setRouteData(route);
              }}
            />
          </div>

          {/* 4. Qaysi paytdan qaysi paytgacha yetkaziladi (Vaqt Oralig'i) */}
          <div className="p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/85 shadow-2xs space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              4. Reys Vaqt Oralig'i (Qachondan qachongacha)
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Jo'nash sanasi & vaqti:</span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={e => setDepartureDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  required
                />
                <select
                  value={departureTimeWindow}
                  onChange={e => setDepartureTimeWindow(e.target.value)}
                  className="w-full mt-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                >
                  <option value="08:00 - 11:00 oralig'ida">08:00 - 11:00 oralig'ida</option>
                  <option value="12:00 - 15:00 oralig'ida">12:00 - 15:00 oralig'ida</option>
                  <option value="16:00 - 19:00 oralig'ida">16:00 - 19:00 oralig'ida</option>
                  <option value="Kechasi (21:00 dan keyin)">Kechasi (21:00 dan keyin)</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Yetkazish sanasi & vaqti:</span>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  required
                />
                <select
                  value={deliveryTimeWindow}
                  onChange={e => setDeliveryTimeWindow(e.target.value)}
                  className="w-full mt-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                >
                  <option value="18:00 gacha yetkazish">18:00 gacha yetkazish</option>
                  <option value="Ertasi kuni 12:00 gacha">Ertasi kuni 12:00 gacha</option>
                  <option value="24 soat ichida">24 soat ichida</option>
                  <option value="Aniq kelishilgan vaqtda">Aniq kelishilgan vaqtda</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Narx va Izoh */}
          <div className="p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/85 shadow-2xs space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              5. 1 Tonna uchun narx (yoki butun bo'sh joy)
            </label>
            <div className="relative">
              <input
                type="number"
                step="50000"
                value={pricePerTonUzs}
                onChange={e => setPricePerTonUzs(e.target.value)}
                placeholder="350,000"
                className="w-full pl-4 pr-16 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">
                UZS/t
              </span>
            </div>

            <input
              type="text"
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              placeholder="Qo'shimcha izoh (Masalan: Toshkent Sergeli bozoridan chiqaman, yo'l-yo'lakay yuk olaman)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-5 rounded-full bg-teal-700 hover:bg-teal-800 active:scale-98 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Reys va Bo'sh Joyni E'lon Qilish</span>
          </button>
        </form>
      </div>
    </div>
  );
};
