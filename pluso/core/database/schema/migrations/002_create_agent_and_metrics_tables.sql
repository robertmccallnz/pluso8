-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    industry TEXT,
    template TEXT,
    features JSONB,
    models JSONB,
    system_prompt TEXT,
    yaml_config TEXT,
    evaluations_enabled BOOLEAN DEFAULT true,
    evaluation_criteria JSONB,
    test_cases JSONB,
    metrics_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create agent_metrics table
CREATE TABLE IF NOT EXISTS agent_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    agent_name TEXT NOT NULL,
    agent_type TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    response_time INTEGER NOT NULL,
    tokens INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10,6) NOT NULL DEFAULT 0,
    model TEXT NOT NULL,
    conversation_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metrics JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create agent_evaluations table
CREATE TABLE IF NOT EXISTS agent_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    conversation_id UUID NOT NULL,
    criteria TEXT NOT NULL,
    score INTEGER NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create agent_error_logs table
CREATE TABLE IF NOT EXISTS agent_error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create agent_performance_snapshots table
CREATE TABLE IF NOT EXISTS agent_performance_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    memory_usage BIGINT,
    cpu_usage DOUBLE PRECISION,
    response_time_ms INTEGER,
    success_rate DOUBLE PRECISION,
    total_requests INTEGER,
    error_count INTEGER,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_created_at ON agent_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_evaluations_agent_id ON agent_evaluations(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_evaluations_created_at ON agent_evaluations(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_error_logs_agent_id ON agent_error_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_performance_snapshots_agent_id ON agent_performance_snapshots(agent_id);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER update_agents_updated_at
        BEFORE UPDATE ON agents
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_agent_metrics_updated_at
        BEFORE UPDATE ON agent_metrics
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
