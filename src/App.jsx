import React, { useState, useEffect } from 'react';
import OpenAIAdapter from './adapters/OpenAIAdapter';
import GeminiAdapter from './adapters/GeminiAdapter';

const saveStorage = (data) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set(data);
  } else {
    Object.keys(data).forEach(key => {
      window.localStorage.setItem(key, data[key]);
    });
  }
};

const getStorage = (keys, callback) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(keys, callback);
  } else {
    const result = {};
    keys.forEach(key => {
      result[key] = window.localStorage.getItem(key) || '';
    });
    callback(result);
  }
};

function App() {
  const [view, setView] = useState('dashboard');
  const [apiKeys, setApiKeys] = useState({ openai: '', gemini: '', anthropic: '' });
  const [providers, setProviders] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    getStorage(['openai_key', 'gemini_key', 'anthropic_key'], (result) => {
      setApiKeys({
        openai: result.openai_key || '',
        gemini: result.gemini_key || '',
        anthropic: result.anthropic_key || '',
      });
    });
  }, []);

  useEffect(() => {
    if (view === 'dashboard') {
      syncData();
    }
  }, [view]);

  const syncData = async () => {
    setIsSyncing(true);
    getStorage(['openai_key', 'gemini_key', 'anthropic_key'], async (result) => {
      const activeProviders = [];

      // Process OpenAI
      if (result.openai_key) {
        try {
          const adapter = new OpenAIAdapter(result.openai_key);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          activeProviders.push({
            name: 'OpenAI',
            type: 'Currency',
            used: 0,
            limit: 0,
            status: 'Error Syncing'
          });
        }
      }

      // Process Gemini
      if (result.gemini_key) {
        try {
          const adapter = new GeminiAdapter(result.gemini_key);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          activeProviders.push({
            name: 'Gemini Pro',
            type: 'Tokens',
            used: 0,
            limit: 0,
            status: 'Error Syncing'
          });
        }
      }

      // Placeholder for Anthropic
      if (result.anthropic_key) {
        activeProviders.push({
          name: 'Anthropic',
          type: 'Currency',
          used: 0,
          limit: 0,
          status: 'Adapter Pending'
        });
      }

      setProviders(activeProviders);
      setIsSyncing(false);
    });
  };

  const handleSave = () => {
    saveStorage({
      openai_key: apiKeys.openai,
      gemini_key: apiKeys.gemini,
      anthropic_key: apiKeys.anthropic,
    });
    setView('dashboard');
  };

  return (
    <div className="w-[400px] h-[550px] bg-[#030712] text-white p-6 relative overflow-hidden flex flex-col gap-6">
      {/* Ambient Background Light Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
      </div>

      {view === 'dashboard' ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <h1 className="tracking-tight font-semibold text-xl text-white flex items-center gap-2">
              AI Credit Monitor
              {isSyncing && (
                <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </h1>
            <button 
              onClick={() => setView('settings')}
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-4 z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {providers.length === 0 && !isSyncing && (
              <div className="flex flex-col items-center justify-center flex-1 h-full text-slate-500 gap-3 mt-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                <p className="text-sm font-medium">No API keys configured.</p>
                <button onClick={() => setView('settings')} className="text-xs text-indigo-400 hover:text-indigo-300">Go to Settings</button>
              </div>
            )}

            {providers.map((provider) => {
              const percent = provider.limit > 0 ? (provider.used / provider.limit) * 100 : 0;
              const isWarning = percent > 80;

              const formatValue = (val) => {
                if (provider.type === 'Currency') {
                  return `$${Number(val).toFixed(2)}`;
                }
                return Number(val).toLocaleString();
              };

              return (
                <div 
                  key={provider.name}
                  className="p-5 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl transition-all duration-300 ease-out hover:border-white/[0.12] hover:bg-white/[0.04] flex flex-col"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-medium text-sm tracking-tight">{provider.name}</span>
                      {provider.status && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                          {provider.status}
                        </span>
                      )}
                      {!provider.status && isWarning && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-sm font-semibold tracking-tight ${isWarning && !provider.status ? 'text-amber-400' : 'text-slate-100'}`}>
                        {formatValue(provider.used)}
                      </span>
                      <span className="text-slate-500 text-xs font-mono font-normal">
                        / {formatValue(provider.limit)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/[0.06] h-1 rounded-full">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        isWarning && !provider.status
                          ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                          : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Settings Header */}
          <div className="flex items-center gap-3 z-10">
            <button 
              onClick={() => setView('dashboard')}
              className="text-slate-400 hover:text-white transition-colors duration-200 p-1 -ml-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <h1 className="tracking-tight font-semibold text-xl text-white">Settings</h1>
          </div>

          <div className="flex flex-col gap-6 z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-5 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl h-full">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">OpenAI API Key</label>
              <input 
                type="password" 
                value={apiKeys.openai}
                onChange={e => setApiKeys({...apiKeys, openai: e.target.value})}
                placeholder="sk-..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all duration-300 placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gemini API Key</label>
              <input 
                type="password" 
                value={apiKeys.gemini}
                onChange={e => setApiKeys({...apiKeys, gemini: e.target.value})}
                placeholder="AIza..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all duration-300 placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Anthropic API Key</label>
              <input 
                type="password" 
                value={apiKeys.anthropic}
                onChange={e => setApiKeys({...apiKeys, anthropic: e.target.value})}
                placeholder="sk-ant-..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all duration-300 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="z-10 mt-auto">
            <button 
              onClick={handleSave}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-all duration-200 active:scale-[0.98]"
            >
              Save Keys
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
