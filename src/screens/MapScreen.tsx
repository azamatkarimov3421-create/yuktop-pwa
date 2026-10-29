import React, { useState } from 'react';
import { LocationPoint, RouteGeometry, UserRole, Order } from '../types';
import { UZBEKISTAN_CITIES } from '../data/uzbekistanLocations';
import { MapPicker } from '../components/MapPicker';
import { TrackingMap } from '../components/TrackingMap';
import { 
  Truck, 
  Info,
  MapPin
} from 'lucide-react';

interface MapScreenProps {
  activeRole: UserRole;
  activeOrders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  activeRole,
  activeOrders,
  onSelectOrder
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    activeOrders.length > 0 ? activeOrders[0] : null
  );

  const [testPointA, setTestPointA] = useState<LocationPoint>(UZBEKISTAN_CITIES[0]);
  const [testPointB, setTestPointB] = useState<LocationPoint>(UZBEKISTAN_CITIES[3]);
  const [activeTab, setActiveTab] = useState<'tracking' | 'calculator'>('tracking');

  return (
    <div className="space-y-4 pb-28 max-w-md md:max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <h1 className="text-lg font-black text-slate-900">
            Logistika Xaritasi
          </h1>
          <p className="text-xs text-slate-400">
            OpenStreetMap va jonli GPS monitoring
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-white/70 backdrop-blur-xl border border-white/85 rounded-full text-xs font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] ${
              activeTab === 'tracking' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GPS ({activeOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] ${
              activeTab === 'calculator' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Marshrut
          </button>
        </div>
      </div>

      {activeTab === 'tracking' ? (
        <div className="space-y-3">
          {activeOrders.length === 0 ? (
            <div className="p-8 text-center bg-white/72 backdrop-blur-xl rounded-[28px] border border-white/85 shadow-xs text-xs text-slate-400 space-y-2">
              <Truck className="w-8 h-8 mx-auto text-slate-300" />
              <div>Yo'lda faol transport mavjud emas.</div>
              <p className="text-[11px] text-slate-400">
                Buyurtma kelishilgach, GPS lokatsiyasi bu yerda jonli aks etadi.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Order selector pills */}
              {(() => {
                const currentOrder = (selectedOrder && activeOrders.some(o => o.id === selectedOrder.id)) 
                  ? selectedOrder 
                  : activeOrders[0];
                return (
                  <>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
                      {activeOrders.map(ord => (
                        <button
                          key={ord.id}
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className={`px-3.5 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all border text-xs font-bold active:scale-95 shadow-2xs ${
                            currentOrder?.id === ord.id
                              ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                              : 'bg-white/70 backdrop-blur-xl text-slate-700 border-white/85 hover:bg-white'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{ord.orderCode} - {ord.driverName.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>

                    {currentOrder && (
                      <TrackingMap
                        order={currentOrder}
                        isCarrierView={activeRole === 'yuk_tashuvchi'}
                      />
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-teal-500/15 backdrop-blur-md border border-teal-200/60 rounded-2xl flex items-center gap-2 text-xs text-teal-900 shadow-2xs">
            <Info className="w-4 h-4 shrink-0 text-teal-600" />
            <span className="text-[11px]">Xaritada A (Yuklash) va B (Yetkazish) o'rtasidagi masofa va vaqt hisoblanadi.</span>
          </div>

          <MapPicker
            initialPointA={testPointA}
            initialPointB={testPointB}
            onPointsSelected={(a, b) => {
              setTestPointA(a);
              setTestPointB(b);
            }}
          />
        </div>
      )}
    </div>
  );
};
