import React from 'react';
import { Play, Star, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import triumphImage from '@/assets/triumph-game.webp';

export const GameGrid = () => {
  const navigate = useNavigate();
  
  const games = [
    {
      id: 'mine',
      name: 'MINE',
      description: 'Découvrez les diamants cachés',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5YZAtLfX4wMQo9y1EvuKL2W0gud4xPP5hfRRaLwK3T290V7edbR4eWlojqZBLXcLgMwpJ7e24DFS36DtwT27VKpTR5bfXHHpWZ0PJizecgYrPthPw-iupGM0Cr8whCjJYXsu4MmN-62ruuvhLF8kaKlA_PR3Op5DJ5wNT7hS2LblDnXabnpMHxk2aZGLG/s512/MAGIC%20(4).png',
      gradient: 'from-blue-500 to-blue-700',
      players: '1,247',
      trend: '+12%',
      path: '/mine'
    },
    {
      id: 'lucky-jet',
      name: 'LUCKY JET',
      description: 'Volez vers la fortune',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1Ew9dm2PFG3k3FpcA_zfkkn31C0r48NtktvBoc9eqiMgC-zfimrq84LlFWNG8fWR79r3kD0I0RZG39wmGBLywu61UeZyXelWqi4jkliocZS9Wr88s9G6Z0B9fD7GnHr7CdgANpa6ql9qPIpwjhmAHIWghlMOPMHBRCyAcrTNVkcHUxdj3Ma0hFbwtfNMK/s512/MAGIC%20(2).png',
      gradient: 'from-orange-500 to-red-600',
      players: '892',
      trend: '+8%',
      path: '/game-not-available/lucky-jet'
    },
    {
      id: 'dice',
      name: 'DICE',
      description: 'Lancez les dés de la fortune',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEglmU5-UPuOlo5pWn_24IYjCo1zkAQY4wVN1uonbyc2Tz4j8JBjmBNNoEaULweB04xZgfr7WZxf8M3fkpD0jHccclzpvbpJtHXbHaRR6pRTJ7wFEIcs1eNYWnYphgAWK5VN_hBnLJMdvD01MjiCecsJ6PGn2KlcvLSFoVROI59YrGKdR-zQ3miuCZTdSw6h/s512/MAGIC%20(1).png',
      gradient: 'from-green-500 to-emerald-600',
      players: '2,156',
      trend: '+15%',
      path: '/dice'
    },
    {
      id: 'plinko',
      name: 'PLINKO',
      description: 'Faites tomber la balle gagnante',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4FducspGRLuJlT1ouGXvB4WVx9nwKc7BICHQoMkDf7m7g-RmK0VmirRqNYwrO2scLcD3f6-WbbPhi4SS9umP5bWZ4Y1u2tExKKJENO7_3mguDMa8jtWAqpdB4DQjMTjjrTgM4vp5bf-lL7DDIJehAhlw5zOU3qrqQMyMqAhEVcgzDe4ckty1O9skwV1fB/s512/MAGIC%20(3).png',
      gradient: 'from-pink-500 to-purple-600',
      players: '673',
      trend: '+5%',
      path: '/plinko'
    },
    {
      id: 'plus-ou-moins',
      name: 'PLUS OU MOINS',
      description: 'Devinez si le total sera plus ou moins que 7',
      image: 'https://bienetrechien.com/wp-content/uploads/2025/12/dicegame-2.png',
      gradient: 'from-indigo-500 to-purple-600',
      players: '1,089',
      trend: '+18%',
      path: '/plus-ou-moins'
    },
    {
      id: 'triumph',
      name: 'TRIUMPH',
      description: 'Détruisez les blocs et gagnez',
      image: triumphImage,
      gradient: 'from-cyan-500 to-blue-600',
      players: '2,847',
      trend: '+25%',
      path: '/triumph'
    }
  ];

  const handleGameClick = (game: typeof games[0]) => {
    navigate(game.path);
  };

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
            onClick={() => handleGameClick(game)}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-full aspect-square bg-gray-800/30 rounded-lg mb-2 relative overflow-hidden">
              <img 
                src={game.image} 
                alt={game.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Play className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

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
