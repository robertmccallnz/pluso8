// core/buffer/manager.ts

import { Buffer } from "node:buffer";
import { EventEmitter } from "node:events";

export interface BufferStats {
  totalAllocated: number;
  activeBuffers: number;
  averageSize: number;
  peakMemoryUsage: number;
}

export interface BufferPoolOptions {
  maxPoolSize: number;  // Maximum size in bytes
  initialSize: number;  // Initial pool size in bytes
  growthFactor: number; // How much to grow pool when needed
  shrinkThreshold: number; // When to shrink pool (0-1)
}

export class BufferPool extends EventEmitter {
  private pools: Map<number, Buffer[]>;
  private stats: BufferStats;
  private options: BufferPoolOptions;
  
  constructor(options: Partial<BufferPoolOptions> = {}) {
    super();
    this.options = {
      maxPoolSize: options.maxPoolSize || 1024 * 1024 * 100, // 100MB
      initialSize: options.initialSize || 1024 * 1024,       // 1MB
      growthFactor: options.growthFactor || 1.5,
      shrinkThreshold: options.shrinkThreshold || 0.3
    };
    
    this.pools = new Map();
    this.stats = {
      totalAllocated: 0,
      activeBuffers: 0,
      averageSize: 0,
      peakMemoryUsage: 0
    };
    
    this.initializePool();
  }

  private initializePool(): void {
    // Initialize with common buffer sizes
    const sizes = [1024, 4096, 16384, 65536];
    for (const size of sizes) {
      this.pools.set(size, []);
      this.allocateNewBuffers(size, Math.floor(this.options.initialSize / size));
    }
  }

  private allocateNewBuffers(size: number, count: number): void {
    const pool = this.pools.get(size) || [];
    for (let i = 0; i < count; i++) {
      const buffer = Buffer.allocUnsafe(size);
      pool.push(buffer);
      this.stats.totalAllocated += size;
    }
    this.pools.set(size, pool);
    this.updateStats();
  }

  acquire(size: number): Buffer | null {
    // Find the smallest buffer size that fits the request
    const poolSize = this.findOptimalPoolSize(size);
    if (!poolSize) return null;

    let pool = this.pools.get(poolSize);
    if (!pool || pool.length === 0) {
      this.allocateNewBuffers(poolSize, Math.ceil(this.options.growthFactor));
      pool = this.pools.get(poolSize);
    }

    const buffer = pool!.pop();
    if (buffer) {
      this.stats.activeBuffers++;
      this.updateStats();
      return buffer;
    }

    return null;
  }

  release(buffer: Buffer): void {
    const size = buffer.length;
    const pool = this.pools.get(size);
    
    if (pool) {
      // Clear the buffer before returning to pool
      buffer.fill(0);
      pool.push(buffer);
      this.stats.activeBuffers--;
      this.updateStats();
      
      // Check if we should shrink the pool
      if (pool.length / this.getMaxBuffersForSize(size) > this.options.shrinkThreshold) {
        this.shrinkPool(size);
      }
    }
  }

  private findOptimalPoolSize(size: number): number | null {
    const sizes = Array.from(this.pools.keys()).sort((a, b) => a - b);
    for (const poolSize of sizes) {
      if (poolSize >= size) return poolSize;
    }
    return null;
  }

  private getMaxBuffersForSize(size: number): number {
    return Math.floor(this.options.maxPoolSize / size);
  }

  private shrinkPool(size: number): void {
    const pool = this.pools.get(size);
    if (!pool) return;

    const maxBuffers = this.getMaxBuffersForSize(size);
    const targetSize = Math.ceil(maxBuffers * this.options.shrinkThreshold);
    
    while (pool.length > targetSize) {
      pool.pop();
      this.stats.totalAllocated -= size;
    }
    
    this.updateStats();
  }

  private updateStats(): void {
    this.stats.peakMemoryUsage = Math.max(
      this.stats.peakMemoryUsage,
      this.stats.totalAllocated
    );
    
    if (this.stats.activeBuffers > 0) {
      this.stats.averageSize = this.stats.totalAllocated / this.stats.activeBuffers;
    }
    
    this.emit('stats-update', this.getStats());
  }

  getStats(): BufferStats {
    return { ...this.stats };
  }

  reset(): void {
    this.pools.clear();
    this.stats = {
      totalAllocated: 0,
      activeBuffers: 0,
      averageSize: 0,
      peakMemoryUsage: 0
    };
    this.initializePool();
  }
}