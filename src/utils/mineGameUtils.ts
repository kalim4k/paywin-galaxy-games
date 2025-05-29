
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

// Algorithme optimisé pour seulement 15% de chance d'avoir 3 étoiles consécutives
// Le jeu est maintenant beaucoup plus difficile avec 85% de chance d'échec avant 3 étoiles
export const initializeGameBoard = (bombs: number): ('hidden' | 'star' | 'bomb')[] => {
  const newBoard: ('hidden' | 'star' | 'bomb')[] = Array(25).fill('star');
  
  // Positions les plus susceptibles d'être cliquées en premier (ordre de probabilité)
  const clickProbabilityOrder = [
    // Coins et centre (très populaires)
    0, 4, 20, 24, 12,
    // Positions adjacentes au centre
    11, 13, 7, 17,
    // Bords centraux
    2, 10, 14, 22,
    // Autres positions stratégiques
    1, 3, 5, 9, 15, 19, 21, 23,
    6, 8, 16, 18
  ];
  
  // Patterns de 3 positions consécutives les plus probables d'être tentés
  const highRiskPatterns = [
    // Lignes horizontales les plus communes
    [0, 1, 2], [1, 2, 3], [2, 3, 4],     // Ligne du haut
    [10, 11, 12], [11, 12, 13], [12, 13, 14], // Ligne du milieu
    [20, 21, 22], [21, 22, 23], [22, 23, 24], // Ligne du bas
    
    // Colonnes centrales
    [2, 7, 12], [7, 12, 17], [12, 17, 22],
    
    // Diagonales principales
    [0, 6, 12], [6, 12, 18], [12, 18, 24],
    [4, 8, 12], [8, 12, 16], [12, 16, 20],
    
    // Patterns en L et autres formes communes
    [5, 6, 7], [8, 9, 10], [15, 16, 17], [18, 19, 20],
    
    // Patterns verticaux sur les côtés
    [0, 5, 10], [5, 10, 15], [10, 15, 20],
    [4, 9, 14], [9, 14, 19], [14, 19, 24]
  ];
  
  // Pour avoir seulement 15% de chance de succès, on doit piéger 85% des patterns
  // On cible agressivement tous les patterns probables
  const trappedPositions = new Set<number>();
  
  // Étape 1: Piéger massivement les patterns les plus probables (85% d'entre eux)
  const patternsToTrap = Math.ceil(highRiskPatterns.length * 0.85);
  const selectedPatterns = highRiskPatterns.slice(0, patternsToTrap);
  
  selectedPatterns.forEach(pattern => {
    // Pour chaque pattern, placer au moins 2 bombes sur 3 positions pour maximiser les échecs
    const bombsInPattern = Math.min(2, pattern.length);
    for (let i = 0; i < bombsInPattern; i++) {
      const randomIndex = Math.floor(Math.random() * pattern.length);
      trappedPositions.add(pattern[randomIndex]);
    }
  });
  
  // Étape 2: Saturer les positions les plus cliquées en premier
  clickProbabilityOrder.slice(0, Math.min(15, clickProbabilityOrder.length)).forEach(pos => {
    if (Math.random() < 0.6) { // 60% de chance de piéger les positions populaires
      trappedPositions.add(pos);
    }
  });
  
  // Étape 3: Ajuster pour respecter exactement le nombre de bombes demandé
  const trappedArray = Array.from(trappedPositions);
  
  if (trappedArray.length > bombs) {
    // Trop de bombes - garder les plus stratégiques
    trappedArray.sort((a, b) => {
      const indexA = clickProbabilityOrder.indexOf(a);
      const indexB = clickProbabilityOrder.indexOf(b);
      return (indexA === -1 ? 100 : indexA) - (indexB === -1 ? 100 : indexB);
    });
    
    // Garder seulement le nombre exact de bombes
    trappedPositions.clear();
    trappedArray.slice(0, bombs).forEach(pos => trappedPositions.add(pos));
    
  } else if (trappedArray.length < bombs) {
    // Pas assez de bombes - en ajouter sur les positions restantes les plus stratégiques
    const availablePositions = Array.from({length: 25}, (_, i) => i)
      .filter(i => !trappedPositions.has(i))
      .sort((a, b) => {
        const indexA = clickProbabilityOrder.indexOf(a);
        const indexB = clickProbabilityOrder.indexOf(b);
        return (indexA === -1 ? 100 : indexA) - (indexB === -1 ? 100 : indexB);
      });
    
    const needed = bombs - trappedPositions.size;
    availablePositions.slice(0, needed).forEach(pos => trappedPositions.add(pos));
  }
  
  // Placer les bombes aux positions sélectionnées
  Array.from(trappedPositions).forEach(pos => {
    newBoard[pos] = 'bomb';
  });
  
  console.log(`🎯 Jeu TRÈS DIFFICILE: ${trappedPositions.size}/${bombs} bombes placées stratégiquement`);
  console.log(`📍 Positions des bombes:`, Array.from(trappedPositions).sort((a, b) => a - b));
  console.log(`⚠️  Probabilité d'atteindre 3 étoiles: ~15% (très difficile!)`);
  
  return newBoard;
};
