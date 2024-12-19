// core/deployment/config-generator.ts
import type { AgentConfig } from "../../agents/types/agent.ts";
import { KVStorageManager } from "../storage/manager.ts";

interface DeploymentConfig {
  type: 'widget' | 'webpage';
  agent: AgentConfig;
  styling: {
    theme: 'light' | 'dark' | 'custom';
    customCSS?: string;
    fontFamily?: string;
    colorScheme?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  hosting: {
    standalone: boolean;
    embedCode?: string;
    domain?: string;
    customDomain?: string;
  };
  integration: {
    database?: {
      type: 'kv' | 'custom';
      connectionString?: string;
    };
    authentication?: {
      enabled: boolean;
      provider?: 'oauth' | 'api-key';
    };
  };
}

export class DeploymentConfigGenerator {
  private storage: KVStorageManager;

  constructor(storage: KVStorageManager) {
    this.storage = storage;
  }

  async generateConfig(
    agentConfig: AgentConfig, 
    type: 'widget' | 'webpage',
    options?: Partial<DeploymentConfig>
  ): Promise<DeploymentConfig> {
    // Validate agent exists
    const agent = await this.storage.getAgent(agentConfig.name);
    if (!agent) {
      throw new Error(`Agent ${agentConfig.name} not found`);
    }

    const deployConfig: DeploymentConfig = {
      type,
      agent: agentConfig,
      styling: {
        theme: 'light',
        fontFamily: 'system-ui',
        colorScheme: {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#60a5fa'
        },
        ...options?.styling
      },
      hosting: {
        standalone: type === 'webpage',
        domain: `${agentConfig.name}.pluso.ai`,
        ...options?.hosting
      },
      integration: {
        database: {
          type: 'kv'
        },
        authentication: {
          enabled: false
        },
        ...options?.integration
      }
    };

    if (type === 'widget') {
      deployConfig.hosting.embedCode = this.generateEmbedCode(
        agentConfig,
        deployConfig.hosting.domain!
      );
    }

    return deployConfig;
  }

  private generateEmbedCode(config: AgentConfig, domain: string): string {
    return `
<script src="https://${domain}/agent-widget.js"></script>
<div 
  id="pluso-agent" 
  data-agent-id="${config.name}"
  data-theme="light"
  data-position="bottom-right"
></div>
    `.trim();
  }

  async saveDeployment(config: DeploymentConfig): Promise<void> {
    await this.storage.kv.set(
      ['deployments', config.agent.name],
      config
    );
  }
}
