import BaseAdapter from './BaseAdapter';

export default class AnthropicAdapter extends BaseAdapter {
  async fetchUsage() {
    const start = Date.now();
    try {
      // Make a minimal request to verify the Anthropic API key
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }]
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // Anthropic returns 401 for invalid keys (authentication_error).
        // 400/403/429 might indicate a valid key but out of quota/credits, which we handle gracefully.
        if (res.status === 401 || (errorData.error && errorData.error.type === 'authentication_error')) {
          const err = new Error('Invalid Anthropic API key');
          err.status = res.status;
          throw err;
        }
      }

      const latency = Date.now() - start;
      // Return mock data as requested
      return {
        name: 'Anthropic',
        type: 'Currency',
        used: null,
        limit: null,
        details: {
          status: 'Active',
          latency: latency + 'ms',
          lastSynced: new Date().toLocaleTimeString()
        }
      };
    } catch (error) {
      console.error('Error fetching Anthropic usage:', error);
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      return {
        name: 'Anthropic',
        type: 'Currency',
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
