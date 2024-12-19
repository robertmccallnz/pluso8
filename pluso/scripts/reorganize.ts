// Reorganize agent files into new structure
import { move, ensureDir } from "https://deno.land/std/fs/mod.ts";

const BASE_DIR = "/Users/robertmccall/pluso8/pluso";

// File mapping: old path -> new path
const fileMapping = {
  // Core agent files
  "core/agents/base.ts": "agents/core/base/base_agent.ts",
  "core/agents/templates/base-agent.ts": "agents/core/base/template_agent.ts",
  
  // Runtime files
  "core/runtime/isolates/agent.ts": "agents/core/runtime/isolate.ts",
  "core/workers/agents/chat.ts": "agents/core/runtime/chat_worker.ts",
  
  // Registry files
  "core/agents/registry.ts": "agents/core/registry/registry.ts",
  "core/agents/management/controller.ts": "agents/core/registry/controller.ts",
  
  // Communication files
  "core/agents/communication/manager.ts": "agents/core/communication/manager.ts",
  "core/agents/communication/chat.ts": "agents/core/communication/chat.ts",
  
  // Types
  "types/agent.ts": "agents/types/agent.ts",
  "types/agent-types.ts": "agents/types/agent_types.ts",
  "core/types/agents.ts": "agents/types/core_agents.ts",
  
  // Services
  "core/services/agent.ts": "agents/services/agent_service.ts",
  "core/storage/agent-store.ts": "agents/services/agent_store.ts",
  
  // Configuration
  "core/config/agent-validator.ts": "agents/utils/validator.ts",
};

async function reorganizeFiles() {
  for (const [oldPath, newPath] of Object.entries(fileMapping)) {
    const sourcePath = `${BASE_DIR}/${oldPath}`;
    const targetPath = `${BASE_DIR}/${newPath}`;
    
    try {
      // Ensure target directory exists
      await ensureDir(targetPath.substring(0, targetPath.lastIndexOf("/")));
      
      // Move file
      await move(sourcePath, targetPath, { overwrite: true });
      console.log(`Moved ${oldPath} to ${newPath}`);
    } catch (error) {
      console.error(`Error moving ${oldPath}: ${error.message}`);
    }
  }
}

// Run reorganization
reorganizeFiles();
