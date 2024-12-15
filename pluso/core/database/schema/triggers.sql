-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Agents table triggers
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Legal cases table triggers
CREATE TRIGGER update_legal_cases_updated_at
    BEFORE UPDATE ON legal_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Conversations archiving trigger
CREATE OR REPLACE FUNCTION archive_old_conversations()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND NEW.ended_at < NOW() - INTERVAL '90 days' THEN
        INSERT INTO archived_conversations
        SELECT * FROM conversations WHERE id = NEW.id;
        DELETE FROM conversations WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER archive_conversations
    AFTER UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION archive_old_conversations();

-- Document size validation trigger
CREATE OR REPLACE FUNCTION validate_document_size()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.file_size > 10485760 THEN  -- 10MB limit
        RAISE EXCEPTION 'Document size exceeds maximum limit of 10MB';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_document_size
    BEFORE INSERT OR UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION validate_document_size();

-- Message sanitization trigger
CREATE OR REPLACE FUNCTION sanitize_message_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Basic HTML sanitization
    NEW.content = regexp_replace(NEW.content, '<[^>]+>', '', 'g');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER sanitize_messages
    BEFORE INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION sanitize_message_content();

-- Audit logging trigger
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    action TEXT NOT NULL,
    record_id UUID NOT NULL,
    changed_data JSONB,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    changed_by UUID
);

CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        action,
        record_id,
        changed_data,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id, OLD.id),
        CASE
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb
            WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
                'old', row_to_json(OLD)::jsonb,
                'new', row_to_json(NEW)::jsonb
            )
            ELSE row_to_json(NEW)::jsonb
        END,
        current_setting('app.current_user_id', TRUE)::uuid
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply audit logging to main tables
CREATE TRIGGER audit_agents_changes
    AFTER INSERT OR UPDATE OR DELETE ON agents
    FOR EACH ROW EXECUTE FUNCTION log_changes();

CREATE TRIGGER audit_conversations_changes
    AFTER INSERT OR UPDATE OR DELETE ON conversations
    FOR EACH ROW EXECUTE FUNCTION log_changes();

CREATE TRIGGER audit_legal_cases_changes
    AFTER INSERT OR UPDATE OR DELETE ON legal_cases
    FOR EACH ROW EXECUTE FUNCTION log_changes();