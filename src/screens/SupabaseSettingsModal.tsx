import React, { useState } from 'react';
import { 
  getStoredSupabaseConfig, 
  saveSupabaseConfig, 
  isSupabaseConnected 
} from '../services/supabaseClient';
import { 
  X, 
  Database, 
  Check, 
  Cloud, 
  Server, 
  RefreshCw,
  Code,
  ArrowLeft
} from 'lucide-react';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  if (!isOpen) return null;

  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [showSql, setShowSql] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const isConnected = isSupabaseConnected();

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey);
    onConfigUpdated();
    setTestResult(url ? "Sozlamalar saqlandi va Supabase ga ulandi!" : "Oflayn lokal xotira rejimiga o'tkazildi.");
  };

  const handleTestConnection = async () => {
    if (!url || !anonKey) {
      setTestResult("Supabase URL va Anon Key ni kiriting.");
      return;
    }
    try {
      const res = await fetch(`${url}/rest/v1/`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`
        }
      });
      if (res.ok || res.status === 200 || res.status === 404) {
        setTestResult("✅ Supabase REST API ga muvaffaqiyatli ulandi!");
      } else {
        setTestResult(`Aloqa javobi: HTTP ${res.status}`);
      }
    } catch (e: any) {
      setTestResult(`Xatolik: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white/88 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[32px] p-5 shadow-2xl border border-white/85 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="pt-1 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300/60 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 hover:bg-white text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Orqaga qaytish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-800 flex items-center justify-center font-bold border border-teal-200/50">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Supabase Backend</h2>
              <p className="text-[10px] text-slate-500">PostgreSQL, Realtime va Autentifikatsiya</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status banner */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between backdrop-blur-md ${
          isConnected
            ? 'bg-emerald-500/15 border-emerald-300/60 text-emerald-900'
            : 'bg-white/60 border-white/80 text-slate-700 shadow-2xs'
        }`}>
          <div className="flex items-center gap-2 text-xs">
            {isConnected ? (
              <Cloud className="w-5 h-5 text-emerald-600" />
            ) : (
              <Server className="w-5 h-5 text-slate-400" />
            )}
            <div>
              <div className="font-bold text-xs">
                {isConnected ? 'Supabase Cloud ulangan' : 'Lokal / Oflayn xotira dvigateli'}
              </div>
              <div className="text-[10px] opacity-75">
                {isConnected 
                  ? 'Real-time kanallar va PostgreSQL sinxronizatsiyasi ishlamoqda'
                  : 'Barcha funksiyalar qurilma xotirasida to\'liq ishlaydi'}
              </div>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1 text-[11px]">
              Supabase Project URL:
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1 text-[11px]">
              Supabase Anon Public API Key:
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white focus:outline-none"
            />
          </div>

          {testResult && (
            <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200/80 text-[11px] text-teal-800 font-medium">
              {testResult}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Saqlash va Sinxronlash</span>
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              className="px-4 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tekshirish</span>
            </button>
          </div>
        </div>

        {/* SQL Schema Notice */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
              <Code className="w-3.5 h-3.5 text-teal-600" />
              supabase_schema.sql
            </span>
            <button
              type="button"
              onClick={() => setShowSql(!showSql)}
              className="text-teal-700 font-bold text-[10px] hover:underline"
            >
              {showSql ? 'Yopish' : 'Ko\'rish'}
            </button>
          </div>

          <p className="text-[10px] text-slate-400">
            Loyiha papkasida <strong>supabase_schema.sql</strong> fayli tayyorlangan.
          </p>

          {showSql && (
            <div className="mt-2 p-2.5 bg-slate-900 text-teal-300 font-mono text-[9px] rounded-xl overflow-x-auto max-h-36">
              <pre>{`CREATE TABLE public.profiles (...);
CREATE TABLE public.vehicles (...);
CREATE TABLE public.cargos (...);
CREATE TABLE public.bids (...);
CREATE TABLE public.orders (...);
CREATE TABLE public.messages (...);
CREATE TABLE public.notifications (...);
ALTER PUBLICATION supabase_realtime ADD TABLE public.cargos;`}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
