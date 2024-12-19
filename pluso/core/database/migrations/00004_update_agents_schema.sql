-- Update agents table with new ID structure
ALTER TABLE agents
    ADD COLUMN agent_id TEXT UNIQUE,
    ADD COLUMN version TEXT,
    ADD COLUMN capabilities TEXT[],
    ADD COLUMN metadata JSONB;

-- Create enum types for industry and agent type
DO $$ BEGIN
    CREATE TYPE agent_industry AS ENUM (
        'AGR', 'LEG', 'TECH', 'HLTH', 'EDU',
        'FIN', 'RET', 'MFG', 'NRG', 'REAL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE agent_type AS ENUM (
        'SPEC', 'ASST', 'ANLY', 'TUTR', 'ADVR', 'RSCH'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add columns with new types
ALTER TABLE agents
    ADD COLUMN industry_code agent_industry,
    ADD COLUMN type_code agent_type;

-- Create function to generate agent_id
CREATE OR REPLACE FUNCTION generate_agent_id(
    p_industry agent_industry,
    p_type agent_type,
    p_name TEXT,
    p_sequence INTEGER DEFAULT 1
) RETURNS TEXT AS $$
DECLARE
    clean_name TEXT;
    seq_str TEXT;
BEGIN
    -- Clean name (remove special characters and spaces, convert to uppercase)
    clean_name := upper(regexp_replace(p_name, '[^a-zA-Z0-9]', '', 'g'));
    -- Format sequence number with leading zeros
    seq_str := lpad(p_sequence::TEXT, 4, '0');
    -- Return formatted agent_id
    RETURN p_industry || '_' || p_type || '_' || clean_name || '_' || seq_str;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically generate agent_id on insert
CREATE OR REPLACE FUNCTION auto_generate_agent_id()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INTEGER;
    new_id TEXT;
BEGIN
    -- Get the next sequence number for this combination
    SELECT COALESCE(MAX(CAST(split_part(agent_id, '_', 4) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM agents
    WHERE industry_code = NEW.industry_code
    AND type_code = NEW.type_code
    AND split_part(agent_id, '_', 3) = upper(regexp_replace(NEW.name, '[^a-zA-Z0-9]', '', 'g'));

    -- Generate the new agent_id
    new_id := generate_agent_id(NEW.industry_code, NEW.type_code, NEW.name, seq_num);
    
    -- Set the agent_id
    NEW.agent_id := new_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating agent_id
DO $$ BEGIN
    CREATE TRIGGER trigger_auto_generate_agent_id
        BEFORE INSERT ON agents
        FOR EACH ROW
        EXECUTE FUNCTION auto_generate_agent_id();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_industry_code ON agents(industry_code);
CREATE INDEX IF NOT EXISTS idx_agents_type_code ON agents(type_code);

-- Update agent_metrics table to use the new agent_id
ALTER TABLE agent_metrics
    ADD COLUMN agent_id_str TEXT REFERENCES agents(agent_id);

-- Create a view for agent analytics
CREATE OR REPLACE VIEW agent_analytics AS
WITH industry_totals AS (
    SELECT 
        industry_code,
        COUNT(*) as total_agents,
        COUNT(DISTINCT type_code) as unique_types
    FROM agents
    GROUP BY industry_code
),
type_totals AS (
    SELECT 
        type_code,
        COUNT(*) as total_agents,
        COUNT(DISTINCT industry_code) as unique_industries
    FROM agents
    GROUP BY type_code
),
performance_metrics AS (
    SELECT 
        a.agent_id,
        a.industry_code,
        a.type_code,
        COUNT(m.id) as total_interactions,
        AVG(m.response_time) as avg_response_time,
        SUM(m.tokens) as total_tokens,
        SUM(m.cost) as total_cost
    FROM agents a
    LEFT JOIN agent_metrics m ON a.id = m.agent_id
    GROUP BY a.agent_id, a.industry_code, a.type_code
)
SELECT 
    i.industry_code,
    i.total_agents as industry_total,
    i.unique_types as industry_unique_types,
    t.type_code,
    t.total_agents as type_total,
    t.unique_industries as type_unique_industries,
    p.total_interactions,
    p.avg_response_time,
    p.total_tokens,
    p.total_cost
FROM industry_totals i
CROSS JOIN type_totals t
LEFT JOIN performance_metrics p 
    ON p.industry_code = i.industry_code 
    AND p.type_code = t.type_code;

-- Create materialized view for performance trends
CREATE MATERIALIZED VIEW IF NOT EXISTS agent_performance_trends AS
SELECT 
    a.agent_id,
    a.industry_code,
    a.type_code,
    date_trunc('hour', m.created_at) as time_bucket,
    COUNT(*) as request_count,
    AVG(m.response_time) as avg_response_time,
    SUM(m.tokens) as total_tokens,
    SUM(m.cost) as total_cost,
    COUNT(CASE WHEN m.success THEN 1 END)::float / COUNT(*)::float as success_rate
FROM agents a
JOIN agent_metrics m ON a.id = m.agent_id
GROUP BY a.agent_id, a.industry_code, a.type_code, date_trunc('hour', m.created_at);

-- Create index for the materialized view
CREATE INDEX IF NOT EXISTS idx_agent_performance_trends_time 
ON agent_performance_trends(time_bucket, industry_code, type_code);

-- Create refresh function for the materialized view
CREATE OR REPLACE FUNCTION refresh_agent_performance_trends()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY agent_performance_trends;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh the materialized view
DO $$ BEGIN
    CREATE TRIGGER trigger_refresh_performance_trends
        AFTER INSERT OR UPDATE OR DELETE
        ON agent_metrics
        FOR EACH STATEMENT
        EXECUTE FUNCTION refresh_agent_performance_trends();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
