export default class BaseAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchUsage() {
    throw new Error('Not Implemented');
  }
}
