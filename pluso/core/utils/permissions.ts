pluso/utils/permissions.ts
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export interface PermissionRequest {
  type: Deno.PermissionName;
  path?: string;
  name?: string;
  host?: string;
}

export class PermissionManager {
  private static instance: PermissionManager;
  private grantedPermissions: Set<string> = new Set();

  private constructor() {}

  static getInstance(): PermissionManager {
    if (!this.instance) {
      this.instance = new PermissionManager();
    }
    return this.instance;
  }

  private async requestPermission(request: PermissionRequest): Promise<boolean> {
    const permissionKey = this.getPermissionKey(request);
    
    if (this.grantedPermissions.has(permissionKey)) {
      return true;
    }

    const status = await Deno.permissions.request(request);
    if (status.state === "granted") {
      this.grantedPermissions.add(permissionKey);
      return true;
    }
    
    return false;
  }

  private getPermissionKey(request: PermissionRequest): string {
    return `${request.type}:${request.path || request.name || request.host || ''}`;
  }

  async ensureNetworkPermissions(hosts: string[]): Promise<void> {
    for (const host of hosts) {
      const granted = await this.requestPermission({
        type: "net",
        host
      });
      
      if (!granted) {
        throw new PermissionError(
          `Network permission denied for host: ${host}`
        );
      }
    }
  }

  async ensureFileSystemPermissions(paths: string[]): Promise<void> {
    for (const path of paths) {
      const readGranted = await this.requestPermission({
        type: "read",
        path
      });
      
      if (!readGranted) {
        throw new PermissionError(
          `File system read permission denied for path: ${path}`
        );
      }  // For config directories, we also need write permissions
      if (path.includes("config")) {
        const writeGranted = await this.requestPermission({
          type: "write",
          path
        });
        
        if (!writeGranted) {
          throw new PermissionError(
            `File system write permission denied for path: ${path}`
          );
        }
      }
    }
  }

  async ensureEnvPermissions(variables: string[]): Promise<void> {
    for (const variable of variables) {
      const granted = await this.requestPermission({
        type: "env",
        name: variable
      });
      
      if (!granted) {
        throw new PermissionError(
          `Environment permission denied for variable: ${variable}`
        );
      }
    }
  }

  async ensureWorkerPermissions(): Promise<void> {
    const granted = await this.requestPermission({ type: "run" });
    
    if (!granted) {
      throw new PermissionError("Worker creation permission denied");
    }
  }
}
