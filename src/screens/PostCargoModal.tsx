import React, { useState, useEffect } from 'react';
import { CargoCategory, LocationPoint, RouteGeometry, PaymentMethod, UrgencyLevel } from '../types';
import { UZBEKISTAN_CITIES, CARGO_PRESET_IMAGES } from '../data/uzbekistanLocations';
import { MapPicker } from '../components/MapPicker';
import { calculateRecommendedPrice, formatMoneyUz, getRoute, getMultiPointRoute } from '../services/routingService';
import { locationService } from '../services/locationService';
import { 
  X, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Weight, 
  Box, 
  Camera, 
  Image as ImageIcon,
  Check, 
  AlertCircle,
  Sparkles,
  Zap,
  CreditCard,
  FileText,
  ArrowLeft,
  Crosshair,
  Loader2,
  Navigation,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostCargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cargoData: {
    title: string;
    category: CargoCategory;
    loadType: import('../types').LoadType;
    imageUrl: string;
    weightKg: number;
    volumeM3: number;
    pickupLocation: LocationPoint;
    deliveryLocation: LocationPoint;
    stops?: LocationPoint[];
    pickupDate: string;
    pickupTimeWindow: string;
    deliveryDate: string;
    deliveryTimeWindow: string;
    priceUzs: number;
    paymentMethod: PaymentMethod;
    urgency: UrgencyLevel;
    hasDocuments: boolean;
    distanceKm: number;
    durationMinutes: number;
    specialNotes: string;
  }) => void;
}

