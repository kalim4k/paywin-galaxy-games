import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, MessageCircle, ExternalLink, Send, Share, Bookmark } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const FluxPage = () => {
  const { posts, loading, toggleLike, addComment } = usePosts();
  const { profile } = useAuth();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg ring-4 ring-purple-500/20">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
            Flux VIP
          </h1>
          <p className="text-slate-400 text-lg">Découvrez les créations de notre communauté exclusive</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-12 text-center rounded-2xl shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucune publication pour le moment</h3>
              <p className="text-slate-400">Soyez le premier à partager votre créativité depuis la page Bonus !</p>
            </Card>
          ) : (
            posts.map((post, index) => (
              <Card 
                key={post.id} 
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.01] hover:border-purple-500/30 rounded-2xl overflow-hidden group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <CardContent className="p-0">
                  {/* Header avec profil utilisateur */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-purple-500/30 ring-offset-2 ring-offset-slate-900">
                          <AvatarImage src={post.profiles?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                            {post.profiles?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">{post.profiles?.full_name || 'Utilisateur'}</p>
                        <p className="text-sm text-slate-400">{formatTimeAgo(post.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Contenu de la publication */}
                  {post.content && (
                    <div className="px-6 mb-6">
                      <p className="text-white text-lg leading-relaxed">{post.content}</p>
                    </div>
                  )}

                  {/* Image */}
                  {post.image_url && (
                    <div className="mb-6 group-hover:shadow-2xl transition-shadow duration-300">
                      <img 
                        src={post.image_url} 
                        alt="Publication" 
                        className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Vidéo */}
                  {post.video_url && (
                    <div className="mb-6 group-hover:shadow-2xl transition-shadow duration-300">
                      <video 
                        controls 
                        className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                        preload="metadata"
                      >
                        <source src={post.video_url} type="video/mp4" />
                        Votre navigateur ne supporte pas les vidéos.
                      </video>
                    </div>
                  )}

                  {/* Bouton personnalisé */}
                  {post.button_text && post.button_link && (
                    <div className="px-6 mb-6">
                      <Button 
                        asChild
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 rounded-full px-6 py-2"
                      >
                        <a href={post.button_link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {post.button_text}
                        </a>
                      </Button>
                    </div>
                  )}

                  {/* Actions (Likes et commentaires) */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50 bg-slate-800/30">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={`group relative px-4 py-2 rounded-full transition-all duration-300 ${
                          post.post_likes.some(like => like.user_id === profile?.id) 
                            ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                            : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        <Heart 
                          className={`w-5 h-5 mr-2 transition-transform duration-200 ${
                            post.post_likes.some(like => like.user_id === profile?.id) 
                              ? 'fill-current scale-110' 
                              : 'group-hover:scale-110'
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
                        className="group px-4 py-2 rounded-full transition-all duration-300 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                      >
                        <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        {post.post_comments.length}
                      </Button>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      {post.post_likes.length + post.post_comments.length} interactions
                    </div>
                  </div>

                  {/* Section commentaires */}
                  {showComments[post.id] && (
                    <div className="bg-slate-800/50 border-t border-slate-700/50">
                      {/* Ajouter un commentaire */}
                      <div className="p-6 border-b border-slate-700/30">
                        <div className="flex space-x-3">
                          <Avatar className="w-8 h-8 ring-1 ring-purple-500/30">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                              {profile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex space-x-2">
                            <Input
                              placeholder="Partager votre avis..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ 
                                ...prev, 
                                [post.id]: e.target.value 
                              }))}
                              className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 rounded-full px-4"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleCommentSubmit(post.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleCommentSubmit(post.id)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-4 shadow-lg"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Liste des commentaires */}
                      <div className="max-h-64 overflow-y-auto">
                        {post.post_comments.map((comment, commentIndex) => (
                          <div 
                            key={comment.id} 
                            className="flex space-x-3 p-4 hover:bg-slate-700/30 transition-colors duration-200"
                            style={{
                              animationDelay: `${commentIndex * 50}ms`,
                              animation: 'slideInLeft 0.4s ease-out forwards'
                            }}
                          >
                            <Avatar className="w-8 h-8 ring-1 ring-slate-600/50">
                              <AvatarImage src={comment.profiles?.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                {comment.profiles?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-slate-700/50 rounded-2xl p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-semibold text-white text-sm">
                                    {comment.profiles?.full_name || 'Utilisateur'}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {formatTimeAgo(comment.created_at)}
                                  </p>
                                </div>
                                <p className="text-slate-200 text-sm leading-relaxed">{comment.content}</p>
                              </div>
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
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <Navigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default FluxPage;