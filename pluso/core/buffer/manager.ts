// core/buffer/manager.ts

import { EventEmitter } from "https://cdn.skypack.dev/events@3.3.0";

export interface BufferStats {
  totalAllocated: number;
  totalFreed: number;
  currentUsage: number;
  peakUsage: number;
}

export class BufferPool extends EventEmitter {
  private buffers: Map<number, Uint8Array[]> = new Map();
  private stats: BufferStats = {
    totalAllocated: 0,
    totalFreed: 0,
    currentUsage: 0,
    peakUsage: 0
  };

  constructor(private maxSize: number = 1024 * 1024 * 100) { // 100MB default
    super();
  }

  acquire(size: number): Uint8Array {
    const bufferList = this.buffers.get(size) || [];
    
    if (bufferList.length > 0) {
      const buffer = bufferList.pop()!;
      this.updateStats('acquire', size);
      return buffer;
    }

    const newBuffer = new Uint8Array(size);
    this.updateStats('new', size);
    return newBuffer;
  }

  release(buffer: Uint8Array): void {
    const size = buffer.length;
    const bufferList = this.buffers.get(size) || [];
    
    if (this.stats.currentUsage + size <= this.maxSize) {
      bufferList.push(buffer);
      this.buffers.set(size, bufferList);
    }
    
    this.updateStats('release', size);
  }

  private updateStats(operation: 'new' | 'acquire' | 'release', size: number): void {
    switch (operation) {
      case 'new':
      case 'acquire':
        this.stats.currentUsage += size;
        this.stats.totalAllocated += size;
        break;
      case 'release':
        this.stats.currentUsage -= size;
        this.stats.totalFreed += size;
        break;
    }

    if (this.stats.currentUsage > this.stats.peakUsage) {
      this.stats.peakUsage = this.stats.currentUsage;
    }

    this.emit('stats', { ...this.stats });
  }

  getStats(): BufferStats {
    return { ...this.stats };
  }

  reset(): void {
    this.buffers.clear();
    this.stats = {
      totalAllocated: 0,
      totalFreed: 0,
      currentUsage: 0,
      peakUsage: 0
    };
    this.emit('reset');
  }
}

export const globalBufferPool = new BufferPool();