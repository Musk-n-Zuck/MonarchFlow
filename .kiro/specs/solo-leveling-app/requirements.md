# Requirements Document

## Introduction

The Solo Leveling Productivity App is a gamified focus and productivity platform that transforms mundane tasks into epic quests. The app combines the aesthetic and progression mechanics of the Solo Leveling webtoon with proven productivity techniques like Pomodoro timers and body doubling. Users progress from E-Rank to S-Rank Hunters through completing focus sessions (Gates), AI-generated quests, and participating in community activities (Legions). The core emotional promise is transforming the feeling of being stuck into becoming the protagonist of your own productivity journey.

## Requirements

### Requirement 1

**User Story:** As a new user, I want to create an account and choose my Hunter class, so that I can begin my journey from E-Rank to legendary status.

#### Acceptance Criteria

1. WHEN a user opens the app for the first time THEN the system SHALL present an "Awakening Onboarding" flow
2. WHEN a user reaches the class selection screen THEN the system SHALL offer four classes: Scholar, Mercenary, Ranger, and Shadow Adept
3. WHEN a user selects a class THEN the system SHALL store their class preference and customize their experience accordingly
4. WHEN a user completes onboarding THEN the system SHALL automatically create a managed Google Gemini API key for their account
5. WHEN account creation is complete THEN the system SHALL set the user's initial rank to E-Rank and grant them 5 daily AI quest credits

### Requirement 2

**User Story:** As a Hunter, I want to receive AI-generated quests based on my class and current mood, so that I can have personalized productivity tasks that feel engaging.

#### Acceptance Criteria

1. WHEN a user accesses the Rune Board THEN the system SHALL display 3-4 AI-generated quests based on their class and mood state
2. WHEN a user selects their mana state (Drained, Focused, or Overloaded) THEN the system SHALL adjust quest difficulty and type accordingly
3. WHEN a free-tier user has used their daily quest limit THEN the system SHALL display an upsell message instead of generating new quests
4. WHEN the AI service generates quests THEN the system SHALL use encouraging language that matches the Solo Leveling theme
5. WHEN a user completes a quest THEN the system SHALL award appropriate Essence (XP) and update their progress

### Requirement 3

**User Story:** As a Hunter, I want to enter Gates (focus sessions) with customizable timers and ambient environments, so that I can maintain deep focus while feeling immersed in the experience.

#### Acceptance Criteria

1. WHEN a user clicks "Enter Gate" THEN the system SHALL present timer options from 25-90 minutes based on their subscription tier
2. WHEN a focus session begins THEN the system SHALL display a swirling portal ring timer with real-time countdown
3. WHEN multiple users are in the same Gate THEN the system SHALL show Shadow Troop avatars without chat or video functionality
4. WHEN a user selects an ambient soundscape THEN the system SHALL play options like Rainy Crypt, Lo-Fi Citadel, or Whispering Library
5. WHEN a focus session completes THEN the system SHALL award Essence based on session length and grant completion artifacts

### Requirement 4

**User Story:** As a Hunter, I want to join Legions (communities) and participate in group activities, so that I can feel connected to other productivity-focused users.

#### Acceptance Criteria

1. WHEN a user accesses Legions THEN the system SHALL display available public and premium Legion channels
2. WHEN a user joins a Legion THEN the system SHALL enable them to participate in Legion chat and view leaderboards
3. WHEN Legion Raids are scheduled THEN the system SHALL allow users to join co-working Gates with XP multipliers
4. WHEN users complete activities THEN the system SHALL display anonymized celebration messages in the Essence Pulse feed
5. WHEN premium users access Legions THEN the system SHALL provide exclusive channels and creator-led events

### Requirement 5

**User Story:** As a Hunter, I want to track my progress through ranks and streaks without feeling punished for breaks, so that I can maintain motivation while respecting my human needs.

#### Acceptance Criteria

