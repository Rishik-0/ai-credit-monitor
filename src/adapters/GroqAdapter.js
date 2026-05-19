import BaseAdapter from './BaseAdapter';

export default class GroqAdapter extends BaseAdapter {
  async fetchUsage() {
    const start = Date.now();
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!res.ok) {
        const err = new Error('Failed to fetch Groq usage');
        err.status = res.status;
        throw err;
      }

      const latency = Date.now() - start;
      
      return {
        name: 'Groq',
        type: 'Ping',
        used: null,
        limit: null,
        details: {
          status: 'Active',
          latency: latency + 'ms',
          lastSynced: new Date().toLocaleTimeString()
        }
      };
    } catch (error) {
      console.error('Error fetching Groq usage:', error);
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      return {
        name: 'Groq',
        type: 'Ping',
        used: null,
        limit: null,
        details: {
          status: is429 ? 'Rate Limited' : 'Error',
          latency: '-',
          lastSynced: '-'
        }
      };
    }
  }
}
