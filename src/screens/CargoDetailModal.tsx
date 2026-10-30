import React, { useState } from 'react';
import { CargoItem, Bid, UserRole } from '../types';
import { MapPicker } from '../components/MapPicker';
import { StatusBadge } from '../components/StatusBadge';
import { formatMoneyUz, formatDurationUz } from '../services/routingService';
import { 
  X, 
  MapPin, 
  Calendar, 
  Weight, 
  Box, 
  Phone, 
  Star, 
  Truck, 
  Send, 
  Check, 
  MessageSquare, 
  DollarSign,
  ChevronRight,
  ShieldCheck,
  FileText,
  Zap,
  CreditCard,
  Banknote,
  Calculator,
  ExternalLink,
  ArrowLeft,
  Navigation,
  Trash2
} from 'lucide-react';

interface CargoDetailModalProps {
  cargo: CargoItem | null;
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  bids: Bid[];
  distanceToPickupKm?: number;
  onAcceptBid?: (bidId: string) => void;
  onCounterBid?: (bidId: string, counterPrice: number, note?: string) => void;
  onRejectBid?: (bidId: string) => void;
  onSubmitCarrierBid?: (cargoId: string, price: number, note?: string) => void;
  onOpenChatWithDriver?: (driverId: string) => void;
  onDeleteCargo?: (cargoId: string) => void;
}

