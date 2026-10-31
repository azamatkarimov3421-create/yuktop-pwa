import React, { useState } from 'react';
import { Order } from '../types';
import { storageService } from '../services/storageService';
import { 
  X, 
  Star, 
  Check,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  if (!isOpen || !order) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Vaqtida yetkazdi',
    'Ehtiyotkor haydovchi'
  ]);

  const availableTags = [
    'Vaqtida yetkazdi',
    'Ehtiyotkor haydovchi',
    'Xushmuomala',
    'A\'lo narx',
    'Toza transport',
    'Tavsiya qilaman'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

    storageService.addOrderReview(order.id, rating, comment, selectedTags);

    if (onSubmitSuccess) onSubmitSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/25 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-md bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] p-5 border border-white/85 shadow-2xl animate-in slide-in-from-bottom duration-200 space-y-4">
        <div className="pt-1 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/70 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-slate-700 hover:bg-white text-xs font-bold transition-all shadow-xs active:scale-95"
              title="Orqaga qaytish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-300/40 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Xizmatni baholash</h2>
              <p className="text-[10px] text-slate-500">Buyurtma: {order.orderCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Driver info */}
        <div className="p-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
            {order.driverName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">{order.driverName}</div>
            <div className="text-[10px] text-slate-500">
              {order.vehicleModel} ({order.vehiclePlate})
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Star Rating */}
          <div className="text-center space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Baho qo'ying:</span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 active:scale-90 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="text-[11px] text-slate-600 mb-1.5 block font-medium">Qaysi jihatlari ma'qul keldi?</span>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white/65 backdrop-blur-md text-slate-700 border border-white/80 hover:bg-white/90 shadow-2xs'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <span className="text-[11px] text-slate-600 mb-1 block font-medium">Fikr-mulohazangiz:</span>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Qo'shimcha fikringizni yozing..."
              rows={2}
              className="w-full p-3 rounded-2xl bg-white/65 backdrop-blur-md border border-white/80 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white placeholder:text-slate-400 shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-800 hover:to-sky-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Bahoni yuborish</span>
          </button>
        </form>
      </div>
    </div>
  );
};
