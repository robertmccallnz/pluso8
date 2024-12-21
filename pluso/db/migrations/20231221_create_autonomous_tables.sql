-- Create allowed_domains table
CREATE TABLE IF NOT EXISTS allowed_domains (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create verified_resources table
CREATE TABLE IF NOT EXISTS verified_resources (
    id SERIAL PRIMARY KEY,
    checksum TEXT NOT NULL UNIQUE,
    content BYTEA NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create model_registry table
CREATE TABLE IF NOT EXISTS model_registry (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    task TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    source TEXT NOT NULL,
    checksum TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, version)
);

-- Create enhancements table
CREATE TABLE IF NOT EXISTS enhancements (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    source TEXT NOT NULL,
    purpose TEXT NOT NULL,
    priority FLOAT NOT NULL DEFAULT 0.0,
    requirements JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    result JSONB,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create download_failures table
CREATE TABLE IF NOT EXISTS download_failures (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    error TEXT NOT NULL,
    attempts INT NOT NULL DEFAULT 1,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create verification_failures table
CREATE TABLE IF NOT EXISTS verification_failures (
    id SERIAL PRIMARY KEY,
    checksum TEXT NOT NULL,
    error TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create security_threats table
CREATE TABLE IF NOT EXISTS security_threats (
    id SERIAL PRIMARY KEY,
    pattern TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create security_patterns table
CREATE TABLE IF NOT EXISTS security_patterns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    pattern TEXT NOT NULL,
    description TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create risk_factors table
CREATE TABLE IF NOT EXISTS risk_factors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    weight FLOAT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial data
INSERT INTO allowed_domains (url, active) VALUES
    ('huggingface.co', true),
    ('cdn.openai.com', true),
    ('github.com', true),
    ('raw.githubusercontent.com', true)
ON CONFLICT (url) DO NOTHING;

INSERT INTO security_patterns (name, pattern, description, active) VALUES
    ('sql_injection', '(?i)(select|insert|update|delete|drop).*from', 'SQL Injection Pattern', true),
    ('xss_script', '(?i)<script[^>]*>', 'XSS Script Tag Pattern', true),
    ('remote_execution', '(?i)(eval|exec|system)\\s*\\(', 'Remote Code Execution Pattern', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO risk_factors (name, weight, description) VALUES
    ('untrusted_source', 0.8, 'Resource from untrusted source'),
    ('unsafe_pattern', 0.9, 'Contains unsafe code pattern'),
    ('high_complexity', 0.6, 'High code complexity score')
ON CONFLICT (name) DO NOTHING;