export const CargoDetailModal: React.FC<CargoDetailModalProps> = ({
  cargo,
  isOpen,
  onClose,
  activeRole,
  bids,
  distanceToPickupKm,
  onAcceptBid,
  onCounterBid,
  onRejectBid,
  onSubmitCarrierBid,
  onOpenChatWithDriver,
  onDeleteCargo
}) => {
  if (!isOpen || !cargo) return null;

  const [counterBidId, setCounterBidId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<string>('');
  const [counterNote, setCounterNote] = useState<string>('');

  const [carrierOfferPrice, setCarrierOfferPrice] = useState<string>(cargo.priceUzs.toString());
  const [carrierNote, setCarrierNote] = useState<string>('');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const handleSendCounter = (bidId: string) => {
    const price = parseFloat(counterPrice);
    if (!price || price <= 0) return;
    if (onCounterBid) {
      onCounterBid(bidId, price, counterNote);
    }
    setCounterBidId(null);
    setCounterPrice('');
    setCounterNote('');
  };

  const handleCarrierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(carrierOfferPrice);
    if (!price || price <= 0) return;
    if (onSubmitCarrierBid) {
      onSubmitCarrierBid(cargo.id, price, carrierNote);
      setBidSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-xl bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-y-auto shadow-2xl border border-white/85 animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/60 rounded-full" />
        </div>

        {/* Sticky Header */}
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
            <StatusBadge status={cargo.status} size="sm" />
            <span className="text-[10px] text-slate-500 font-mono font-bold bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/80">
              #{cargo.id.slice(-6)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Main Photo & Details */}
          <div className="flex flex-col sm:flex-row gap-3.5 items-start">
            <img
              src={cargo.imageUrl}
              alt={cargo.title}
              className="w-full sm:w-32 h-32 rounded-2xl object-cover border border-white/80 shrink-0 shadow-xs"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-200/60 inline-block">
                  {cargo.category}
                </span>

                {cargo.urgency === 'Shoshilinch (Bugun)' && (
                  <span className="text-[9px] font-extrabold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 flex items-center gap-0.5">
                    <Zap className="w-3 h-3 fill-amber-600 text-amber-600" />
                    ⚡ Shoshilinch
                  </span>
                )}
              </div>

              <h1 className="text-base font-extrabold text-slate-900 leading-snug">
                {cargo.title}
              </h1>

              <div className="text-[11px] text-slate-500 flex items-center gap-2.5 pt-0.5 flex-wrap">
                <span className="font-semibold text-slate-700">
                  {(cargo.weightKg / 1000).toFixed(1)} tonna
                </span>
                <span className="text-slate-300">•</span>
                <span>{cargo.volumeM3} m³</span>
                <span className="text-slate-300">•</span>
                <span className="text-teal-700 font-bold bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-200/50">
                  {cargo.paymentMethod}
                </span>
              </div>

              {/* Price Banner */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Belgilangan narx:</span>
                  <span className="text-base font-black text-teal-700">
                    {formatMoneyUz(cargo.priceUzs)}
                  </span>
                </div>
                {distanceToPickupKm !== undefined && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Yuklashgacha:</span>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-200/60 backdrop-blur-md">
                      📍 {distanceToPickupKm} km
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Yo'nalish va Marshrut {cargo.stops && cargo.stops.length > 2 ? `(${cargo.stops.length} ta manzil)` : ''}
              </span>
              <span className="text-[11px] font-semibold text-slate-600">
                {cargo.distanceKm} km • {formatDurationUz(cargo.durationMinutes)}
              </span>
            </div>
            <MapPicker
              initialPointA={cargo.stops?.[0] || cargo.pickupLocation}
              initialPointB={cargo.stops?.[1] || cargo.deliveryLocation}
              initialPointC={cargo.stops && cargo.stops.length > 2 ? cargo.stops[2] : null}
              readOnly={true}
            />

            {/* Yandex Navigatsiyada ochish tugmasi */}
            <div className="pt-1">
              <a
                href={
                  cargo.stops && cargo.stops.length > 2
                    ? `https://yandex.ru/maps/?rtext=${cargo.stops.map(s => `${s.lat},${s.lng}`).join('~')}&rtt=auto`
                    : `https://yandex.ru/maps/?rtext=${cargo.pickupLocation.lat},${cargo.pickupLocation.lng}~${cargo.deliveryLocation.lat},${cargo.deliveryLocation.lng}&rtt=auto`
                }
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-300/80 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.99]"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-700" />
                <span>🧭 Yandex Navigatorda yo'lni ochish</span>
                <ExternalLink className="w-3 h-3 text-amber-600" />
              </a>
            </div>
          </div>

          {/* Route Details Box */}
          <div className="p-3.5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 space-y-2 text-xs">
            {cargo.stops && cargo.stops.length > 2 ? (
              // Multi-stop 3 ta manzil ko'rinishi
              <div className="space-y-2.5">
                {cargo.stops.map((stop, idx) => {
                  const letter = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C';
                  const badgeBg = idx === 0 ? 'bg-teal-600' : idx === 1 ? 'bg-amber-500' : 'bg-rose-600';
                  const label = idx === 0 ? 'Yuklash nuqtasi' : idx === 1 ? '1-Tushirish manzili' : '2-Tushirish (Yakuniy)';
                  return (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className={`w-5 h-5 rounded-full ${badgeBg} text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5`}>
                        {letter}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{stop.city}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({label})</span>
                        </div>
                        <div className="text-slate-500 text-[10px]">{stop.address || "Aniq manzil belgilanmagan"}</div>
                        {idx === 0 && (
                          <div className="text-teal-700 font-semibold text-[10px] mt-0.5">
                            Yuklash: {cargo.pickupDate} {cargo.pickupTimeWindow ? `(${cargo.pickupTimeWindow})` : ''}
                          </div>
                        )}
                        {idx === cargo.stops!.length - 1 && (
                          <div className="text-rose-700 font-semibold text-[10px] mt-0.5">
                            Yetkazish: {cargo.deliveryDate} {cargo.deliveryTimeWindow ? `(${cargo.deliveryTimeWindow})` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // 2 ta manzil (A va B)
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    A
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">{cargo.pickupLocation.city}</div>
                    <div className="text-slate-400 text-[10px]">{cargo.pickupLocation.address}</div>
                    <div className="text-teal-700 font-semibold text-[10px] mt-0.5">
                      Yuklash: {cargo.pickupDate} {cargo.pickupTimeWindow ? `(${cargo.pickupTimeWindow})` : ''}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 my-1" />

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    B
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">{cargo.deliveryLocation.city}</div>
                    <div className="text-slate-400 text-[10px]">{cargo.deliveryLocation.address}</div>
                    <div className="text-rose-700 font-semibold text-[10px] mt-0.5">
                      Yetkazish: {cargo.deliveryDate} {cargo.deliveryTimeWindow ? `(${cargo.deliveryTimeWindow})` : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {cargo.specialNotes && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 text-slate-600 text-[11px]">
                <strong>Talablar:</strong> {cargo.specialNotes}
              </div>
            )}
          </div>

          {/* Cargo Owner Contact */}
          <div className="p-3.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/85 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-800 flex items-center justify-center font-bold text-xs border border-teal-200/60">
                {cargo.ownerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">{cargo.ownerName}</div>
                <div className="text-[10px] text-slate-400">Yuk egasi • {cargo.ownerPhone}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`https://t.me/${(cargo.ownerTelegram || cargo.ownerPhone.replace(/[^0-9]/g, '')).replace(/^@/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px] active:scale-95 transition-all shadow-2xs"
                title="Telegram orqali yozish"
              >
                <span>Telegram</span>
              </a>

              <a
                href={`tel:${cargo.ownerPhone}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-700 text-white font-bold text-[11px] active:scale-95 transition-all shadow-md shadow-teal-700/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Qo'ng'iroq</span>
              </a>
            </div>
          </div>

          {/* ROLE ACTIONS */}

          {/* Yuk beruvchi: Incoming bids */}
          {activeRole === 'yuk_beruvchi' && (
            <div className="space-y-2.5 pt-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-1">
                <Truck className="w-4 h-4 text-teal-600" />
                Tashuvchilardan takliflar ({bids.length})
              </h3>

              {bids.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                  Hozircha narx takliflari tushmadi. Takliflar tushishi bilan shu yerda ko'rinadi.
                </div>
              ) : (
                <div className="space-y-2">
                  {bids.map(bid => (
                    <div
                      key={bid.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-teal-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <span>{bid.driverName}</span>
                              <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                                <Star className="w-3 h-3 fill-amber-400" /> {bid.driverRating}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {bid.vehicleModel} • <span className="font-mono">{bid.vehiclePlate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-black text-teal-700">
                            {formatMoneyUz(bid.offeredPriceUzs)}
                          </div>
                          {bid.counterPriceUzs && (
                            <div className="text-[9px] text-amber-600 font-bold">
                              Qarshi: {formatMoneyUz(bid.counterPriceUzs)}
                            </div>
                          )}
                        </div>
                      </div>

                      {bid.counterNote && (
                        <div className="text-[10px] bg-amber-50 text-amber-800 p-2 rounded-xl border border-amber-200/80">
                          <strong>Izoh:</strong> {bid.counterNote}
                        </div>
                      )}

                      {/* Actions */}
                      {bid.status !== 'accepted' && bid.status !== 'rejected' && (
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onAcceptBid && onAcceptBid(bid.id)}
                            className="flex-1 py-2 px-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Qabul qilish</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setCounterBidId(counterBidId === bid.id ? null : bid.id);
                              setCounterPrice(bid.offeredPriceUzs.toString());
                            }}
                            className="py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                          >
                            Qarshi narx
                          </button>

                          <a
                            href={`https://t.me/${(bid.driverTelegram || bid.driverPhone.replace(/[^0-9]/g, '')).replace(/^@/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-sky-50 text-sky-700 border border-sky-200"
                            title="Telegram"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={`tel:${bid.driverPhone}`}
                            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {/* Counter price box */}
                      {counterBidId === bid.id && (
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-1 animate-in fade-in">
                          <span className="text-[10px] font-bold text-slate-600 block">
                            Qarshi narx taklifi (so'm):
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="50000"
                              value={counterPrice}
                              onChange={e => setCounterPrice(e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold"
                              placeholder="Narxni kiriting"
                            />
                            <button
                              type="button"
                              onClick={() => handleSendCounter(bid.id)}
                              className="px-4 py-1.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800"
                            >
                              Yuborish
                            </button>
                          </div>
                          <input
                            type="text"
                            value={counterNote}
                            onChange={e => setCounterNote(e.target.value)}
                            placeholder="Qo'shimcha izoh (ixtiyoriy)"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Yuk tashuvchi: Make Offer */}
          {activeRole === 'yuk_tashuvchi' && (
            <div className="space-y-2.5 pt-1">
              <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-teal-900 uppercase tracking-wider">
                      Narx taklif qilish
                    </h3>
                    <p className="text-[10px] text-teal-700">
                      Belgilangan narxni qabul qiling yoki o'z taklifingizni yuboring
                    </p>
                  </div>
                </div>

                {bidSubmitted ? (
                  <div className="p-3 bg-emerald-500 text-white rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" /> Taklifingiz yuk egasiga yetkazildi!
                  </div>
                ) : (
                  <form onSubmit={handleCarrierSubmit} className="space-y-2.5">
                    <div className="relative">
                      <input
                        type="number"
                        step="50000"
                        value={carrierOfferPrice}
                        onChange={e => setCarrierOfferPrice(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-teal-300 bg-white text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                      <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-400">
                        UZS
                      </span>
                    </div>

                    {/* Quick Price Buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                      <button
                        type="button"
                        onClick={() => setCarrierOfferPrice(cargo.priceUzs.toString())}
                        className="px-2.5 py-1 rounded-xl bg-white border border-teal-200 text-slate-700 text-[10px] font-bold whitespace-nowrap hover:bg-teal-50"
                      >
                        Egasi narxi ({formatMoneyUz(cargo.priceUzs)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarrierOfferPrice((cargo.priceUzs + 200000).toString())}
                        className="px-2.5 py-1 rounded-xl bg-white border border-teal-200 text-slate-700 text-[10px] font-bold whitespace-nowrap hover:bg-teal-50"
                      >
                        +200,000 so'm
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarrierOfferPrice((cargo.priceUzs + 500000).toString())}
                        className="px-2.5 py-1 rounded-xl bg-white border border-teal-200 text-slate-700 text-[10px] font-bold whitespace-nowrap hover:bg-teal-50"
                      >
                        +500,000 so'm
                      </button>
                    </div>

                    <input
                      type="text"
                      value={carrierNote}
                      onChange={e => setCarrierNote(e.target.value)}
                      placeholder="Izoh (masalan: Bugun soat 16:00 da yuklashga tayyorman)"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs"
                    />

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Taklifni yuborish</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
          {/* Yuk egasi: E'lonni o'chirish tugmasi */}
          {activeRole === 'yuk_beruvchi' && onDeleteCargo && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Rostdan ham ushbu e'lonni o'chirmoqchimisiz?")) {
                    onDeleteCargo(cargo.id);
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200 text-rose-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.99]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ushbu e'lonni o'chirish</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
