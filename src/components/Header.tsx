
import React from 'react';
import { Coins } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
          <span className="text-black font-bold text-lg">P</span>
        </div>
        <h1 className="text-white font-bold text-xl">PAYWIN</h1>
      </div>
      
      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full">
        <Coins className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">25,750 FCFA</span>
      </div>
    </header>
  );
};
