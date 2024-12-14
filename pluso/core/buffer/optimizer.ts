// core/buffer/optimizer.ts

import { Buffer } from "node:buffer";
import { BufferPool } from "./manager.ts";

interface OptimizationResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
}

export class BufferOptimizer {
  private bufferPool: BufferPool;
  private readonly pageSize: number;
  private alignmentCache: Map<number, number>;

  constructor(poolOptions = {}) {
    this.bufferPool = new BufferPool(poolOptions);
    this.pageSize = 4096; // Default page size
    this.alignmentCache = new Map();
  }

  async optimizeBuffer(data: Buffer | ArrayBuffer): Promise<OptimizationResult> {
    try {
      const size = data instanceof Buffer ? data.length : data.byteLength;
      const alignedSize = this.getAlignedSize(size);
      
      const buffer = this.bufferPool.acquire(alignedSize);
      if (!buffer) {
        return {
          success: false,
          error: "Failed to acquire buffer from pool"
        };
      }

      if (data instanceof Buffer) {
        data.copy(buffer);
      } else {
        new Uint8Array(buffer).set(new Uint8Array(data));
      }

      return {
        success: true,
        buffer
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async optimizeBatch(buffers: (Buffer | ArrayBuffer)[]): Promise<OptimizationResult[]> {
    return Promise.all(buffers.map(buffer => this.optimizeBuffer(buffer)));
  }

  releaseOptimizedBuffer(buffer: Buffer): void {
    this.bufferPool.release(buffer);
  }

  private getAlignedSize(size: number): number {
    if (this.alignmentCache.has(size)) {
      return this.alignmentCache.get(size)!;
    }

    // Align to the next page size
    const aligned = Math.ceil(size / this.pageSize) * this.pageSize;
    this.alignmentCache.set(size, aligned);
    return aligned;
  }

  // V8-specific optimizations
  async optimizeForV8(data: ArrayBuffer): Promise<OptimizationResult> {
    // Ensure the buffer is aligned for V8's memory layout
    const size = data.byteLength;
    const alignedSize = this.getAlignedSize(size);
    
    try {
      // Request an optimized buffer from the pool
      const buffer = this.bufferPool.acquire(alignedSize);
      if (!buffer) {
        return {
          success: false,
          error: "Failed to acquire V8-optimized buffer"
        };
      }

      // Copy data with optimized alignment
      const view = new Uint8Array(data);
      const optimizedView = new Uint8Array(buffer.buffer, buffer.byteOffset, size);
      optimizedView.set(view);

      return {
        success: true,
        buffer
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Monitor and collect optimization metrics
  getOptimizationMetrics() {
    return {
      poolStats: this.bufferPool.getStats(),
      alignmentCacheSize: this.alignmentCache.size,
      pageSize: this.pageSize
    };
  }

  // Reset the optimizer state
  reset(): void {
    this.bufferPool.reset();
    this.alignmentCache.clear();
  }
}

// Export a singleton instance
export const globalBufferOptimizer = new BufferOptimizer();