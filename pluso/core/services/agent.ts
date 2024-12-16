import { AgentConfig, AgentCreationData } from "../types/dashboard.ts";
import supabase from "../database/supabase/client.ts";

export async function createAgent(data: AgentCreationData): Promise<AgentConfig> {
  try {
    // Create the agent config
    const agentConfig: AgentConfig = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      type: data.type,
      industry: data.industry,
      template: data.template,
      features: data.features || [],
      models: data.models || { primary: "" },
      systemPrompt: data.systemPrompt,
      evaluations: {
        enabled: data.evaluations || false,
        criteria: data.evaluationCriteria || [],
        testCases: data.testCases || {},
      },
      metrics: {
        enabled: data.metrics || false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Supabase
    const { data: savedAgent, error } = await supabase
      .from('agents')
      .insert([agentConfig])
      .select()
      .single();

    if (error) {
      console.error('Error saving agent:', error);
      throw error;
    }

    return savedAgent;
  } catch (error) {
    console.error('Error in createAgent:', error);
    throw error;
  }
}

export async function getAgent(id: string): Promise<AgentConfig | null> {
  try {
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }

    return agent;
  } catch (error) {
    console.error('Error in getAgent:', error);
    throw error;
  }
}

export async function listAgents(): Promise<AgentConfig[]> {
  try {
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }

    return agents || [];
  } catch (error) {
    console.error('Error in listAgents:', error);
    throw error;
  }
}
