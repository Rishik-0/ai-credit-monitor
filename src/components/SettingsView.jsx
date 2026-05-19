import React, { useState } from 'react';

const apiConfigs = [
  { id: 'openrouter', name: 'OpenRouter', placeholder: 'sk-or-v1-...' },
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-proj-...' },
  { id: 'gemini', name: 'Gemini', placeholder: 'AIzaSy...' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'youtube', name: 'YouTube Data v3', placeholder: 'AIzaSy...' },
  { id: 'groq', name: 'Groq', placeholder: 'gsk_...' },
  { id: 'replicate', name: 'Replicate', placeholder: 'r8_...' },
  { id: 'elevenlabs', name: 'ElevenLabs', placeholder: 'xi-...' },
  { id: 'huggingface', name: 'Hugging Face', placeholder: 'hf_...' },
  { id: 'perplexity', name: 'Perplexity', placeholder: 'pplx-...' }
];

export default function SettingsView({ apiKeys, setApiKeys, handleSave, setView }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAPIs = apiConfigs.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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

      <div className="flex flex-col gap-4 z-10 flex-1 overflow-hidden h-full mt-4">
        {/* Search Bar */}
        <div className="w-full relative shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search providers..."
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all duration-300 placeholder:text-slate-500"
          />
        </div>

        {/* Dynamic Inputs List */}
        <div className="flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:hidden p-5 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl flex-1">
          {filteredAPIs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <p className="text-sm">No providers found</p>
            </div>
          ) : (
            filteredAPIs.map(api => (
              <div key={api.id} className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{api.name} API Key</label>
                <input 
                  type="password" 
                  value={apiKeys[api.id] || ''}
                  onChange={e => setApiKeys({...apiKeys, [api.id]: e.target.value})}
                  placeholder={api.placeholder}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all duration-300 placeholder:text-slate-600"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="z-10 mt-auto pt-4 shrink-0">
        <button 
          onClick={handleSave}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-all duration-200 active:scale-[0.98]"
        >
          Save Keys
        </button>
      </div>
    </>
  );
}
