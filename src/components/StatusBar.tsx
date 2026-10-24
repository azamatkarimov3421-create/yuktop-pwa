import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  darkText?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ darkText = true }) => {
  const textColor = darkText ? 'text-slate-900' : 'text-white';
  
  return (
    <div className={`w-full flex items-center justify-between px-7 pt-3 pb-1 select-none text-xs font-semibold z-30 transition-colors ${textColor}`}>
      {/* Time */}
      <span className="tracking-tight text-sm font-bold">9:41</span>
      
      {/* Right mobile indicators */}
      <div className="flex items-center space-x-1.5">
        {/* Cellular Signal Icon */}
        <div className="flex items-end space-x-0.5 h-3">
          <span className="w-0.5 h-1 bg-current rounded-xs"></span>
          <span className="w-0.5 h-1.5 bg-current rounded-xs"></span>
          <span className="w-0.5 h-2.5 bg-current rounded-xs"></span>
          <span className="w-0.5 h-3 bg-current rounded-xs"></span>
        </div>
        
        {/* Wifi Icon */}
        <Wifi className="w-3.5 h-3.5" />
        
        {/* Battery Icon */}
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );
};
