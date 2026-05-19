import React from 'react';

export default function DetailView({ activeProvider, setActiveProvider }) {
  if (!activeProvider) return null;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-3 z-10">
        <button 
          onClick={() => setActiveProvider(null)}
          className="text-slate-400 hover:text-white transition-colors duration-200 p-1 -ml-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="tracking-tight font-semibold text-xl text-white ml-auto">{activeProvider.name}</h1>
      </div>

      <div className="flex flex-col gap-6 z-10 flex-1">
        {/* Usage Bar */}
        <div className="p-5 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl">
          <div className="flex justify-between items-end mb-3">
            <span className="text-slate-400 text-sm font-medium">Usage</span>
            <div className="flex items-baseline gap-1">
              {activeProvider.used === null ? (
                <span className="text-xl font-semibold tracking-tight text-slate-400">
                  {activeProvider.details?.status || 'Connected'}
                </span>
              ) : (
                <>
                  <span className="text-xl font-semibold tracking-tight text-slate-100">
                    {activeProvider.type === 'Currency' ? `$${Number(activeProvider.used).toFixed(2)}` : Number(activeProvider.used).toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-sm font-mono font-normal">
                    / {activeProvider.limit === null ? 'Unlimited' : (activeProvider.type === 'Currency' ? `$${Number(activeProvider.limit).toFixed(2)}` : Number(activeProvider.limit).toLocaleString())}
                  </span>
                </>
              )}
            </div>
          </div>
          {(activeProvider.limit !== null && activeProvider.limit > 0) && (
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full">
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  (activeProvider.limit > 0 ? (activeProvider.used / activeProvider.limit) * 100 : 0) > 80 && activeProvider.details?.status === 'Active'
                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                    : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                }`}
                style={{ width: `${Math.min((activeProvider.limit > 0 ? (activeProvider.used / activeProvider.limit) * 100 : 0), 100)}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                activeProvider.details?.status === 'Active' 
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' 
                  : activeProvider.details?.status === 'Rate Limited' 
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                    : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'
              }`}></div>
              <span className="text-slate-200 text-sm font-medium">{activeProvider.details?.status || 'Error'}</span>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Latency</span>
            <span className="text-slate-200 text-sm font-medium">{activeProvider.details?.latency || '-'}</span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl flex flex-col gap-1 col-span-2">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Last Synced</span>
            <span className="text-slate-200 text-sm font-medium">{activeProvider.details?.lastSynced || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
