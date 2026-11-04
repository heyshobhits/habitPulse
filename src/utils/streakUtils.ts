export const calculateCurrentStreak = (completedDays: boolean[]): number => {
  let lastCheckedIdx = -1;
  for (let i = completedDays.length - 1; i >= 0; i--) {
    if (completedDays[i]) {
      lastCheckedIdx = i;
      break;
    }
  }
  if (lastCheckedIdx === -1) return 0;
  let streak = 0;
  for (let i = lastCheckedIdx; i >= 0; i--) {
    if (completedDays[i]) streak++;
    else break;
  }
  return streak;
};

export const calculateBestWeekStreak = (completedDays: boolean[]): number => {
  let maxS = 0;
  let curr = 0;
  for (const val of completedDays) {
    if (val) {
      curr++;
      if (curr > maxS) maxS = curr;
    } else {
      curr = 0;
    }
  }
  return maxS;
};
