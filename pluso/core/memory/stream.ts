// core/tokio/stream-optimizer.ts
export class StreamOptimizer {
    constructor(private bufferPool: BufferPool) {}
  
    async optimizeRead(stream: ReadableStream, hints: {
      expectedSize?: number,
      priority?: number
    } = {}): Promise<Buffer> {
      const { expectedSize = 4096, priority = 5 } = hints;
      const buffer = this.bufferPool.acquire(expectedSize);
      
      try {
        const reader = stream.getReader();
        let offset = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer.set(value, offset);
          offset += value.length;
        }
        
        return buffer.slice(0, offset);
      } finally {
        this.bufferPool.release(buffer);
      }
    }
  
    createOptimizedWriter(stream: WritableStream, batchSize = 16384): WritableStream {
      let batch: Buffer[] = [];
      let batchBytes = 0;
      
      return new WritableStream({
        write(chunk) {
          batch.push(Buffer.from(chunk));
          batchBytes += chunk.length;
          
          if (batchBytes >= batchSize) {
            const combined = Buffer.concat(batch);
            batch = [];
            batchBytes = 0;
            return stream.getWriter().write(combined);
          }
        },
        close() {
          if (batch.length > 0) {
            return stream.getWriter().write(Buffer.concat(batch));
          }
        }
      });
    }
  }