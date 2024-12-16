import { HandlerContext } from "$fresh/server.ts";
import { generateMockMetrics } from "../../../core/metrics/mock-metrics.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  
  if (!agentId) {
    return new Response(JSON.stringify({ error: "Missing agentId" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log(`Metrics connected: ${agentId}`);
      socket.send(JSON.stringify(generateMockMetrics(agentId)));
    };
    
    const interval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(generateMockMetrics(agentId)));
      }
    }, 5000);
    
    socket.onclose = () => {
      console.log(`Metrics disconnected: ${agentId}`);
      clearInterval(interval);
    };
    
    socket.onerror = (error) => {
      console.error(`Metrics error: ${agentId}`, error);
      clearInterval(interval);
    };
    
    return response;
  } catch (error) {
    console.error(`WebSocket error: ${agentId}`, error);
    return new Response(JSON.stringify({ error: "WebSocket upgrade failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
