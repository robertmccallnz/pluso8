import { updateArchitectureDoc } from "./update-architecture.ts";

interface ChatContext {
  timestamp: string;
  architecture: string;
  activeFile?: string;
  activeLine?: number;
  activeCodeItem?: string;
}

async function generateChatContext(): Promise<ChatContext> {
  // Get architecture overview in chat format
  const architecture = await updateArchitectureDoc("chat");
  
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Get active file info from environment or editor state
  const activeFile = Deno.env.get("ACTIVE_FILE");
  const activeLine = parseInt(Deno.env.get("ACTIVE_LINE") || "0");
  const activeCodeItem = Deno.env.get("ACTIVE_CODE_ITEM");
  
  return {
    timestamp,
    architecture,
    activeFile,
    activeLine,
    activeCodeItem,
  };
}

async function outputChatContext() {
  try {
    const context = await generateChatContext();
    
    console.log(`
**Chat Session Initialized**
Current Time: ${new Date(context.timestamp).toLocaleString()}

${context.architecture}

**Current Context:**
${context.activeFile ? `- Active File: ${context.activeFile}` : ""}
${context.activeLine ? `- Line: ${context.activeLine}` : ""}
${context.activeCodeItem ? `- Code Item: ${context.activeCodeItem}` : ""}
`);
  } catch (error) {
    console.error("Error generating chat context:", error);
    throw error;
  }
}

if (import.meta.main) {
  await outputChatContext();
}
