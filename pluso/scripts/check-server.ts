import { PuppeteerTools } from "../utils/puppeteer.ts";

console.log("Checking server for errors...");

const results = await PuppeteerTools.monitorPageErrors("http://localhost:8000/");

console.log("Status:", results.responseStatus);
console.log("\nErrors:", results.errors);
console.log("\nNetwork Errors:", results.networkErrors);
console.log("\nConsole Messages:", results.consoleMessages);
