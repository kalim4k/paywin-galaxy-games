
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe, Dice6, Plane } from 'lucide-react';

const games = [
  {
    id: 'mine',
    title: 'MINE',
    description: 'Trouvez les diamants cachés et évitez les bombes',
    icon: Pickaxe,
    gradient: 'from-blue-500 to-purple-600',
    route: '/mine'
  },
  {
    id: 'dice',
    title: 'DICE',
    description: 'Lancez les dés et tentez votre chance',
    icon: Dice6,
    gradient: 'from-green-500 to-emerald-600',
    route: '/dice'
  },
  {
    id: 'lucky-jet',
    title: 'LUCKY JET',
    description: 'Montez jusqu\'aux étoiles avec Lucky Jet',
    icon: Plane,
    gradient: 'from-orange-500 to-red-600',
    route: '/game-not-available/lucky-jet'
  }
];

export const GameGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-2xl font-bold mb-6 text-center">Nos Jeux</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => {
          const IconComponent = game.icon;
          
          return (
            <Card key={game.id} className="bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r ${game.gradient} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2">{game.title}</h3>
                      <p className="text-white/90 text-sm">{game.description}</p>
                    </div>
                    <IconComponent className="w-12 h-12 text-white/80" />
                  </div>
                </div>
                
                <div className="p-4">
                  <Button 
                    onClick={() => navigate(game.route)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm transition-all"
                  >
                    Jouer maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
