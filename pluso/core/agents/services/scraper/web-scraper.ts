import { ServiceAgent, ServiceAgentType } from "../types.ts";
import { EventEmitter } from "../../../../events/emitter.ts";
import { db } from "../../../../utils/db.ts";
import { PuppeteerTools } from "../../../../utils/puppeteer.ts";
import axios, { AxiosProxyConfig } from "axios";
import * as cheerio from "cheerio";

export interface ScrapingRequest {
  url: string;
  selector?: string;
  dataType: "text" | "html" | "json" | "screenshot" | "pdf" | "metrics" | "seo" | "dynamic" | "structured";
  options?: {
    headers?: Record<string, string>;
    timeout?: number;
    fullPage?: boolean;
    outputPath?: string;
    metaTags?: string[];
    formData?: Record<string, string>;
    submitSelector?: string;
    waitFor?: string | number; // CSS selector or time in ms
    proxy?: AxiosProxyConfig;
    fingerprint?: {
      userAgent?: string;
      platform?: string;
      vendor?: string;
    };
    extraction?: {
      pattern: "list" | "table" | "article" | "custom";
      selectors: Record<string, string>;
      transform?: (data: any) => any;
    };
    concurrent?: {
      maxConnections?: number;
      delayBetweenRequests?: number;
    };
  };
}

export interface ScrapingResult {
  success: boolean;
  data: any;
  timestamp: Date;
  metadata?: {
    responseTime: number;
    statusCode?: number;
    contentType?: string;
    proxy?: string;
    fingerprint?: string;
  };
  error?: string;
}

interface BrowserFingerprint {
  userAgent: string;
  platform: string;
  vendor: string;
}

