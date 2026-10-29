import React, { useState } from 'react';
import { 
  getStoredAppwriteConfig, 
  saveAppwriteConfig, 
  isAppwriteConnected,
  testAppwriteConnection,
  DEFAULT_APPWRITE_ENDPOINT,
  DEFAULT_APPWRITE_DATABASE_ID
} from '../services/appwriteClient';
import { storageService } from '../services/storageService';
import { 
  X, 
  Database, 
  Check, 
  Cloud, 
  Server, 
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';

interface AppwriteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const AppwriteSettingsModal: React.FC<AppwriteSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  if (!isOpen) return null;

  const currentConfig = getStoredAppwriteConfig();
  const [endpoint, setEndpoint] = useState(currentConfig.endpoint || DEFAULT_APPWRITE_ENDPOINT);
  const [projectId, setProjectId] = useState(currentConfig.projectId);
  const [databaseId, setDatabaseId] = useState(currentConfig.databaseId || DEFAULT_APPWRITE_DATABASE_ID);
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const isConnected = isAppwriteConnected();

  const handleSave = async () => {
    saveAppwriteConfig(endpoint, projectId, databaseId);
    if (projectId.trim()) {
      await storageService.syncWithAppwrite();
    }
    onConfigUpdated();
    setTestResult({
      success: true,
      message: projectId.trim()
        ? "✅ Appwrite Cloud sozlamalari saqlandi va loyiha ulandi!"
        : "Lokal oflayn xotira rejimiga o'tkazildi."
    });
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testAppwriteConnection(endpoint, projectId);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: `Xatolik: ${e.message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] p-5 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200 max-h-[92vh] overflow-y-auto space-y-4">
        {/* Mobile handle */}
        <div className="pt-1 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors"
              title="Orqaga qaytish"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>Appwrite Cloud</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  75k Bepul
                </span>
              </h2>
              <p className="text-[10px] text-slate-500">Real-time WebSockets, Baza va Fayllar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status banner */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          isConnected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-2.5 text-xs">
            {isConnected ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                <Server className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="font-bold text-xs">
                {isConnected ? 'Appwrite Cloud Ulangan!' : 'Lokal Oflayn Xotira Rejimi'}
              </div>
              <div className="text-[10px] opacity-75">
                {isConnected 
                  ? 'Real-time sinxronizatsiya va bulutli baza faol'
                  : 'Project ID kiritib, 1 daqiqada bepul bulutga ulang'}
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-600 font-semibold text-[11px]">
                Appwrite Project ID:
              </label>
              <a 
                href="https://cloud.appwrite.io/console" 
                target="_blank" 
                rel="noreferrer" 
                className="text-teal-700 hover:underline text-[10px] font-bold flex items-center gap-0.5"
              >
                <span>Console ochish</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="text"
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              placeholder="Masalan: 67123abcd456789..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white focus:outline-none font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              cloud.appwrite.io dagi loyihangiz "Settings" sahifasidan olingan Project ID
            </span>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1 text-[11px]">
              API Endpoint:
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={e => setEndpoint(e.target.value)}
              placeholder="https://cloud.appwrite.io/v1"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white focus:outline-none text-slate-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1 text-[11px]">
              Database ID:
            </label>
            <input
              type="text"
              value={databaseId}
              onChange={e => setDatabaseId(e.target.value)}
              placeholder="yuktop_db"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:bg-white focus:outline-none text-slate-600"
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-[11px] font-medium flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {testResult.success ? <Check className="w-4 h-4 shrink-0 text-emerald-600" /> : <X className="w-4 h-4 shrink-0 text-rose-600" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Saqlash va Ulanish</span>
            </button>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !projectId.trim()}
              className="px-4 py-3 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>Tekshirish</span>
            </button>
          </div>
        </div>

        {/* 3-Step Setup Quick Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="font-black text-slate-800 text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Appwrite Cloud ni 1 daqiqada ulash yo'riqnomasi:</span>
          </div>

          <ol className="list-decimal list-inside space-y-1 text-[10px] text-slate-600 leading-relaxed font-medium">
            <li>
              <a href="https://cloud.appwrite.io" target="_blank" rel="noreferrer" className="text-teal-700 font-bold underline">
                cloud.appwrite.io
              </a> ga kiring va bepul ro'yxatdan o'ting.
            </li>
            <li>
              Yangi loyiha (masalan: <strong>YUKTOP</strong>) oching va uning <strong>Project ID</strong> sini nusxalang.
            </li>
            <li>
              Shu yerdagi <strong>Project ID</strong> maydoniga qo'yib, <strong>"Saqlash va Ulanish"</strong> tugmasini bosing!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
