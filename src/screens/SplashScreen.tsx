import React from 'react';
import { StatusBar } from '../components/StatusBar';
import { TruckIllustration } from '../components/TruckIllustration';

interface SplashScreenProps {
  onGetStarted: () => void;
  onLogIn: () => void;
  langText: {
    welcomeTitle1: string;
    welcomeTitle2: string;
    welcomeSubtitle: string;
    getStarted: string;
    logIn: string;
  };
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onLogIn, langText }) => {
  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <TruckIllustration type="hero" />
      </div>

      {/* Top Status Bar & App Logo Header */}
      <div className="relative z-20 flex flex-col items-center">
        <StatusBar darkText={false} />
        
        {/* Brand Header */}
        <div className="mt-4 flex items-center space-x-2.5 bg-slate-900/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-400 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <span className="font-extrabold text-base tracking-wider text-white">
            YUK<span className="text-[#FF7A00]">TOP</span>
          </span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-20 px-6 pb-6 pt-10 flex flex-col">
        {/* Headline */}
        <div className="mb-4">
          <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
            {langText.welcomeTitle1} <br />
            <span className="text-[#FF7A00]">{langText.welcomeTitle2}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-200/90 font-medium leading-relaxed max-w-xs">
            {langText.welcomeSubtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 mt-4">
          <button
            onClick={onGetStarted}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:from-[#FF8A10] hover:to-[#FF6510] active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all duration-200 text-center"
          >
            {langText.getStarted}
          </button>
          
          <button
            onClick={onLogIn}
            className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/25 backdrop-blur-md text-white font-semibold text-base transition-all duration-200 text-center"
          >
            {langText.logIn}
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <span className="w-6 h-2 rounded-full bg-[#FF7A00]"></span>
          <span className="w-2 h-2 rounded-full bg-white/40"></span>
          <span className="w-2 h-2 rounded-full bg-white/40"></span>
          <span className="w-2 h-2 rounded-full bg-white/40"></span>
        </div>
      </div>
    </div>
  );
};
