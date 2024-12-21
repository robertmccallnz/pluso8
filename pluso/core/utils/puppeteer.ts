import { Browser, Page } from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

interface BrowserFingerprint {
  userAgent: string;
  platform: string;
  vendor: string;
}

export class PuppeteerTools {
  /**
   * Creates a new page with specified fingerprint
   * @param fingerprint Browser fingerprint to use
   */
  static async createPage(fingerprint?: BrowserFingerprint): Promise<Page> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    if (fingerprint) {
      await page.setUserAgent(fingerprint.userAgent);
      await page.evaluateOnNewDocument((fp) => {
        Object.defineProperty(navigator, 'platform', { get: () => fp.platform });
        Object.defineProperty(navigator, 'vendor', { get: () => fp.vendor });
      }, fingerprint);
    }
    
    return page;
  }

  /**
   * Takes a screenshot of a webpage
   * @param url The URL to screenshot
   * @param outputPath Path to save the screenshot
   * @param fullPage Whether to capture the full scrollable page
   * @param fingerprint Browser fingerprint to use
   */
  static async takeScreenshot(
    url: string,
    outputPath: string,
    fullPage = false,
    fingerprint?: BrowserFingerprint
  ) {
    const page = await this.createPage(fingerprint);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outputPath, fullPage });
    await page.browser().close();
  }

  /**
   * Generates a PDF of a webpage
   * @param url The URL to convert to PDF
   * @param outputPath Path to save the PDF
   * @param fingerprint Browser fingerprint to use
   */
  static async generatePDF(
    url: string,
    outputPath: string,
    fingerprint?: BrowserFingerprint
  ) {
    const page = await this.createPage(fingerprint);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outputPath, format: 'A4' });
    await page.browser().close();
  }

  /**
   * Extracts text content from a webpage using a CSS selector
   * @param url The URL to scrape
   * @param selector CSS selector to target elements
   * @param fingerprint Browser fingerprint to use
   */
  static async extractContent(
    url: string,
    selector: string,
    fingerprint?: BrowserFingerprint
  ): Promise<string[]> {
    const page = await this.createPage(fingerprint);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const content = await page.$$eval(selector, elements => 
      elements.map(el => el.textContent?.trim() || '')
    );
    
    await page.browser().close();
    return content;
  }

  /**
   * Fills and submits a form
   * @param url The URL with the form
   * @param formData Object containing selector-value pairs for form fields
   * @param submitSelector Selector for the submit button
   * @param fingerprint Browser fingerprint to use
   */
  static async fillForm(
    url: string, 
    formData: Record<string, string>,
    submitSelector: string,
    fingerprint?: BrowserFingerprint
  ) {
    const page = await this.createPage(fingerprint);
    await page.goto(url, { waitUntil: 'networkidle0' });

    for (const [selector, value] of Object.entries(formData)) {
      await page.type(selector, value);
    }

    await page.click(submitSelector);
    await page.waitForNavigation();
    await page.browser().close();
  }

  /**
   * Monitors page load performance metrics
   * @param url The URL to monitor
   * @param fingerprint Browser fingerprint to use
   */
  static async getPerformanceMetrics(
    url: string,
    fingerprint?: BrowserFingerprint
  ) {
    const page = await this.createPage(fingerprint);
    await page.goto(url, { waitUntil: 'networkidle0' });
    const metrics = await page.metrics();
    await page.browser().close();
    return metrics;
  }

  /**
   * Checks if specific meta tags exist and extracts their content
   * @param url The URL to check
   * @param metaTags Array of meta tag names to check
   * @param fingerprint Browser fingerprint to use
   */
  static async analyzeSEOMetaTags(
    url: string,
    metaTags: string[],
    fingerprint?: BrowserFingerprint
  ) {
    const page = await this.createPage(fingerprint);
    await page.goto(url, { waitUntil: 'networkidle0' });

    const results: Record<string, string | null> = {};
    
    for (const tag of metaTags) {
      const content = await page.$eval(
        `meta[name="${tag}"]`, 
        (element) => element.getAttribute('content')
      ).catch(() => null);
      
      results[tag] = content;
    }

    await page.browser().close();
    return results;
  }

  /**
   * Monitors page for errors and network issues
   * @param url The URL to monitor
   * @param timeout Timeout in milliseconds
   * @param fingerprint Browser fingerprint to use
   */
  static async monitorPageErrors(
    url: string,
    timeout = 30000,
    fingerprint?: BrowserFingerprint
  ): Promise<{
    errors: string[];
    networkErrors: string[];
    consoleMessages: { type: string; text: string }[];
    responseStatus: number | null;
  }> {
    const page = await this.createPage(fingerprint);
    
    const errors: string[] = [];
    const networkErrors: string[] = [];
    const consoleMessages: { type: string; text: string }[] = [];
    let responseStatus: number | null = null;

    page.on('error', err => errors.push(err.message));
    page.on('pageerror', err => errors.push(err.message));
    page.on('requestfailed', request => 
      networkErrors.push(`${request.url()} failed: ${request.failure()?.errorText}`)
    );
    page.on('console', msg => 
      consoleMessages.push({ type: msg.type(), text: msg.text() })
    );
    page.on('response', response => {
      if (response.url() === url) {
        responseStatus = response.status();
      }
    });

    try {
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout 
      });
    } catch (error) {
      errors.push(error.message);
    }

    await page.browser().close();

    return {
      errors,
      networkErrors,
      consoleMessages,
      responseStatus
    };
  }

  /**
   * Tests accessibility of elements on a webpage
   * @param url The URL to test
   * @param selectors Array of CSS selectors to test
   * @param fingerprint Browser fingerprint to use
   */
  static async testElementsAccessibility(
    url: string,
    selectors: string[],
    fingerprint?: BrowserFingerprint
  ) {
    const page = await this.createPage(fingerprint);
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

    await page.browser().close();
    return results;
  }
}
