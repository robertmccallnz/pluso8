// configLoader.ts
import { parse } from "https://deno.land/std/yaml/mod.ts";
import { z } from "https://deno.land/x/zod/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

// Type Definitions
export interface JeffIdentity {
  age: number;
  location: string;
  personality: {
    formal: boolean;
    professional: boolean;
    transparent: boolean;
    traits: string[];
  };
}

export interface JeffExpertise {
  primary: string[];
  specializations: Record<string, {
    enabled: boolean;
    route: string;
  }>;
}

export interface JeffConfig {
  name: string;
  version: string;
  description: string;
  identity: JeffIdentity;
  expertise: JeffExpertise;
  document_handling: unknown;
  consultation_flow: unknown;
  email_templates: unknown;
  search_configuration: unknown;
  subscription: unknown;
}

// Zod Schemas
const personalitySchema = z.object({
  formal: z.boolean(),
  professional: z.boolean(),
  transparent: z.boolean(),
  traits: z.array(z.string())
});

const identitySchema = z.object({
  age: z.number(),
  location: z.string(),
  personality: personalitySchema
});

const expertiseSchema = z.object({
  primary: z.array(z.string()),
  specializations: z.record(z.object({
    enabled: z.boolean(),
    route: z.string()
  }))
});

const configSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  identity: identitySchema,
  expertise: expertiseSchema,
  document_handling: z.unknown(),
  consultation_flow: z.unknown(),
  email_templates: z.unknown(),
  search_configuration: z.unknown(),
  subscription: z.unknown()
});

export class JeffConfigLoader {
  private static instance: JeffConfigLoader;
  private config: JeffConfig;
  private readonly configPath: string;

  private constructor() {
    this.configPath = new URL("jeff-legal.yaml", import.meta.url).pathname;
    this.config = this.loadConfig();
  }

  public static getInstance(): JeffConfigLoader {
    if (!JeffConfigLoader.instance) {
      JeffConfigLoader.instance = new JeffConfigLoader();
    }
    return JeffConfigLoader.instance;
  }

  private loadConfig(): JeffConfig {
    try {
      const configFile = Deno.readTextFileSync(this.configPath);
      const parsedConfig = parse(configFile) as unknown;
      
      const validationResult = configSchema.safeParse(parsedConfig);
      
      if (!validationResult.success) {
        throw new Error(
          `Config validation failed: ${JSON.stringify(validationResult.error.format(), null, 2)}`
        );
      }

      return validationResult.data;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`Configuration file not found at ${this.configPath}`);
      }
      throw new Error(`Failed to load Jeff configuration: ${error.message}`);
    }
  }

  // Public Getters
  public getPersonality(): JeffIdentity["personality"] {
    return this.config.identity.personality;
  }

  public getExpertise(): JeffExpertise {
    return this.config.expertise;
  }

  public getEmailTemplates() {
    return this.config.email_templates;
  }

  public getConsultationFlow() {
    return this.config.consultation_flow;
  }

  public getFullConfig(): Readonly<JeffConfig> {
    return Object.freeze({ ...this.config });
  }

  // Reload configuration (useful for development)
  public reloadConfig(): void {
    this.config = this.loadConfig();
  }

  // Validate specialization exists
  public hasSpecialization(name: string): boolean {
    return name in this.config.expertise.specializations;
  }

  // Get specialization if enabled
  public getEnabledSpecialization(name: string) {
    const specialization = this.config.expertise.specializations[name];
    if (!specialization || !specialization.enabled) {
      return null;
    }
    return specialization;
  }
}

// React hook for Fresh/Preact
export function useJeffConfig() {
  return {
    personality: JeffConfigLoader.getInstance().getPersonality(),
    expertise: JeffConfigLoader.getInstance().getExpertise(),
    emailTemplates: JeffConfigLoader.getInstance().getEmailTemplates(),
    consultationFlow: JeffConfigLoader.getInstance().getConsultationFlow(),
  };
}

// Additional exports for type safety
export type { 
  JeffConfig as Config,
  JeffIdentity as Identity,
  JeffExpertise as Expertise
};

// Usage example:
/*
import { JeffConfigLoader, useJeffConfig } from "./configLoader.ts";

// In a component:
function LegalComponent() {
  const { personality, expertise } = useJeffConfig();
  
  // Use configuration...
}

// Or directly:
const config = JeffConfigLoader.getInstance();
const specialization = config.getEnabledSpecialization("legal");
*/