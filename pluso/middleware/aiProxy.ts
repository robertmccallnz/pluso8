import { FreshContext } from "$fresh/server.ts";

interface ProxyConfig {
  targetUrl: string;
  apiKey: string;
  service: string;
}

const PROXY_CONFIGS: Record<string, ProxyConfig> = {
  together: {
    targetUrl: "https://api.together.xyz",
    apiKey: Deno.env.get("TOGETHER_API_KEY") || "",
    service: "Together AI"
  },
  anthropic: {
    targetUrl: "https://api.anthropic.com",
    apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "",
    service: "Anthropic"
  },
  openai: {
    targetUrl: "https://api.openai.com",
    apiKey: Deno.env.get("OPENAI_API_KEY") || "",
    service: "OpenAI"
  },
  huggingface: {
    targetUrl: "https://api-inference.huggingface.co",
    apiKey: Deno.env.get("HUGGINGFACE_API_KEY") || "",
    service: "Hugging Face"
  },
  ultravox: {
    targetUrl: "https://api.ultravox.ai",
    apiKey: Deno.env.get("ULTRAVOX_API_KEY") || "",
    service: "Ultravox"
  }
};

export function aiProxy(service: keyof typeof PROXY_CONFIGS) {
  const config = PROXY_CONFIGS[service];
  
  return async function aiProxyMiddleware(
    req: Request,
    ctx: FreshContext
  ) {
    if (!config.apiKey) {
      return new Response(`${config.service} API key not configured`, { status: 503 });
    }

    try {
      // Clone the request
      const proxyReq = new Request(new URL(req.url).pathname.replace("/api/proxy", ""), {
        method: req.method,
        headers: new Headers({
          "Authorization": `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        }),
        body: req.body
      });

      // Forward to AI service
      const response = await fetch(proxyReq);
      
      // Add proxy headers
      const headers = new Headers(response.headers);
      headers.set("X-Proxy-Service", config.service);
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (error) {
      console.error(`Error proxying to ${config.service}:`, error);
      return new Response(`Error connecting to ${config.service}`, { status: 502 });
    }
  };
}
