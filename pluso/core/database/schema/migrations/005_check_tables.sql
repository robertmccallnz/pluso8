-- Check structure of all agent-related tables
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name IN (
    'agents',
    'agent_metrics',
    'agent_evaluations',
    'agent_error_logs',
    'agent_performance_snapshots'
)
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;
