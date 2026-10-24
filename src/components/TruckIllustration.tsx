import React from 'react';

interface TruckProps {
  type: 'small' | 'medium' | 'large' | 'hero' | 'avatar';
  className?: string;
}

export const TruckIllustration: React.FC<TruckProps> = ({ type, className = 'w-16 h-12' }) => {
  if (type === 'small') {
    // Small Light Delivery Truck (Blue)
    return (
      <svg viewBox="0 0 160 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="smallBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6"/>
            <stop offset="100%" stopColor="#1D4ED8"/>
          </linearGradient>
          <linearGradient id="smallBox" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#E2E8F0"/>
          </linearGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="80" cy="88" rx="65" ry="6" fill="#000" opacity="0.15" />
        {/* Cargo Box */}
        <rect x="15" y="22" width="75" height="50" rx="4" fill="url(#smallBox)" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="15" y1="36" x2="90" y2="36" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="15" y1="52" x2="90" y2="52" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3"/>
        {/* Cab */}
        <path d="M92 38 L118 38 Q130 38 135 48 L142 60 Q145 66 145 72 L92 72 Z" fill="url(#smallBody)" />
        {/* Cab Window */}
        <path d="M100 42 L118 42 Q125 42 128 48 L133 56 Q134 58 132 58 L100 58 Z" fill="#93C5FD" opacity="0.9" />
        {/* Headlight */}
        <rect x="140" y="66" width="5" height="5" rx="1.5" fill="#FEF08A" />
        {/* Wheels */}
        <circle cx="42" cy="74" r="14" fill="#1E293B" />
        <circle cx="42" cy="74" r="7" fill="#94A3B8" />
        <circle cx="42" cy="74" r="3" fill="#FFFFFF" />
        
        <circle cx="122" cy="74" r="14" fill="#1E293B" />
        <circle cx="122" cy="74" r="7" fill="#94A3B8" />
        <circle cx="122" cy="74" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type === 'medium') {
    // Medium Box Truck (Clean White / Silver)
    return (
      <svg viewBox="0 0 170 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="medCab" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC"/>
            <stop offset="100%" stopColor="#CBD5E1"/>
          </linearGradient>
          <linearGradient id="medBox" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F1F5F9"/>
            <stop offset="50%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#E2E8F0"/>
          </linearGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="85" cy="89" rx="72" ry="6" fill="#000" opacity="0.18" />
        {/* Chassis */}
        <rect x="20" y="68" width="125" height="6" fill="#334155" rx="2" />
        {/* Cargo Body */}
        <rect x="15" y="16" width="95" height="54" rx="3" fill="url(#medBox)" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="62" y1="16" x2="62" y2="70" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Wind Deflector */}
        <path d="M112 18 Q125 18 135 24 L138 28 L112 28 Z" fill="#94A3B8" opacity="0.5" />
        {/* Cab */}
        <path d="M112 26 L136 26 Q146 26 150 34 L156 50 Q158 56 158 64 L112 72 Z" fill="url(#medCab)" stroke="#64748B" strokeWidth="1" />
        {/* Window */}
        <path d="M118 31 L134 31 Q141 31 144 38 L148 48 Q149 50 146 50 L118 50 Z" fill="#38BDF8" opacity="0.85" />
        {/* Grill and Headlights */}
        <rect x="150" y="56" width="8" height="12" rx="2" fill="#475569" />
        <rect x="154" y="60" width="4" height="4" rx="1" fill="#FEF08A" />
        {/* Triple Wheels */}
        <circle cx="38" cy="74" r="13" fill="#0F172A" />
        <circle cx="38" cy="74" r="6" fill="#94A3B8" />
        <circle cx="68" cy="74" r="13" fill="#0F172A" />
        <circle cx="68" cy="74" r="6" fill="#94A3B8" />
        <circle cx="138" cy="74" r="13" fill="#0F172A" />
        <circle cx="138" cy="74" r="6" fill="#94A3B8" />
      </svg>
    );
  }

  if (type === 'large') {
    // Large Semi-Trailer Truck (Vibrant Orange Volvo FH / Scania style)
    return (
      <svg viewBox="0 0 180 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="largeOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00"/>
            <stop offset="100%" stopColor="#EA580C"/>
          </linearGradient>
          <linearGradient id="largeTrailer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FB923C"/>
            <stop offset="100%" stopColor="#F97316"/>
          </linearGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="90" cy="90" rx="80" ry="6" fill="#000" opacity="0.22" />
        {/* Trailer Body */}
        <rect x="10" y="14" width="105" height="58" rx="4" fill="url(#largeTrailer)" stroke="#C2410C" strokeWidth="1.5" />
        <rect x="15" y="19" width="95" height="48" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.35"/>
        <line x1="10" y1="42" x2="115" y2="42" stroke="#FFFFFF" strokeWidth="1" opacity="0.25"/>
        {/* Cab (Tractor) */}
        <path d="M120 18 L148 18 Q160 18 165 26 L174 46 Q176 52 176 62 L120 72 Z" fill="url(#largeOrange)" stroke="#9A3412" strokeWidth="1" />
        {/* Roof Deflector */}
        <path d="M120 14 Q135 14 148 18 L120 18 Z" fill="#C2410C" />
        {/* Big Windshield */}
        <path d="M126 22 L146 22 Q154 22 158 29 L165 42 Q167 46 163 46 L126 46 Z" fill="#BAE6FD" opacity="0.9" />
        {/* Big Front Chrome Grill */}
        <rect x="166" y="50" width="9" height="18" rx="2" fill="#1E293B" />
        <line x1="168" y1="54" x2="173" y2="54" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="168" y1="58" x2="173" y2="58" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="168" y1="62" x2="173" y2="62" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="170" y="66" width="5" height="4" rx="1" fill="#FEF08A" />
        {/* Tandem Wheels on Trailer */}
        <circle cx="32" cy="74" r="13" fill="#0F172A" />
        <circle cx="32" cy="74" r="6" fill="#94A3B8" />
        <circle cx="58" cy="74" r="13" fill="#0F172A" />
        <circle cx="58" cy="74" r="6" fill="#94A3B8" />
        <circle cx="84" cy="74" r="13" fill="#0F172A" />
        <circle cx="84" cy="74" r="6" fill="#94A3B8" />
        {/* Cab Wheels */}
        <circle cx="152" cy="74" r="13" fill="#0F172A" />
        <circle cx="152" cy="74" r="6" fill="#94A3B8" />
      </svg>
    );
  }

  if (type === 'avatar') {
    // Azizbek Rakhimov Avatar with driver cap and smile
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#E2E8F0" />
        {/* Shirt */}
        <path d="M15 95 Q30 75 50 75 Q70 75 85 95 Z" fill="#1D4ED8" />
        <path d="M42 75 L50 88 L58 75 Z" fill="#3B82F6" />
        {/* Neck */}
        <rect x="43" y="60" width="14" height="18" fill="#FDBA74" rx="3" />
        {/* Face */}
        <ellipse cx="50" cy="48" rx="20" ry="22" fill="#FED7AA" />
        {/* Beard / Stubble */}
        <path d="M35 52 Q50 68 65 52 Q62 68 50 70 Q38 68 35 52 Z" fill="#9A3412" opacity="0.25" />
        {/* Smile */}
        <path d="M44 57 Q50 63 56 57" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <circle cx="43" cy="45" r="2.5" fill="#431407" />
        <circle cx="57" cy="45" r="2.5" fill="#431407" />
        {/* Eyebrows */}
        <path d="M39 40 Q43 38 47 40" stroke="#431407" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M53 40 Q57 38 61 40" stroke="#431407" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Driver Cap (Blue) */}
        <path d="M28 36 Q50 18 72 36 L75 39 Q50 30 25 39 Z" fill="#1E3A8A" />
        <path d="M22 38 Q50 32 78 38 L84 41 Q50 36 16 41 Z" fill="#0F172A" />
      </svg>
    );
  }

  // Hero Graphic for Splash
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg viewBox="0 0 400 480" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A"/>
            <stop offset="40%" stopColor="#2563EB"/>
            <stop offset="80%" stopColor="#60A5FA"/>
            <stop offset="100%" stopColor="#BAE6FD"/>
          </linearGradient>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155"/>
            <stop offset="100%" stopColor="#0F172A"/>
          </linearGradient>
        </defs>
        {/* Sky */}
        <rect width="400" height="480" fill="url(#skyGrad)"/>
        {/* Distant Mountains */}
        <path d="M0 240 L60 190 L130 230 L220 170 L310 225 L400 180 L400 320 L0 320 Z" fill="#1E40AF" opacity="0.6"/>
        <path d="M0 260 L80 220 L180 255 L280 210 L370 250 L400 235 L400 340 L0 340 Z" fill="#1D4ED8" opacity="0.8"/>
        {/* Rolling Hills */}
        <path d="M0 290 Q120 260 240 285 T400 280 L400 380 L0 380 Z" fill="#15803D" opacity="0.7"/>
        {/* Highway Road with perspective */}
        <path d="M120 310 L280 310 L390 480 L10 480 Z" fill="url(#roadGrad)"/>
        {/* Center dashed highway line */}
        <line x1="200" y1="315" x2="200" y2="480" stroke="#FBBF24" strokeWidth="4" strokeDasharray="16 14"/>
        <line x1="130" y1="315" x2="30" y2="480" stroke="#FFFFFF" strokeWidth="3" opacity="0.6"/>
        <line x1="270" y1="315" x2="370" y2="480" stroke="#FFFFFF" strokeWidth="3" opacity="0.6"/>
        
        {/* Big Volvo/Scania Semi Truck Driving on Road */}
        <g transform="translate(100, 240) scale(1.15)">
          {/* Orange trailer */}
          <rect x="0" y="30" width="100" height="70" rx="4" fill="#F97316" stroke="#C2410C" strokeWidth="2"/>
          <line x1="0" y1="65" x2="100" y2="65" stroke="#FFF" strokeWidth="1.5" opacity="0.3"/>
          {/* Modern Blue Cab */}
          <path d="M98 35 L125 35 Q135 35 140 44 L152 70 Q155 78 155 90 L98 100 Z" fill="#0B63F6" stroke="#0047C7" strokeWidth="2"/>
          {/* Windshield */}
          <path d="M106 40 L125 40 Q132 40 135 48 L144 64 Q146 68 142 68 L106 68 Z" fill="#E0F2FE" opacity="0.95"/>
          {/* Chrome Grill */}
          <rect x="146" y="74" width="9" height="20" rx="2" fill="#334155"/>
          <line x1="148" y1="78" x2="153" y2="78" stroke="#94A3B8" strokeWidth="1.5"/>
          <line x1="148" y1="83" x2="153" y2="83" stroke="#94A3B8" strokeWidth="1.5"/>
          <line x1="148" y1="88" x2="153" y2="88" stroke="#94A3B8" strokeWidth="1.5"/>
          {/* Headlights with beam glow */}
          <rect x="148" y="94" width="7" height="4" rx="1" fill="#FEF08A"/>
          <polygon points="155,95 240,115 240,135 155,98" fill="#FEF08A" opacity="0.3"/>
          {/* Heavy duty Wheels */}
          <circle cx="25" cy="102" r="14" fill="#0F172A"/>
          <circle cx="25" cy="102" r="7" fill="#64748B"/>
          <circle cx="55" cy="102" r="14" fill="#0F172A"/>
          <circle cx="55" cy="102" r="7" fill="#64748B"/>
          <circle cx="128" cy="102" r="14" fill="#0F172A"/>
          <circle cx="128" cy="102" r="7" fill="#64748B"/>
        </g>
      </svg>
      {/* Gradient overlay at bottom for smooth text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
    </div>
  );
};
