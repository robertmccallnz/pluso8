import { Browser, Page } from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

export class PuppeteerTools {
  /**
   * Takes a screenshot of a webpage
   * @param url The URL to screenshot
   * @param outputPath Path to save the screenshot
   * @param fullPage Whether to capture the full scrollable page
   */
  static async takeScreenshot(url: string, outputPath: string, fullPage = false) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outputPath, fullPage });
    await browser.close();
  }

  /**
   * Generates a PDF of a webpage
   * @param url The URL to convert to PDF
   * @param outputPath Path to save the PDF
   */
  static async generatePDF(url: string, outputPath: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outputPath, format: 'A4' });
    await browser.close();
  }

  /**
   * Extracts text content from a webpage using a CSS selector
   * @param url The URL to scrape
   * @param selector CSS selector to target elements
   */
  static async extractContent(url: string, selector: string): Promise<string[]> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const content = await page.$$eval(selector, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
    
    await browser.close();
    return content;
  }

  /**
   * Fills and submits a form
   * @param url The URL with the form
   * @param formData Object containing selector-value pairs for form fields
   * @param submitSelector Selector for the submit button
   */
  static async fillForm(
    url: string, 
    formData: Record<string, string>,
    submitSelector: string
  ) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    for (const [selector, value] of Object.entries(formData)) {
      await page.type(selector, value);
    }

    await page.click(submitSelector);
    await page.waitForNavigation();
    await browser.close();
  }

  /**
   * Monitors page load performance metrics
   * @param url The URL to monitor
   */
  static async getPerformanceMetrics(url: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const metrics = await page.metrics();
    await browser.close();
    
    return metrics;
  }

  /**
   * Checks if specific meta tags exist and extracts their content
   * @param url The URL to check
   * @param metaTags Array of meta tag names to check
   */
  static async analyzeSEOMetaTags(url: string, metaTags: string[]) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const results: Record<string, string | null> = {};
    
    for (const tag of metaTags) {
      const content = await page.$eval(
        `meta[name="${tag}"]`, 
        (element) => element.getAttribute('content')
      ).catch(() => null);
      
      results[tag] = content;
    }

    await browser.close();
    return results;
  }

  /**
   * Monitors network requests during page load
   * @param url The URL to monitor
   */
  static async monitorNetworkRequests(url: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    await browser.close();
    
    return requests;
  }

  /**
   * Tests if elements are visible and clickable
   * @param url The URL to test
   * @param selectors Array of CSS selectors to test
   */
  static async testElementsAccessibility(url: string, selectors: string[]) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const results: Record<string, { visible: boolean; clickable: boolean }> = {};
    
    for (const selector of selectors) {
      const visible = await page.$eval(
        selector,
        (el) => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }
      ).catch(() => false);

      const clickable = await page.$eval(
        selector,
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }
      ).catch(() => false);

      results[selector] = { visible, clickable };
    }

    await browser.close();
    return results;
  }

  /**
   * Monitors page for errors and network issues
   * @param url The URL to monitor
   * @param timeout Timeout in milliseconds
   */
  static async monitorPageErrors(url: string, timeout = 30000): Promise<{
    errors: string[];
    networkErrors: string[];
    consoleMessages: { type: string; text: string }[];
    responseStatus: number | null;
  }> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const errors: string[] = [];
    const networkErrors: string[] = [];
    const consoleMessages: { type: string; text: string }[] = [];
    let responseStatus: number | null = null;

    // Monitor page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Monitor console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Monitor network errors
    page.on('requestfailed', request => {
      networkErrors.push(`${request.url()} failed: ${request.failure()?.errorText || 'unknown error'}`);
    });

    try {
      const response = await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout
      });
      responseStatus = response?.status() || null;

      // Get page content for error analysis
      const content = await page.content();
      if (content.includes('Internal Server Error') || content.includes('Error 500')) {
        errors.push('Found 500 Internal Server Error in page content');
      }

      // Try to find error messages in the DOM
      const errorMessages = await page.evaluate(() => {
        const messages: string[] = [];
        // Look for common error message elements
        document.querySelectorAll('.error-message, .alert-error, [role="alert"], pre').forEach(el => {
          const text = el.textContent?.trim();
          if (text) messages.push(text);
        });
        return messages;
      });

      if (errorMessages.length > 0) {
        errors.push(...errorMessages);
      }

    } catch (error) {
      errors.push(`Navigation error: ${error.message}`);
    }

    await browser.close();
    return { errors, networkErrors, consoleMessages, responseStatus };
  }

  /**
   * Analyzes SEO-related links on a webpage
   * @param url The URL to analyze
   */
  static async analyzeSEOLinks(url: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const links = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a'));
      const currentHost = window.location.host;
      
      let internal = 0;
      let external = 0;
      let broken = 0;
      
      allLinks.forEach(link => {
        const href = link.href;
        if (!href) return;
        
        try {
          const url = new URL(href);
          if (url.host === currentHost) {
            internal++;
          } else {
            external++;
          }
        } catch {
          broken++;
        }
      });
      
      return { internal, external, broken };
    });
    
    await browser.close();
    return links;
  }

  /**
   * Analyzes images on a webpage for SEO
   * @param url The URL to analyze
   */
  static async analyzeSEOImages(url: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const imageStats = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const total = images.length;
      const withAlt = images.filter(img => img.hasAttribute('alt') && img.getAttribute('alt')?.trim() !== '').length;
      
      return {
        total,
        withAlt,
        withoutAlt: total - withAlt
      };
    });
    
    await browser.close();
    return imageStats;
  }

  /**
   * Tests accessibility of elements on a webpage
   * @param url The URL to test
   * @param selectors Array of CSS selectors to test
   */
  static async testElementsAccessibility(url: string, selectors: string[]) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const results: Record<string, { visible: boolean; clickable: boolean }> = {};
    
    for (const selector of selectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length === 0) {
          results[selector] = { visible: false, clickable: false };
          continue;
        }

        const visibilityPromises = elements.map(el => 
          page.evaluate(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
          }, el)
        );

        const clickabilityPromises = elements.map(el =>
          page.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && 
                   rect.height > 0 && 
                   !el.hasAttribute('disabled');
          }, el)
        );

        const visibilityResults = await Promise.all(visibilityPromises);
        const clickabilityResults = await Promise.all(clickabilityPromises);

        results[selector] = {
          visible: visibilityResults.some(v => v),
          clickable: clickabilityResults.some(c => c)
        };
      } catch (error) {
        results[selector] = { visible: false, clickable: false };
      }
    }
    
    await browser.close();
    return results;
  }
}
