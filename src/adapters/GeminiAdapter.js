import BaseAdapter from './BaseAdapter';

export default class GeminiAdapter extends BaseAdapter {
  async fetchUsage() {
    try {
      // Hit a standard Gemini API endpoint to verify the key is valid
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`);
      
      if (!res.ok) {
        throw new Error(`Failed to verify Gemini API key (status: ${res.status})`);
      }

      // Return mock quota data as requested for the lightweight extension
      return {
        name: 'Gemini Pro',
        type: 'Tokens',
        used: 12500,
        limit: 50000
      };
    } catch (error) {
      console.error('Error fetching Gemini usage:', error);
      throw error;
    }
  }
}
