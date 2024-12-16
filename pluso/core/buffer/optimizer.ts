// core/buffer/optimizer.ts

export class BufferOptimizer {
  private readonly maxSize: number;
  private readonly minSize: number;
  private readonly growthFactor: number;
  private readonly shrinkFactor: number;

  constructor(
    maxSize: number = 1024 * 1024, // 1MB
    minSize: number = 1024,        // 1KB
    growthFactor: number = 2,
    shrinkFactor: number = 0.5
  ) {
    this.maxSize = maxSize;
    this.minSize = minSize;
    this.growthFactor = growthFactor;
    this.shrinkFactor = shrinkFactor;
  }

  optimizeSize(currentSize: number, requiredSize: number): number {
    if (requiredSize <= 0) {
      return this.minSize;
    }

    if (requiredSize > this.maxSize) {
      return this.maxSize;
    }

    // If current size is sufficient, keep it
    if (currentSize >= requiredSize && currentSize <= this.maxSize) {
      // Check if we should shrink
      if (currentSize > this.minSize && requiredSize < currentSize * this.shrinkFactor) {
        return Math.max(
          this.minSize,
          Math.ceil(currentSize * this.shrinkFactor)
        );
      }
      return currentSize;
    }

    // Need to grow
    let newSize = currentSize;
    while (newSize < requiredSize) {
      newSize = Math.ceil(newSize * this.growthFactor);
    }

    return Math.min(newSize, this.maxSize);
  }

  shouldReallocate(currentSize: number, requiredSize: number): boolean {
    if (requiredSize > currentSize) {
      return true;
    }

    // Check if buffer is significantly larger than needed
    return currentSize > this.minSize && 
           requiredSize < currentSize * this.shrinkFactor;
  }

  getNextPowerOfTwo(size: number): number {
    let power = 1;
    while (power < size) {
      power *= 2;
    }
    return Math.min(power, this.maxSize);
  }

  alignToBlockSize(size: number, blockSize: number = 4096): number {
    return Math.ceil(size / blockSize) * blockSize;
  }
}

// Export a singleton instance
export const globalBufferOptimizer = new BufferOptimizer();