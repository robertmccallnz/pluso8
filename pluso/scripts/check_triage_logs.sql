-- Check recent triage errors
SELECT 
    te.id,
    te.request_type,
    te.error_message,
    te.context->>'component' as component,
    te.timestamp,
    al.description as activity_description
FROM triage_errors te
LEFT JOIN activity_log al ON al.error_id = te.id
WHERE te.timestamp > NOW() - INTERVAL '1 hour'
ORDER BY te.timestamp DESC
LIMIT 5;

-- Check recent triage logs
SELECT 
    tl.id,
    tl.request_type,
    tl.source,
    tl.success,
    tl.assigned_agent,
    tl.data->>'component' as component,
    tl.timestamp,
    al.description as activity_description
FROM triage_logs tl
LEFT JOIN activity_log al ON al.triage_id = tl.id
WHERE tl.timestamp > NOW() - INTERVAL '1 hour'
ORDER BY tl.timestamp DESC
LIMIT 5;
