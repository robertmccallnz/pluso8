import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { dirname } from "https://deno.land/std@0.208.0/path/mod.ts";
import * as esbuild from 'https://deno.land/x/esbuild@v0.19.8/mod.js';
import postcss from 'https://deno.land/x/postcss@8.4.16/mod.js';
import tailwindcss from 'npm:tailwindcss@3.3.5';

const inputFile = "./static/styles.css";
const outputFile = "./static/output.css";

// Ensure output directory exists
await ensureDir(dirname(outputFile));

// Read input CSS
const css = await Deno.readTextFile(inputFile);

// Process with PostCSS and Tailwind
const result = await postcss([
  tailwindcss,
]).process(css, {
  from: inputFile,
  to: outputFile,
});

// Write output CSS
await Deno.writeTextFile(outputFile, result.css);
console.log(`CSS built successfully: ${outputFile}`);
