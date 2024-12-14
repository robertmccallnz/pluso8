import { assertStrictEquals, assert, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { KupuScraper, type KupuScraperConfig, KupuScraperError, ScrapingErrorType } from "../mod.ts";
import { WordType } from "../types.ts";

const defaultConfig: Required<KupuScraperConfig> = {
  baseUrl: "https://maoridictionary.co.nz/search?keywords=",
  rateLimitMs: 1000,
  cacheExpiration: 24 * 60 * 60 * 1000,
  headers: {}
};

const successfulResponseHtml = `
  <div class="search-results">
    <div class="part-of-speech">noun</div>
    <div class="meaning">test meaning 1</div>
    <div class="meaning">test meaning 2</div>
    <div class="example">
      <span class="reo">Test reo text</span>
      <span class="translation">Test translation</span>
      <span class="context">Test context</span>
    </div>
    <div class="note">Test note</div>
  </div>
`;

Deno.test("successfully scrapes a word", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url: string | URL | Request) => {
      return new Response(successfulResponseHtml, {
        status: 200,
        headers: { "content-type": "text/html" }
      });
    };

    const scraper = new KupuScraper(defaultConfig);
    const result = await scraper.lookup("test");

    assertStrictEquals(result.kupu, "test");
    assertStrictEquals(result.wordType, WordType.NOUN);
    assert(result.translations.length === 2);
    assertStrictEquals(result.translations[0], "test meaning 1");
    assertStrictEquals(result.translations[1], "test meaning 2");
    assert(result.examples.length === 1);
    assertStrictEquals(result.examples[0].reo, "Test reo text");
    assertStrictEquals(result.examples[0].english, "Test translation");
    assertStrictEquals(result.examples[0].context, "Test context");
    if (result.notes) {
      assertStrictEquals(result.notes[0], "Test note");
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("handles network error", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      throw new Error("Network request failed");
    };

    const scraper = new KupuScraper(defaultConfig);
    
    try {
      await scraper.lookup("network-error");
      assert(false, "Expected error to be thrown");
    } catch (e) {
      assert(e instanceof KupuScraperError);
      assertStrictEquals(e.type, ScrapingErrorType.NETWORK_ERROR);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("handles non-existent word", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      return new Response("<div>No results found</div>", {
        status: 200,
        headers: { "content-type": "text/html" }
      });
    };

    const scraper = new KupuScraper(defaultConfig);
    
    try {
      await scraper.lookup("non-existent");
      assert(false, "Expected error to be thrown");
    } catch (e) {
      assert(e instanceof KupuScraperError);
      assertStrictEquals(e.type, ScrapingErrorType.NOT_FOUND);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});