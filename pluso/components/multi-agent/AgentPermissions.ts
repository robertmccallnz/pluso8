export type AgentPermission =
  | 'read'      // Read data/context
  | 'write'     // Modify data/state
  | 'network'   // Make external API calls
  | 'spawn'     // Create new agents
  | 'execute'   // Run commands/scripts
  | 'interact'  // Interact with other agents
  | 'delegate'  // Delegate tasks to other agents
  | 'monitor'   // Monitor other agents
  | 'evaluate'  // Evaluate other agents' outputs
  | 'override'; // Override other agents' decisions

export interface PermissionScope {
  resources: string[];    // Specific resources this permission applies to
  conditions?: {         // Optional conditions for when permission is granted
    timeWindow?: {
      start: string;
      end: string;
    };
    rateLimits?: {
      requests: number;
      window: string;
    };
    contextRequired?: string[];
    approvalRequired?: string[];
  };
}

export interface AgentPermissionConfig {
  id: string;
  name: string;
  permissions: Record<AgentPermission, PermissionScope>;
  inheritance?: string[];  // IDs of permission configs to inherit from
}

export interface AgentRole {
  id: string;
  name: string;
  description: string;
  permissionConfig: AgentPermissionConfig;
  capabilities: string[];
}

export class PermissionManager {
  private static instance: PermissionManager;
  private permissionConfigs: Map<string, AgentPermissionConfig> = new Map();
  private roles: Map<string, AgentRole> = new Map();
  private agentPermissions: Map<string, Set<string>> = new Map();

  private constructor() {}

  static getInstance(): PermissionManager {
    if (!this.instance) {
      this.instance = new PermissionManager();
    }
    return this.instance;
  }

  createPermissionConfig(config: AgentPermissionConfig): void {
    this.permissionConfigs.set(config.id, config);
  }

  createRole(role: AgentRole): void {
    this.roles.set(role.id, role);
  }

  assignRoleToAgent(agentId: string, roleId: string): void {
    const role = this.roles.get(roleId);
    if (!role) throw new Error('Role not found');

    const permissions = new Set<string>();
    this.resolvePermissions(role.permissionConfig, permissions);
    this.agentPermissions.set(agentId, permissions);
  }

  private resolvePermissions(
    config: AgentPermissionConfig,
    permissions: Set<string>
  ): void {
    // Add direct permissions
    Object.entries(config.permissions).forEach(([perm, scope]) => {
      scope.resources.forEach(resource => {
        permissions.add(`${perm}:${resource}`);
      });
    });

    // Resolve inherited permissions
    config.inheritance?.forEach(inheritedId => {
      const inheritedConfig = this.permissionConfigs.get(inheritedId);
      if (inheritedConfig) {
        this.resolvePermissions(inheritedConfig, permissions);
      }
    });
  }

  checkPermission(
    agentId: string,
    permission: AgentPermission,
    resource: string
  ): boolean {
    const agentPerms = this.agentPermissions.get(agentId);
    if (!agentPerms) return false;

    return agentPerms.has(`${permission}:${resource}`);
  }

  validateInteraction(
    sourceAgentId: string,
    targetAgentId: string,
    action: AgentPermission
  ): {
    allowed: boolean;
    reason?: string;
  } {
    const sourcePerms = this.agentPermissions.get(sourceAgentId);
    const targetPerms = this.agentPermissions.get(targetAgentId);

    if (!sourcePerms || !targetPerms) {
      return {
        allowed: false,
        reason: 'One or both agents not found'
      };
    }

    // Check if source agent has interaction permission
    if (!sourcePerms.has(`interact:${targetAgentId}`)) {
      return {
        allowed: false,
        reason: 'Source agent lacks interaction permission'
      };
    }

    // Check if target agent allows the specific action
    if (!targetPerms.has(`${action}:*`) && !targetPerms.has(`${action}:${sourceAgentId}`)) {
      return {
        allowed: false,
        reason: `Target agent does not allow ${action} action`
      };
    }

    return { allowed: true };
  }
}

// Default permission configurations
export const DEFAULT_PERMISSION_CONFIGS: Record<string, AgentPermissionConfig> = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Orchestrator',
    permissions: {
      read: { resources: ['*'] },
      write: { resources: ['task_queue', 'results'] },
      network: { resources: ['internal'] },
      spawn: { resources: ['worker_agents'] },
      interact: { resources: ['*'] },
      delegate: { resources: ['*'] },
      monitor: { resources: ['*'] },
      evaluate: { resources: ['*'] },
      override: { resources: ['worker_agents'] },
      execute: { resources: ['task_queue'] }
    }
  },
  worker: {
    id: 'worker',
    name: 'Worker',
    permissions: {
      read: { resources: ['task_queue', 'assigned_tasks'] },
      write: { resources: ['results'] },
      network: { resources: [] },
      spawn: { resources: [] },
      interact: { resources: ['orchestrator'] },
      delegate: { resources: [] },
      monitor: { resources: [] },
      evaluate: { resources: [] },
      override: { resources: [] },
      execute: { resources: ['assigned_tasks'] }
    }
  },
  validator: {
    id: 'validator',
    name: 'Validator',
    permissions: {
      read: { resources: ['results'] },
      write: { resources: ['validation_results'] },
      network: { resources: [] },
      spawn: { resources: [] },
      interact: { resources: ['orchestrator'] },
      delegate: { resources: [] },
      monitor: { resources: ['worker_agents'] },
      evaluate: { resources: ['results'] },
      override: { resources: [] },
      execute: { resources: ['validation_tasks'] }
    }
  }
};
