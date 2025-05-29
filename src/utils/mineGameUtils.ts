
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

// Algorithme optimisé pour 25% de chance d'avoir 3 étoiles consécutives
export const initializeGameBoard = (bombs: number): ('hidden' | 'star' | 'bomb')[] => {
  const newBoard: ('hidden' | 'star' | 'bomb')[] = Array(25).fill('star');
  
  // Positions les plus susceptibles d'être cliquées en premier
  // Hiérarchisées par probabilité de clic
  const mostLikelyFirstClicks = [
    // Coins (très souvent cliqués en premier)
    0, 4, 20, 24,
    // Centre (position "sûre" en apparence)
    12,
    // Positions centrales adjacentes
    11, 13, 7, 17,
    // Bords centraux
    2, 10, 14, 22,
    // Autres positions stratégiques
    1, 3, 5, 9, 15, 19, 21, 23,
    6, 8, 16, 18
  ];
  
  // Calculer les combinaisons de 3 positions consécutives les plus probables
  const consecutivePatterns = [
    // Patterns horizontaux les plus courants
    [0, 1, 2], [1, 2, 3], [2, 3, 4],
    [10, 11, 12], [11, 12, 13], [12, 13, 14],
    [20, 21, 22], [21, 22, 23], [22, 23, 24],
    // Patterns verticaux centraux
    [2, 7, 12], [7, 12, 17], [12, 17, 22],
    // Patterns diagonaux
    [0, 6, 12], [6, 12, 18], [12, 18, 24],
    [4, 8, 12], [8, 12, 16], [12, 16, 20],
    // Autres patterns stratégiques
    [5, 6, 7], [8, 9, 10], [15, 16, 17], [18, 19, 20]
  ];
  
  // Trier les patterns par probabilité de clic (basé sur la somme des positions)
  consecutivePatterns.sort((a, b) => {
    const scoreA = a.reduce((sum, pos) => sum + (mostLikelyFirstClicks.indexOf(pos) !== -1 ? mostLikelyFirstClicks.indexOf(pos) : 25), 0);
    const scoreB = b.reduce((sum, pos) => sum + (mostLikelyFirstClicks.indexOf(pos) !== -1 ? mostLikelyFirstClicks.indexOf(pos) : 25), 0);
    return scoreA - scoreB;
  });
  
  // Pour avoir 25% de chance de 3 étoiles consécutives, on doit piéger 75% des patterns les plus probables
  const patternsToTrap = Math.ceil(consecutivePatterns.length * 0.75);
  const trappedPatterns = consecutivePatterns.slice(0, patternsToTrap);
  
  // Collecter toutes les positions à piéger
  const positionsToTrap = new Set<number>();
  trappedPatterns.forEach(pattern => {
    // Pour chaque pattern, placer au moins une bombe
    const randomIndex = Math.floor(Math.random() * pattern.length);
    positionsToTrap.add(pattern[randomIndex]);
  });
  
  // Ajouter des positions supplémentaires si nécessaire pour atteindre le nombre de bombes
  const remainingPositions = Array.from({length: 25}, (_, i) => i).filter(i => !positionsToTrap.has(i));
  
  // Priorité aux positions les plus susceptibles d'être cliquées
  const sortedRemaining = remainingPositions.sort((a, b) => {
    const indexA = mostLikelyFirstClicks.indexOf(a);
    const indexB = mostLikelyFirstClicks.indexOf(b);
    return (indexA === -1 ? 100 : indexA) - (indexB === -1 ? 100 : indexB);
  });
  
  // Ajouter des bombes supplémentaires si nécessaire
  while (positionsToTrap.size < bombs && sortedRemaining.length > 0) {
    const pos = sortedRemaining.shift();
    if (pos !== undefined) {
      positionsToTrap.add(pos);
    }
  }
  
  // Si on a trop de bombes, retirer les moins stratégiques
  if (positionsToTrap.size > bombs) {
    const bombPositions = Array.from(positionsToTrap);
    bombPositions.sort((a, b) => {
      const indexA = mostLikelyFirstClicks.indexOf(a);
      const indexB = mostLikelyFirstClicks.indexOf(b);
      return (indexB === -1 ? -100 : indexB) - (indexA === -1 ? -100 : indexA);
    });
    
    // Garder seulement le nombre de bombes demandé
    const finalBombPositions = bombPositions.slice(0, bombs);
    positionsToTrap.clear();
    finalBombPositions.forEach(pos => positionsToTrap.add(pos));
  }
  
  // Placer les bombes aux positions sélectionnées
  Array.from(positionsToTrap).forEach(pos => {
    newBoard[pos] = 'bomb';
  });
  
  console.log(`Bombes placées (25% chance pour 3 étoiles): ${positionsToTrap.size}/${bombs} aux positions:`, Array.from(positionsToTrap));
  
  return newBoard;
};