1. WHEN a user completes activities THEN the system SHALL award Essence (XP) that contributes to rank progression from E-Rank to S-Rank
2. WHEN a user maintains focus streaks THEN the system SHALL provide bonus XP without creating punishment for breaks
3. WHEN a user's streak is broken THEN the system SHALL display encouraging messages like "You rested. Shadows wait patiently."
4. WHEN a user views their Battle Log THEN the system SHALL show streak heat-maps and gentle insights about their patterns
5. WHEN a user reaches rank milestones THEN the system SHALL unlock new cosmetic artifacts and portal skins

### Requirement 6

**User Story:** As a free-tier user, I want access to core functionality with reasonable limits, so that I can experience the app's value before deciding to upgrade.

#### Acceptance Criteria

1. WHEN a free user accesses the app THEN the system SHALL provide 5 AI quests per day and Gates up to 25 minutes
2. WHEN a free user participates in community features THEN the system SHALL allow access to public Legions and basic Battle Log charts
3. WHEN a free user reaches their daily limits THEN the system SHALL display gentle upsell messages without blocking core functionality
4. WHEN a free user's managed API key incurs costs THEN the system SHALL absorb these costs up to the daily token limit
5. WHEN a free user exceeds limits THEN the system SHALL offer upgrade options without displaying error messages

### Requirement 7

**User Story:** As an S-Rank Pass subscriber, I want unlimited access to premium features and content, so that I can fully immerse myself in the productivity experience.

#### Acceptance Criteria

1. WHEN a user subscribes to S-Rank Pass THEN the system SHALL provide unlimited AI quests and Master Gates up to 90 minutes
2. WHEN a premium user accesses analytics THEN the system SHALL display full Battle Log analytics and insights
3. WHEN a premium user joins Legions THEN the system SHALL provide access to exclusive premium channels and artifacts
4. WHEN a premium user's subscription renews THEN the system SHALL automatically refill their managed API key budget
5. WHEN premium users participate in events THEN the system SHALL provide early access to creator-led Legion Raids

### Requirement 8

**User Story:** As a user with my own API key, I want to use my personal AI service credentials, so that I can have unlimited usage without subscription costs.

#### Acceptance Criteria

1. WHEN a user accesses Shadow Lab settings THEN the system SHALL provide an option to "Infuse Your Corestone" with personal API keys
2. WHEN a user enters their API key THEN the system SHALL encrypt it with AES-256 and store it securely
3. WHEN a BYOK user makes AI requests THEN the system SHALL use their personal key instead of the managed service
4. WHEN BYOK users are active THEN the system SHALL pause usage counters and provide unlimited access
5. WHEN BYOK users use the service THEN the system SHALL maintain zero telemetry about their usage patterns

### Requirement 9

**User Story:** As a user, I want the app to handle my API key management invisibly, so that I never have to think about technical implementation details.

#### Acceptance Criteria

1. WHEN a user creates an account THEN the system SHALL automatically generate and manage a Google Gemini API key via service account
2. WHEN API keys need rotation THEN the system SHALL handle this automatically for inactive accounts after 30 days
3. WHEN users interact with AI features THEN the system SHALL never display technical terms like "API key" or "tokens"
4. WHEN budget limits are reached THEN the system SHALL display user-friendly messages about upgrading rather than technical errors
5. WHEN the system manages keys THEN the system SHALL track usage and costs transparently for billing purposes

### Requirement 10

**User Story:** As a user, I want the app to work seamlessly across mobile platforms with real-time updates, so that I can access my productivity journey anywhere.

#### Acceptance Criteria

1. WHEN the app is built THEN the system SHALL use React Native CLI for cross-platform mobile compatibility
2. WHEN users interact with real-time features THEN the system SHALL use Supabase realtime channels for Legion chat and Gate presence
3. WHEN data needs to be stored THEN the system SHALL use Supabase Postgres with proper authentication and authorization
4. WHEN payments are processed THEN the system SHALL integrate Stripe via Supabase for subscription management
5. WHEN the app is deployed THEN the system SHALL use Supabase CLI migrations and GitHub Actions for CI/CD