export const PostCargoModal: React.FC<PostCargoModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CargoCategory>('Qurilish mollari');
  const [loadType, setLoadType] = useState<import('../types').LoadType>('yigma_yuk');
  const [selectedImage, setSelectedImage] = useState(CARGO_PRESET_IMAGES[0].url);
  const [weightTon, setWeightTon] = useState('3.5');
  const [volumeM3, setVolumeM3] = useState('14');
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTimeWindow, setPickupTimeWindow] = useState('08:00 - 12:00 (Ertalab)');
  const [deliveryDate, setDeliveryDate] = useState(tomorrowStr);
  const [deliveryTimeWindow, setDeliveryTimeWindow] = useState('18:00 gacha');
  const [priceUzs, setPriceUzs] = useState('2200000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Naqd pul');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Oddiy');
  const [hasDocuments, setHasDocuments] = useState(true);
  const [specialNotes, setSpecialNotes] = useState('');

  const [pointA, setPointA] = useState<LocationPoint>({
    ...UZBEKISTAN_CITIES[0],
    address: ''
  }); // Toshkent
  const [pointB, setPointB] = useState<LocationPoint>({
    ...UZBEKISTAN_CITIES[3],
    address: ''
  }); // Samarqand
  const [pointC, setPointC] = useState<LocationPoint | null>(null); // 3-manzil (Oraliq/yakuniy tushirish)
  const [routeData, setRouteData] = useState<RouteGeometry>({
    coordinates: [],
    distanceKm: 315,
    durationMinutes: 280
  });

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState('');

  // Foydalanuvchining haqiqiy GPS joylashuvini aniqlash va yuklash nuqtasi (A) qilib belgilash
  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    setErrorMsg('');
    try {
      const res = await locationService.getCurrentLocation();
      setPointA(res.point);
      if (res.isGps) {
        setGpsSuccessMessage(`Aniqlandi: ${res.point.address || res.point.city} (±${res.accuracyMeters}m)`);
      } else if (res.message) {
        setGpsSuccessMessage(res.message);
      } else {
        setGpsSuccessMessage(`Belgilandi: ${res.point.city}`);
      }
      const points = pointC ? [res.point, pointB, pointC] : [res.point, pointB];
      const newRoute = await getMultiPointRoute(points);
      setRouteData(newRoute);
      setTimeout(() => setGpsSuccessMessage(''), 8000);
    } catch {
      setErrorMsg("Joylashuvni aniqlab bo'lmadi. Telefon sozlamalarida 'Joylashuv' (GPS) yoqilganligini tekshiring.");
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Modal ochilganda avtomatik haqiqiy joylashuvni aniqlash
  useEffect(() => {
    if (isOpen && !pointA.address) {
      handleDetectGps().catch(() => {});
    }
  }, [isOpen]);

  // Calculate smart market rates dynamically
  const weightVal = parseFloat(weightTon) || 5;
  const rates = calculateRecommendedPrice(routeData.distanceKm, weightVal * 1000, category);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowImagePicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Iltimos, yuk nomini kiriting');
      return;
    }
    const weight = parseFloat(weightTon);
    if (isNaN(weight) || weight <= 0) {
      setErrorMsg('Og\'irlikni to\'g\'ri kiriting');
      return;
    }
    const price = parseFloat(priceUzs);
    if (isNaN(price) || price <= 0) {
      setErrorMsg('Narxni to\'g\'ri kiriting');
      return;
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const stops: LocationPoint[] = pointC ? [pointA, pointB, pointC] : [pointA, pointB];

    onSubmit({
      title: title.trim(),
      category,
      loadType,
      imageUrl: selectedImage,
      weightKg: Math.round(weight * 1000),
      volumeM3: parseFloat(volumeM3) || 20,
      pickupLocation: pointA,
      deliveryLocation: pointC || pointB,
      stops,
      pickupDate,
      pickupTimeWindow,
      deliveryDate,
      deliveryTimeWindow,
      priceUzs: price,
      paymentMethod,
      urgency,
      hasDocuments,
      distanceKm: routeData.distanceKm,
      durationMinutes: routeData.durationMinutes,
      specialNotes: specialNotes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/25 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-xl bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92dvh] overflow-y-auto shadow-2xl border border-white/85 animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
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
              title="Orqaga qaytish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Orqaga</span>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-800 flex items-center justify-center font-bold border border-teal-200/50">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Yangi yuk e'lon qilish</h2>
              <p className="text-[10px] text-slate-500">Tashuvchilardan eng yaxshi takliflarni oling</p>
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

        {errorMsg && (
          <div className="mx-4 xs:mx-5 mt-3 p-3 rounded-2xl bg-rose-50/90 backdrop-blur-md border border-rose-200 flex items-center gap-2 text-rose-700 text-xs shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 xs:p-5 space-y-4 text-xs">
          {/* 1. Yuk nomi va turi */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              1. Yuk ma'lumotlari
            </label>
            <div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Yuk nomi (masalan: Qurilish qizil g'ishti, 5000 dona)"
                className="w-full px-4 py-3 rounded-2xl bg-white/65 backdrop-blur-md border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all placeholder:text-slate-400 shadow-2xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block font-medium">Toifasi:</span>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CargoCategory)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/65 backdrop-blur-md border border-slate-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-2xs"
                >
                  <option value="Qurilish mollari">Qurilish mollari</option>
                  <option value="Oziq-ovqat mahsulotlari">Oziq-ovqat mahsulotlari</option>
                  <option value="Meva va sabzavotlar">Meva va sabzavotlar</option>
                  <option value="Don va un mahsulotlari">Don va un mahsulotlari</option>
                  <option value="Mebel va jihozlar">Mebel va jihozlar</option>
                  <option value="Maishiy texnika">Maishiy texnika</option>
                  <option value="Kiyim va to'qimachilik">Kiyim va to'qimachilik</option>
                  <option value="Suyuqlik va sisterna">Suyuqlik va sisterna</option>
                  <option value="Xavfli yuk (ADR)">Xavfli yuk (ADR)</option>
                  <option value="Boshqa yuklar">Boshqa yuklar</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 mb-1 block font-medium">Yuk fotosurati:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="flex-1 px-3 py-2 rounded-2xl bg-white/65 backdrop-blur-md border border-slate-200/80 flex items-center justify-between gap-1.5 hover:bg-white transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <img src={selectedImage} alt="Yuk" className="w-5 h-5 rounded-lg object-cover" />
                      <span className="text-[11px] text-slate-700 font-semibold truncate">Tanlash</span>
                    </div>
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  <label className="p-2.5 rounded-2xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/80 cursor-pointer transition-colors shrink-0" title="Kameradan olish">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            {showImagePicker && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 animate-in fade-in">
                {CARGO_PRESET_IMAGES.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedImage(img.url);
                      setShowImagePicker(false);
                    }}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === img.url ? 'border-teal-600 ring-2 ring-teal-200' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-14 object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-white/85 backdrop-blur-xs text-slate-800 text-[8px] p-0.5 truncate text-center font-bold">
                      {img.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Parametrlari va Yuk Formati */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              2. Yuk turi, Og'irligi va Hajmi
            </label>

            {/* Load Type Selector: To'liq mashina vs Yig'ma / Poputniy */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLoadType('yigma_yuk')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  loadType === 'yigma_yuk'
                    ? 'bg-teal-500/15 border-teal-600 ring-2 ring-teal-200'
                    : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>📦 Yig'ma yuk (LTL)</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Tejamkor
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                  Boshqa yuklar bilan bitta mashinada (poputniy). Arzon narxda yetkaziladi.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLoadType('tolik_mashina')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  loadType === 'tolik_mashina'
                    ? 'bg-teal-500/15 border-teal-600 ring-2 ring-teal-200'
                    : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>🚚 To'liq mashina (FTL)</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Alohida
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                  Butun yuk mashinasi faqat sizning yukingiz uchun yollanadi.
                </p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block flex items-center gap-1 font-medium">
                  <Weight className="w-3 h-3 text-slate-400" /> Og'irligi (Tonna):
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={weightTon}
                  onChange={e => setWeightTon(e.target.value)}
                  placeholder="Masalan: 3.5"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 mb-1 block flex items-center gap-1 font-medium">
                  <Box className="w-3 h-3 text-slate-400" /> Hajmi (m³):
                </span>
                <input
                  type="number"
                  step="1"
                  value={volumeM3}
                  onChange={e => setVolumeM3(e.target.value)}
                  placeholder="Masalan: 14"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* 3. Xarita orqali A va B manzillarni belgilash */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                3. Marshrut va Lokatsiyani belgilash
              </label>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                GPS + Xarita
              </span>
            </div>

            {/* GPS Joylashuvni aniqlash tugmasi va indikatori */}
            <div className="p-3 bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-teal-200/80 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
                    <span>Mening GPS joylashuvim</span>
                    {gpsSuccessMessage && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 truncate font-medium">
                    {gpsSuccessMessage || `Hozirgi A nuqta: ${pointA.city}`}
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

            {/* Shaharlar va manzillarni aniq tanlash */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
              {/* Point A */}
              <div className="p-2.5 bg-white/70 border border-slate-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    A
                  </span>
                  <span className="text-[11px] font-bold text-slate-800">Yuklash manzili</span>
                </div>
                <select
                  value={pointA.city}
                  onChange={async (e) => {
                    const found = UZBEKISTAN_CITIES.find(c => c.city === e.target.value) || pointA;
                    setPointA(found);
                    const pts = pointC ? [found, pointB, pointC] : [found, pointB];
                    const r = await getMultiPointRoute(pts);
                    setRouteData(r);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {UZBEKISTAN_CITIES.map(c => (
                    <option key={c.city} value={c.city}>{c.city} ({c.district})</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={pointA.address}
                  onChange={(e) => setPointA({ ...pointA, address: e.target.value })}
                  placeholder="Ombor / Ko'cha / Mo'ljal"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              {/* Point B */}
              <div className="p-2.5 bg-white/70 border border-slate-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    B
                  </span>
                  <span className="text-[11px] font-bold text-slate-800">1-Tushirish manzili</span>
                </div>
                <select
                  value={pointB.city}
                  onChange={async (e) => {
                    const found = UZBEKISTAN_CITIES.find(c => c.city === e.target.value) || pointB;
                    setPointB(found);
                    const pts = pointC ? [pointA, found, pointC] : [pointA, found];
                    const r = await getMultiPointRoute(pts);
                    setRouteData(r);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {UZBEKISTAN_CITIES.map(c => (
                    <option key={c.city} value={c.city}>{c.city} ({c.district})</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={pointB.address}
                  onChange={(e) => setPointB({ ...pointB, address: e.target.value })}
                  placeholder="Ombor / Do'kon / Mo'ljal"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Point C (3-manzil) agar mavjud bo'lsa */}
            {pointC ? (
              <div className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      C
                    </span>
                    <span className="text-[11px] font-bold text-rose-950">
                      3-Manzil (Oraliq tushirish yoki 2-do'kon)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setPointC(null);
                      const r = await getRoute(pointA, pointB);
                      setRouteData(r);
                    }}
                    className="text-[10px] text-rose-700 hover:text-rose-900 font-extrabold px-2 py-0.5 rounded-full bg-white border border-rose-200 shadow-2xs transition-colors"
                  >
                    ✕ O'chirish
                  </button>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  <select
                    value={pointC.city}
                    onChange={async (e) => {
                      const found = UZBEKISTAN_CITIES.find(c => c.city === e.target.value) || pointC;
                      setPointC(found);
                      const pts = [pointA, pointB, found];
                      const r = await getMultiPointRoute(pts);
                      setRouteData(r);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {UZBEKISTAN_CITIES.map(c => (
                      <option key={c.city} value={c.city}>{c.city} ({c.district})</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={pointC.address}
                    onChange={(e) => setPointC({ ...pointC, address: e.target.value })}
                    placeholder="2-do'kon yoki oraliq punkt"
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-rose-200 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  const defaultC = UZBEKISTAN_CITIES[4]; // Buxoro
                  setPointC(defaultC);
                  const r = await getMultiPointRoute([pointA, pointB, defaultC]);
                  setRouteData(r);
                }}
                className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-teal-300 bg-teal-50/40 hover:bg-teal-50 text-teal-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.99]"
              >
                <Plus className="w-3.5 h-3.5 text-teal-600" />
                <span>+ 3-manzilni qo'shish (Oraliq tushirish yoki 2-do'kon)</span>
              </button>
            )}

            <MapPicker
              initialPointA={pointA}
              initialPointB={pointB}
              initialPointC={pointC}
              onPointsSelected={(a, b, c, route) => {
                setPointA(a);
                setPointB(b);
                setPointC(c);
                setRouteData(route);
              }}
            />
          </div>

          {/* 4. Zamonaviy Narx Kalkulyatori va To'lov */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              4. Aqlli Bozor Narxi va To'lov
            </label>

            {/* Recommended Market Rates Box */}
            <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-100 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-teal-900 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
                  Bozor tahlili bo'yicha tavsiya narxlar:
                </span>
                <span className="text-[10px] text-teal-700 font-medium">Bosing va to'ldiring</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPriceUzs(rates.economy.toString())}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    priceUzs === rates.economy.toString()
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-teal-400'
                  }`}
                >
                  <span className="block text-[9px] opacity-75 font-medium">Tejamkor</span>
                  <strong className="block text-[10px] xs:text-[11px] font-extrabold truncate">
                    {formatMoneyUz(rates.economy)}
                  </strong>
                </button>

                <button
                  type="button"
                  onClick={() => setPriceUzs(rates.standard.toString())}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    priceUzs === rates.standard.toString()
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-teal-400'
                  }`}
                >
                  <span className="block text-[9px] opacity-75 font-bold text-teal-700">★ Bozor narxi</span>
                  <strong className="block text-[10px] xs:text-[11px] font-extrabold truncate">
                    {formatMoneyUz(rates.standard)}
                  </strong>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPriceUzs(rates.express.toString());
                    setUrgency('Shoshilinch (Bugun)');
                  }}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    priceUzs === rates.express.toString()
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-teal-400'
                  }`}
                >
                  <span className="block text-[9px] opacity-75 font-medium">⚡ Tezkor</span>
                  <strong className="block text-[10px] xs:text-[11px] font-extrabold truncate">
                    {formatMoneyUz(rates.express)}
                  </strong>
                </button>
              </div>
            </div>

            {/* Custom Price Input */}
            <div>
              <span className="text-[11px] text-slate-500 mb-1 block font-medium">Belgilangan taklif narxi:</span>
              <div className="relative">
                <input
                  type="number"
                  step="50000"
                  value={priceUzs}
                  onChange={e => setPriceUzs(e.target.value)}
                  placeholder="3,500,000"
                  className="w-full pl-4 pr-14 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  required
                />
                <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-400">
                  UZS
                </span>
              </div>
            </div>

            {/* To'lov turi (Payment Method) */}
            <div>
              <span className="text-[11px] text-slate-500 mb-1 block font-medium">To'lov shakli:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Naqd pul', 'Karta (Click / Payme / Humo)', 'Hisob-raqam (Perechisleniye)'] as PaymentMethod[]).map(pm => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-2 px-1.5 rounded-xl text-center border text-[10px] font-bold transition-all truncate ${
                      paymentMethod === pm
                        ? 'bg-teal-50 border-teal-600 text-teal-800'
                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    {pm.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Muddatlar va Vaqt Oralig'i */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[11px] text-slate-500 mb-1 block flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" /> Yuklash sanasi:
                  </span>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={e => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    required
                  />
                  {/* Yuklash vaqt oralig'i */}
                  <select
                    value={pickupTimeWindow}
                    onChange={e => setPickupTimeWindow(e.target.value)}
                    className="w-full mt-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                  >
                    <option value="08:00 - 12:00 (Ertalab)">08:00 - 12:00 (Ertalab)</option>
                    <option value="12:00 - 17:00 (Tushdan keyin)">12:00 - 17:00 (Tushdan keyin)</option>
                    <option value="17:00 - 21:00 (Oqshom)">17:00 - 21:00 (Oqshom)</option>
                    <option value="Ixtiyoriy vaqt">Ixtiyoriy vaqt</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 mb-1 block flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" /> Yetkazish sanasi:
                  </span>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    required
                  />
                  {/* Yetkazish vaqt oralig'i */}
                  <select
                    value={deliveryTimeWindow}
                    onChange={e => setDeliveryTimeWindow(e.target.value)}
                    className="w-full mt-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                  >
                    <option value="18:00 gacha">18:00 gacha yetkazish</option>
                    <option value="12:00 gacha (Tushgacha)">12:00 gacha (Tushgacha)</option>
                    <option value="24 soat ichida">24 soat ichida</option>
                    <option value="Aniq kelishilgan vaqtda">Aniq kelishilgan vaqtda</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shoshilinchlik va Hujjatlar */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDocuments}
                  onChange={e => setHasDocuments(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-[11px] font-semibold text-slate-700">
                  Rasmiy TTN / Hujjatlar beriladi
                </span>
              </label>

              <button
                type="button"
                onClick={() => setUrgency(urgency === 'Oddiy' ? 'Shoshilinch (Bugun)' : 'Oddiy')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                  urgency === 'Shoshilinch (Bugun)'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {urgency === 'Shoshilinch (Bugun)' ? '⚡ Shoshilinch' : 'Oddiy reys'}
              </button>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 mb-1 block font-medium">Qo'shimcha talablar:</span>
              <input
                type="text"
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                placeholder="Masalan: Tentli fura, yuklashga kran bor"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit Action & Back button */}
          <div className="pt-2 pb-1 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-4 rounded-full bg-white/70 hover:bg-white text-slate-700 font-extrabold text-xs border border-white/85 shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 px-4 rounded-full bg-gradient-to-r from-teal-700 via-teal-800 to-sky-700 text-white font-extrabold text-xs shadow-lg shadow-teal-900/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Yukni e'lon qilish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
