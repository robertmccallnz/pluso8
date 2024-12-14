// tests/metrics.test.ts
describe('PerformanceMonitor', () => {
    const monitor = new PerformanceMonitor(5);
  
    it('should track metric history', () => {
      const values = [1, 2, 3, 4, 5];
      values.forEach(v => monitor.record('test', v));
  
      const metrics = monitor.getMetrics('test');
      expect(metrics?.current).toBe(5);
      expect(metrics?.min).toBe(1);
      expect(metrics?.max).toBe(5);
      expect(metrics?.avg).toBe(3);
    });
  
    it('should maintain history size limit', () => {
      const values = [1, 2, 3, 4, 5, 6];
      values.forEach(v => monitor.record('test2', v));
  
      const metrics = monitor.getMetrics('test2');
      expect(metrics?.history.length).toBe(5);
      expect(metrics?.history[0]).toBe(2);
    });
  });
  Last edited 4 minutes ago
  
  
  
  