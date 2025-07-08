-- Modifier les politiques pour permettre à tous de voir les posts
DROP POLICY IF EXISTS "VIP users can view posts" ON public.posts;
CREATE POLICY "Anyone can view posts" 
ON public.posts 
FOR SELECT 
USING (true);

-- Modifier les politiques pour permettre à tous de voir les likes
DROP POLICY IF EXISTS "VIP users can view likes" ON public.post_likes;
CREATE POLICY "Anyone can view likes" 
ON public.post_likes 
FOR SELECT 
USING (true);

-- Modifier les politiques pour permettre à tous de voir les commentaires
DROP POLICY IF EXISTS "VIP users can view comments" ON public.post_comments;
CREATE POLICY "Anyone can view comments" 
ON public.post_comments 
FOR SELECT 
USING (true);

-- Permettre à tous les utilisateurs connectés de liker et commenter
DROP POLICY IF EXISTS "VIP users can create likes" ON public.post_likes;
CREATE POLICY "Users can create likes" 
ON public.post_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "VIP users can create comments" ON public.post_comments;
CREATE POLICY "Users can create comments" 
ON public.post_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);