-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION get_tables()
RETURNS text[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT table_name::text
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get columns for a specific table
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
    column_name text,
    data_type text,
    is_nullable text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        columns.column_name::text,
        columns.data_type::text,
        columns.is_nullable::text
    FROM information_schema.columns
    WHERE columns.table_schema = 'public'
    AND columns.table_name = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get foreign key constraints
CREATE OR REPLACE FUNCTION get_foreign_keys()
RETURNS TABLE (
    constraint_name text,
    table_name text,
    constraint_type text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.constraint_name::text,
        tc.table_name::text,
        tc.constraint_type::text
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema = 'public'
    AND tc.constraint_type IN ('FOREIGN KEY', 'PRIMARY KEY');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
