-- core/database/schema/legislation.sql
-- Add this to your schema directory

-- Legislation sections table
create table if not exists legislation_sections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  url text not null,
  parent_id uuid references legislation_sections(id),
  last_scraped timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable full-text search
alter table legislation_sections 
  add column if not exists text_search tsvector 
  generated always as (to_tsvector('english', content)) stored;

create index if not exists legislation_sections_text_search_idx 
  on legislation_sections using gin(text_search);

-- Search results table
create table if not exists search_results (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  url text unique not null,
  excerpt text,
  created_at timestamp with time zone default now()
);