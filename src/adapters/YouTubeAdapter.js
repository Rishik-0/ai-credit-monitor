import BaseAdapter from './BaseAdapter';

export default class YouTubeAdapter extends BaseAdapter {
  async fetchUsage() {
    const start = Date.now();
    try {
      // Make a lightweight fetch call to verify the key against a public channel
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&id=UC_x5XG1OV2P6uZZ5FSM9Ttw&key=${this.apiKey}`);
      
      if (!res.ok) {
        const err = new Error('Failed to verify YouTube API key');
        err.status = res.status;
        throw err;
      }

      const latency = Date.now() - start;
      // Return standardized mock quota data
      return {
        name: 'YouTube API',
        type: 'quota',
        used: 2450,
        limit: 10000,
        details: {
          status: 'Active',
          latency: latency + 'ms',
          lastSynced: new Date().toLocaleTimeString()
        }
      };
    } catch (error) {
      console.error('Error fetching YouTube API usage:', error);
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      return {
        name: 'YouTube API',
        type: 'quota',
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
