// /src/app/maia/MaiaServer.ts
import { WebForgeNZ } from "../../tools/web-forge/nz-extension.ts";
import { createTeReoAssistant } from "../../tools/te-reo-assistant.ts/mod.ts";
import { KupuScraper } from "../../tools/kupu-scraper/mod.ts";


export class MaiaServer {
  private port: number;
  private webForge: WebForgeNZ;
  private teReo: ReturnType<typeof createTeReoAssistant>;
  private kupuScraper: KupuScraper;
  private blobStorage: ReturnType<typeof createBlobStorage>;
  private abortController: AbortController;

  constructor(port: number = 8000) {
    this.port = port;
    this.webForge = new WebForgeNZ("./output");
    this.teReo = createTeReoAssistant({
      languageLevel: "beginner",
      includeExamples: true
    });
    this.kupuScraper = new KupuScraper({
      rateLimitMs: 1000,
      cacheExpiration: 24 * 60 * 60 * 1000
    });
    this.blobStorage = createBlobStorage({
      token: Deno.env.get("BLOB_READ_WRITE_TOKEN") || "",
      pathPrefix: "maia-content"
    });
    this.abortController = new AbortController();
  }

  private async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    console.log(`Incoming request: ${request.method} ${url.pathname}`);

    try {
      switch (url.pathname) {
        case "/":
          return new Response(
            JSON.stringify({ message: "Welcome to Maia Server" }),
            { headers }
          );

        case "/api/health":
          return new Response(
            JSON.stringify({ status: "healthy" }),
            { headers }
          );

        case "/api/te-reo":
          if (request.method !== "POST") {
            return new Response(
              JSON.stringify({ error: "Method not allowed" }),
              { status: 405, headers }
            );
          }
          
          const data = await request.json();
          console.log("Received data:", data);
          
          const result = await this.teReo.translate(data.text, 'mi');
          console.log("Translation result:", result);
          
          return new Response(
            JSON.stringify({ translation: result }),
            { headers }
          );

        default:
          console.log(`No route found for ${url.pathname}`);
          return new Response(
            JSON.stringify({ error: "Not found" }),
            { status: 404, headers }
          );
      }
    } catch (error) {
      console.error("Request error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Internal server error", 
          details: error.message 
        }),
        { status: 500, headers }
      );
    }
  }

  async start() {
    console.log(`🌟 Maia Server starting on port ${this.port}...`);
    
    try {
      const server = Deno.serve({
        port: this.port,
        handler: async (request: Request) => {
          console.log(`Incoming request: ${request.method} ${new URL(request.url).pathname}`);
          return this.handleRequest(request);
        },
      });
  
      await server.finished;
    } catch (error) {
      console.error("Server error:", error);
      throw error;
    }
  }

  async stop() {
    console.log("Shutting down Maia Server...");
    this.abortController.abort();
  }
}

export const createMaiaServer = (port?: number) => {
  return new MaiaServer(port);
};