-- Sequence + RPC for wp_id values of posts published directly through the
-- new publish-blog-post Edge Function (no real WordPress ID exists for
-- these — n8n publishes straight to Supabase, WordPress is being
-- decommissioned, see docs/decisions/0004-n8n-publish-edge-function.md).
--
-- Starts at 900,000,000: the highest real WordPress id ever synced into
-- blog.posts was 13121 (checked 2026-08-24), so this range can never
-- collide with a migrated post.
--
-- Apply by hand in Supabase Dashboard -> SQL Editor (this repo's convention
-- for one-off schema changes — see the other migrations referenced in
-- ../../blog migration/blog-migration-wordpress-supabase.md).

create sequence if not exists blog.native_post_id_seq
  start with 900000000
  increment by 1;

create or replace function blog.next_native_post_id()
returns bigint
language sql
security definer
set search_path = blog
as $$
  select nextval('blog.native_post_id_seq');
$$;

grant usage on schema blog to service_role;
grant execute on function blog.next_native_post_id() to service_role;
