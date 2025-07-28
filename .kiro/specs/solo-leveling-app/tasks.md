# Implementation Plan

- [x] 1. Project Foundation and Setup
  - Configure existing Expo project for Solo Leveling app development
  - Install and configure NativeWind for Tailwind styling (already partially set up)
  - Enhance TypeScript configuration and organize project structure
  - Verify React Navigation v7 setup and configure app navigation structure
  - _Requirements: 10.1, 10.3_

- [x] 2. Supabase Backend Infrastructure
  - Initialize Supabase project and configure local development
  - Create database schema with all required tables (profiles, quests, gates, legions, etc.)
  - Set up Row Level Security policies for data protection
  - Configure Supabase Auth with custom profile creation
  - _Requirements: 1.4, 9.2, 10.3, 10.4_

- [ ] 3. Authentication and Onboarding Flow
  - Implement Awakening Onboarding component with multi-step flow
  - Create ClassSelector component for Hunter class selection
  - Build ManaStatePicker for mood selection interface
  - Integrate Supabase Auth with profile creation and class storage
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ] 4. Google Cloud IAM and API Key Management
  - Set up Google Cloud service account for managed API key creation
  - Implement createHunterKey Edge Function for automatic key generation
  - Create AES-256 encryption utilities for secure key storage
  - Build key rotation system for inactive accounts
  - _Requirements: 1.4, 9.1, 9.2, 9.5_

- [ ] 5. AI Quest Generation System
  - Implement getAIPlan Edge Function with Google Gemini integration
  - Create quest generation prompts based on Hunter class and mana state
  - Build usage tracking and budget management system
  - Implement free tier quota limits with graceful degradation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.1, 6.3_

- [ ] 6. Guild Hall Dashboard
  - Create HunterGreeting component with personalized rank display
  - Build RuneBoard component for displaying AI-generated quests
  - Implement EssencePulse real-time activity feed
  - Create GatePortal main CTA button with portal animation
  - _Requirements: 2.1, 2.5, 5.4_

- [ ] 7. Gate Focus Session System
  - Implement PortalTimer component with animated countdown ring
  - Create timer functionality with 25-90 minute options based on subscription
  - Build ShadowTroop component for anonymous user avatars
  - Implement AmbientSoundscape audio player with themed environments
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 8. Real-time Presence and Multiplayer Gates
  - Set up Supabase Realtime channels for Gate presence
  - Implement real-time user presence in shared focus sessions
  - Create anonymous avatar system for Shadow Troop display
  - Build session completion rewards and Essence distribution
  - _Requirements: 3.2, 3.3, 3.5, 10.2_

- [ ] 9. Gamification and Progress System
  - Implement Essence (XP) calculation and award system
  - Create rank progression logic from E-Rank to S-Rank
  - Build streak tracking system without punishment mechanics
  - Implement artifact unlocking and cosmetic reward system
  - _Requirements: 2.5, 5.1, 5.2, 5.3, 5.5_

- [ ] 10. Legion Community Features
  - Create LegionList component for available channels
  - Implement LegionChat with real-time messaging via Supabase channels
  - Build LegionLeaderboard for rankings and achievements
  - Create RaidScheduler for co-working session planning
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 11. Battle Log Analytics Dashboard
  - Implement StreakHeatmap component for activity visualization
  - Create ProgressChart for rank progression and Essence tracking
  - Build InsightCards with gentle analytics and encouragement
  - Implement analytics data aggregation and storage
  - _Requirements: 5.4, 6.2, 7.2_

- [ ] 12. Subscription and Payment Integration
  - Integrate Stripe payment processing via Supabase
  - Implement S-Rank Pass subscription tiers and feature gating
  - Create automatic API key budget refill system for premium users
  - Build subscription management and billing webhook handlers
  - _Requirements: 6.1, 6.2, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 13. BYOK (Bring Your Own Key) System
  - Create Shadow Lab settings interface for personal API keys
  - Implement AES-256 encryption for user-provided API keys
  - Build key switching logic between managed and personal keys
  - Implement zero telemetry mode for BYOK users
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 14. Error Handling and User Experience
  - Implement graceful error handling for API key budget exhaustion
  - Create user-friendly error messages that maintain Solo Leveling theme
  - Build offline support and connection recovery systems
  - Implement fallback systems for AI service unavailability
  - _Requirements: 6.4, 9.4_

- [ ] 15. Testing and Quality Assurance
  - Write unit tests for API key management and encryption
  - Create integration tests for Supabase Edge Functions
  - Implement end-to-end tests for onboarding and core user flows
  - Build performance tests for real-time features and database queries
  - _Requirements: 9.5, 10.2_

- [ ] 16. Security and Data Protection
  - Implement Row Level Security policies for all database tables
  - Create API rate limiting and abuse prevention
  - Build secure key rotation and revocation systems
  - Implement data encryption for sensitive user information
  - _Requirements: 8.2, 9.1, 9.2_

- [ ] 17. Mobile Platform Optimization
  - Optimize Expo app performance for iOS and Android
  - Implement platform-specific UI adaptations using Expo APIs
  - Create efficient state management with Zustand
  - Build memory and battery usage optimization with Expo tools
  - _Requirements: 10.1, 10.2_

- [ ] 18. Deployment and CI/CD Pipeline
  - Set up GitHub Actions for automated testing and deployment
  - Configure Supabase CLI migrations for database schema management
  - Create environment-specific configurations for development and production
  - Implement automated Edge Function deployment and monitoring
  - _Requirements: 10.5_