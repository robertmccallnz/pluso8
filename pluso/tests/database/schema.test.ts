import { assertEquals, assertExists } from "https://deno.land/std@0.211.0/assert/mod.ts";
import { supabaseAdmin } from "../../core/database/client.ts";

interface TableInfo {
  table_name: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

interface ConstraintInfo {
  constraint_name: string;
  table_name: string;
  constraint_type: string;
}

interface ColumnDefinition {
  type: string;
  nullable: boolean;
}

Deno.test("Database Schema - Tables exist", async () => {
  const { data: tables, error } = await supabaseAdmin.from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');

  assertExists(tables, "Failed to fetch tables");
  assertEquals(error, null, "Error fetching tables");

  // List of expected tables
  const expectedTables = [
    'agents',
    'conversations',
    'messages',
    'users',
    'metrics'
  ];

  const tableNames = (tables as { tablename: string }[]).map(t => t.tablename);
  for (const table of expectedTables) {
    assertEquals(
      tableNames.includes(table),
      true,
      `Table '${table}' should exist in the database`
    );
  }
});

Deno.test("Database Schema - Agents table structure", async () => {
  const { data: columns, error } = await supabaseAdmin.from('pg_attribute')
    .select('attname,format_type(atttypid, atttypmod),attnotnull')
    .eq('attrelid', 'public.agents'::regclass)
    .neq('attnum', 0)
    .not('attisdropped');

  assertExists(columns, "Failed to fetch agents table columns");
  assertEquals(error, null, "Error fetching agents table columns");

  // Expected columns and their types
  const expectedColumns: Record<string, ColumnDefinition> = {
    id: { type: 'uuid', nullable: false },
    name: { type: 'character varying', nullable: false },
    description: { type: 'text', nullable: true },
    model: { type: 'character varying', nullable: false },
    system_prompt: { type: 'text', nullable: false },
    temperature: { type: 'numeric', nullable: false },
    max_tokens: { type: 'integer', nullable: false },
    created_at: { type: 'timestamp with time zone', nullable: false },
    updated_at: { type: 'timestamp with time zone', nullable: false }
  };

  // Check each expected column
  for (const [columnName, expected] of Object.entries(expectedColumns)) {
    const columnInfo = columns.find((c: any) => c.attname === columnName);
    assertExists(
      columnInfo,
      `Column '${columnName}' should exist in agents table`
    );
    assertEquals(
      columnInfo?.format_type,
      expected.type,
      `Column '${columnName}' should be of type '${expected.type}'`
    );
    assertEquals(
      !columnInfo?.attnotnull,
      expected.nullable,
      `Column '${columnName}' nullable status should be ${expected.nullable}`
    );
  }
});

Deno.test("Database Schema - Messages table structure", async () => {
  const { data: columns, error } = await supabaseAdmin.from('pg_attribute')
    .select('attname,format_type(atttypid, atttypmod),attnotnull')
    .eq('attrelid', 'public.messages'::regclass)
    .neq('attnum', 0)
    .not('attisdropped');

  assertExists(columns, "Failed to fetch messages table columns");
  assertEquals(error, null, "Error fetching messages table columns");

  // Expected columns and their types
  const expectedColumns: Record<string, ColumnDefinition> = {
    id: { type: 'uuid', nullable: false },
    conversation_id: { type: 'uuid', nullable: false },
    role: { type: 'character varying', nullable: false },
    content: { type: 'text', nullable: false },
    tokens: { type: 'integer', nullable: true },
    created_at: { type: 'timestamp with time zone', nullable: false }
  };

  // Check each expected column
  for (const [columnName, expected] of Object.entries(expectedColumns)) {
    const columnInfo = columns.find((c: any) => c.attname === columnName);
    assertExists(
      columnInfo,
      `Column '${columnName}' should exist in messages table`
    );
    assertEquals(
      columnInfo?.format_type,
      expected.type,
      `Column '${columnName}' should be of type '${expected.type}'`
    );
    assertEquals(
      !columnInfo?.attnotnull,
      expected.nullable,
      `Column '${columnName}' nullable status should be ${expected.nullable}`
    );
  }
});

Deno.test("Database Schema - Foreign key constraints", async () => {
  const { data: constraints, error } = await supabaseAdmin.from('pg_constraint')
    .select('conname,conrelid::regclass::text,contype')
    .in('contype', ['f', 'p']);

  assertExists(constraints, "Failed to fetch constraints");
  assertEquals(error, null, "Error fetching constraints");

  // Expected foreign key relationships
  const expectedConstraints = [
    { table: 'messages', type: 'f', description: 'messages_conversation_id_fkey' },
    { table: 'conversations', type: 'f', description: 'conversations_agent_id_fkey' },
    { table: 'conversations', type: 'f', description: 'conversations_user_id_fkey' }
  ];

  for (const expected of expectedConstraints) {
    const constraintInfo = constraints.find(
      (c: any) => c.conrelid === `public.${expected.table}` &&
           c.contype === expected.type &&
           c.conname === expected.description
    );
    assertExists(
      constraintInfo,
      `Constraint '${expected.description}' should exist on table '${expected.table}'`
    );
  }
});
