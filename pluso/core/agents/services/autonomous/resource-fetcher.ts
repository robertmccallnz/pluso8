import { SecurityScanner } from "../../../../utils/security-scanner.ts";
import { CodeAnalyzer } from "../../../../utils/code-analyzer.ts";
import { EventEmitter } from "../../../../events/emitter.ts";
import { db } from "../../../../utils/db.ts";

interface ResourceRequest {
  type: "model" | "file" | "dependency";
  url: string;
  checksum?: string;
  metadata?: Record<string, unknown>;
  priority: number;
}

interface DownloadResult {
  success: boolean;
  content?: Uint8Array;
  error?: string;
  metadata: {
    size: number;
    type: string;
    checksum: string;
    timestamp: Date;
  };
}

interface VerificationResult {
  verified: boolean;
  safe: boolean;
  error?: string;
  details: {
    checksumMatch?: boolean;
    securityCheck?: boolean;
    contentAnalysis?: boolean;
  };
}

export class ResourceFetcher {
  private static instance: ResourceFetcher;
  private events: EventEmitter;
  private securityScanner: SecurityScanner;
  private codeAnalyzer: CodeAnalyzer;
  private downloadQueue: Map<string, ResourceRequest>;
  private verifiedResources: Set<string>;
  private allowedDomains: Set<string>;
  private maxRetries: number;
  private downloadTimeout: number;

  private constructor() {
    this.events = new EventEmitter();
    this.securityScanner = new SecurityScanner();
    this.codeAnalyzer = new CodeAnalyzer();
    this.downloadQueue = new Map();
    this.verifiedResources = new Set();
    this.allowedDomains = new Set();
    this.maxRetries = 3;
    this.downloadTimeout = 30000; // 30 seconds
    this.initialize();
  }

  static getInstance(): ResourceFetcher {
    if (!ResourceFetcher.instance) {
      ResourceFetcher.instance = new ResourceFetcher();
    }
    return ResourceFetcher.instance;
  }

  private async initialize() {
    await this.loadAllowedDomains();
    await this.loadVerifiedResources();
    this.setupEventListeners();
  }

  private async loadAllowedDomains() {
    const domains = await db.query("SELECT * FROM allowed_domains WHERE active = true");
    for (const domain of domains.rows as Array<{ url: string }>) {
      this.allowedDomains.add(domain.url);
    }
  }

  private async loadVerifiedResources() {
    const resources = await db.query("SELECT * FROM verified_resources");
    for (const resource of resources.rows as Array<{ checksum: string }>) {
      this.verifiedResources.add(resource.checksum);
    }
  }

  private setupEventListeners() {
    this.events.on("download:failed", async (data) => {
      await this.handleDownloadFailure(data);
    });

    this.events.on("verification:failed", async (data) => {
      await this.handleVerificationFailure(data);
    });
  }

  async fetchResource(request: ResourceRequest): Promise<{ content: Uint8Array; metadata: any } | null> {
    // Validate request
    if (!this.validateRequest(request)) {
      throw new Error("Invalid resource request");
    }

    // Check if already verified
    if (request.checksum && this.verifiedResources.has(request.checksum)) {
      return await this.loadVerifiedResource(request);
    }

    // Download resource
    const downloadResult = await this.downloadResource(request);
    if (!downloadResult.success) {
      throw new Error(`Download failed: ${downloadResult.error}`);
    }

    // Verify resource
    const verificationResult = await this.verifyResource(downloadResult.content!, request);
    if (!verificationResult.verified || !verificationResult.safe) {
      throw new Error(`Verification failed: ${verificationResult.error}`);
    }

    // Store verified resource
    await this.storeVerifiedResource(downloadResult, request);

    return {
      content: downloadResult.content!,
      metadata: downloadResult.metadata
    };
  }

  private validateRequest(request: ResourceRequest): boolean {
    try {
      const url = new URL(request.url);
      return this.allowedDomains.has(url.hostname);
    } catch {
      return false;
    }
  }

  private async downloadResource(request: ResourceRequest): Promise<DownloadResult> {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.downloadTimeout);

        const response = await fetch(request.url, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const content = new Uint8Array(await response.arrayBuffer());
        const checksum = await this.calculateChecksum(content);

        return {
          success: true,
          content,
          metadata: {
            size: content.length,
            type: response.headers.get("content-type") || "application/octet-stream",
            checksum,
            timestamp: new Date()
          }
        };
      } catch (error) {
        retries++;
        if (retries === this.maxRetries) {
          const errorObj = error as Error;
          return {
            success: false,
            error: errorObj.message,
            metadata: {
              size: 0,
              type: "",
              checksum: "",
              timestamp: new Date()
            }
          };
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }

    return {
      success: false,
      error: "Max retries exceeded",
      metadata: {
        size: 0,
        type: "",
        checksum: "",
        timestamp: new Date()
      }
    };
  }

  private async verifyResource(content: Uint8Array, request: ResourceRequest): Promise<VerificationResult> {
    const results: VerificationResult = {
      verified: false,
      safe: false,
      details: {}
    };

    // Verify checksum if provided
    if (request.checksum) {
      const calculatedChecksum = await this.calculateChecksum(content);
      results.details.checksumMatch = calculatedChecksum === request.checksum;
      if (!results.details.checksumMatch) {
        results.error = "Checksum mismatch";
        return results;
      }
    }

    // Security check
    const securityResult = await this.securityScanner.scan({
      type: request.type,
      content: content
    });
    results.details.securityCheck = securityResult.safe;
    if (!securityResult.safe) {
      results.error = `Security check failed: ${securityResult.details}`;
      return results;
    }

    // Content analysis
    if (request.type === "file" || request.type === "model") {
      const analysisResult = await this.codeAnalyzer.analyzeContent({
        type: request.type,
        content: new TextDecoder().decode(content)
      });
      results.details.contentAnalysis = analysisResult.safe;
      if (!analysisResult.safe) {
        results.error = `Content analysis failed: ${analysisResult.details}`;
        return results;
      }
    }

    results.verified = true;
    results.safe = true;
    return results;
  }

  private async calculateChecksum(content: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", content);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  private async loadVerifiedResource(request: ResourceRequest) {
    const resource = await db.query(
      "SELECT * FROM verified_resources WHERE checksum = ?",
      [request.checksum]
    );

    if (resource.rows.length === 0) {
      throw new Error("Verified resource not found");
    }

    const resourceContent = resource.rows[0] as { content: Uint8Array, metadata: any };
    return {
      content: resourceContent.content,
      metadata: resourceContent.metadata
    };
  }

  private async storeVerifiedResource(result: DownloadResult, request: ResourceRequest) {
    await db.query(
      "INSERT INTO verified_resources (checksum, content, metadata, timestamp) VALUES (?, ?, ?, ?)",
      [
        result.metadata.checksum,
        result.content,
        JSON.stringify({ ...result.metadata, ...request.metadata }),
        new Date()
      ]
    );
    this.verifiedResources.add(result.metadata.checksum);
  }

  private async handleDownloadFailure(data: any) {
    await db.query(
      "INSERT INTO download_failures (url, error, timestamp) VALUES (?, ?, ?)",
      [data.url, data.error, new Date()]
    );
  }

  private async handleVerificationFailure(data: any) {
    await db.query(
      "INSERT INTO verification_failures (checksum, error, timestamp) VALUES (?, ?, ?)",
      [data.checksum, data.error, new Date()]
    );
  }

  async getStatus() {
    return {
      queueSize: this.downloadQueue.size,
      verifiedCount: this.verifiedResources.size,
      allowedDomains: this.allowedDomains.size
    };
  }
}
