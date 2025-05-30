
import React from 'react';
import { useBazGame } from '@/hooks/useBazGame';
import { GameBoard } from './mine/GameBoard';
import { GameControls } from './mine/GameControls';
import { GameStats } from './mine/GameStats';
import { ActionButtons } from './mine/ActionButtons';

export const BazGame = () => {
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
  } = useBazGame();

  if (!profile) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-white">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
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
