-- File path: /pluso/core/database/schema/init.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Agent types enum
CREATE TYPE agent_type AS ENUM ('legal', 'assistant', 'specialist');

-- Base tables for all agents
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type agent_type NOT NULL,
    yaml_config JSONB NOT NULL,
    capabilities JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT true,
    UNIQUE(name)
);

-- Store agent-specific configuration
CREATE TABLE agent_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    config_key VARCHAR(255) NOT NULL,
    config_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_id, config_key)
);

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    user_id UUID NOT NULL,
    context JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    metadata JSONB
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    embedding vector(1536)  -- For semantic search capabilities
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    user_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    content_text TEXT,  -- For searchable content
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    embedding vector(1536)  -- For semantic search capabilities
);

-- Agent-specific knowledge bases
CREATE TABLE knowledge_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    embedding vector(1536)  -- For semantic search capabilities
);

-- For Jeff Legal
CREATE TABLE legal_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    conversation_id UUID REFERENCES conversations(id),
    case_number VARCHAR(100),
    status VARCHAR(50),
    jurisdiction VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- For Maia (assuming AI assistant focus)
CREATE TABLE assistant_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    conversation_id UUID REFERENCES conversations(id),
    session_type VARCHAR(100),
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- For Petunia (and general learning/training)
CREATE TABLE training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id),
    category VARCHAR(100),
    content JSONB,
    source VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    validated BOOLEAN DEFAULT false,
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_agents_name ON agents(name);
CREATE INDEX idx_agents_type ON agents(type);
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_documents_agent_id ON documents(agent_id);
CREATE INDEX idx_knowledge_bases_agent_id ON knowledge_bases(agent_id);
CREATE INDEX idx_legal_cases_agent_id ON legal_cases(agent_id);
CREATE INDEX idx_assistant_sessions_agent_id ON assistant_sessions(agent_id);
CREATE INDEX idx_training_data_agent_id ON training_data(agent_id);

-- Example initial data
INSERT INTO agents (name, type, yaml_config, capabilities) VALUES
('Jeff', 'legal', 
 jsonb_build_object('config_path', '/routes/jeff/jeff-legal.yaml'),
 jsonb_build_object('features', ARRAY['legal_advice', 'document_review', 'case_management'])),
('Maia', 'assistant',
 jsonb_build_object('config_path', '/routes/maia/maia.yml'),
 jsonb_build_object('features', ARRAY['conversation', 'task_management', 'learning'])),
('Petunia', 'specialist',
 jsonb_build_object('config_path', '/routes/petunia/petunia.yml'),
 jsonb_build_object('features', ARRAY['specialized_knowledge', 'training', 'adaptation']));