import BaseAdapter from './BaseAdapter';

export default class HuggingFaceAdapter extends BaseAdapter {
  async fetchUsage() {
    const start = Date.now();
    try {
      const res = await fetch('https://huggingface.co/api/whoami-v2', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!res.ok) {
        const err = new Error('Failed to fetch Hugging Face usage');
        err.status = res.status;
        throw err;
      }

      const latency = Date.now() - start;
      
      return {
        name: 'Hugging Face',
        type: 'API',
        used: null,
        limit: null,
        details: {
          status: 'Active',
          latency: latency + 'ms',
          lastSynced: new Date().toLocaleTimeString()
        }
      };
    } catch (error) {
      console.error('Error fetching Hugging Face usage:', error);
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      return {
        name: 'Hugging Face',
        type: 'API',
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
