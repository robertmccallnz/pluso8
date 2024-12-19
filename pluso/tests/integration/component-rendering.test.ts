import { assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import puppeteer from "puppeteer";

const TEST_PORT = 8001;
let browser: puppeteer.Browser;
let server: Deno.Process;

async function startTestServer() {
  server = Deno.run({
    cmd: ["deno", "run", "-A", "--watch=static/,routes/", "dev.ts"],
    env: { "PORT": TEST_PORT.toString() },
    stdout: "piped",
    stderr: "piped",
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

async function stopTestServer() {
  try {
    server.close();
  } catch (e) {
    console.error("Error stopping server:", e);
  }
}

Deno.test({
  name: "Component Integration Tests",
  async fn(t) {
    // Start browser and server before all tests
    browser = await puppeteer.launch({ headless: true });
    await startTestServer();

    try {
      await t.step("Island components render properly with IS_BROWSER check", async () => {
        const page = await browser.newPage();
        await page.goto(`http://localhost:${TEST_PORT}/test-island`);
        
        // Check initial render
        const content = await page.content();
        assertEquals(content.includes("Loading..."), false);
        
        // Check component functionality
        const count = await page.$eval("[data-testid='count']", (el) => el.textContent);
        assertEquals(count, "0");
        
        // Test interaction
        await page.click("[data-testid='increment']");
        const newCount = await page.$eval("[data-testid='count']", (el) => el.textContent);
        assertEquals(newCount, "1");
      });

      await t.step("Signal state updates correctly", async () => {
        const page = await browser.newPage();
        await page.goto(`http://localhost:${TEST_PORT}/test-signals`);
        
        // Test signal updates
        await page.type("[data-testid='input']", "test");
        const value = await page.$eval("[data-testid='display']", (el) => el.textContent);
        assertEquals(value, "test");
      });

      await t.step("Components handle client-side navigation", async () => {
        const page = await browser.newPage();
        await page.goto(`http://localhost:${TEST_PORT}`);
        
        // Navigate to test page
        await page.click("[data-testid='nav-test']");
        await page.waitForSelector("[data-testid='test-page']");
        
        const url = page.url();
        assertEquals(url.endsWith("/test"), true);
      });

    } finally {
      // Cleanup after all tests
      await browser.close();
      await stopTestServer();
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
