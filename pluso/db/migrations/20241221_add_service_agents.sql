-- Create service_agents table
CREATE TABLE IF NOT EXISTS service_agents (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create service_triggers table
CREATE TABLE IF NOT EXISTS service_triggers (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES service_agents(id),
    event VARCHAR(100) NOT NULL,
    condition TEXT,
    action TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create service_agent_relationships table
CREATE TABLE IF NOT EXISTS service_agent_relationships (
    source_agent_id UUID REFERENCES service_agents(id),
    target_agent_id UUID REFERENCES service_agents(id),
    relationship_type VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_agent_id, target_agent_id)
);

-- Create indexes
CREATE INDEX idx_service_agents_type ON service_agents(type);
CREATE INDEX idx_service_agents_status ON service_agents(status);
CREATE INDEX idx_service_triggers_agent ON service_triggers(agent_id);
CREATE INDEX idx_service_triggers_event ON service_triggers(event);

-- Add trigger for updated_at
CREATE TRIGGER update_service_agents_updated_at
    BEFORE UPDATE ON service_agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_triggers_updated_at
    BEFORE UPDATE ON service_triggers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
