import React from 'react';

export default function DashboardView({ providers, isSyncing, isCoolingDown, syncData, setView, setActiveProvider }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-4">
        <h1 className="tracking-tight font-semibold text-xl text-white flex items-center gap-2">
          AI Credit Monitor
          {isSyncing && (
            <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={syncData}
            disabled={isSyncing || isCoolingDown}
            title={isCoolingDown ? 'Refresh available in 15 seconds' : 'Refresh Data'}
            className={`text-slate-400 hover:text-white transition-colors duration-200 ${(isSyncing || isCoolingDown) ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={isSyncing ? 'animate-spin' : ''}
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
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
              onClick={() => setActiveProvider(provider)}
              className="p-5 bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl transition-all duration-300 ease-out hover:border-white/[0.12] hover:bg-white/[0.04] flex flex-col cursor-pointer"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium text-sm tracking-tight">{provider.name}</span>
                  {provider.details && provider.details.status !== 'Active' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                      {provider.details.status}
                    </span>
                  )}
                  {(!provider.details || provider.details.status === 'Active') && isWarning && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Critical
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  {provider.used === null ? (
                    <span className="text-sm font-semibold tracking-tight text-slate-400">
                      {provider.details?.status || 'Connected'}
                    </span>
                  ) : (
                    <>
                      <span className={`text-sm font-semibold tracking-tight ${isWarning && (!provider.details || provider.details.status === 'Active') ? 'text-amber-400' : 'text-slate-100'}`}>
                        {formatValue(provider.used)}
                      </span>
                      <span className="text-slate-500 text-xs font-mono font-normal">
                        / {provider.limit === null ? 'Unlimited' : formatValue(provider.limit)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              {(provider.limit !== null && provider.limit > 0) && (
                <div className="w-full bg-white/[0.06] h-1 rounded-full">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isWarning && (!provider.details || provider.details.status === 'Active')
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                        : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
