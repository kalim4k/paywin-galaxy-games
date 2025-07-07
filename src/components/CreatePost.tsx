import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Image, Video, Link, Sparkles } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';

export const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    image_url: '',
    video_url: '',
    button_text: '',
    button_link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPost } = usePosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() && !formData.image_url && !formData.video_url) {
      return;
    }

    setIsSubmitting(true);
    const success = await createPost({
      content: formData.content.trim() || undefined,
      image_url: formData.image_url.trim() || undefined,
      video_url: formData.video_url.trim() || undefined,
      button_text: formData.button_text.trim() || undefined,
      button_link: formData.button_link.trim() || undefined,
    });

    if (success) {
      setFormData({
        content: '',
        image_url: '',
        video_url: '',
        button_text: '',
        button_link: ''
      });
      setIsOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Card className="bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20 backdrop-blur-lg border-2 border-purple-400/30 shadow-2xl mb-8 hover:shadow-purple-500/20 transition-all duration-300">
        <CardContent className="p-6">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <Sparkles className="w-4 h-4 mr-2" />
            Créer une publication VIP
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20 backdrop-blur-lg border-2 border-purple-400/30 shadow-2xl mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
          Créer une publication VIP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contenu texte */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white font-medium">
              Message (optionnel)
            </Label>
            <Textarea
              id="content"
              placeholder="Partagez quelque chose avec la communauté VIP..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none min-h-[100px]"
              rows={4}
            />
          </div>

          {/* URL d'image */}
          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-white font-medium flex items-center">
              <Image className="w-4 h-4 mr-2" />
              Image (URL)
            </Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://exemple.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* URL de vidéo */}
          <div className="space-y-2">
            <Label htmlFor="video_url" className="text-white font-medium flex items-center">
              <Video className="w-4 h-4 mr-2" />
              Vidéo (URL)
            </Label>
            <Input
              id="video_url"
              type="url"
              placeholder="https://exemple.com/video.mp4"
              value={formData.video_url}
              onChange={(e) => handleInputChange('video_url', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Bouton personnalisé */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button_text" className="text-white font-medium flex items-center">
                <Link className="w-4 h-4 mr-2" />
                Texte du bouton
              </Label>
              <Input
                id="button_text"
                placeholder="Visiter mon site"
                value={formData.button_text}
                onChange={(e) => handleInputChange('button_text', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="button_link" className="text-white font-medium">
                Lien du bouton
              </Label>
              <Input
                id="button_link"
                type="url"
                placeholder="https://monsite.com"
                value={formData.button_link}
                onChange={(e) => handleInputChange('button_link', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Aperçu de l'image */}
          {formData.image_url && (
            <div className="space-y-2">
              <Label className="text-white font-medium">Aperçu de l'image</Label>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={formData.image_url} 
                  alt="Aperçu" 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || 
                (!formData.content.trim() && !formData.image_url && !formData.video_url)
              }
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isSubmitting ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};