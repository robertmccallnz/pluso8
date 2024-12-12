// pluso/core/init.ts
export async function initializePermissions() {
    const permManager = PermissionManager.getInstance();
  
    try {
      // Network permissions
      await permManager.ensureNetworkPermissions([
        "api.pluso.ai",
        "localhost:8000",
        "deno.land"
      ]);
  
      // File system permissions
      await permManager.ensureFileSystemPermissions([
        "config/",
        "agents/prompts/",
        "storage/",
        "logs/"
      ]);
  
      // Environment variables
      await permManager.ensureEnvPermissions([
        "PLUSO_API_KEY",
        "PLUSO_ENV",
        "PLUSO_OPENAI_KEY",
        "PLUSO_DATABASE_URL"
      ]);
  
      // Worker permissions
      await permManager.ensureWorkerPermissions();
  
    } catch (error) {
      if (error instanceof PermissionError) {
        console.error("Permission initialization failed:", error.message);
        Deno.exit(1);
      }
      throw error;
    }
  }