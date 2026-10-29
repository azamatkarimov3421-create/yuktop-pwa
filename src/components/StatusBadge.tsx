import React from 'react';
import { OrderStatus } from '../types';
import { 
  Sparkles, 
  Clock, 
  Handshake, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<OrderStatus, { label: string; icon: any; bg: string; text: string; border: string; dot: string }> = {
    yangi: {
      label: 'Yangi',
      icon: Sparkles,
      bg: 'bg-blue-50/90',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      dot: 'bg-blue-500'
    },
    taklif_kutilmoqda: {
      label: 'Taklif kutilmoqda',
      icon: Clock,
      bg: 'bg-amber-50/90',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500'
    },
    kelishildi: {
      label: 'Kelishildi',
      icon: Handshake,
      bg: 'bg-teal-50/90',
      text: 'text-teal-800',
      border: 'border-teal-200/80',
      dot: 'bg-teal-500'
    },
    yuklashda: {
      label: 'Yuklashda',
      icon: Package,
      bg: 'bg-indigo-50/90',
      text: 'text-indigo-800',
      border: 'border-indigo-200/80',
      dot: 'bg-indigo-500'
    },
    yolda: {
      label: 'Yo‘lda (GPS faol)',
      icon: Truck,
      bg: 'bg-sky-50/90',
      text: 'text-sky-800',
      border: 'border-sky-300/80',
      dot: 'bg-sky-500 animate-pulse'
    },
    yetkazildi: {
      label: 'Yetkazildi',
      icon: CheckCircle2,
      bg: 'bg-emerald-50/90',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      dot: 'bg-emerald-500'
    },
    bekor_qilindi: {
      label: 'Bekor qilindi',
      icon: XCircle,
      bg: 'bg-rose-50/90',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      dot: 'bg-rose-500'
    }
  };

  const item = config[status] || config.yangi;
  const Icon = item.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2'
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-full border backdrop-blur-sm ${item.bg} ${item.text} ${item.border} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      <span>{item.label}</span>
    </span>
  );
};
