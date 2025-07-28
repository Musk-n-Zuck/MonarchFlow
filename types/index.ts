// Solo Leveling App Types

export type HunterClass = 'Scholar' | 'Mercenary' | 'Ranger' | 'Shadow Adept';

export type ManaState = 'Drained' | 'Focused' | 'Overloaded';

export type HunterRank = 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';

export type SubscriptionTier = 'free' | 's_rank';

export interface Hunter {
  id: string;
  hunter_name: string;
  hunter_class: HunterClass;
  current_rank: HunterRank;
  essence_points: number;
  streak_count: number;
  last_active: string;
  subscription_tier: SubscriptionTier;
  daily_quest_credits: number;
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  hunter_id: string;
  title: string;
  description?: string;
  quest_type: string;
  difficulty: string;
  essence_reward: number;
  completed_at?: string;
  created_at: string;
}

export interface Gate {
  id: string;
  hunter_id: string;
  duration_minutes: number;
  soundscape?: string;
  essence_earned: number;
  legion_id?: string;
  completed_at?: string;
  created_at: string;
}

export interface Legion {
  id: string;
  name: string;
  description?: string;
  is_premium: boolean;
  member_count: number;
  created_at: string;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'avatar_frame' | 'portal_skin' | 'emoji_relic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlock_requirement?: string;
  created_at: string;
}

// Navigation Types
export type RootStackParamList = {
  '(tabs)': undefined;
  'onboarding': undefined;
  'gate': { duration?: number };
  'legion': { legionId?: string };
  '+not-found': undefined;
};

export type TabParamList = {
  'guild-hall': undefined;
  'legions': undefined;
  'battle-log': undefined;
  'shadow-lab': undefined;
};