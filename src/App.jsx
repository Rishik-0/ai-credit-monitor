import React, { useState, useEffect } from 'react';

const mockProviders = [
  { name: 'OpenAI', type: 'Currency', used: 4.50, limit: 10.00 },
  { name: 'Gemini Pro', type: 'Tokens', used: 12000, limit: 50000 },
  { name: 'Anthropic', type: 'Currency', used: 18.20, limit: 20.00 },
];

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

  // Load keys when the settings view opens (or on mount)
  useEffect(() => {
    getStorage(['openai_key', 'gemini_key', 'anthropic_key'], (result) => {
      setApiKeys({
        openai: result.openai_key || '',
        gemini: result.gemini_key || '',
        anthropic: result.anthropic_key || '',
      });
    });
  }, []);

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
            <h1 className="tracking-tight font-semibold text-xl text-white">AI Credit Monitor</h1>
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
            {mockProviders.map((provider) => {
              const percent = (provider.used / provider.limit) * 100;
              const isWarning = percent > 80;

              const formatValue = (val) => {
                if (provider.type === 'Currency') {
                  return `$${val.toFixed(2)}`;
                }
                return val.toLocaleString();
              };

              return (
                <div 
                  key={provider.name}
                  className="p-5 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl transition-all duration-300 ease-out hover:border-white/[0.12] hover:bg-white/[0.04] flex flex-col"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-medium text-sm tracking-tight">{provider.name}</span>
                      {isWarning && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-sm font-semibold tracking-tight ${isWarning ? 'text-amber-400' : 'text-slate-100'}`}>
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
                        isWarning 
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
