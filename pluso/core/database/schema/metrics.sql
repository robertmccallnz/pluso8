-- Metrics tables for storing historical agent performance data

-- Agent metrics table
CREATE TABLE agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Conversation metrics
    total_conversations INTEGER NOT NULL DEFAULT 0,
    active_conversations INTEGER NOT NULL DEFAULT 0,
    completed_conversations INTEGER NOT NULL DEFAULT 0,
    avg_conversation_duration INTEGER NOT NULL DEFAULT 0, -- in milliseconds
    avg_response_time INTEGER NOT NULL DEFAULT 0, -- in milliseconds
    min_response_time INTEGER NOT NULL DEFAULT 0,
    max_response_time INTEGER NOT NULL DEFAULT 0,
    
    -- Performance metrics
    memory_usage BIGINT NOT NULL DEFAULT 0, -- in bytes
    cpu_usage FLOAT NOT NULL DEFAULT 0, -- percentage
    latency INTEGER NOT NULL DEFAULT 0, -- in milliseconds
    error_rate FLOAT NOT NULL DEFAULT 0,
    success_rate FLOAT NOT NULL DEFAULT 0,
    
    -- Knowledge metrics
    total_tokens BIGINT NOT NULL DEFAULT 0,
    unique_topics INTEGER NOT NULL DEFAULT 0,
    context_size INTEGER NOT NULL DEFAULT 0, -- in bytes
    embedding_count INTEGER NOT NULL DEFAULT 0,
    
    -- Interaction metrics
    user_satisfaction FLOAT NOT NULL DEFAULT 0,
    clarification_requests INTEGER NOT NULL DEFAULT 0,
    accuracy_score FLOAT NOT NULL DEFAULT 0,
    engagement_level FLOAT NOT NULL DEFAULT 0,
    
    -- Metadata
    metadata JSONB
);

-- Indexes for efficient querying
CREATE INDEX idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_timestamp ON agent_metrics(timestamp);
CREATE INDEX idx_agent_metrics_agent_timestamp ON agent_metrics(agent_id, timestamp);

-- Metrics aggregation table for longer-term storage
CREATE TABLE agent_metrics_hourly (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    hour TIMESTAMPTZ NOT NULL,
    metrics JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_agent_metrics_hourly_unique 
ON agent_metrics_hourly(agent_id, hour);

-- Cleanup function to aggregate and archive old metrics
CREATE OR REPLACE FUNCTION aggregate_old_metrics()
RETURNS void AS $$
BEGIN
    -- Aggregate metrics older than 24 hours into hourly records
    INSERT INTO agent_metrics_hourly (agent_id, hour, metrics)
    SELECT 
        agent_id,
        date_trunc('hour', timestamp) as hour,
        jsonb_build_object(
            'conversations', jsonb_build_object(
                'total', AVG(total_conversations),
                'active', AVG(active_conversations),
                'completed', AVG(completed_conversations),
                'avg_duration', AVG(avg_conversation_duration),
                'response_time', jsonb_build_object(
                    'avg', AVG(avg_response_time),
                    'min', MIN(min_response_time),
                    'max', MAX(max_response_time)
                )
            ),
            'performance', jsonb_build_object(
                'memory_usage', AVG(memory_usage),
                'cpu_usage', AVG(cpu_usage),
                'latency', AVG(latency),
                'error_rate', AVG(error_rate),
                'success_rate', AVG(success_rate)
            ),
            'knowledge', jsonb_build_object(
                'total_tokens', MAX(total_tokens),
                'unique_topics', MAX(unique_topics),
                'context_size', AVG(context_size),
                'embedding_count', MAX(embedding_count)
            ),
            'interaction', jsonb_build_object(
                'user_satisfaction', AVG(user_satisfaction),
                'clarification_requests', SUM(clarification_requests),
                'accuracy_score', AVG(accuracy_score),
                'engagement_level', AVG(engagement_level)
            )
        ) as metrics
    FROM agent_metrics
    WHERE timestamp < NOW() - INTERVAL '24 hours'
    GROUP BY agent_id, date_trunc('hour', timestamp)
    ON CONFLICT (agent_id, hour) DO UPDATE
    SET metrics = EXCLUDED.metrics;

    -- Delete aggregated metrics
    DELETE FROM agent_metrics
    WHERE timestamp < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the aggregation
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('aggregate_metrics', '0 * * * *', 'SELECT aggregate_old_metrics()');
