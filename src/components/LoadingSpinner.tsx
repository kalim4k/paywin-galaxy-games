
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Cercles concentriques futuristes */}
      <div className="absolute">
        <div className="w-32 h-32 border border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-4 border border-yellow-400/40 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-8 border border-blue-400/50 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Logo PAYWIN avec effet typing */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            <span className="inline-block animate-typing">PAYWIN</span>
          </h1>
          <div className="h-1 w-24 mx-auto mt-2 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Texte de chargement futuriste */}
        <div className="text-white/80 text-lg font-medium tracking-wider">
          <span className="inline-block">Chargement du classement</span>
          <span className="inline-block animate-bounce ml-2" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>.</span>
        </div>
        
        {/* Barre de progression futuriste */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
          <div className="h-full bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" style={{ width: '75%' }}></div>
        </div>

        {/* Indicateurs de données */}
        <div className="flex space-x-4 text-xs text-white/60">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Données synchronisées</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>Calcul des rangs</span>
          </div>
        </div>
      </div>

      {/* Effet de glow central */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent animate-pulse"></div>
    </div>
  );
};
