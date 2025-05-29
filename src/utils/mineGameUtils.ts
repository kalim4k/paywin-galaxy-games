
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

// Nouveau système : le plateau ne contient que des étoiles au début
export const initializeGameBoard = (bombs: number): ('hidden' | 'star' | 'bomb')[] => {
  // Tous les cases sont des étoiles au début - les bombes seront placées dynamiquement
  const newBoard: ('hidden' | 'star' | 'bomb')[] = Array(25).fill('star');
  
  console.log(`Jeu initialisé avec toutes les étoiles - ${bombs} bombes seront placées dynamiquement`);
  
  return newBoard;
};

// Nouveau: Calculer la probabilité de tomber sur une bombe selon les étoiles trouvées
export const calculateBombProbability = (starsFound: number): number => {
  if (starsFound === 0) return 0.20; // 20% de chance à la première étoile
  if (starsFound === 1) return 0.50; // 50% de chance à la deuxième étoile
  if (starsFound === 2) return 0.85; // 85% de chance à la troisième étoile
  return 0.95; // 95% de chance pour les étoiles suivantes (quasi impossible)
};

// Nouveau: Décider dynamiquement si une cellule devient une bombe
export const shouldPlaceBomb = (
  starsFound: number, 
  bombsPlaced: number, 
  maxBombs: number,
  revealedCells: boolean[]
): boolean => {
  // Si on a déjà placé toutes les bombes, pas de nouvelle bombe
  if (bombsPlaced >= maxBombs) return false;
  
  // Calculer combien de cellules restent à révéler
  const remainingCells = revealedCells.filter(cell => !cell).length - 1; // -1 pour la cellule actuelle
  
  // Si on doit placer toutes les bombes restantes dans les dernières cellules
  if (remainingCells <= (maxBombs - bombsPlaced)) return true;
  
  // Utiliser la probabilité basée sur les étoiles trouvées
  const bombProbability = calculateBombProbability(starsFound);
  return Math.random() < bombProbability;
};

// Nouveau: Placer les bombes restantes sur les cellules non révélées à la fin du jeu
export const fillRemainingBombs = (
  gameBoard: ('hidden' | 'star' | 'bomb')[],
  revealedCells: boolean[],
  bombsPlaced: number,
  maxBombs: number
): ('hidden' | 'star' | 'bomb')[] => {
  const newBoard = [...gameBoard];
  const bombsToPlace = maxBombs - bombsPlaced;
  
  if (bombsToPlace <= 0) return newBoard;
  
  // Trouver toutes les cellules non révélées qui ne sont pas déjà des bombes
  const availablePositions = [];
  for (let i = 0; i < 25; i++) {
    if (!revealedCells[i] && newBoard[i] !== 'bomb') {
      availablePositions.push(i);
    }
  }
  
  // Mélanger les positions disponibles
  for (let i = availablePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
  }
  
  // Placer les bombes restantes
  for (let i = 0; i < Math.min(bombsToPlace, availablePositions.length); i++) {
    newBoard[availablePositions[i]] = 'bomb';
  }
  
  console.log(`Bombes restantes placées: ${Math.min(bombsToPlace, availablePositions.length)}/${bombsToPlace}`);
  
  return newBoard;
};
