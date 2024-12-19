-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agents table if it doesn't exist
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create metrics table
CREATE TABLE agent_metrics (
    id SERIAL PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    total_conversations INTEGER NOT NULL DEFAULT 0,
    active_conversations INTEGER NOT NULL DEFAULT 0,
    completed_conversations INTEGER NOT NULL DEFAULT 0,
    avg_response_time INTEGER NOT NULL DEFAULT 0,
    success_rate FLOAT NOT NULL DEFAULT 0,
    error_rate FLOAT NOT NULL DEFAULT 0,
    memory_usage BIGINT NOT NULL DEFAULT 0,
    cpu_usage FLOAT NOT NULL DEFAULT 0,
    latency INTEGER NOT NULL DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_recorded_at ON agent_metrics(recorded_at);
CREATE INDEX idx_agent_metrics_agent_recorded ON agent_metrics(agent_id, recorded_at);

-- Insert test agents
INSERT INTO agents (id, name, type) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Jeff', 'EVALUATOR'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Petunia', 'ASSISTANT'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Maia', 'RESEARCHER')
ON CONFLICT (id) DO NOTHING;

-- Insert test metrics
INSERT INTO agent_metrics (
    agent_id,
    recorded_at,
    total_conversations,
    active_conversations,
    completed_conversations,
    avg_response_time,
    success_rate,
    error_rate,
    memory_usage,
    cpu_usage,
    latency
) VALUES 
    -- Jeff's metrics (last 24 hours)
    ('550e8400-e29b-41d4-a716-446655440000', NOW(), 150, 5, 145, 250, 97.5, 2.5, 524288000, 45.5, 120),
    ('550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '1 hour', 145, 4, 141, 255, 97.3, 2.7, 524288000, 44.0, 125),
    ('550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '2 hours', 140, 4, 136, 260, 97.2, 2.8, 524288000, 43.5, 130),
    ('550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '3 hours', 135, 3, 132, 265, 97.1, 2.9, 524288000, 43.0, 132),
    ('550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '4 hours', 130, 3, 127, 270, 97.0, 3.0, 524288000, 42.5, 135),
    ('550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '5 hours', 125, 3, 122, 275, 96.9, 3.1, 524288000, 42.0, 137),
    ('550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '6 hours', 120, 3, 117, 280, 96.8, 3.2, 524288000, 41.5, 140),
    
    -- Petunia's metrics (last 24 hours)
    ('550e8400-e29b-41d4-a716-446655440001', NOW(), 180, 8, 172, 200, 98.2, 1.8, 419430400, 38.5, 100),
    ('550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 hour', 175, 7, 168, 205, 98.1, 1.9, 419430400, 38.0, 102),
    ('550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 hours', 170, 7, 163, 210, 98.0, 2.0, 419430400, 37.5, 105),
    ('550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 hours', 165, 6, 159, 212, 97.9, 2.1, 419430400, 37.0, 107),
    ('550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '4 hours', 160, 6, 154, 215, 97.8, 2.2, 419430400, 36.5, 110),
    ('550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 hours', 155, 5, 150, 217, 97.7, 2.3, 419430400, 36.0, 112),
    ('550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '6 hours', 150, 5, 145, 220, 97.6, 2.4, 419430400, 35.5, 115),
    
    -- Maia's metrics (last 24 hours)
    ('550e8400-e29b-41d4-a716-446655440002', NOW(), 130, 4, 126, 300, 96.8, 3.2, 629145600, 52.0, 150),
    ('550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '1 hour', 125, 4, 121, 305, 96.7, 3.3, 629145600, 51.5, 152),
    ('550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 hours', 120, 3, 117, 310, 96.6, 3.4, 629145600, 51.0, 155),
    ('550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 hours', 115, 3, 112, 312, 96.5, 3.5, 629145600, 50.5, 157),
    ('550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '4 hours', 110, 3, 107, 315, 96.4, 3.6, 629145600, 50.0, 160),
    ('550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '5 hours', 105, 2, 103, 317, 96.3, 3.7, 629145600, 49.5, 162),
    ('550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '6 hours', 100, 2, 98, 320, 96.2, 3.8, 629145600, 49.0, 165)
ON CONFLICT DO NOTHING;
