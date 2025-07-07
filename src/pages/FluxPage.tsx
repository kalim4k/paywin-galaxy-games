import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, MessageCircle, ExternalLink, Send } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const FluxPage = () => {
  const { posts, loading, toggleLike, addComment } = usePosts();
  const { profile } = useAuth();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const hasVipAccess = profile && profile.balance >= 150000;

  const handleCommentSubmit = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    const success = await addComment(postId, content);
    if (success) {
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'maintenant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}j`;
  };

  if (!hasVipAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 pb-20 flex items-center justify-center min-h-[60vh]">
          <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Accès VIP Requis</h1>
            <p className="text-white/70 mb-6">
              Vous devez avoir un solde d'au moins 150,000 FCFA pour accéder au flux.
            </p>
            <p className="text-white/50">
              Votre solde actuel: {profile?.balance?.toLocaleString()} FCFA
            </p>
          </Card>
        </div>
        <Navigation />
        <PWAInstallPrompt />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Navigation />
        <PWAInstallPrompt />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Flux VIP</h1>
          <p className="text-white/70">Découvrez les dernières publications de la communauté</p>
        </div>

        <ScrollArea className="space-y-6">
          {posts.length === 0 ? (
            <Card className="bg-black/20 backdrop-blur-md border border-white/10 p-8 text-center">
              <p className="text-white/70">Aucune publication pour le moment.</p>
              <p className="text-white/50 text-sm mt-2">Soyez le premier à publier depuis la page Bonus !</p>
            </Card>
          ) : (
            posts.map((post) => (
              <Card 
                key={post.id} 
                className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-black/30"
              >
                <CardContent className="p-6">
                  {/* Header avec profil utilisateur */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-10 h-10 ring-2 ring-white/20">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {post.profiles?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{post.profiles?.full_name || 'Utilisateur'}</p>
                      <p className="text-xs text-white/50">{formatTimeAgo(post.created_at)}</p>
                    </div>
                  </div>

                  {/* Contenu de la publication */}
                  {post.content && (
                    <p className="text-white mb-4 leading-relaxed">{post.content}</p>
                  )}

                  {/* Image */}
                  {post.image_url && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt="Publication" 
                        className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Vidéo */}
                  {post.video_url && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-auto max-h-96 object-cover"
                        preload="metadata"
                      >
                        <source src={post.video_url} type="video/mp4" />
                        Votre navigateur ne supporte pas les vidéos.
                      </video>
                    </div>
                  )}

                  {/* Bouton personnalisé */}
                  {post.button_text && post.button_link && (
                    <div className="mb-4">
                      <Button 
                        asChild
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        <a href={post.button_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {post.button_text}
                        </a>
                      </Button>
                    </div>
                  )}

                  {/* Actions (Likes et commentaires) */}
                  <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={`text-white/70 hover:text-white hover:bg-white/10 ${
                        post.post_likes.some(like => like.user_id === profile?.id) 
                          ? 'text-red-400 hover:text-red-300' 
                          : ''
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 mr-2 ${
                          post.post_likes.some(like => like.user_id === profile?.id) 
                            ? 'fill-current' 
                            : ''
                        }`} 
                      />
                      {post.post_likes.length}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(prev => ({ 
                        ...prev, 
                        [post.id]: !prev[post.id] 
                      }))}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {post.post_comments.length}
                    </Button>
                  </div>

                  {/* Section commentaires */}
                  {showComments[post.id] && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      {/* Ajouter un commentaire */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Ajouter un commentaire..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ 
                            ...prev, 
                            [post.id]: e.target.value 
                          }))}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCommentSubmit(post.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleCommentSubmit(post.id)}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Liste des commentaires */}
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {post.post_comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.profiles?.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                {comment.profiles?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-white/5 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-semibold text-white text-sm">
                                  {comment.profiles?.full_name || 'Utilisateur'}
                                </p>
                                <p className="text-xs text-white/50">
                                  {formatTimeAgo(comment.created_at)}
                                </p>
                              </div>
                              <p className="text-white/90 text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </ScrollArea>
      </div>

      <Navigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default FluxPage;