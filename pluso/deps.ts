// Standard library dependencies
export * as path from "https://deno.land/std@0.211.0/path/mod.ts";
export * as fs from "https://deno.land/std@0.211.0/fs/mod.ts";

// Testing dependencies
export { 
  assertEquals,
  assertNotEquals,
  assertExists,
  assertStrictEquals,
  assertThrows
} from "https://deno.land/std@0.211.0/assert/mod.ts";
export { spy, stub } from "https://deno.land/std@0.211.0/testing/mock.ts";

// Third-party dependencies
export { default as OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";
export { Anthropic } from "npm:@anthropic-ai/sdk@0.10.2";
export { default as Together } from "https://raw.githubusercontent.com/ekaone/together-js/main/src/index.ts";
export { HfInference } from "npm:@huggingface/inference@2.6.4";
export { createClient } from "npm:@supabase/supabase-js@2.39.1";

// Fresh framework
export * as $ from "https://deno.land/x/dax@0.30.1/mod.ts";

// Utilities
export { open as opn } from "https://deno.land/x/opener@v1.0.1/mod.ts";
