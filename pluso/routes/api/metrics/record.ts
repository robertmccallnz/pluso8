import { HandlerContext } from "$fresh/server.ts";
import supabase from "../../../core/database/supabase/client.ts";

interface MetricsPayload {
  agentId: string;
  metrics: {
    response_time: number;
    tokens: number;
    cost: number;
    model: string;
    response_quality?: number;
    user_satisfaction?: number;
    [key: string]: unknown;
  };
  performance?: {
    memory_usage?: number;
    cpu_usage?: number;
    response_time_ms?: number;
    success_rate?: number;
    total_requests?: number;
    error_count?: number;
    metadata?: Record<string, unknown>;
  };
  evaluation?: {
    criteria: string;
    score: number;
    feedback?: string;
    conversation_id: string;
  };
}

export async function handler(
  req: Request,
  _ctx: HandlerContext
): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const payload: MetricsPayload = await req.json();
    const { agentId, metrics, performance, evaluation } = payload;

    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Insert metrics
    const { error: metricsError } = await supabase
      .from('agent_metrics')
      .insert({
        agent_id: agentId,
        metrics
      });
    
    if (metricsError) {
      console.error('Error inserting metrics:', metricsError);
      throw metricsError;
    }

    // Insert performance snapshot if provided
    if (performance) {
      const { error: perfError } = await supabase
        .from('agent_performance_snapshots')
        .insert({
          agent_id: agentId,
          ...performance
        });
      
      if (perfError) {
        console.error('Error inserting performance:', perfError);
        throw perfError;
      }
    }

    // Insert evaluation if provided
    if (evaluation) {
      const { error: evalError } = await supabase
        .from('agent_evaluations')
        .insert({
          agent_id: agentId,
          ...evaluation
        });
      
      if (evalError) {
        console.error('Error inserting evaluation:', evalError);
        throw evalError;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error recording metrics:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to record metrics',
        details: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
