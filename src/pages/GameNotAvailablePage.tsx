
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const GameNotAvailablePage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  
  const gameNames: { [key: string]: string } = {
    'plinko': 'PLINKO',
    'lucky-jet': 'LUCKY JET'
  };

  const gameName = gameNames[gameId || ''] || 'Ce jeu';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">{gameName}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-orange-800 mb-2">Niveau insuffisant</h3>
              <p className="text-orange-700">
                Vous n'avez pas encore le niveau requis pour jouer à ce jeu. 
                Continuez à jouer aux autres jeux pour augmenter votre niveau !
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <TrendingUp className="w-5 h-5" />
                <span>Jouez à MINE et DICE pour gagner de l'expérience</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux jeux
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/mine')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Jouer à MINE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default GameNotAvailablePage;
