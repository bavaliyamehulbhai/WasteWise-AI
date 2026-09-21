export const getLevelFromXP = (xp) => {
  let level = 1;
  let requiredXP = 100;

  while (xp >= requiredXP) {
    xp -= requiredXP;
    level += 1;
    requiredXP = level * 100;
  }

  return level;
};

export const getLevelProgress = (totalXP) => {
  let level = 1;
  let xpRemaining = totalXP;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = 100;

  while (xpRemaining >= xpForNextLevel) {
    xpRemaining -= xpForNextLevel;

    level += 1;

    xpForCurrentLevel = xpForNextLevel;
    xpForNextLevel = level * 100;
  }

  return {
    level,
    currentXP: xpRemaining,
    xpForNextLevel,
    progress: (xpRemaining / xpForNextLevel) * 100,
  };
};
