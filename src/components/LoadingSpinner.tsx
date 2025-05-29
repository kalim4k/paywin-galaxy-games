
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Animation de chargement futuriste */}
        <div className="relative w-16 h-16">
          {/* Cercle extérieur rotatif */}
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
          {/* Cercle intérieur avec gradient */}
          <div className="absolute inset-1 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
          {/* Point central pulsant */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Texte de chargement avec animation */}
        <div className="text-gray-600 text-lg font-medium">
          <span className="inline-block animate-pulse">Chargement</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="inline-block animate-bounce ml-0.5" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce ml-0.5" style={{ animationDelay: '0.3s' }}>.</span>
        </div>
        
        {/* Barres de progression animées */}
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};
