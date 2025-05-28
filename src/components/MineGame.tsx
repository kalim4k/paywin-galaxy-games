
import React, { useState, useEffect } from 'react';
import { Bomb, Star, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';

export const MineGame = () => {
  const [bet, setBet] = useState(200);
  const [bombs, setBombs] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameBoard, setGameBoard] = useState<('hidden' | 'star' | 'bomb')[]>(Array(25).fill('hidden'));
  const [revealedCells, setRevealedCells] = useState<boolean[]>(Array(25).fill(false));
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameEnded, setGameEnded] = useState(false);
  const [won, setWon] = useState(false);
  const [revealedStars, setRevealedStars] = useState(0);

  // Calculer le multiplicateur avec des cotes très faibles
  const calculateMultiplier = (starsFound: number, bombCount: number) => {
    if (starsFound === 0) return 1;
    
    // Multiplicateur très faible - seulement 1% d'augmentation par étoile
    const baseMultiplier = 1 + (starsFound * 0.01);
    
    return Math.max(1, Number(baseMultiplier.toFixed(3)));
  };

  // Calculer les prochains multiplicateurs possibles
  const getNextMultipliers = () => {
    const multipliers = [];
    for (let i = 1; i <= 5; i++) {
      const nextStars = revealedStars + i;
      if (nextStars <= 25 - bombs) {
        const mult = calculateMultiplier(nextStars, bombs);
        multipliers.push({
          stars: nextStars,
          multiplier: mult,
          amount: bet * mult
        });
      }
    }
    return multipliers;
  };

  const initializeBoard = () => {
    const newBoard = Array(25).fill('star');
    const bombPositions = [];
    
    // Augmenter drastiquement les chances de tomber sur une bombe
    // en plaçant les bombes de manière plus agressive
    const totalBombs = Math.max(bombs, Math.floor(25 * 0.4)); // Au moins 40% de bombes
    
    while (bombPositions.length < totalBombs) {
      const pos = Math.floor(Math.random() * 25);
      if (!bombPositions.includes(pos)) {
        bombPositions.push(pos);
        newBoard[pos] = 'bomb';
      }
    }
    
    setGameBoard(newBoard);
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
  };

  const startGame = () => {
    setIsPlaying(true);
    initializeBoard();
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || revealedCells[index] || gameEnded) return;

    const newRevealedCells = [...revealedCells];
    newRevealedCells[index] = true;
    setRevealedCells(newRevealedCells);

    if (gameBoard[index] === 'bomb') {
      // Révéler toutes les bombes
      const allRevealed = gameBoard.map((cell, i) => cell === 'bomb' || revealedCells[i]);
      setRevealedCells(allRevealed);
      setGameEnded(true);
      setWon(false);
    } else {
      const newStarsFound = revealedStars + 1;
      setRevealedStars(newStarsFound);
      const newMultiplier = calculateMultiplier(newStarsFound, bombs);
      setCurrentMultiplier(newMultiplier);
    }
  };

  const cashOut = () => {
    if (isPlaying && revealedStars > 0) {
      // Révéler toutes les bombes quand le joueur récupère ses gains
      const allRevealed = gameBoard.map((cell, i) => cell === 'bomb' || revealedCells[i]);
      setRevealedCells(allRevealed);
      setGameEnded(true);
      setWon(true);
      setIsPlaying(false);
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameBoard(Array(25).fill('hidden'));
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
  };

  const adjustBet = (amount: number) => {
    if (!isPlaying) {
      setBet(Math.max(200, bet + amount));
    }
  };

  const adjustBombs = (amount: number) => {
    if (!isPlaying) {
      setBombs(Math.max(1, Math.min(24, bombs + amount)));
    }
  };

  const potentialWin = bet * currentMultiplier;
  const nextMultipliers = getNextMultipliers();

  return (
    <div className="px-4 py-2">
      {/* Grille de jeu */}
      <div className="bg-gray-800/50 rounded-2xl p-3 mb-3">
        <div className="grid grid-cols-5 gap-2">
          {gameBoard.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!isPlaying || revealedCells[index] || gameEnded}
              className={`
                aspect-square rounded-xl border-2 transition-all duration-200 text-lg font-bold
                ${revealedCells[index] 
                  ? cell === 'bomb' 
                    ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/30' 
                    : 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/30'
                  : 'bg-blue-500/80 border-blue-400/60 hover:bg-blue-400 hover:border-blue-300 active:scale-95'
                }
                ${!isPlaying || gameEnded ? 'opacity-50' : 'hover:shadow-lg hover:shadow-blue-500/20'}
                flex items-center justify-center
              `}
            >
              {revealedCells[index] && (
                <>
                  {cell === 'bomb' ? (
                    <Bomb className="w-6 h-6 text-white" />
                  ) : (
                    <Star className="w-6 h-6 text-white fill-current" />
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progression des gains avec cotes très faibles */}
      {isPlaying && !gameEnded && (
        <div className="bg-gray-800/30 rounded-xl p-2 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">
              Prochaine étape: {(bet * calculateMultiplier(revealedStars + 1, bombs)).toLocaleString()} FCFA
            </span>
          </div>
          <div className="flex space-x-1 overflow-x-auto">
            {nextMultipliers.map((mult, index) => (
              <div
                key={index}
                className={`
                  min-w-fit px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap
                  ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-700/50 text-gray-300'}
                `}
              >
                x{mult.multiplier}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrôles de jeu - Plus compacts */}
      <div className="space-y-2">
        {/* Sélection du nombre de bombes */}
        <div className="bg-gray-800/30 rounded-xl p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-xs font-medium">Bombes</span>
            <span className="text-yellow-400 text-xs font-bold">{bombs}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => adjustBombs(-1)}
              disabled={isPlaying || bombs <= 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-1.5 transition-colors"
            >
              <Minus className="w-3 h-3 text-white" />
            </button>
            <div className="flex-1 bg-gray-700 rounded-lg h-1.5">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-lg transition-all"
                style={{ width: `${(bombs / 24) * 100}%` }}
              />
            </div>
            <button
              onClick={() => adjustBombs(1)}
              disabled={isPlaying || bombs >= 24}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-1.5 transition-colors"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Contrôle de mise */}
        <div className="bg-gray-800/30 rounded-xl p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-xs font-medium">Votre mise</span>
            <span className="text-green-400 text-xs font-bold">{bet.toLocaleString()} FCFA</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => adjustBet(-100)}
              disabled={isPlaying}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-1.5 transition-colors"
            >
              <Minus className="w-3 h-3 text-white" />
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                value={bet}
                onChange={(e) => !isPlaying && setBet(Math.max(200, parseInt(e.target.value) || 200))}
                disabled={isPlaying}
                className="bg-gray-700 text-white text-center rounded-lg p-1.5 w-full disabled:opacity-50 font-medium text-xs"
                min="200"
              />
            </div>
            <button
              onClick={() => adjustBet(100)}
              disabled={isPlaying}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-1.5 transition-colors"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-2">
          {!isPlaying ? (
            <Button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2.5 text-sm rounded-xl"
            >
              Jouer
            </Button>
          ) : (
            <div className="space-y-2">
              {revealedStars > 0 && !gameEnded && (
                <Button
                  onClick={cashOut}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 text-sm rounded-xl"
                >
                  {potentialWin.toLocaleString()} FCFA - Retirer
                </Button>
              )}
            </div>
          )}

          {gameEnded && (
            <div className="space-y-2">
              <div className={`text-center p-2 rounded-xl text-xs ${won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {won ? `Félicitations! Vous avez gagné ${potentialWin.toLocaleString()} FCFA!` : 'Boom! Vous avez touché une bombe!'}
              </div>
              <Button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2.5 text-sm rounded-xl"
              >
                Rejouer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
