-- Create agent_evolution table
CREATE TABLE IF NOT EXISTS agent_evolution (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES service_agents(id),
    version INTEGER NOT NULL,
    capabilities JSONB,
    learning_data JSONB,
    performance_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_feedback table
CREATE TABLE IF NOT EXISTS agent_feedback (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES service_agents(id),
    user_id UUID REFERENCES users(id),
    context TEXT,
    rating INTEGER,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_adaptations table
CREATE TABLE IF NOT EXISTS agent_adaptations (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES service_agents(id),
    trigger_event TEXT,
    adaptation_type TEXT,
    changes JSONB,
    success_metric FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create emerging_patterns table
CREATE TABLE IF NOT EXISTS emerging_patterns (
    id UUID PRIMARY KEY,
    pattern_type TEXT,
    pattern_data JSONB,
    frequency INTEGER,
    first_seen TIMESTAMP WITH TIME ZONE,
    last_seen TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'detected',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_blueprints table
CREATE TABLE IF NOT EXISTS agent_blueprints (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    domain TEXT NOT NULL,
    capabilities JSONB,
    triggers JSONB,
    dependencies JSONB,
    learning_objectives JSONB,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_agent_evolution_agent_id ON agent_evolution(agent_id);
CREATE INDEX idx_agent_feedback_agent_id ON agent_feedback(agent_id);
CREATE INDEX idx_agent_adaptations_agent_id ON agent_adaptations(agent_id);
CREATE INDEX idx_emerging_patterns_status ON emerging_patterns(status);
CREATE INDEX idx_agent_blueprints_type ON agent_blueprints(type);

-- Add triggers for updated_at
CREATE TRIGGER update_agent_blueprints_updated_at
    BEFORE UPDATE ON agent_blueprints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
