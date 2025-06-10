
import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const DiceGame = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Game Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">DICE GAME</h1>
        <p className="text-white/70">Choisissez votre couleur et tentez votre chance</p>
      </div>

      {/* Maintenance Message */}
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Settings className="w-10 h-10 text-orange-400 animate-spin" />
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Jeu en maintenance</h2>
          <p className="text-white/70 text-lg max-w-md">
            Le jeu DICE est temporairement indisponible pour maintenance. 
            Nous travaillons pour l'améliorer et il sera bientôt de retour !
          </p>
          <p className="text-orange-400 font-medium">
            Merci de votre patience 🛠️
          </p>
        </div>

        <Button 
          onClick={() => navigate('/')}
          className="mt-8 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux jeux
        </Button>
      </div>
    </div>
  );
};
