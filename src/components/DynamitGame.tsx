
import React from 'react';
import { useDynamitGame } from '@/hooks/useDynamitGame';
import { GameBoard } from './mine/GameBoard';
import { GameControls } from './mine/GameControls';
import { GameStats } from './mine/GameStats';
import { ActionButtons } from './mine/ActionButtons';

export const DynamitGame = () => {
  const {
    bet,
    bombs,
    isPlaying,
    gameBoard,
    revealedCells,
    currentMultiplier,
    gameEnded,
    won,
    revealedStars,
    isProcessing,
    profile,
    potentialWin,
    nextMultipliers,
    startGame,
    handleCellClick,
    cashOut,
    resetGame,
    adjustBet,
    adjustBombs,
    calculateMultiplier
  } = useDynamitGame();

  if (!profile) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-white">Chargement du profil...</p>
      </div>
    );
  }

  if (profile.balance < 150000) {
    return (
      <div className="px-4 py-6 text-center">
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🔒 Accès VIP Requis</h2>
          <p className="text-white/80 mb-4">
            Ce jeu est réservé aux joueurs VIP avec un solde minimum de 150,000 FCFA.
          </p>
          <p className="text-red-400 font-semibold">
            Votre solde actuel : {profile.balance.toLocaleString()} FCFA
          </p>
          <p className="text-white/60 text-sm mt-2">
            Il vous manque {(150000 - profile.balance).toLocaleString()} FCFA
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      {/* Indicateur VIP */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-yellow-400 text-lg">👑</span>
          <span className="text-yellow-400 font-bold">MODE VIP - DYNAMIT</span>
          <span className="text-yellow-400 text-lg">💥</span>
        </div>
      </div>

      <GameBoard
        gameBoard={gameBoard}
        revealedCells={revealedCells}
        isPlaying={isPlaying}
        gameEnded={gameEnded}
        onCellClick={handleCellClick}
      />

      <GameStats
        isPlaying={isPlaying}
        gameEnded={gameEnded}
        bet={bet}
        revealedStars={revealedStars}
        bombs={bombs}
        nextMultipliers={nextMultipliers}
        calculateMultiplier={calculateMultiplier}
      />

      <GameControls
        bet={bet}
        bombs={bombs}
        isPlaying={isPlaying}
        isProcessing={isProcessing}
        maxBalance={profile.balance}
        onAdjustBet={adjustBet}
        onAdjustBombs={adjustBombs}
      />

      <ActionButtons
        isPlaying={isPlaying}
        gameEnded={gameEnded}
        won={won}
        isProcessing={isProcessing}
        bet={bet}
        maxBalance={profile.balance}
        potentialWin={potentialWin}
        revealedStars={revealedStars}
        onStartGame={startGame}
        onCashOut={cashOut}
        onResetGame={resetGame}
      />
    </div>
  );
};
