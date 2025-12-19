-- Fix SECURITY DEFINER VIEW issue: recreate as SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard_view;
CREATE VIEW public.leaderboard_view 
WITH (security_invoker = on) AS
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