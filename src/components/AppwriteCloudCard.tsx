import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Database, 
  Check, 
  Copy, 
  Server, 
  RefreshCw, 
  ChevronDown,
  ChevronUp,
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
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  
  // Custom edit accordion
  const [showEditForm, setShowEditForm] = useState(false);
  const [endpointInput, setEndpointInput] = useState(config.endpoint || DEFAULT_APPWRITE_ENDPOINT);
  const [projectIdInput, setProjectIdInput] = useState(config.projectId || DEFAULT_APPWRITE_PROJECT_ID);
  const [databaseIdInput, setDatabaseIdInput] = useState(config.databaseId || DEFAULT_APPWRITE_DATABASE_ID);
  const [saveNote, setSaveNote] = useState(false);

  useEffect(() => {
    let isMounted = true;
    testAppwriteConnection(config.endpoint, config.projectId).then(res => {
      if (isMounted) {
        setPingResult(res);
      }
    });
    return () => { isMounted = false; };
  }, [config.endpoint, config.projectId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProject(true);
    setTimeout(() => setCopiedProject(false), 2000);
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
    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
      {/* 1. Header with Appwrite Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 leading-tight">
              Appwrite Cloud Baza
            </h2>
            <p className="text-[11px] text-slate-500">
              Frankfurt (EU) • loyiha: yuktop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
          <span>Faol {pingResult?.latencyMs ? `(${pingResult.latencyMs} ms)` : ''}</span>
        </div>
      </div>

      {/* 2. Compact Project ID and Storage Info */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">Loyiha kodi (Project ID):</span>
          <code className="font-mono font-bold text-slate-800 text-xs">{config.projectId}</code>
        </div>
        <button
          type="button"
          onClick={() => handleCopy(config.projectId)}
          className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-200/60 transition-all flex items-center gap-1"
        >
          {copiedProject ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Nusxalandi</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Nusxa olish</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Simple Stats Line */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>📦 {cargosCount} ta yuk • 🚚 {tripsCount} ta reys</span>
        <span>☁️ 2 GB bo'sh joy • 75k kvota</span>
      </div>

      {/* 4. Actions: Ping and Settings */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleTestPing}
          disabled={testingPing}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-2xs"
        >
          {testingPing ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Tekshirilmoqda...</span>
            </>
          ) : (
            <>
              <Zap className="w-3 h-3" />
              <span>Aloqani tekshirish</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowEditForm(!showEditForm)}
          className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <span>Sozlash</span>
          {showEditForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Custom Edit Form (if expanded) */}
      {showEditForm && (
        <form onSubmit={handleSaveCustomConfig} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs pt-3">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block mb-1">Server Endpoint:</span>
            <input
              type="url"
              value={endpointInput}
              onChange={e => setEndpointInput(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs focus:outline-none"
              required
            />
          </div>

          <div>
            <span className="text-[11px] text-slate-500 font-medium block mb-1">Project ID:</span>
            <input
              type="text"
              value={projectIdInput}
              onChange={e => setProjectIdInput(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs focus:outline-none"
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
              className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium"
            >
              Standart
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-bold transition-colors"
            >
              Saqlash
            </button>
          </div>
        </form>
      )}

      {saveNote && (
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sozlamalar saqlandi!</span>
        </div>
      )}
    </div>
  );
};
