-- Create agent_metrics table
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_error_logs table
CREATE TABLE IF NOT EXISTS agent_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_performance_snapshots table
CREATE TABLE IF NOT EXISTS agent_performance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  memory_usage BIGINT,
  cpu_usage DOUBLE PRECISION,
  response_time_ms INTEGER,
  success_rate DOUBLE PRECISION,
  total_requests INTEGER,
  error_count INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_error_logs_agent_id ON agent_error_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_performance_snapshots_agent_id ON agent_performance_snapshots(agent_id);

-- Add updated_at trigger for agent_metrics
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agent_metrics_updated_at
    BEFORE UPDATE ON agent_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
