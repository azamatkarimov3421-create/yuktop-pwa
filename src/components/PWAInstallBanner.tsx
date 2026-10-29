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
    <div className="absolute top-12 left-4 right-4 z-40 bg-slate-900/80 backdrop-blur-2xl text-white p-3.5 rounded-3xl shadow-2xl border border-white/20 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center shadow-md shrink-0 border border-white/20">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white tracking-tight">{appName}</h4>
          <p className="text-[10px] text-slate-300 leading-tight max-w-[180px]">{installDesc}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleInstall}
          className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white border border-white/30 rounded-full text-xs font-bold backdrop-blur-md transition-all shadow-xs"
        >
          {installText}
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
