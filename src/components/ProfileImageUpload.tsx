
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileImageUploadProps {
  currentAvatarUrl?: string | null;
  onImageUpdate: (url: string) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentAvatarUrl,
  onImageUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "URL requise",
        description: "Veuillez entrer une URL d'image valide",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      onImageUpdate(imageUrl);
      setShowUrlInput(false);
      setImageUrl('');
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo de profil",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageUpdate('');
    toast({
      title: "Photo supprimée",
      description: "Votre photo de profil a été supprimée",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
          <AvatarImage src={currentAvatarUrl || undefined} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <Button
            onClick={() => setShowUrlInput(!showUrlInput)}
            variant="outline"
            size="sm"
            className="bg-white border-gray-300"
          >
            <Camera className="w-4 h-4 mr-2" />
            {currentAvatarUrl ? 'Changer la photo' : 'Ajouter une photo'}
          </Button>

          {currentAvatarUrl && (
            <Button
              onClick={handleRemoveImage}
              variant="outline"
              size="sm"
              className="bg-white border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {showUrlInput && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700">
            Entrez l'URL de votre photo de profil
          </div>
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="https://exemple.com/votre-photo.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={isUploading || !imageUrl.trim()}
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Mise à jour...' : 'Valider'}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Utilisez une URL d'image publique (jpg, png, gif)
          </p>
        </div>
      )}
    </div>
  );
};
