-- Initial database schema for Solo Leveling Productivity App
-- This migration creates all the core tables and their relationships

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  hunter_name TEXT NOT NULL,
  hunter_class TEXT NOT NULL CHECK (hunter_class IN ('Scholar', 'Mercenary', 'Ranger', 'Shadow Adept')),
  current_rank TEXT DEFAULT 'E-Rank' CHECK (current_rank IN ('E-Rank', 'D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank')),
  essence_points INTEGER DEFAULT 0 CHECK (essence_points >= 0),
  streak_count INTEGER DEFAULT 0 CHECK (streak_count >= 0),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Managed API Key System
  gemini_key_enc TEXT, -- AES-256 encrypted API key
  gemini_budget_cents INTEGER DEFAULT 0 CHECK (gemini_budget_cents >= 0),
  gemini_usage_tokens INTEGER DEFAULT 0 CHECK (gemini_usage_tokens >= 0),
  daily_quest_credits INTEGER DEFAULT 5 CHECK (daily_quest_credits >= 0),
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 's_rank')),
  stripe_customer_id TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests table
CREATE TABLE quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('focus', 'learning', 'creative', 'maintenance', 'social')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'legendary')),
  essence_reward INTEGER DEFAULT 10 CHECK (essence_reward > 0),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legions (communities) table
CREATE TABLE legions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0 CHECK (member_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gates (focus sessions) table
CREATE TABLE gates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 90),
  soundscape TEXT CHECK (soundscape IN ('rainy_crypt', 'lofi_citadel', 'whispering_library', 'shadow_realm', 'silent_void')),
  essence_earned INTEGER DEFAULT 0 CHECK (essence_earned >= 0),
  legion_id UUID REFERENCES legions(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legion memberships
CREATE TABLE legion_members (
  legion_id UUID REFERENCES legions(id) ON DELETE CASCADE,
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (legion_id, hunter_id)
);

-- Usage logs for API key management
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tokens_used INTEGER NOT NULL CHECK (tokens_used > 0),
  cost_cents INTEGER NOT NULL CHECK (cost_cents >= 0),
  service_type TEXT DEFAULT 'gemini' CHECK (service_type IN ('gemini', 'openai', 'claude')),
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artifacts (cosmetic rewards)
CREATE TABLE artifacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('avatar_frame', 'portal_skin', 'emoji_relic', 'soundscape')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  unlock_requirement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hunter artifacts (owned cosmetics)
CREATE TABLE hunter_artifacts (
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  artifact_id UUID REFERENCES artifacts(id) ON DELETE CASCADE,
  equipped BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (hunter_id, artifact_id)
);

-- Legion messages for real-time chat
CREATE TABLE legion_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legion_id UUID REFERENCES legions(id) ON DELETE CASCADE NOT NULL,
  hunter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'system', 'celebration')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_hunter_class ON profiles(hunter_class);
CREATE INDEX idx_profiles_current_rank ON profiles(current_rank);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_quests_hunter_id ON quests(hunter_id);
CREATE INDEX idx_quests_completed_at ON quests(completed_at);
CREATE INDEX idx_gates_hunter_id ON gates(hunter_id);
CREATE INDEX idx_gates_completed_at ON gates(completed_at);
CREATE INDEX idx_gates_legion_id ON gates(legion_id);
CREATE INDEX idx_legion_members_hunter_id ON legion_members(hunter_id);
CREATE INDEX idx_usage_logs_hunter_id ON usage_logs(hunter_id);
CREATE INDEX idx_usage_logs_logged_at ON usage_logs(logged_at);
CREATE INDEX idx_legion_messages_legion_id ON legion_messages(legion_id);
CREATE INDEX idx_legion_messages_created_at ON legion_messages(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update legion member count
CREATE OR REPLACE FUNCTION update_legion_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE legions SET member_count = member_count + 1 WHERE id = NEW.legion_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE legions SET member_count = member_count - 1 WHERE id = OLD.legion_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to maintain legion member count
CREATE TRIGGER update_legion_member_count_trigger
    AFTER INSERT OR DELETE ON legion_members
    FOR EACH ROW EXECUTE FUNCTION update_legion_member_count();