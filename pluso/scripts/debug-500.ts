import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

async function debug500Error() {
  console.log("Starting debug session...");
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Enable detailed logging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', err => console.error('Page error:', err));
    page.on('requestfailed', request => 
      console.error(`Request failed: ${request.url()}`, request.failure())
    );

    // Enable request interception
    await page.setRequestInterception(true);
    page.on('request', request => {
      console.log(`Request: ${request.method()} ${request.url()}`);
      request.continue();
    });
    
    page.on('response', async response => {
      const status = response.status();
      const url = response.url();
      console.log(`Response: ${status} ${url}`);
      
      if (status >= 400) {
        try {
          const text = await response.text();
          console.error(`Error response (${status}):`, text);
        } catch (e) {
          console.error('Could not get response text:', e);
        }
      }
    });

    // Monitor network conditions
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');
    
    client.on('Network.loadingFailed', event => {
      console.error('Network loading failed:', event);
    });

    client.on('Network.responseReceived', async event => {
      const { response } = event;
      if (response.status >= 500) {
        console.error('Server error details:', {
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
    });

    // Navigate to the page
    console.log("Navigating to http://localhost:8000/...");
    const response = await page.goto('http://localhost:8000/', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Check response status
    if (response) {
      console.log('Page response status:', response.status());
      if (response.status() >= 400) {
        const text = await response.text();
        console.error('Error page content:', text);
      }
    }

    // Take a screenshot for visual debugging
    await page.screenshot({ path: 'debug-screenshot.png' });

    // Get page metrics
    const metrics = await page.metrics();
    console.log('Page metrics:', metrics);

    // Check for any error messages in the DOM
    const errorMessages = await page.evaluate(() => {
      const errors = [];
      document.querySelectorAll('.error-message, [class*="error"]').forEach(el => {
        errors.push(el.textContent);
      });
      return errors;
    });

    if (errorMessages.length > 0) {
      console.log('Found error messages in DOM:', errorMessages);
    }

    // Memory metrics
    const performanceMetrics = await client.send('Performance.getMetrics');
    console.log('Performance metrics:', performanceMetrics);

    // Wait a bit to ensure all errors are captured
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    console.error('Debug session error:', error);
  } finally {
    await browser.close();
    console.log("Debug session completed");
  }
}

// Run the debug session
debug500Error().catch(console.error);
