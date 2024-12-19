// Cleanup script for agent-related code
import { walk, ensureDir, move } from "https://deno.land/std/fs/mod.ts";

const BASE_DIR = "/Users/robertmccall/pluso8/pluso";

// Unified handlers to create
const unifiedHandlers = {
  "agents/routes/chat.ts": `
import { AgentConfig } from "../types/agent.ts";
import { BaseAgent } from "../core/base/base_agent.ts";

export function createChatHandler(agentType: string) {
  return async (req: Request) => {
    const config: AgentConfig = {
      type: agentType,
      // Common config
    };
    
    const agent = new BaseAgent(config);
    const response = await agent.processMessage(req);
    return response;
  };
}`,

  "agents/routes/ws.ts": `
import { AgentConfig } from "../types/agent.ts";
import { WebSocketHandler } from "../core/communication/websocket.ts";

export function createWSHandler(agentType: string) {
  return async (req: Request) => {
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }
    
    const handler = new WebSocketHandler(agentType);
    return handler.handle(req);
  };
}`,

  "agents/components/ChatLayout.tsx": `
import { JSX } from "preact";

interface ChatLayoutProps {
  children: JSX.Element;
  title: string;
}

export function ChatLayout({ children, title }: ChatLayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <header class="bg-white shadow">
        <h1 class="text-xl font-bold p-4">{title}</h1>
      </header>
      <main class="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}`,
};

// Files to be removed (now handled by unified code)
const filesToRemove = [
  "routes/petunia/chat.ts",
  "routes/jeff/chat.ts",
  "routes/maia/chat.ts",
  "routes/api/petunia/ws.ts",
  "routes/api/jeff/ws.ts",
  "routes/api/maia/ws.ts",
];

async function cleanup() {
  // Create unified handlers
  for (const [path, content] of Object.entries(unifiedHandlers)) {
    const fullPath = `${BASE_DIR}/${path}`;
    await ensureDir(fullPath.substring(0, fullPath.lastIndexOf("/")));
    await Deno.writeTextFile(fullPath, content.trim());
    console.log(`Created unified handler: ${path}`);
  }

  // Remove duplicate files
  for (const file of filesToRemove) {
    try {
      await Deno.remove(`${BASE_DIR}/${file}`);
      console.log(`Removed duplicate file: ${file}`);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        console.error(`Error removing ${file}:`, error);
      }
    }
  }

  console.log("\nCleanup completed successfully!");
}

// Run cleanup
cleanup().catch(console.error);
