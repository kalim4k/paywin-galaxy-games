
import React from 'react';
import { useRobGame } from '@/hooks/useRobGame';
import { GameBoard } from './mine/GameBoard';
import { GameControls } from './mine/GameControls';
import { GameStats } from './mine/GameStats';
import { ActionButtons } from './mine/ActionButtons';

export const RobGame = () => {
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
    countdown,
    showingBombs,
    bombPositions,
    startGame,
    handleCellClick,
    cashOut,
    resetGame,
    adjustBet,
    adjustBombs,
    calculateMultiplier
  } = useRobGame();

  if (!profile) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-white">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      {/* Overlay pour le compte à rebours et la révélation des bombes */}
      {(countdown > 0 || showingBombs) && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center">
            {countdown > 0 ? (
              <>
                <div className="text-6xl font-bold text-white mb-4 animate-pulse">
                  {countdown}
                </div>
                <p className="text-white text-xl">Révélation des bombes dans...</p>
              </>
            ) : showingBombs ? (
              <>
                <div className="text-4xl font-bold text-red-500 mb-4 animate-pulse">
                  💣 BOMBES RÉVÉLÉES 💣
                </div>
                <p className="text-white text-lg">Mémorisez bien leurs positions !</p>
              </>
            ) : null}
          </div>
        </div>
      )}

      <GameBoard
        gameBoard={gameBoard}
        revealedCells={revealedCells}
        isPlaying={isPlaying}
        gameEnded={gameEnded}
        onCellClick={handleCellClick}
        showingBombs={showingBombs}
        bombPositions={bombPositions}
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
