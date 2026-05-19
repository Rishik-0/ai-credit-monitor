import BaseAdapter from './BaseAdapter';

export default class OpenRouterAdapter extends BaseAdapter {
  async fetchUsage() {
    const start = Date.now();
    try {
      const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!res.ok) {
        const err = new Error('Failed to fetch OpenRouter usage');
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const latency = Date.now() - start;
      
      return {
        name: 'OpenRouter',
        type: 'Credits',
        used: data.data.usage,
        limit: data.data.limit,
        details: {
          status: 'Active',
          latency: latency + 'ms',
          lastSynced: new Date().toLocaleTimeString()
        }
      };
    } catch (error) {
      console.error('Error fetching OpenRouter usage:', error);
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      return {
        name: 'OpenRouter',
        type: 'Credits',
        used: 0,
        limit: 0,
        details: {
          status: is429 ? 'Rate Limited' : 'Error',
          latency: '-',
          lastSynced: '-'
        }
      };
    }
  }
}
