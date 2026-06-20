
-- Enable scheduling extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Extend scheduled_blog_posts to support fully written (custom) posts
ALTER TABLE public.scheduled_blog_posts
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'ai',
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS generate_image BOOLEAN NOT NULL DEFAULT false;

-- Make topic_hint optional for custom posts
ALTER TABLE public.scheduled_blog_posts ALTER COLUMN topic_hint DROP NOT NULL;

-- Topic queue used by twice-weekly auto-blog cron
CREATE TABLE IF NOT EXISTS public.blog_topic_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_hint TEXT NOT NULL,
  target_keyword TEXT,
  category TEXT NOT NULL DEFAULT 'Trending',
  position INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_topic_queue TO authenticated;
GRANT ALL ON public.blog_topic_queue TO service_role;

ALTER TABLE public.blog_topic_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Editors manage topic queue"
ON public.blog_topic_queue
FOR ALL
TO authenticated
USING (public.is_editor(auth.uid()))
WITH CHECK (public.is_editor(auth.uid()));

CREATE TRIGGER trg_blog_topic_queue_updated
BEFORE UPDATE ON public.blog_topic_queue
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed a few starter topics if table is empty
INSERT INTO public.blog_topic_queue (topic_hint, target_keyword, category, position)
SELECT * FROM (VALUES
  ('Sacred temple textiles and their hidden meaning', 'temple textiles', 'Heritage', 1),
  ('Why upcycled sacred fabric makes the most meaningful gift', 'sacred upcycled gift', 'Gifting', 2),
  ('The Punarvsu artisan story: hands that carry blessings', 'artisan craft Delhi', 'Artisans', 3),
  ('How to style a Punarvsu potli for a festival look', 'festival potli styling', 'Style Guide', 4),
  ('Zero-waste fashion: what sacred upcycling really means', 'zero waste fashion India', 'Sustainability', 5),
  ('Diwali gifting with intention: blessings you can carry', 'diwali gifting', 'Festival', 6),
  ('From temple to wardrobe: the journey of a Punarvsu bag', 'sacred bag journey', 'Heritage', 7),
  ('Why every Punarvsu piece is one-of-a-kind', 'one of a kind sacred bag', 'Trending', 8)
) AS v(topic_hint, target_keyword, category, position)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_topic_queue);
