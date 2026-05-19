import React, { useState, useEffect } from 'react';
import OpenAIAdapter from './adapters/OpenAIAdapter';
import GeminiAdapter from './adapters/GeminiAdapter';
import AnthropicAdapter from './adapters/AnthropicAdapter';
import YouTubeAdapter from './adapters/YouTubeAdapter';
import OpenRouterAdapter from './adapters/OpenRouterAdapter';
import GroqAdapter from './adapters/GroqAdapter';
import ReplicateAdapter from './adapters/ReplicateAdapter';
import { encryptKey, decryptKey } from './utils/encryption';
import SettingsView from './components/SettingsView';
import DashboardView from './components/DashboardView';
import DetailView from './components/DetailView';

const saveStorage = (data) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set(data);
  } else {
    Object.keys(data).forEach(key => {
      let valueToStore = data[key];
      if (typeof valueToStore === 'object' && valueToStore !== null) {
        valueToStore = JSON.stringify(valueToStore);
      }
      window.localStorage.setItem(key, valueToStore);
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
  const [apiKeys, setApiKeys] = useState({ openai: '', gemini: '', anthropic: '', youtube: '', openrouter: '', groq: '', replicate: '' });
  const [providers, setProviders] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [activeProvider, setActiveProvider] = useState(null);

  const isCoolingDown = Date.now() - lastSyncTime < 15000;

  useEffect(() => {
    getStorage(['openai_key', 'gemini_key', 'anthropic_key', 'youtube_key', 'openrouter_key', 'groq_key', 'replicate_key', 'last_sync_time', 'cached_providers'], (result) => {
      setApiKeys({
        openai: decryptKey(result.openai_key),
        gemini: decryptKey(result.gemini_key),
        anthropic: decryptKey(result.anthropic_key),
        youtube: decryptKey(result.youtube_key),
        openrouter: decryptKey(result.openrouter_key),
        groq: decryptKey(result.groq_key),
        replicate: decryptKey(result.replicate_key),
      });
      setLastSyncTime(result.last_sync_time ? parseInt(result.last_sync_time, 10) : 0);
      
      // Phase 1: Stale-While-Revalidate Implementation
      if (result.cached_providers) {
        try {
          const cached = typeof result.cached_providers === 'string' ? JSON.parse(result.cached_providers) : result.cached_providers;
          setProviders(cached);
        } catch (e) {
          console.error("Failed to parse cached providers", e);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (view === 'dashboard') {
      syncData();
    }
    
    // Auto-poll every 2 minutes when on the dashboard
    let intervalId;
    if (view === 'dashboard') {
      intervalId = setInterval(() => {
        syncData();
      }, 120000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [view]);

  const syncData = async () => {
    if (Date.now() - lastSyncTime < 15000) return;
    setIsSyncing(true);
    getStorage(['openai_key', 'gemini_key', 'anthropic_key', 'youtube_key', 'openrouter_key', 'groq_key', 'replicate_key'], async (result) => {
      const activeProviders = [];

      const openAiKeyDecrypted = decryptKey(result.openai_key);
      if (openAiKeyDecrypted) {
        try {
          const adapter = new OpenAIAdapter(openAiKeyDecrypted);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          console.error('Error in OpenAIAdapter flow:', error);
        }
      }

      const geminiKeyDecrypted = decryptKey(result.gemini_key);
      if (geminiKeyDecrypted) {
        try {
          const adapter = new GeminiAdapter(geminiKeyDecrypted);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          console.error('Error in GeminiAdapter flow:', error);
        }
      }

      const anthropicKeyDecrypted = decryptKey(result.anthropic_key);
      if (anthropicKeyDecrypted) {
        try {
          const adapter = new AnthropicAdapter(anthropicKeyDecrypted);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          console.error('Error in AnthropicAdapter flow:', error);
        }
      }

      const youtubeKeyDecrypted = decryptKey(result.youtube_key);
      if (youtubeKeyDecrypted) {
        try {
          const adapter = new YouTubeAdapter(youtubeKeyDecrypted);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          console.error('Error in YouTubeAdapter flow:', error);
        }
      }

      const openRouterKeyDecrypted = decryptKey(result.openrouter_key);
      if (openRouterKeyDecrypted) {
        try {
          const adapter = new OpenRouterAdapter(openRouterKeyDecrypted);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          console.error('Error in OpenRouterAdapter flow:', error);
        }
      }

      const groqKeyDecrypted = decryptKey(result.groq_key);
      if (groqKeyDecrypted) {
        try {
          const adapter = new GroqAdapter(groqKeyDecrypted);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          console.error('Error in GroqAdapter flow:', error);
        }
      }

      const replicateKeyDecrypted = decryptKey(result.replicate_key);
      if (replicateKeyDecrypted) {
        try {
          const adapter = new ReplicateAdapter(replicateKeyDecrypted);
          const data = await adapter.fetchUsage();
          activeProviders.push(data);
        } catch (error) {
          console.error('Error in ReplicateAdapter flow:', error);
        }
      }

      setProviders(activeProviders);
      const newSyncTime = Date.now();
      setLastSyncTime(newSyncTime);
      saveStorage({ last_sync_time: newSyncTime, cached_providers: activeProviders });
      setIsSyncing(false);
    });
  };

  const handleSave = () => {
    saveStorage({
      openai_key: encryptKey(apiKeys.openai),
      gemini_key: encryptKey(apiKeys.gemini),
      anthropic_key: encryptKey(apiKeys.anthropic),
      youtube_key: encryptKey(apiKeys.youtube),
      openrouter_key: encryptKey(apiKeys.openrouter),
      groq_key: encryptKey(apiKeys.groq),
      replicate_key: encryptKey(apiKeys.replicate),
      last_sync_time: 0,
      openai_alert_sent: false,
      gemini_pro_alert_sent: false,
      anthropic_alert_sent: false,
      youtube_api_alert_sent: false,
      openrouter_alert_sent: false,
      groq_alert_sent: false,
      replicate_alert_sent: false,
    });
    setLastSyncTime(0);
    setView('dashboard');
  };

  return (
    <div className="w-[400px] h-[550px] bg-[#030712] text-white p-6 relative overflow-hidden flex flex-col gap-6">
      {/* Ambient Background Light Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Routed Views */}
      <div className="z-10 flex flex-col h-full overflow-hidden">
        {view === 'dashboard' ? (
          activeProvider ? (
            <DetailView activeProvider={activeProvider} setActiveProvider={setActiveProvider} />
          ) : (
            <DashboardView 
              providers={providers} 
              isSyncing={isSyncing} 
              isCoolingDown={isCoolingDown} 
              syncData={syncData} 
              setView={setView} 
              setActiveProvider={setActiveProvider} 
            />
          )
        ) : (
          <SettingsView 
            apiKeys={apiKeys} 
            setApiKeys={setApiKeys} 
            handleSave={handleSave} 
            setView={setView} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
