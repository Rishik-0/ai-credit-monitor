import BaseAdapter from './BaseAdapter';

export default class ElevenLabsAdapter extends BaseAdapter {
  async fetchUsage() {
    const start = Date.now();
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });
      
      if (!res.ok) {
        const err = new Error('Failed to fetch ElevenLabs usage');
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const latency = Date.now() - start;
      
      return {
        name: 'ElevenLabs',
        type: 'Characters',
        used: data.subscription.character_count,
        limit: data.subscription.character_limit,
        details: {
          status: 'Active',
          latency: latency + 'ms',
          lastSynced: new Date().toLocaleTimeString()
        }
      };
    } catch (error) {
      console.error('Error fetching ElevenLabs usage:', error);
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      return {
        name: 'ElevenLabs',
        type: 'Characters',
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
