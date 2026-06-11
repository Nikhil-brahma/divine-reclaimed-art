
CREATE TABLE public.scheduled_blog_posts (
  id uuid primary key default gen_random_uuid(),
  topic_hint text not null,
  target_keyword text,
  category text default 'Trending',
  scheduled_at timestamptz not null,
  status text not null default 'pending', -- pending | processing | published | failed
  post_id uuid references public.auto_blog_posts(id) on delete set null,
  error text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_blog_posts TO authenticated;
GRANT ALL ON public.scheduled_blog_posts TO service_role;

ALTER TABLE public.scheduled_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Editors view scheduled" ON public.scheduled_blog_posts
  FOR SELECT TO authenticated USING (public.is_editor(auth.uid()));
CREATE POLICY "Editors insert scheduled" ON public.scheduled_blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.is_editor(auth.uid()));
CREATE POLICY "Editors update scheduled" ON public.scheduled_blog_posts
  FOR UPDATE TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));
CREATE POLICY "Editors delete scheduled" ON public.scheduled_blog_posts
  FOR DELETE TO authenticated USING (public.is_editor(auth.uid()));

CREATE INDEX scheduled_blog_due_idx ON public.scheduled_blog_posts (status, scheduled_at);

-- Enable cron extensions for scheduled blog publisher
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
