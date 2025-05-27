
import React, { useState } from 'react';
import { Gamepad2, Trophy, Gift, CreditCard } from 'lucide-react';

export const Navigation = () => {
  const [activeTab, setActiveTab] = useState('jeux');

  const navItems = [
    { id: 'jeux', label: 'Jeux', icon: Gamepad2 },
    { id: 'classement', label: 'Classement', icon: Trophy },
    { id: 'bonus', label: 'Bonus', icon: Gift },
    { id: 'retrait', label: 'Retrait', icon: CreditCard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-yellow-400 bg-yellow-400/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
