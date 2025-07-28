// TypeScript types for Supabase database schema
// Generated based on the database schema in migrations

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          hunter_name: string;
          hunter_class: 'Scholar' | 'Mercenary' | 'Ranger' | 'Shadow Adept';
          current_rank: 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';
          essence_points: number;
          streak_count: number;
          last_active: string;
          gemini_key_enc: string | null;
          gemini_budget_cents: number;
          gemini_usage_tokens: number;
          daily_quest_credits: number;
          subscription_tier: 'free' | 's_rank';
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          hunter_name: string;
          hunter_class: 'Scholar' | 'Mercenary' | 'Ranger' | 'Shadow Adept';
          current_rank?: 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';
          essence_points?: number;
          streak_count?: number;
          last_active?: string;
          gemini_key_enc?: string | null;
          gemini_budget_cents?: number;
          gemini_usage_tokens?: number;
          daily_quest_credits?: number;
          subscription_tier?: 'free' | 's_rank';
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hunter_name?: string;
          hunter_class?: 'Scholar' | 'Mercenary' | 'Ranger' | 'Shadow Adept';
          current_rank?: 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';
          essence_points?: number;
          streak_count?: number;
          last_active?: string;
          gemini_key_enc?: string | null;
          gemini_budget_cents?: number;
          gemini_usage_tokens?: number;
          daily_quest_credits?: number;
          subscription_tier?: 'free' | 's_rank';
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quests: {
        Row: {
          id: string;
          hunter_id: string;
          title: string;
          description: string | null;
          quest_type: 'focus' | 'learning' | 'creative' | 'maintenance' | 'social';
          difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
          essence_reward: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          hunter_id: string;
          title: string;
          description?: string | null;
          quest_type: 'focus' | 'learning' | 'creative' | 'maintenance' | 'social';
          difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
          essence_reward?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          hunter_id?: string;
          title?: string;
          description?: string | null;
          quest_type?: 'focus' | 'learning' | 'creative' | 'maintenance' | 'social';
          difficulty?: 'easy' | 'medium' | 'hard' | 'legendary';
          essence_reward?: number;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      gates: {
        Row: {
          id: string;
          hunter_id: string;
          duration_minutes: number;
          soundscape: 'rainy_crypt' | 'lofi_citadel' | 'whispering_library' | 'shadow_realm' | 'silent_void' | null;
          essence_earned: number;
          legion_id: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          hunter_id: string;
          duration_minutes: number;
          soundscape?: 'rainy_crypt' | 'lofi_citadel' | 'whispering_library' | 'shadow_realm' | 'silent_void' | null;
          essence_earned?: number;
          legion_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          hunter_id?: string;
          duration_minutes?: number;
          soundscape?: 'rainy_crypt' | 'lofi_citadel' | 'whispering_library' | 'shadow_realm' | 'silent_void' | null;
          essence_earned?: number;
          legion_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      legions: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_premium: boolean;
          member_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_premium?: boolean;
          member_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_premium?: boolean;
          member_count?: number;
          created_at?: string;
        };
      };
      legion_members: {
        Row: {
          legion_id: string;
          hunter_id: string;
          joined_at: string;
        };
        Insert: {
          legion_id: string;
          hunter_id: string;
          joined_at?: string;
        };
        Update: {
          legion_id?: string;
          hunter_id?: string;
          joined_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          hunter_id: string;
          tokens_used: number;
          cost_cents: number;
          service_type: 'gemini' | 'openai' | 'claude';
          logged_at: string;
        };
        Insert: {
          id?: string;
          hunter_id: string;
          tokens_used: number;
          cost_cents: number;
          service_type?: 'gemini' | 'openai' | 'claude';
          logged_at?: string;
        };
        Update: {
          id?: string;
          hunter_id?: string;
          tokens_used?: number;
          cost_cents?: number;
          service_type?: 'gemini' | 'openai' | 'claude';
          logged_at?: string;
        };
      };
      artifacts: {
        Row: {
          id: string;
          name: string;
          type: 'avatar_frame' | 'portal_skin' | 'emoji_relic' | 'soundscape';
          rarity: 'common' | 'rare' | 'epic' | 'legendary';
          unlock_requirement: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'avatar_frame' | 'portal_skin' | 'emoji_relic' | 'soundscape';
          rarity: 'common' | 'rare' | 'epic' | 'legendary';
          unlock_requirement?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'avatar_frame' | 'portal_skin' | 'emoji_relic' | 'soundscape';
          rarity?: 'common' | 'rare' | 'epic' | 'legendary';
          unlock_requirement?: string | null;
          created_at?: string;
        };
      };
      hunter_artifacts: {
        Row: {
          hunter_id: string;
          artifact_id: string;
          equipped: boolean;
          unlocked_at: string;
        };
        Insert: {
          hunter_id: string;
          artifact_id: string;
          equipped?: boolean;
          unlocked_at?: string;
        };
        Update: {
          hunter_id?: string;
          artifact_id?: string;
          equipped?: boolean;
          unlocked_at?: string;
        };
      };
      legion_messages: {
        Row: {
          id: string;
          legion_id: string;
          hunter_id: string;
          message: string;
          message_type: 'message' | 'system' | 'celebration';
          created_at: string;
        };
        Insert: {
          id?: string;
          legion_id: string;
          hunter_id: string;
          message: string;
          message_type?: 'message' | 'system' | 'celebration';
          created_at?: string;
        };
        Update: {
          id?: string;
          legion_id?: string;
          hunter_id?: string;
          message?: string;
          message_type?: 'message' | 'system' | 'celebration';
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_premium_user: {
        Args: {
          user_id: string;
        };
        Returns: boolean;
      };
      get_hunter_name: {
        Args: {
          user_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for common operations
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Quest = Database['public']['Tables']['quests']['Row'];
export type QuestInsert = Database['public']['Tables']['quests']['Insert'];
export type QuestUpdate = Database['public']['Tables']['quests']['Update'];

export type Gate = Database['public']['Tables']['gates']['Row'];
export type GateInsert = Database['public']['Tables']['gates']['Insert'];
export type GateUpdate = Database['public']['Tables']['gates']['Update'];

export type Legion = Database['public']['Tables']['legions']['Row'];
export type LegionInsert = Database['public']['Tables']['legions']['Insert'];
export type LegionUpdate = Database['public']['Tables']['legions']['Update'];

export type LegionMember = Database['public']['Tables']['legion_members']['Row'];
export type LegionMemberInsert = Database['public']['Tables']['legion_members']['Insert'];

export type UsageLog = Database['public']['Tables']['usage_logs']['Row'];
export type UsageLogInsert = Database['public']['Tables']['usage_logs']['Insert'];

export type Artifact = Database['public']['Tables']['artifacts']['Row'];
export type ArtifactInsert = Database['public']['Tables']['artifacts']['Insert'];

export type HunterArtifact = Database['public']['Tables']['hunter_artifacts']['Row'];
export type HunterArtifactInsert = Database['public']['Tables']['hunter_artifacts']['Insert'];

export type LegionMessage = Database['public']['Tables']['legion_messages']['Row'];
export type LegionMessageInsert = Database['public']['Tables']['legion_messages']['Insert'];