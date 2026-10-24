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
    <div className="absolute top-12 left-4 right-4 z-40 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-blue-500/30 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B63F6] to-[#0047C7] flex items-center justify-center shadow-xs shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white tracking-tight">{appName} PWA</h4>
          <p className="text-[10px] text-slate-300 leading-tight max-w-[180px]">{installDesc}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-[#0B63F6] hover:bg-blue-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          {installText}
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="w-7 h-7 rounded-full text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
