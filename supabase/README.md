# Supabase Backend Setup

This directory contains the Supabase backend configuration for the Solo Leveling Productivity App.

## Setup Options

### Option 1: Hosted Supabase (Recommended - No Docker Required)

1. **Create a Supabase project:**
   - Go to https://supabase.com and create a free account
   - Create a new project (choose a region close to you)
   - Wait for the project to be ready (takes ~2 minutes)
   - Go to Settings > API to get your project URL and anon key

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your project credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Apply migrations to your hosted project:**
   ```bash
   bunx supabase link --project-ref your-project-ref
   bunx supabase db push
   ```

4. **Add seed data:**
   - Go to your Supabase dashboard > SQL Editor
   - Copy and paste the contents of `supabase/seed.sql`
   - Run the query to populate initial data

### Option 2: Local Development (Requires Docker Desktop)

**Prerequisites:**
- Docker Desktop installed and running
- Node.js and bun installed
- Supabase CLI installed

1. **Start Supabase locally:**
   ```bash
   bunx supabase start
   ```

2. **Apply migrations:**
   ```bash
   bunx supabase db reset
   ```

3. **View the local dashboard:**
   - Studio: http://localhost:54323
   - API: http://localhost:54321
   - Database: localhost:54322

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

For local development, use:
```
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
```

### Database Schema

The database includes the following main tables:

- **profiles**: User profiles with Hunter class and progression data
- **quests**: AI-generated tasks and user quests
- **gates**: Focus session records
- **legions**: Community groups
- **legion_members**: Community membership
- **usage_logs**: API usage tracking
- **artifacts**: Cosmetic rewards and unlockables
- **hunter_artifacts**: User-owned cosmetics
- **legion_messages**: Real-time chat messages

### Migrations

Migrations are located in `migrations/` and are applied automatically:

1. `20240101000001_initial_schema.sql` - Core database schema
2. `20240101000002_rls_policies.sql` - Row Level Security policies
3. `20240101000003_auth_triggers.sql` - Authentication triggers

### Seed Data

The `seed.sql` file contains initial data:
- Default artifacts and cosmetic items
- Initial Legion communities
- Welcome messages for each Legion

### Row Level Security

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Legion members can see shared Legion content
- Public data (artifacts, legions) is readable by all authenticated users

### Real-time Features

The app uses Supabase Realtime for:
- Legion chat messages
- Gate presence (who's in focus sessions)
- Live activity feeds

### Quick Start (Without Docker)

If you don't have Docker installed, you can still set up the backend:

1. **Create a hosted Supabase project** (free tier available)
2. **Manually apply the schema:**
   - Go to your Supabase dashboard > SQL Editor
   - Copy and run each migration file in order:
     1. `migrations/20240101000001_initial_schema.sql`
     2. `migrations/20240101000002_rls_policies.sql` 
     3. `migrations/20240101000003_auth_triggers.sql`
     4. `seed.sql` (for initial data)
3. **Update your `.env` file** with the hosted project credentials
4. **Test the connection** with `bun run test:supabase`

### Useful Commands

```bash
# Reset database with fresh migrations and seed data
bunx supabase db reset

# Generate TypeScript types
bunx supabase gen types typescript --local > types/supabase.ts

# View logs
bunx supabase logs

# Stop local instance
bunx supabase stop
```