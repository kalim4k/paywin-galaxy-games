import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  user_id: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  button_text?: string;
  button_link?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
  post_likes: { id: string; user_id: string }[];
  post_comments: { 
    id: string; 
    content: string; 
    user_id: string;
    created_at: string;
    profiles: { full_name: string; avatar_url?: string };
  }[];
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          post_likes (id, user_id),
          post_comments (
            id,
            content,
            user_id,
            created_at,
            profiles:user_id (full_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les publications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    content?: string;
    image_url?: string;
    video_url?: string;
    button_text?: string;
    button_link?: string;
  }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          ...postData
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Publication créée avec succès"
      });

      fetchPosts();
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la publication",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const existingLike = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike.data) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        });

      if (error) throw error;

      fetchPosts();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    refreshPosts: fetchPosts
  };
};