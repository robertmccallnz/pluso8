-- Create triage_logs table
CREATE TABLE IF NOT EXISTS triage_logs (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) NOT NULL,
    priority INTEGER NOT NULL,
    source VARCHAR(255),
    success BOOLEAN NOT NULL,
    assigned_agent VARCHAR(255),
    data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create triage_errors table
CREATE TABLE IF NOT EXISTS triage_errors (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_triage_logs_type ON triage_logs(request_type);
CREATE INDEX idx_triage_logs_agent ON triage_logs(assigned_agent);
CREATE INDEX idx_triage_errors_type ON triage_errors(request_type);

-- Add to activity_log table
ALTER TABLE activity_log 
ADD COLUMN IF NOT EXISTS triage_id INTEGER,
ADD COLUMN IF NOT EXISTS error_id INTEGER,
ADD CONSTRAINT fk_triage_log FOREIGN KEY (triage_id) REFERENCES triage_logs(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_triage_error FOREIGN KEY (error_id) REFERENCES triage_errors(id) ON DELETE SET NULL;
