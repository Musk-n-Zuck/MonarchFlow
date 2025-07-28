-- Row Level Security policies for Solo Leveling Productivity App
-- These policies ensure users can only access their own data and appropriate shared data

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE legions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legion_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunter_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legion_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Quests policies
CREATE POLICY "Users can view their own quests" ON quests
    FOR SELECT USING (auth.uid() = hunter_id);

CREATE POLICY "Users can insert their own quests" ON quests
    FOR INSERT WITH CHECK (auth.uid() = hunter_id);

CREATE POLICY "Users can update their own quests" ON quests
    FOR UPDATE USING (auth.uid() = hunter_id);

CREATE POLICY "Users can delete their own quests" ON quests
    FOR DELETE USING (auth.uid() = hunter_id);

-- Gates policies
CREATE POLICY "Users can view their own gates" ON gates
    FOR SELECT USING (auth.uid() = hunter_id);

CREATE POLICY "Users can insert their own gates" ON gates
    FOR INSERT WITH CHECK (auth.uid() = hunter_id);

CREATE POLICY "Users can update their own gates" ON gates
    FOR UPDATE USING (auth.uid() = hunter_id);

-- Legions policies (public read, restricted write)
CREATE POLICY "Anyone can view legions" ON legions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create legions" ON legions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Legion members policies
CREATE POLICY "Users can view legion memberships" ON legion_members
    FOR SELECT USING (
        auth.uid() = hunter_id OR 
        legion_id IN (SELECT legion_id FROM legion_members WHERE hunter_id = auth.uid())
    );

CREATE POLICY "Users can join legions" ON legion_members
    FOR INSERT WITH CHECK (auth.uid() = hunter_id);

CREATE POLICY "Users can leave legions" ON legion_members
    FOR DELETE USING (auth.uid() = hunter_id);

-- Usage logs policies (users can only see their own)
CREATE POLICY "Users can view their own usage logs" ON usage_logs
    FOR SELECT USING (auth.uid() = hunter_id);

CREATE POLICY "System can insert usage logs" ON usage_logs
    FOR INSERT WITH CHECK (auth.uid() = hunter_id);

-- Artifacts policies (public read)
CREATE POLICY "Anyone can view artifacts" ON artifacts
    FOR SELECT USING (true);

-- Hunter artifacts policies
CREATE POLICY "Users can view their own artifacts" ON hunter_artifacts
    FOR SELECT USING (auth.uid() = hunter_id);

CREATE POLICY "Users can manage their own artifacts" ON hunter_artifacts
    FOR ALL USING (auth.uid() = hunter_id);

-- Legion messages policies
CREATE POLICY "Legion members can view messages" ON legion_messages
    FOR SELECT USING (
        legion_id IN (SELECT legion_id FROM legion_members WHERE hunter_id = auth.uid())
    );

CREATE POLICY "Legion members can send messages" ON legion_messages
    FOR INSERT WITH CHECK (
        auth.uid() = hunter_id AND
        legion_id IN (SELECT legion_id FROM legion_members WHERE hunter_id = auth.uid())
    );

-- Function to check if user is premium
CREATE OR REPLACE FUNCTION is_premium_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND subscription_tier = 's_rank'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced legion policies for premium features
CREATE POLICY "Premium users can access premium legions" ON legion_members
    FOR INSERT WITH CHECK (
        auth.uid() = hunter_id AND (
            NOT (SELECT is_premium FROM legions WHERE id = legion_id) OR
            is_premium_user(auth.uid())
        )
    );

-- Function to get user's hunter name (for anonymized displays)
CREATE OR REPLACE FUNCTION get_hunter_name(user_id UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT hunter_name FROM profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;