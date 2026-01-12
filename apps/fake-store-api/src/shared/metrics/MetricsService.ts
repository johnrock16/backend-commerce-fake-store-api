type Counters = Record<string, number>;

export class MetricsService {
  private counters: Counters = {};

  increment(metric: string, value = 1) {
    if (!this.counters[metric]) this.counters[metric] = 0;
    this.counters[metric] += value;
  }

  get(metric: string) {
    return this.counters[metric] || 0;
  }

  getAll() {
    return { ...this.counters };
  }
}

export const metricsService = new MetricsService();
