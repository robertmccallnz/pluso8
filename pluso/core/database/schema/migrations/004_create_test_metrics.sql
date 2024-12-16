-- Get the agent ID
WITH agent_info AS (
    SELECT id, name 
    FROM agents 
    WHERE name = 'Test Assistant'
    LIMIT 1
)
-- Insert test metrics
INSERT INTO agent_metrics (
    agent_id,
    metrics
)
VALUES (
    '82cbb039-8f91-413a-a9eb-82351c691000'::text,  
    '{
        "response_time": 150,
        "tokens": 1024,
        "cost": 0.02,
        "model": "gpt-4",
        "prompt_tokens": 512,
        "completion_tokens": 512,
        "total_tokens": 1024,
        "response_quality": 0.95,
        "user_satisfaction": 1
    }'::jsonb
);

-- Insert a test evaluation
INSERT INTO agent_evaluations (
    agent_id,
    conversation_id,
    criteria,
    score,
    feedback
)
VALUES (
    '82cbb039-8f91-413a-a9eb-82351c691000'::uuid,  
    gen_random_uuid(),
    'response_quality',
    95,
    'Excellent response with clear explanations and accurate information'
);

-- Insert a test performance snapshot
INSERT INTO agent_performance_snapshots (
    agent_id,
    memory_usage,
    cpu_usage,
    response_time_ms,
    success_rate,
    total_requests,
    error_count,
    metadata
)
VALUES (
    '82cbb039-8f91-413a-a9eb-82351c691000'::text,  
    128000000,  
    0.75,       
    150,        
    0.98,       
    100,        
    2,          
    '{
        "avg_tokens_per_request": 1024,
        "peak_memory_usage": 256000000,
        "peak_cpu_usage": 0.85
    }'::jsonb
);

-- Verify all the data
SELECT 
    a.name as agent_name,
    m.metrics->>'response_time' as response_time,
    m.metrics->>'tokens' as tokens,
    m.metrics->>'cost' as cost,
    m.metrics->>'model' as model,
    e.criteria as evaluation_criteria,
    e.score as evaluation_score,
    ps.memory_usage,
    ps.cpu_usage,
    ps.success_rate
FROM agents a
LEFT JOIN agent_metrics m ON a.id::text = m.agent_id
LEFT JOIN agent_evaluations e ON a.id = e.agent_id
LEFT JOIN agent_performance_snapshots ps ON a.id::text = ps.agent_id
WHERE a.id = '82cbb039-8f91-413a-a9eb-82351c691000'
ORDER BY m.created_at DESC, e.created_at DESC, ps.created_at DESC
LIMIT 1;
