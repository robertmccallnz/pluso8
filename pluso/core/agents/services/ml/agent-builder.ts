import { MLIntegrations } from "./integrations.ts";
import { AgentWireframe } from "../wireframe/types.ts";
import { ServiceAgent } from "../types.ts";

export class AgentBuilder {
  private mlIntegrations: MLIntegrations;

  constructor() {
    this.mlIntegrations = MLIntegrations.getInstance();
  }

  async buildAgent(wireframe: AgentWireframe): Promise<ServiceAgent> {
    // 1. Generate agent specification
    const spec = this.createAgentSpec(wireframe);

    // 2. Generate code using HuggingFace
    const { code, tests, documentation } = await this.mlIntegrations.generateAgentCode(spec);

    // 3. Analyze the generated code
    const analysis = await this.mlIntegrations.analyzeArchitecture(code);

    // 4. Apply optimizations if needed
    if (analysis.suggestions.length > 0) {
      const optimizations = await this.mlIntegrations.suggestOptimizations(
        JSON.stringify(analysis)
      );
      
      // Apply high-priority optimizations
      if (optimizations.priority === "high") {
        // Generate optimized code
        const optimizedSpec = this.createOptimizedSpec(spec, optimizations);
        const optimizedResult = await this.mlIntegrations.generateAgentCode(optimizedSpec);
        return await this.createAgent(optimizedResult.code, optimizedResult.tests);
      }
    }

    // 5. Create and return the agent
    return await this.createAgent(code, tests);
  }

  private createAgentSpec(wireframe: AgentWireframe): string {
    return `
      Agent Specification:
      Name: ${wireframe.name}
      Description: ${wireframe.description}
      Domain: ${wireframe.domain}
      
      Capabilities:
      ${wireframe.capabilities.map(cap => `- ${cap}`).join('\n')}
      
      ML Models:
      ${wireframe.mlModels.map(model => `
        - Name: ${model.modelName}
          Type: ${model.type}
          Framework: ${model.framework}
      `).join('\n')}
      
      Routes:
      ${wireframe.routes.map(route => `
        - Path: ${route.path}
          Method: ${route.method}
          Auth: ${route.authentication}
      `).join('\n')}
      
      Data Model:
      ${wireframe.dataModel.entities.map(entity => `
        - Entity: ${entity.name}
          Fields:
          ${entity.fields.map(field => `
            - ${field.name}: ${field.type}${field.required ? ' (required)' : ''}`
          ).join('\n')}
      `).join('\n')}
    `;
  }

  private createOptimizedSpec(spec: string, optimizations: any): string {
    return `
      ${spec}
      
      Optimizations Required:
      ${optimizations.optimizations.map((opt: string) => `- ${opt}`).join('\n')}
      
      Priority: ${optimizations.priority}
      Expected Impact: ${optimizations.impact}
      
      Please generate optimized code incorporating these improvements.
    `;
  }

  private async createAgent(code: string, tests: string): Promise<ServiceAgent> {
    // Create temporary files for the generated code and tests
    const agentPath = `/tmp/generated_agent_${Date.now()}.ts`;
    const testsPath = `/tmp/generated_tests_${Date.now()}.ts`;

    try {
      // Write the generated code and tests
      await Deno.writeTextFile(agentPath, code);
      await Deno.writeTextFile(testsPath, tests);

      // Import and instantiate the agent
      const AgentClass = await import(agentPath);
      const agent = new AgentClass.default();

      // Run tests
      const testResult = await import(testsPath);
      await testResult.default();

      // Clean up temporary files
      await Deno.remove(agentPath);
      await Deno.remove(testsPath);

      return agent;
    } catch (error) {
      console.error("Error creating agent:", error);
      // Clean up on error
      try {
        await Deno.remove(agentPath);
        await Deno.remove(testsPath);
      } catch {}
      throw error;
    }
  }
}
