import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Image, Video, Link, Sparkles, Upload, X } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const { createPost } = usePosts();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const uploadFile = async (file: File, bucket: string) => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingImage(true);
    try {
      const url = await uploadFile(file, 'post-images');
      if (url) {
        setFormData(prev => ({ ...prev, image_url: url }));
        setImageFile(file);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload de l'image",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier vidéo valide",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingVideo(true);
    try {
      const url = await uploadFile(file, 'post-videos');
      if (url) {
        setFormData(prev => ({ ...prev, video_url: url }));
        setVideoFile(file);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload de la vidéo",
        variant: "destructive"
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImageFile(null);
  };

  const removeVideo = () => {
    setFormData(prev => ({ ...prev, video_url: '' }));
    setVideoFile(null);
  };

  if (!isOpen) {
    return (
      <Card className="bg-black/40 backdrop-blur-lg border border-white/20 shadow-2xl mb-8 hover:shadow-white/10 transition-all duration-300">
        <CardContent className="p-6">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 border border-white/20"
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
    <Card className="bg-black/40 backdrop-blur-lg border border-white/20 shadow-2xl mb-8">
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

          {/* Upload d'image */}
          <div className="space-y-2">
            <Label className="text-white font-medium flex items-center">
              <Image className="w-4 h-4 mr-2" />
              Image
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
                disabled={uploadingImage}
              />
              {uploadingImage && <div className="text-white/70 text-sm">Upload...</div>}
              {imageFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Upload de vidéo */}
          <div className="space-y-2">
            <Label className="text-white font-medium flex items-center">
              <Video className="w-4 h-4 mr-2" />
              Vidéo
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
                disabled={uploadingVideo}
              />
              {uploadingVideo && <div className="text-white/70 text-sm">Upload...</div>}
              {videoFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeVideo}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
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
              className="flex-1 border-white/30 text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || uploadingImage || uploadingVideo ||
                (!formData.content.trim() && !formData.image_url && !formData.video_url)
              }
              className="flex-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white border border-white/20"
            >
              {isSubmitting ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};