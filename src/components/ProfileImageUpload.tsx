import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, X, Link, Smartphone } from 'lucide-react';
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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    profile
  } = useAuth();
  const {
    toast
  } = useToast();
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
      setUploadMethod(null);
      setImageUrl('');
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès"
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
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Fichier invalide",
        description: "Veuillez sélectionner un fichier image (jpg, png, gif)",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille de l'image ne doit pas dépasser 5MB",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      onImageUpdate(result);
      setUploadMethod(null);
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès"
      });
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast({
        title: "Erreur",
        description: "Impossible de lire le fichier",
        variant: "destructive"
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveImage = () => {
    onImageUpdate('');
    toast({
      title: "Photo supprimée",
      description: "Votre photo de profil a été supprimée"
    });
  };
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };
  return <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
          <AvatarImage src={currentAvatarUrl || undefined} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          {!uploadMethod && <div className="flex flex-col space-y-2">
              <Button onClick={() => setUploadMethod('file')} variant="outline" size="sm" className="bg-white border-gray-300">
                <Smartphone className="w-4 h-4 mr-2" />
                Depuis le téléphone
              </Button>
              
              
            </div>}

          {currentAvatarUrl && <Button onClick={handleRemoveImage} variant="outline" size="sm" className="bg-white border-red-300 text-red-600 hover:bg-red-50">
              <X className="w-4 h-4 mr-2" />
              Supprimer
            </Button>}
        </div>
      </div>

      {/* Input file caché */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Interface pour fichier depuis téléphone */}
      {uploadMethod === 'file' && <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700">
            Sélectionner une photo depuis votre téléphone
          </div>
          <div className="flex space-x-2">
            <Button onClick={openFileSelector} disabled={isUploading} size="sm" className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              {isUploading ? 'Chargement...' : 'Choisir une photo'}
            </Button>
            <Button onClick={() => setUploadMethod(null)} variant="outline" size="sm">
              Annuler
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Formats acceptés: JPG, PNG, GIF (max 5MB)
          </p>
        </div>}

      {/* Interface pour URL */}
      {uploadMethod === 'url' && <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700">
            Entrez l'URL de votre photo de profil
          </div>
          <div className="flex space-x-2">
            <Input type="url" placeholder="https://exemple.com/votre-photo.jpg" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="flex-1" />
            <Button onClick={handleUrlSubmit} disabled={isUploading || !imageUrl.trim()} size="sm">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Mise à jour...' : 'Valider'}
            </Button>
            <Button onClick={() => setUploadMethod(null)} variant="outline" size="sm">
              Annuler
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Utilisez une URL d'image publique (jpg, png, gif)
          </p>
        </div>}
    </div>;
};