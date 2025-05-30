
export const calculateMultiplier = (starsFound: number, bombCount: number) => {
  if (starsFound === 0) return 1;
  
  const bombMultiplier = 1 + (bombCount * 0.05);
  const starMultiplier = 1 + (starsFound * 0.15);
  const finalMultiplier = bombMultiplier * starMultiplier;
  
  return Math.max(1, Number(finalMultiplier.toFixed(3)));
};

export const getNextMultipliers = (revealedStars: number, bombs: number) => {
  const multipliers = [];
  for (let i = 1; i <= 3; i++) {
    const nextStars = revealedStars + i;
    if (nextStars <= 25 - bombs) {
      const mult = calculateMultiplier(nextStars, bombs);
      multipliers.push(mult);
    }
  }
  return multipliers;
};

export const initializeGameBoard = (bombs: number): ('hidden' | 'star' | 'bomb')[] => {
  const newBoard: ('hidden' | 'star' | 'bomb')[] = Array(25).fill('star');
  console.log(`Jeu Baz initialisé avec toutes les étoiles - ${bombs} bombes seront placées dynamiquement`);
  return newBoard;
};

// Probabilités beaucoup plus favorables pour Baz
export const calculateBazBombProbability = (starsFound: number): number => {
  if (starsFound === 0) return 0.05; // Seulement 5% de chance à la première étoile
  if (starsFound <= 2) return 0.08; // 8% de chance pour les 2-3 premières étoiles
  if (starsFound <= 5) return 0.12; // 12% de chance pour les étoiles 4-6
  if (starsFound <= 8) return 0.18; // 18% de chance pour les étoiles 7-9
  if (starsFound <= 12) return 0.25; // 25% de chance pour les étoiles 10-13
  if (starsFound <= 16) return 0.35; // 35% de chance pour les étoiles 14-17
  return 0.50; // 50% de chance maximum même en fin de partie
};

export const shouldPlaceBazBomb = (
  starsFound: number, 
  bombsPlaced: number, 
  maxBombs: number,
  revealedCells: boolean[]
): boolean => {
  // Si on a déjà placé toutes les bombes, pas de nouvelle bombe
  if (bombsPlaced >= maxBombs) return false;
  
  // Calculer combien de cellules restent à révéler
  const remainingCells = revealedCells.filter(cell => !cell).length - 1;
  
  // Si on doit placer toutes les bombes restantes dans les dernières cellules
  if (remainingCells <= (maxBombs - bombsPlaced)) return true;
  
  // Utiliser les probabilités favorables de Baz
  const bombProbability = calculateBazBombProbability(starsFound);
  return Math.random() < bombProbability;
};

export const fillRemainingBombs = (
  gameBoard: ('hidden' | 'star' | 'bomb')[],
  revealedCells: boolean[],
  bombsPlaced: number,
  maxBombs: number
): ('hidden' | 'star' | 'bomb')[] => {
  const newBoard = [...gameBoard];
  const bombsToPlace = maxBombs - bombsPlaced;
  
  if (bombsToPlace <= 0) return newBoard;
  
  const availablePositions = [];
  for (let i = 0; i < 25; i++) {
    if (!revealedCells[i] && newBoard[i] !== 'bomb') {
      availablePositions.push(i);
    }
  }
  
  for (let i = availablePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
  }
  
  for (let i = 0; i < Math.min(bombsToPlace, availablePositions.length); i++) {
    newBoard[availablePositions[i]] = 'bomb';
  }
  
  console.log(`Bombes restantes placées pour Baz: ${Math.min(bombsToPlace, availablePositions.length)}/${bombsToPlace}`);
  
  return newBoard;
};