export class WebScraper implements ServiceAgent {
  private static instance: WebScraper;
  id: string;
  type: ServiceAgentType;
  status: "active" | "inactive" | "error";
  lastHeartbeat: Date;
  metrics: {
    requestsHandled: number;
    successRate: number;
    averageResponseTime: number;
    activeConnections: number;
  };
  private events: EventEmitter;
  private rateLimiter: Map<string, number[]>;
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly MIN_REQUEST_INTERVAL = 1000;
  private readonly MAX_RETRIES = 3;
  private readonly DEFAULT_CONCURRENT_CONNECTIONS = 5;
  private readonly userAgents: string[] = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  ];

  private constructor() {
    this.id = crypto.randomUUID();
    this.type = ServiceAgentType.SCRAPER;
    this.status = "active";
    this.lastHeartbeat = new Date();
    this.metrics = {
      requestsHandled: 0,
      successRate: 1,
      averageResponseTime: 0,
      activeConnections: 0
    };
    this.events = new EventEmitter();
    this.rateLimiter = new Map();
  }

  public static getInstance(): WebScraper {
    if (!WebScraper.instance) {
      WebScraper.instance = new WebScraper();
    }
    return WebScraper.instance;
  }

  private async checkRateLimit(domain: string): Promise<boolean> {
    const now = Date.now();
    const requests = this.rateLimiter.get(domain) || [];
    
    // Remove old requests
    const recentRequests = requests.filter(time => now - time < this.MIN_REQUEST_INTERVAL);
    
    if (recentRequests.length >= this.DEFAULT_CONCURRENT_CONNECTIONS) {
      return false;
    }
    
    recentRequests.push(now);
    this.rateLimiter.set(domain, recentRequests);
    return true;
  }

  private getDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  private getRandomFingerprint(): BrowserFingerprint {
    return {
      userAgent: this.userAgents[Math.floor(Math.random() * this.userAgents.length)],
      platform: ['Windows', 'MacOS', 'Linux'][Math.floor(Math.random() * 3)],
      vendor: ['Google Inc.', 'Apple Computer, Inc.'][Math.floor(Math.random() * 2)]
    };
  }

  private async extractStructuredData(
    $: cheerio.CheerioAPI,
    pattern: string,
    selectors: Record<string, string>
  ): Promise<any[]> {
    const results: any[] = [];

    switch (pattern) {
      case "list":
        $(selectors.container).each((_, el) => {
          const item: Record<string, string> = {};
          for (const [key, selector] of Object.entries(selectors)) {
            if (key !== "container") {
              item[key] = $(el).find(selector).text().trim();
            }
          }
          results.push(item);
        });
        break;

      case "table":
        $(selectors.row).each((_, row) => {
          const item: Record<string, string> = {};
          for (const [key, selector] of Object.entries(selectors)) {
            if (key !== "row") {
              item[key] = $(row).find(selector).text().trim();
            }
          }
          results.push(item);
        });
        break;

      case "article":
        const article: Record<string, string> = {};
        for (const [key, selector] of Object.entries(selectors)) {
          article[key] = $(selector).text().trim();
        }
        results.push(article);
        break;

      case "custom":
        // Custom extraction logic can be implemented through the transform function
        break;
    }

    return results;
  }

  public async scrape(request: ScrapingRequest): Promise<ScrapingResult> {
    const startTime = Date.now();
    const domain = this.getDomain(request.url);
    this.metrics.activeConnections++;

    try {
      if (!await this.checkRateLimit(domain)) {
        throw new Error("Rate limit exceeded for domain");
      }

      const fingerprint = request.options?.fingerprint || this.getRandomFingerprint();
      let data: any;
      let metadata: ScrapingResult["metadata"] = {
        responseTime: 0,
        fingerprint: fingerprint.userAgent
      };

      switch (request.dataType) {
        case "dynamic":
          const page = await PuppeteerTools.createPage(fingerprint);
          await page.goto(request.url, { waitUntil: 'networkidle0' });
          
          if (request.options?.waitFor) {
            if (typeof request.options.waitFor === "string") {
              await page.waitForSelector(request.options.waitFor);
            } else {
              await page.waitForTimeout(request.options.waitFor);
            }
          }

          const content = await page.content();
          const $ = cheerio.load(content);
          data = request.selector ? $(request.selector).text() : $.root().html();
          await page.close();
          break;

        case "structured":
          if (!request.options?.extraction) {
            throw new Error("Extraction pattern required for structured data");
          }

          const response = await axios.get(request.url, {
            headers: { 'User-Agent': fingerprint.userAgent },
            proxy: request.options?.proxy,
            timeout: request.options?.timeout || this.DEFAULT_TIMEOUT
          });

          const $structured = cheerio.load(response.data);
          data = await this.extractStructuredData(
            $structured,
            request.options.extraction.pattern,
            request.options.extraction.selectors
          );

          if (request.options.extraction.transform) {
            data = request.options.extraction.transform(data);
          }

          metadata.statusCode = response.status;
          metadata.contentType = response.headers['content-type'];
          break;

        case "screenshot":
          await PuppeteerTools.takeScreenshot(
            request.url,
            request.options?.outputPath || `screenshot-${Date.now()}.png`,
            request.options?.fullPage,
            fingerprint
          );
          data = { message: "Screenshot captured successfully" };
          break;

        case "pdf":
          await PuppeteerTools.generatePDF(
            request.url,
            request.options?.outputPath || `document-${Date.now()}.pdf`,
            fingerprint
          );
          data = { message: "PDF generated successfully" };
          break;

        case "metrics":
          data = await PuppeteerTools.getPerformanceMetrics(request.url, fingerprint);
          break;

        case "seo":
          const metaTags = request.options?.metaTags || [
            "description",
            "keywords",
            "robots",
            "viewport"
          ];
          data = await PuppeteerTools.analyzeSEOMetaTags(request.url, metaTags, fingerprint);
          break;

        case "text":
        case "html":
        case "json":
          const axiosResponse = await axios.get(request.url, {
            headers: {
              'User-Agent': fingerprint.userAgent,
              ...request.options?.headers
            },
            proxy: request.options?.proxy,
            timeout: request.options?.timeout || this.DEFAULT_TIMEOUT
          });

          metadata.statusCode = axiosResponse.status;
          metadata.contentType = axiosResponse.headers['content-type'];

          if (request.dataType === "json") {
            data = axiosResponse.data;
          } else {
            const $html = cheerio.load(axiosResponse.data);
            if (request.selector) {
              data = request.dataType === "text" 
                ? $html(request.selector).text() 
                : $html(request.selector).html();
            } else {
              data = request.dataType === "text" 
                ? $html.root().text() 
                : $html.root().html();
            }
          }
          break;

        default:
          throw new Error(`Unsupported data type: ${request.dataType}`);
      }

      metadata.responseTime = Date.now() - startTime;
      if (request.options?.proxy) {
        metadata.proxy = request.options.proxy.host;
      }

      const result: ScrapingResult = {
        success: true,
        data,
        timestamp: new Date(),
        metadata
      };

      // Update metrics
      this.updateMetrics(startTime, true);
      await this.logScraping(request, result);
      this.events.emit("scraper:success", { request, result });

      return result;
    } catch (error) {
      const result: ScrapingResult = {
        success: false,
        data: null,
        timestamp: new Date(),
        metadata: {
          responseTime: Date.now() - startTime
        },
        error: error.message
      };

      // Update metrics
      this.updateMetrics(startTime, false);
      await this.logError(request, error);
      this.events.emit("scraper:error", { request, error: error.message });

      return result;
    } finally {
      this.metrics.activeConnections--;
    }
  }

  private updateMetrics(startTime: number, success: boolean): void {
    this.metrics.requestsHandled++;
    const responseTime = Date.now() - startTime;
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.requestsHandled - 1) + responseTime) / 
      this.metrics.requestsHandled;
    
    if (!success) {
      this.metrics.successRate = 
        (this.metrics.successRate * (this.metrics.requestsHandled - 1)) / 
        this.metrics.requestsHandled;
    }
  }

  private async logScraping(request: ScrapingRequest, result: ScrapingResult): Promise<void> {
    await db.query(
      `INSERT INTO scraping_logs 
       (url, data_type, success, response_time, status_code, content_type, proxy, fingerprint, timestamp) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        request.url,
        request.dataType,
        result.success,
        result.metadata?.responseTime,
        result.metadata?.statusCode,
        result.metadata?.contentType,
        result.metadata?.proxy,
        result.metadata?.fingerprint,
        new Date()
      ]
    );
  }

  private async logError(request: ScrapingRequest, error: Error): Promise<void> {
    await db.query(
      "INSERT INTO scraping_errors (url, data_type, error_message, timestamp) VALUES ($1, $2, $3, $4)",
      [request.url, request.dataType, error.message, new Date()]
    );
  }

  public async validateUrl(url: string): Promise<boolean> {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public async monitorPageErrors(url: string, timeout = 30000): Promise<any> {
    return PuppeteerTools.monitorPageErrors(url, timeout);
  }

  public async fillForm(
    url: string,
    formData: Record<string, string>,
    submitSelector: string
  ): Promise<void> {
    await PuppeteerTools.fillForm(url, formData, submitSelector);
  }

  public async testAccessibility(url: string, selectors: string[]): Promise<any> {
    return PuppeteerTools.testElementsAccessibility(url, selectors);
  }

  public async scrapeConcurrent(requests: ScrapingRequest[]): Promise<ScrapingResult[]> {
    const maxConnections = Math.min(
      requests[0]?.options?.concurrent?.maxConnections || this.DEFAULT_CONCURRENT_CONNECTIONS,
      this.DEFAULT_CONCURRENT_CONNECTIONS
    );
    const delay = requests[0]?.options?.concurrent?.delayBetweenRequests || this.MIN_REQUEST_INTERVAL;
    
    const results: ScrapingResult[] = [];
    const chunks = [];
    
    // Split requests into chunks
    for (let i = 0; i < requests.length; i += maxConnections) {
      chunks.push(requests.slice(i, i + maxConnections));
    }
    
    // Process chunks sequentially, but requests within chunk concurrently
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(chunk.map(req => this.scrape(req)));
      results.push(...chunkResults);
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return results;
  }
}
