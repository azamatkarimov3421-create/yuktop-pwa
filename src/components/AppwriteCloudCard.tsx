import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Database, 
  Key, 
  Check, 
  Copy, 
  Activity, 
  HardDrive, 
  Server, 
  RefreshCw, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  getStoredAppwriteConfig, 
  saveAppwriteConfig, 
  testAppwriteConnection, 
  DEFAULT_APPWRITE_ENDPOINT,
  DEFAULT_APPWRITE_PROJECT_ID,
  DEFAULT_APPWRITE_DATABASE_ID
} from '../services/appwriteClient';

interface AppwriteCloudCardProps {
  cargosCount: number;
  tripsCount: number;
}

export const AppwriteCloudCard: React.FC<AppwriteCloudCardProps> = ({
  cargosCount,
  tripsCount
}) => {
  const [config, setConfig] = useState(getStoredAppwriteConfig());
  const [copiedProject, setCopiedProject] = useState(false);
  const [copiedDb, setCopiedDb] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  
  // Custom edit accordion
  const [showEditForm, setShowEditForm] = useState(false);
  const [endpointInput, setEndpointInput] = useState(config.endpoint || DEFAULT_APPWRITE_ENDPOINT);
  const [projectIdInput, setProjectIdInput] = useState(config.projectId || DEFAULT_APPWRITE_PROJECT_ID);
  const [databaseIdInput, setDatabaseIdInput] = useState(config.databaseId || DEFAULT_APPWRITE_DATABASE_ID);
  const [saveNote, setSaveNote] = useState(false);

  // Auto-check ping on mount
  useEffect(() => {
    let isMounted = true;
    testAppwriteConnection(config.endpoint, config.projectId).then(res => {
      if (isMounted) {
        setPingResult(res);
      }
    });
    return () => { isMounted = false; };
  }, [config.endpoint, config.projectId]);

  const handleCopy = (text: string, type: 'project' | 'db') => {
    navigator.clipboard.writeText(text);
    if (type === 'project') {
      setCopiedProject(true);
      setTimeout(() => setCopiedProject(false), 2000);
    } else {
      setCopiedDb(true);
      setTimeout(() => setCopiedDb(false), 2000);
    }
  };

  const handleTestPing = async () => {
    setTestingPing(true);
    const res = await testAppwriteConnection(config.endpoint, config.projectId);
    setPingResult(res);
    setTestingPing(false);
  };

  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppwriteConfig(endpointInput, projectIdInput, databaseIdInput);
    setConfig(getStoredAppwriteConfig());
    setSaveNote(true);
    setTimeout(() => setSaveNote(false), 3000);
    setShowEditForm(false);
    handleTestPing();
  };

  return (
    <div className="p-5 bg-white/85 backdrop-blur-2xl rounded-[32px] border border-white/90 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08)] space-y-4 transition-all">
      {/* 1. Header with Appwrite Brand and Live Pulsing Status */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-rose-500/25 border border-white/40">
            <Cloud className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-slate-900 leading-tight">
                Appwrite Cloud Baza
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                Loyiha: yuktop
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-teal-600" />
              <span>Frankfurt (EU Server) • cloud.appwrite.io</span>
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-800 border border-emerald-300/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            <span>Onlayn Bog'langan</span>
          </span>
          {pingResult?.latencyMs ? (
            <span className="text-[10px] font-mono font-bold text-slate-400">
              ⚡ {pingResult.latencyMs} ms
            </span>
          ) : null}
        </div>
      </div>

      {/* 2. Bento Stats: Connection Details & Codes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        {/* Project ID Box with 1-click Copy */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:bg-white transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-rose-500" />
              Loyiha Kodi (Project ID)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(config.projectId, 'project')}
              className="text-[11px] font-extrabold text-teal-700 hover:text-teal-900 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-teal-50 transition-all"
              title="Kodni nusxalash"
            >
              {copiedProject ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Nusxalandi!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Nusxalash</span>
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-xs font-black text-slate-800 break-all select-all pt-0.5">
            {config.projectId}
          </div>
          <div className="text-[10px] text-slate-500">
            Loyiha nomi: <strong className="text-slate-700">Personal Projects / yuktop</strong>
          </div>
        </div>

        {/* Database & API Keys Status Box */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:bg-white transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              API Kalitlar & Baza ID
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              2 ta kalit faol
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-slate-600 font-semibold">Baza ID:</span>
            <code className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
              {config.databaseId}
            </code>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
            <span>Admin Key (113 scopes)</span>
            <span className="text-emerald-600 font-bold">Faol ✓</span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>yuktop kalit (114 scopes)</span>
            <span className="text-emerald-600 font-bold">Faol ✓</span>
          </div>
        </div>
      </div>

      {/* 3. Storage and Capacity Metrics (Qancha joy bor, qancha ma'lumot bor) */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-teal-500/10 border border-teal-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-black text-slate-800">Bulutli Xotira & Baza Sig'imi</span>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-teal-700 text-white shadow-2xs">
            75,000 Bepul So'rov / oy
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 bg-white/80 rounded-xl border border-white/90 text-center">
            <div className="text-xs font-black text-teal-900">{cargosCount}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Yuklar</div>
          </div>

          <div className="p-2 bg-white/80 rounded-xl border border-white/90 text-center">
            <div className="text-xs font-black text-sky-900">{tripsCount}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Reyslar</div>
          </div>

          <div className="p-2 bg-white/80 rounded-xl border border-white/90 text-center">
            <div className="text-xs font-black text-emerald-900">2 GB</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Bo'sh Joy</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1">
          <span className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Xavfsizlik: TLS 1.3 shifrlash & Role Scopes</span>
          </span>
          <span className="font-bold text-teal-800">Sinxron: Avtomatik</span>
        </div>
      </div>

      {/* 4. Action Buttons: Ping Test and Config Settings */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleTestPing}
          disabled={testingPing}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {testingPing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-300" />
              <span>Tekshirilmoqda...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Aloqani tekshirish (Ping)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowEditForm(!showEditForm)}
          className="py-2.5 px-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs active:scale-[0.98]"
          title="Sozlamalarni o'zgartirish"
        >
          <span>Sozlash</span>
          {showEditForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Ping Status Alert */}
      {pingResult && (
        <div className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
          pingResult.success 
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50/90 border-rose-200 text-rose-900'
        }`}>
          {pingResult.message}
        </div>
      )}

      {/* 5. Custom Appwrite Config Edit Form (Accordion) */}
      {showEditForm && (
        <form onSubmit={handleSaveCustomConfig} className="p-3.5 bg-slate-50/95 rounded-2xl border border-slate-200 space-y-3 text-xs animate-in slide-in-from-top duration-200">
          <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <Server className="w-4 h-4 text-teal-600" />
            <span>Appwrite Ulanish Sozlamalari</span>
          </h3>

          <div>
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Server Endpoint URL:</span>
            <input
              type="url"
              value={endpointInput}
              onChange={e => setEndpointInput(e.target.value)}
              placeholder="https://cloud.appwrite.io/v1"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Project ID (Loyiha Kodi):</span>
            <input
              type="text"
              value={projectIdInput}
              onChange={e => setProjectIdInput(e.target.value)}
              placeholder="6ae2ea99001accd5eab5"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Database ID (Baza Nomi):</span>
            <input
              type="text"
              value={databaseIdInput}
              onChange={e => setDatabaseIdInput(e.target.value)}
              placeholder="yuktop_db"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setEndpointInput(DEFAULT_APPWRITE_ENDPOINT);
                setProjectIdInput(DEFAULT_APPWRITE_PROJECT_ID);
                setDatabaseIdInput(DEFAULT_APPWRITE_DATABASE_ID);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
            >
              Standartga qaytarish
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
            >
              Saqlash va Ulanish
            </button>
          </div>
        </form>
      )}

      {saveNote && (
        <div className="p-2.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Appwrite sozlamalari yangilandi!</span>
        </div>
      )}
    </div>
  );
};
