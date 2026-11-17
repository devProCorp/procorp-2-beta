-- Reader engagement per Journal article (pedido de Christian Daza, 2026-11-17):
-- which articles land best with readers, and a popularity score that feeds the
-- recommendations at the end of each article.
--
-- Anonymous by design: one row per article and day with plain counters. No
-- cookie, IP, user agent or any per-reader identifier is stored, so measuring
-- needs no consent. Written only through blog.track_article_event (called by
-- the article-engagement Edge Function with the service role); the table has
-- RLS on and no policies, like the rest of the blog schema.
--
-- Apply by hand (SQL Editor or Management API), like 0001.

create table if not exists blog.article_engagement (
  post_id       bigint  not null,          -- blog.posts.wp_id
  day           date    not null default (now() at time zone 'Europe/Madrid')::date,
  views         integer not null default 0, -- article opened
  reads         integer not null default 0, -- reached the end of the text
  read_seconds  bigint  not null default 0, -- visible time, summed over reads
  audio_plays   integer not null default 0, -- blogcast started
  invest_clicks integer not null default 0, -- «Ver mis opciones de inversión»
  primary key (post_id, day)
);

alter table blog.article_engagement enable row level security;

create or replace function blog.track_article_event(
  p_post_id bigint,
  p_event   text,
  p_seconds integer default 0
) returns void
language plpgsql
security definer
set search_path = blog
as $$
declare
  d date := (now() at time zone 'Europe/Madrid')::date;
  s integer := greatest(0, least(coalesce(p_seconds, 0), 1800));
begin
  if p_event not in ('view', 'read', 'audio', 'invest') then
    raise exception 'unknown event %', p_event;
  end if;
  insert into blog.article_engagement as e (post_id, day, views, reads, read_seconds, audio_plays, invest_clicks)
  values (
    p_post_id, d,
    (p_event = 'view')::int,
    (p_event = 'read')::int,
    case when p_event = 'read' then s else 0 end,
    (p_event = 'audio')::int,
    (p_event = 'invest')::int
  )
  on conflict (post_id, day) do update set
    views         = e.views + excluded.views,
    reads         = e.reads + excluded.reads,
    read_seconds  = e.read_seconds + excluded.read_seconds,
    audio_plays   = e.audio_plays + excluded.audio_plays,
    invest_clicks = e.invest_clicks + excluded.invest_clicks;
end;
$$;

-- Popularity over the last `p_days` days. Weights: finishing the article,
-- listening to the blogcast and clicking towards investment say more about
-- interest than opening the page.
create or replace function blog.article_popularity(p_days integer default 30)
returns table (
  post_id bigint, views bigint, reads bigint, read_seconds bigint,
  audio_plays bigint, invest_clicks bigint, score numeric
)
language sql
stable
security definer
set search_path = blog
as $$
  select e.post_id,
         sum(e.views), sum(e.reads), sum(e.read_seconds),
         sum(e.audio_plays), sum(e.invest_clicks),
         sum(e.views) * 1 + sum(e.reads) * 3 + sum(e.audio_plays) * 3
           + sum(e.invest_clicks) * 5 + round(sum(e.read_seconds) / 120.0, 1)
  from blog.article_engagement e
  where e.day > (now() at time zone 'Europe/Madrid')::date - greatest(1, least(p_days, 365))
  group by e.post_id;
$$;

revoke all on blog.article_engagement from anon, authenticated;
revoke execute on function blog.track_article_event(bigint, text, integer) from public, anon, authenticated;
revoke execute on function blog.article_popularity(integer) from public, anon, authenticated;
grant select, insert, update on blog.article_engagement to service_role;
grant execute on function blog.track_article_event(bigint, text, integer) to service_role;
grant execute on function blog.article_popularity(integer) to service_role;
