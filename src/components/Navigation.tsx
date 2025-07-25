
import React, { useState } from 'react';
import { Gamepad2, Trophy, Gift, CreditCard, Rss } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path.includes('mine') || path.includes('dice') || path.includes('game-not-available')) return 'jeux';
    if (path.includes('withdrawal')) return 'retrait';
    if (path.includes('bonus')) return 'bonus';
    if (path.includes('leaderboard')) return 'classement';
    if (path.includes('flux')) return 'flux';
    return 'jeux';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const navItems = [
    { id: 'jeux', label: 'Jeux', icon: Gamepad2, path: '/' },
    { id: 'classement', label: 'Classement', icon: Trophy, path: '/leaderboard' },
    { id: 'bonus', label: 'Bonus', icon: Gift, path: '/bonus' },
    { id: 'retrait', label: 'Retrait', icon: CreditCard, path: '/withdrawal' },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`relative flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-yellow-400 bg-yellow-400/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {/* Point bleu animé pour Flux et Bonus */}
              {item.id === 'bonus' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50">
                  <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                </div>
              )}
              
              <Icon className={`w-6 h-6 mb-1 transition-all duration-300 ${
                isActive ? 'scale-110' : ''
              } ${
                item.id === 'bonus' ? 'animate-bounce' : ''
              }`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
