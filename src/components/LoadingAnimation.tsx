
import React from 'react';

export const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Cercle principal avec animation de rotation */}
        <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-spin">
          <div className="w-full h-full border-t-4 border-yellow-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Particules orbitales */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-2 h-2 bg-yellow-400 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
        </div>
        
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="w-1 h-1 bg-blue-400 rounded-full absolute top-1/2 -right-1 transform -translate-y-1/2 animate-pulse"></div>
        </div>
        
        {/* Texte de chargement */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium animate-pulse">
          Chargement...
        </div>
        
        {/* Effet de lueur */}
        <div className="absolute inset-0 w-16 h-16 bg-yellow-400/20 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};
