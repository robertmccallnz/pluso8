-- Create activity_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    triage_id INTEGER,
    error_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_activity_log_action ON activity_log(action_type);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);
