-- Fix 1: stop public exposure of sensitive profile data
DROP POLICY IF EXISTS "Public can view profiles for leaderboard" ON public.profiles;

-- Fix 2: create a safe public leaderboard view (no email)
DROP VIEW IF EXISTS public.leaderboard_view;
CREATE VIEW public.leaderboard_view AS
SELECT
  id,
  COALESCE(
    CASE
      WHEN full_name IS NOT NULL AND length(full_name) > 2
        THEN left(full_name, 1) || '***' || right(full_name, 1)
      WHEN full_name IS NOT NULL AND length(full_name) > 0
        THEN left(full_name, 1) || '***'
      ELSE 'Joueur'
    END,
    'Joueur'
  ) AS display_name,
  avatar_url,
  favorite_game,
  balance,
  COALESCE(total_withdrawn, 0) AS total_withdrawn
FROM public.profiles;

GRANT SELECT ON public.leaderboard_view TO anon;
GRANT SELECT ON public.leaderboard_view TO authenticated;

-- Fix 3: anti-replay table for payment webhook tokens
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_pay text UNIQUE NOT NULL,
  user_id uuid REFERENCES public.profiles(id),
  amount integer NOT NULL,
  ip_address text,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- only service-role (edge functions) should access this table
DROP POLICY IF EXISTS "Service role can manage payment tokens" ON public.processed_webhooks;
CREATE POLICY "Service role can manage payment tokens"
ON public.processed_webhooks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_processed_webhooks_token_pay ON public.processed_webhooks(token_pay);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_user_id ON public.processed_webhooks(user_id);