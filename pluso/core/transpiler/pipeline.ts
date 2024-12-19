// core/transpiler/pipeline.ts
import { transform } from "https://deno.land/x/swc@0.2.1/mod.ts";
import type { Config } from "https://deno.land/x/swc@0.2.1/mod.ts";

export interface TranspileOptions {
  target: string;
  module: string;
  sourceMaps: boolean;
  minify: boolean;
  experimentalDecorators?: boolean;
}

export interface TranspileResult {
  code: string;
  sourceMap?: object;
  metrics: {
    inputSize: number;
    outputSize: number;
    duration: number;
  };
}

export class TranspilationPipeline {
  async transpile(source: string, options: TranspileOptions): Promise<TranspileResult> {
    const startTime = performance.now();

    try {
      const swcOptions: Config = {
        jsc: {
          target: options.target,
          parser: {
            syntax: "typescript",
            decorators: options.experimentalDecorators
          }
        },
        module: {
          type: options.module
        },
        minify: options.minify,
        sourceMaps: options.sourceMaps
      };

      const result = await transform(source, swcOptions);

      return {
        code: result.code,
        sourceMap: options.sourceMaps ? JSON.parse(result.map || "{}") : undefined,
        metrics: {
          inputSize: source.length,
          outputSize: result.code.length,
          duration: performance.now() - startTime
        }
      };
    } catch (error) {
      console.error("Transpilation error:", error);
      throw error;
    }
  }
}