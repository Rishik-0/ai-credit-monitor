import BaseAdapter from './BaseAdapter';

export default class OpenAIAdapter extends BaseAdapter {
  async fetchUsage() {
    try {
      // Calculate dates for the current billing cycle (start of month to today/end of month)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      // Standard headers
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      // Fetch subscription to get hard limit
      const subRes = await fetch('https://api.openai.com/v1/dashboard/billing/subscription', { headers });
      let limit = 0;
      if (subRes.ok) {
        const subData = await subRes.json();
        limit = subData.hard_limit_usd || 0;
      }

      // Fetch usage to get current consumption
      const usageRes = await fetch(`https://api.openai.com/v1/dashboard/billing/usage?start_date=${firstDay}&end_date=${lastDay}`, { headers });
      let used = 0;
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        // total_usage is typically in cents, converting to dollars
        used = (usageData.total_usage || 0) / 100;
      }

      if (!subRes.ok && !usageRes.ok) {
        throw new Error('Failed to fetch data from OpenAI API (check API key permissions)');
      }

      return {
        name: 'OpenAI',
        type: 'Currency',
        used: used,
        limit: limit
      };
    } catch (error) {
      console.error('Error fetching OpenAI usage:', error);
      throw error;
    }
  }
}
