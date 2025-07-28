// Solo Leveling App Utilities

import { HunterRank } from '@/types';

/**
 * Calculate essence points required for next rank
 */
export const getEssenceForNextRank = (currentRank: HunterRank): number => {
  const rankRequirements: Record<HunterRank, number> = {
    'E-Rank': 100,
    'D-Rank': 250,
    'C-Rank': 500,
    'B-Rank': 1000,
    'A-Rank': 2000,
    'S-Rank': Infinity, // Max rank
  };
  
  return rankRequirements[currentRank];
};

/**
 * Get next rank for progression
 */
export const getNextRank = (currentRank: HunterRank): HunterRank | null => {
  const rankProgression: Record<HunterRank, HunterRank | null> = {
    'E-Rank': 'D-Rank',
    'D-Rank': 'C-Rank',
    'C-Rank': 'B-Rank',
    'B-Rank': 'A-Rank',
    'A-Rank': 'S-Rank',
    'S-Rank': null, // Max rank
  };
  
  return rankProgression[currentRank];
};

/**
 * Format essence points with appropriate suffix
 */
export const formatEssence = (essence: number): string => {
  if (essence >= 1000000) {
    return `${(essence / 1000000).toFixed(1)}M`;
  }
  if (essence >= 1000) {
    return `${(essence / 1000).toFixed(1)}K`;
  }
  return essence.toString();
};

/**
 * Get rank color for UI theming
 */
export const getRankColor = (rank: HunterRank): string => {
  const rankColors: Record<HunterRank, string> = {
    'E-Rank': '#64748b', // gray
    'D-Rank': '#059669', // green
    'C-Rank': '#0ea5e9', // blue
    'B-Rank': '#7c3aed', // purple
    'A-Rank': '#dc2626', // red
    'S-Rank': '#d97706', // gold
  };
  
  return rankColors[rank];
};

/**
 * Calculate progress percentage to next rank
 */
export const getRankProgress = (currentEssence: number, currentRank: HunterRank): number => {
  if (currentRank === 'S-Rank') return 100;
  
  const currentRankBase = getCurrentRankBase(currentRank);
  const nextRankRequirement = getEssenceForNextRank(currentRank);
  
  const progress = ((currentEssence - currentRankBase) / (nextRankRequirement - currentRankBase)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

/**
 * Get base essence points for current rank
 */
const getCurrentRankBase = (rank: HunterRank): number => {
  const rankBases: Record<HunterRank, number> = {
    'E-Rank': 0,
    'D-Rank': 100,
    'C-Rank': 250,
    'B-Rank': 500,
    'A-Rank': 1000,
    'S-Rank': 2000,
  };
  
  return rankBases[rank];
};