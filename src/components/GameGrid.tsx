
import React from 'react';
import { Play, Star, TrendingUp, Zap } from 'lucide-react';

export const GameGrid = () => {
  const games = [
    {
      id: 'mine',
      name: 'MINE',
      description: 'Découvrez les diamants cachés',
      icon: '💎',
      gradient: 'from-blue-500 to-blue-700',
      players: '1,247',
      trend: '+12%'
    },
    {
      id: 'lucky-jet',
      name: 'LUCKY JET',
      description: 'Volez vers la fortune',
      icon: '🚀',
      gradient: 'from-orange-500 to-red-600',
      players: '892',
      trend: '+8%'
    },
    {
      id: 'double',
      name: 'DOUBLE',
      description: 'Doublez vos gains',
      icon: '⚡',
      gradient: 'from-green-500 to-emerald-600',
      players: '2,156',
      trend: '+15%'
    },
    {
      id: 'link',
      name: 'LINK',
      description: 'Connectez pour gagner',
      icon: '🔗',
      gradient: 'from-pink-500 to-purple-600',
      players: '673',
      trend: '+5%'
    }
  ];

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Jeux Populaires</h2>
        <button className="text-yellow-400 text-sm font-medium">Voir tout</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            <div className={`w-full h-24 bg-gradient-to-r ${game.gradient} rounded-lg mb-3 flex items-center justify-center text-3xl relative overflow-hidden`}>
              <span className="z-10">{game.icon}</span>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <h3 className="text-white font-bold text-sm mb-1">{game.name}</h3>
            <p className="text-gray-400 text-xs mb-3">{game.description}</p>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-gray-400">
                <Star className="w-3 h-3" />
                <span>{game.players}</span>
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>{game.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured game banner */}
      <div className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-black font-bold text-lg mb-1">Jeu du Jour</h3>
            <p className="text-black/80 text-sm">Bonus x2 sur tous les gains</p>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-black" />
            <span className="text-black font-bold text-2xl">2x</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
};
