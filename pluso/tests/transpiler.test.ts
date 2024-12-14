// tests/transpiler.test.ts
import { describe, it, expect } from 'vitest';
import { TranspilationPipeline, TranspileOptions } from '../core/transpiler/pipeline';

describe('TranspilationPipeline', () => {
  const pipeline = new TranspilationPipeline();
  const defaultOptions: TranspileOptions = {
    target: 'es2023',
    module: 'es6',
    sourceMaps: true,
    minify: false
  };

  it('should transpile TypeScript code', async () => {
    const source = `
      interface User {
        name: string;
        age: number;
      }
      
      const user: User = {
        name: "Test",
        age: 30
      };
    `;

    const result = await pipeline.transpile(source, defaultOptions);
    expect(result.code).toBeDefined();
    expect(result.metrics).toBeDefined();
  });

  it('should handle decorators when enabled', async () => {
    const source = `
      @decorator
      class TestClass {
        @property
        test() {}
      }
    `;

    const options = {
      ...defaultOptions,
      experimentalDecorators: true
    };

    const result = await pipeline.transpile(source, options);
    expect(result.code).toBeDefined();
    expect(result.metrics).toBeDefined();
  });

  it('should generate source maps when enabled', async () => {
    const source = `
      const x = 1;
      const y = 2;
      console.log(x + y);
    `;

    const result = await pipeline.transpile(source, {
      ...defaultOptions,
      sourceMaps: true
    });

    expect(result.sourceMap).toBeDefined();
  });

  it('should minify code when enabled', async () => {
    const source = `
      function test() {
        const longVariableName = "test";
        console.log(longVariableName);
      }
    `;

    const result = await pipeline.transpile(source, {
      ...defaultOptions,
      minify: true
    });