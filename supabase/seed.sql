-- Seed data for Solo Leveling Productivity App
-- This file populates the database with initial artifacts and legions

-- Insert initial artifacts
INSERT INTO artifacts (name, type, rarity, unlock_requirement) VALUES
-- Avatar Frames
('Shadow Novice Frame', 'avatar_frame', 'common', 'Complete first Gate'),
('Hunter''s Mark Frame', 'avatar_frame', 'rare', 'Reach D-Rank'),
('Elite Hunter Frame', 'avatar_frame', 'epic', 'Reach B-Rank'),
('S-Rank Legend Frame', 'avatar_frame', 'legendary', 'Reach S-Rank'),

-- Portal Skins
('Basic Portal', 'portal_skin', 'common', 'Default unlock'),
('Crimson Vortex', 'portal_skin', 'rare', 'Complete 10 Gates'),
('Shadow Realm Portal', 'portal_skin', 'epic', 'Complete 50 Gates'),
('Monarch''s Gateway', 'portal_skin', 'legendary', 'Complete 100 Gates'),

-- Emoji Relics
('⚔️ Hunter''s Blade', 'emoji_relic', 'common', 'Complete first quest'),
('🛡️ Shadow Shield', 'emoji_relic', 'rare', 'Complete 25 quests'),
('👑 Monarch''s Crown', 'emoji_relic', 'epic', 'Complete 100 quests'),
('🌟 Eternal Star', 'emoji_relic', 'legendary', 'Maintain 30-day streak'),

-- Soundscapes
('Rainy Crypt', 'soundscape', 'common', 'Default unlock'),
('Lo-Fi Citadel', 'soundscape', 'common', 'Default unlock'),
('Whispering Library', 'soundscape', 'common', 'Default unlock'),
('Shadow Realm', 'soundscape', 'rare', 'Reach C-Rank'),
('Silent Void', 'soundscape', 'epic', 'Reach A-Rank');

-- Insert initial legions
INSERT INTO legions (name, description, is_premium, member_count) VALUES
('Hunters Guild', 'The main gathering place for all Hunters. Share your victories and support fellow adventurers.', false, 0),
('Shadow Academy', 'A place for Scholars to exchange knowledge and study techniques.', false, 0),
('Mercenary Company', 'Where battle-hardened Hunters gather to share combat strategies.', false, 0),
('Ranger''s Lodge', 'A quiet sanctuary for Rangers to plan their next expeditions.', false, 0),
('Elite Vanguard', 'Premium legion for S-Rank Pass members. Exclusive events and advanced strategies.', true, 0),
('Monarch''s Circle', 'The most exclusive legion for legendary Hunters who have proven their worth.', true, 0);

-- Create a system user profile for system messages
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'system@sololeveling.app',
    crypt('system', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "system", "providers": ["system"]}',
    '{"hunter_name": "System", "hunter_class": "Scholar"}',
    false,
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Create system profile
INSERT INTO profiles (
    id,
    hunter_name,
    hunter_class,
    current_rank,
    essence_points,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'System',
    'Scholar',
    'S-Rank',
    0,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert welcome system messages for each legion
INSERT INTO legion_messages (legion_id, hunter_id, message, message_type) 
SELECT 
    l.id,
    '00000000-0000-0000-0000-000000000000'::uuid, -- System user ID
    CASE l.name
        WHEN 'Hunters Guild' THEN 'Welcome to the Hunters Guild! This is where your journey begins. Share your progress and celebrate victories with fellow Hunters.'
        WHEN 'Shadow Academy' THEN 'The Shadow Academy welcomes all seekers of knowledge. Here, wisdom is shared and minds are sharpened.'
        WHEN 'Mercenary Company' THEN 'Welcome, warrior. The Mercenary Company is where strength meets strategy. Share your battle-tested techniques.'
        WHEN 'Ranger''s Lodge' THEN 'The Rangers welcome you to our lodge. Here we plan, prepare, and perfect our craft in quiet contemplation.'
        WHEN 'Elite Vanguard' THEN 'Welcome to the Elite Vanguard, S-Rank Hunter. Only the most dedicated reach these halls.'
        WHEN 'Monarch''s Circle' THEN 'You have entered the Monarch''s Circle. Few achieve this honor. Your legend begins here.'
    END,
    'system'
FROM legions l;