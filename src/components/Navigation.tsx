import React from 'react';
import { Gamepad2, Gift, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path.includes('mine') || path.includes('dice') || path.includes('baz') || path.includes('rob') || path.includes('game-not-available')) return 'jeux';
    if (path.includes('bonus')) return 'bonus';
    if (path.includes('withdrawal')) return 'profil';
    return 'jeux';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'jeux', label: 'Jeux', icon: Gamepad2, path: '/' },
    { id: 'bonus', label: 'Bonus', icon: Gift, path: '/bonus' },
    { id: 'profil', label: 'Profil', icon: User, path: '/withdrawal' },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700/50">
      <div className="flex items-center justify-around py-3 px-6 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className="flex flex-col items-center gap-1.5 min-w-[72px] transition-colors"
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-500'
                }`} 
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={`text-xs font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
