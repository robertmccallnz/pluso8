#!/usr/bin/env -S deno run -A --watch=static/,routes/,islands/

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { load } from "https://deno.land/std/dotenv/mod.ts";
import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

// Load environment variables
await load({
  export: true,
  allowEmptyValues: true
});

await start(manifest, config);
