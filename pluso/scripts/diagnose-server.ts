import { PuppeteerTools } from "../utils/puppeteer.ts";

async function diagnoseServer() {
  console.log("Starting server diagnosis...");
  
  const results = await PuppeteerTools.monitorPageErrors(
    "http://localhost:8000/",
    10000 // 10 second timeout
  );

  console.log("\n=== Server Response ===");
  console.log(`Status Code: ${results.responseStatus}`);

  if (results.errors.length > 0) {
    console.log("\n=== Page Errors ===");
    results.errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  }

  if (results.networkErrors.length > 0) {
    console.log("\n=== Network Errors ===");
    results.networkErrors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  }

  if (results.consoleMessages.length > 0) {
    console.log("\n=== Console Messages ===");
    results.consoleMessages.forEach((msg, i) => {
      console.log(`${i + 1}. [${msg.type}] ${msg.text}`);
    });
  }
}

diagnoseServer().catch(console.error);
