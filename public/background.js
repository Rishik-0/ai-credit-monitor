chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkApiUsage', { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkApiUsage') {
    chrome.storage.local.get(['cached_providers'], (result) => {
      if (result.cached_providers) {
        try {
          const providers = typeof result.cached_providers === 'string' 
            ? JSON.parse(result.cached_providers) 
            : result.cached_providers;
            
          providers.forEach(provider => {
            const percent = provider.limit > 0 ? (provider.used / provider.limit) : 0;
            if (percent > 0.90) {
              const alertKey = `${provider.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_alert_sent`;
              chrome.storage.local.get([alertKey], (alertResult) => {
                if (!alertResult[alertKey]) {
                  // Alert not sent yet, send it
                  chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // transparent pixel fallback
                    title: 'API Limit Warning',
                    message: `WARNING: ${provider.name} usage is at ${Math.round(percent * 100)}% of your limit!`
                  });
                  chrome.storage.local.set({ [alertKey]: true });
                }
              });
            }
          });
        } catch (e) {
          console.error("Failed to check background alarms:", e);
        }
      }
    });
  }
});
