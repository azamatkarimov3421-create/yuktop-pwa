import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface PWAInstallBannerProps {
  appName: string;
  installText: string;
  installDesc: string;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  appName,
  installText,
  installDesc
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also show banner if running on standalone or browser
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalone) {
      // Show gentle prompt after 3 seconds
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timer);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("Ilovani brauzer menyusidan 'Bosh ekranga qo'shish' (Add to Home Screen) tugmasi orqali o'rnatishingiz mumkin!");
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="absolute top-12 left-4 right-4 z-40 bg-white/90 backdrop-blur-2xl text-slate-900 p-3.5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/90 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center shadow-xs shrink-0">
          <Download className="w-5 h-5 text-teal-700" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">{appName}</h4>
          <p className="text-[10px] text-slate-500 leading-tight max-w-[180px]">{installDesc}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleInstall}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 border border-slate-200/80 rounded-full text-xs font-bold backdrop-blur-md transition-all shadow-2xs"
        >
          {installText}
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
