export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          industry: string | null
          template: string | null
          features: Json | null
          models: Json | null
          system_prompt: string | null
          yaml_config: string | null
          evaluations_enabled: boolean
          evaluation_criteria: Json | null
          test_cases: Json | null
          metrics_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          industry?: string | null
          template?: string | null
          features?: Json | null
          models?: Json | null
          system_prompt?: string | null
          yaml_config?: string | null
          evaluations_enabled?: boolean
          evaluation_criteria?: Json | null
          test_cases?: Json | null
          metrics_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          industry?: string | null
          template?: string | null
          features?: Json | null
          models?: Json | null
          system_prompt?: string | null
          yaml_config?: string | null
          evaluations_enabled?: boolean
          evaluation_criteria?: Json | null
          test_cases?: Json | null
          metrics_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      agent_metrics: {
        Row: {
          id: string
          agent_id: string
          metrics: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          metrics: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          metrics?: Json
          created_at?: string
          updated_at?: string
        }
      }
      agent_evaluations: {
        Row: {
          id: string
          agent_id: string
          conversation_id: string
          criteria: string
          score: number
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          conversation_id: string
          criteria: string
          score: number
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          conversation_id?: string
          criteria?: string
          score?: number
          feedback?: string | null
          created_at?: string
        }
      }
      agent_error_logs: {
        Row: {
          id: string
          agent_id: string
          error_message: string
          error_stack: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          error_message: string
          error_stack?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          error_message?: string
          error_stack?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      agent_performance_snapshots: {
        Row: {
          id: string
          agent_id: string
          memory_usage: number | null
          cpu_usage: number | null
          response_time_ms: number | null
          success_rate: number | null
          total_requests: number | null
          error_count: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          memory_usage?: number | null
          cpu_usage?: number | null
          response_time_ms?: number | null
          success_rate?: number | null
          total_requests?: number | null
          error_count?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          memory_usage?: number | null
          cpu_usage?: number | null
          response_time_ms?: number | null
          success_rate?: number | null
          total_requests?: number | null
          error_count?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}
