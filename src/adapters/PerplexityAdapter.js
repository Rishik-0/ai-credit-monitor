import BaseAdapter from './BaseAdapter';

export default class PerplexityAdapter extends BaseAdapter {
  async fetchUsage() {
    const start = Date.now();
    try {
      const res = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          model: 'sonar-small-chat', 
          messages: [{ role: 'user', content: 'ping' }], 
          max_tokens: 1 
        })
      });
      
      if (!res.ok) {
        const err = new Error('Failed to fetch Perplexity usage');
        err.status = res.status;
        throw err;
      }

      const latency = Date.now() - start;
      
      return {
        name: 'Perplexity',
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
      console.error('Error fetching Perplexity usage:', error);
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      return {
        name: 'Perplexity',
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
