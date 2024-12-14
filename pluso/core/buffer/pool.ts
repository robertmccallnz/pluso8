// core/tokio/buffer-pool.ts
export class BufferPool {
    private pools: Map<number, Buffer[]> = new Map();
    private readonly sizes = [1024, 4096, 16384, 65536];
  
    constructor(private maxPoolSize = 1000) {
      this.sizes.forEach(size => this.pools.set(size, []));
    }
  
    acquire(minSize: number): Buffer {
      const size = this.sizes.find(s => s >= minSize) ?? minSize;
      const pool = this.pools.get(size);
      
      if (pool && pool.length > 0) {
        return pool.pop()!;
      }
      
      return Buffer.allocUnsafe(size);
    }
  
    release(buffer: Buffer) {
      const size = buffer.length;
      const pool = this.pools.get(size);
      
      if (pool && pool.length < this.maxPoolSize) {
        buffer.fill(0);
        pool.push(buffer);
      }
    }
  }