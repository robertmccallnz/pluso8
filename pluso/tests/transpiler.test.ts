// tests/transpiler.test.ts
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { TranspilationPipeline, TranspileOptions } from '../core/transpiler/pipeline.ts';

Deno.test("TranspilationPipeline", async (t) => {
  const pipeline = new TranspilationPipeline();
  const defaultOptions: TranspileOptions = {
    target: 'es2022',
    module: 'es6',
    sourceMaps: true,
    minify: false
  };

  await t.step("should transpile TypeScript code", async () => {
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
    assertEquals(typeof result.code, "string");
    assertEquals(typeof result.metrics, "object");
  });

  await t.step("should handle decorators when enabled", async () => {
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
    assertEquals(typeof result.code, "string");
    assertEquals(typeof result.metrics, "object");
  });

  await t.step("should generate source maps when enabled", async () => {
    const source = `
      const x = 1;
      const y = 2;
      console.log(x + y);
    `;

    const result = await pipeline.transpile(source, {
      ...defaultOptions,
      sourceMaps: true
    });

    assertEquals(typeof result.sourceMap, "object");
  });

  await t.step("should minify code when enabled", async () => {
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
    
    assertEquals(typeof result.code, "string");
    assertEquals(result.code.length < source.length, true);
  });
});