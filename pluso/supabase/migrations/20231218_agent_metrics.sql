-- Create agent metrics table
CREATE TABLE IF NOT EXISTS agent_metrics (
    id BIGSERIAL PRIMARY KEY,
    agent_id TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    agent_type TEXT NOT NULL,
    performance_score FLOAT NOT NULL,
    response_time FLOAT NOT NULL,
    success_rate FLOAT NOT NULL,
    user_satisfaction FLOAT NOT NULL,
    context_relevance FLOAT NOT NULL,
    memory_usage FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT agent_type_check CHECK (agent_type IN ('jeff', 'petunia', 'maia'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_created_at ON agent_metrics(created_at);

-- Add RLS policies
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to agent metrics" ON agent_metrics
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow insert access to agent metrics" ON agent_metrics
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
