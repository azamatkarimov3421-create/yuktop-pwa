import React, { useState } from 'react';
import { Order, UserRole } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatMoneyUz } from '../services/routingService';
import { 
  ClipboardList, 
  ChevronRight, 
  MapPin, 
  MessageSquare,
  Search
} from 'lucide-react';

interface OrdersListScreenProps {
  orders: Order[];
  activeRole: UserRole;
  onSelectOrder: (order: Order) => void;
  onOpenChat: (orderId: string) => void;
}

export const OrdersListScreen: React.FC<OrdersListScreenProps> = ({
  orders,
  activeRole,
  onSelectOrder,
  onOpenChat
}) => {
  const [filterType, setFilterType] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    if (filterType === 'active') {
      if (order.status === 'yetkazildi' || order.status === 'bekor_qilindi') return false;
    } else if (filterType === 'completed') {
      if (order.status !== 'yetkazildi') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = order.cargoTitle.toLowerCase().includes(q);
      const matchCode = order.orderCode.toLowerCase().includes(q);
      const matchCityA = order.pickupLocation.city.toLowerCase().includes(q);
      const matchCityB = order.deliveryLocation.city.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchCityA && !matchCityB) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-4">
      <div className="pt-1 px-1">
        <h1 className="text-lg font-black text-slate-900">
          {activeRole === 'yuk_beruvchi' ? 'Mening buyurtmalarim' : 'Mening reyslarim'}
        </h1>
        <p className="text-xs text-slate-400">
          Kelishilgan va faol yuk tashuvlari
        </p>
      </div>

      {/* Modern Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-xl rounded-full border border-white/85 shadow-2xs text-xs font-bold">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`flex-1 py-2 rounded-full transition-all ${
            filterType === 'all' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Barchasi ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('active')}
          className={`flex-1 py-2 rounded-full transition-all ${
            filterType === 'active' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Faol ({orders.filter(o => o.status !== 'yetkazildi' && o.status !== 'bekor_qilindi').length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('completed')}
          className={`flex-1 py-2 rounded-full transition-all ${
            filterType === 'completed' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Yetkazilgan ({orders.filter(o => o.status === 'yetkazildi').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buyurtma kodi yoki nomi..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/85 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs placeholder:text-slate-400"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-white/70 backdrop-blur-xl rounded-[28px] border border-white/85 shadow-xs text-xs text-slate-400 space-y-2">
            <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
            <div>Buyurtmalar topilmadi</div>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-400 cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <StatusBadge status={order.status} size="sm" />
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {order.orderCode}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {order.cargoTitle}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                  <span>{(order.weightKg / 1000).toFixed(1)}t</span>
                  <span className="text-slate-300">•</span>
                  <span>{order.volumeM3}m³</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-extrabold text-teal-700">{formatMoneyUz(order.agreedPriceUzs)}</span>
                </div>
              </div>

              {/* Route */}
              <div className="p-2.5 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-between text-xs border border-white/80">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{order.pickupLocation.city.split(' ')[0]} → {order.deliveryLocation.city.split(' ')[0]}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-semibold">{order.distanceKm} km</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-xs">
                <div className="text-slate-500 text-[11px]">
                  {activeRole === 'yuk_beruvchi' ? (
                    <span>Haydovchi: <strong className="text-slate-800">{order.driverName}</strong></span>
                  ) : (
                    <span>Yuk egasi: <strong className="text-slate-800">{order.ownerName}</strong></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChat(order.id);
                    }}
                    className="p-2 rounded-full bg-white/80 hover:bg-sky-50 text-slate-600 hover:text-sky-700 backdrop-blur-md border border-white/80 transition-colors"
                    title="Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-teal-700 font-bold flex items-center gap-0.5 text-[11px] bg-teal-500/15 border border-teal-200/50 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    Kuzatish <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
