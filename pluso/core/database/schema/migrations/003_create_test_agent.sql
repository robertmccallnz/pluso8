-- Insert a test agent
INSERT INTO agents (
    name,
    description,
    type,
    industry,
    template,
    features,
    models,
    system_prompt,
    yaml_config,
    evaluations_enabled,
    evaluation_criteria,
    test_cases,
    metrics_enabled
) VALUES (
    'Test Assistant',
    'A general-purpose AI assistant for testing',
    'assistant',
    'technology',
    'general',
    '{"chat": true, "code": true, "search": true}'::jsonb,
    '{"gpt-4": true, "claude-2": true}'::jsonb,
    'You are a helpful AI assistant focused on technology and software development.',
    'version: 1
name: Test Assistant
type: assistant
features:
  - chat
  - code
  - search',
    true,
    '{"accuracy": true, "helpfulness": true, "safety": true}'::jsonb,
    '[
        {"input": "Hello", "expected_output": "Friendly greeting"},
        {"input": "Write a function", "expected_output": "Valid code with explanation"}
    ]'::jsonb,
    true
);

-- Verify the agent was created
SELECT id, name, type, created_at 
FROM agents 
WHERE name = 'Test Assistant';
