#!/usr/bin/env node

/**
 * Setup script for hosted Supabase (no Docker required)
 * This script helps you set up the Solo Leveling app with a hosted Supabase instance
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Solo Leveling App - Hosted Supabase Setup');
console.log('===============================================\n');

console.log('Since Docker is not available, let\'s set up with hosted Supabase:\n');

console.log('📋 Step-by-step setup:');
console.log('');
console.log('1. 🌐 Create a Supabase project:');
console.log('   • Go to https://supabase.com');
console.log('   • Sign up/login and create a new project');
console.log('   • Choose a name like "solo-leveling-app"');
console.log('   • Wait for project to be ready (~2 minutes)');
console.log('');

console.log('2. 🔑 Get your credentials:');
console.log('   • Go to Settings > API in your Supabase dashboard');
console.log('   • Copy your Project URL and anon/public key');
console.log('');

console.log('3. ⚙️  Set up environment variables:');
console.log('   • Copy .env.example to .env');
console.log('   • Replace the values with your Supabase credentials');
console.log('');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created! Please edit it with your Supabase credentials.');
  console.log('');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists.');
  console.log('');
}

console.log('4. 🗄️  Apply database schema:');
console.log('   • Go to your Supabase dashboard > SQL Editor');
console.log('   • Copy and run each migration file in this order:');
console.log('     1. supabase/migrations/20240101000001_initial_schema.sql');
console.log('     2. supabase/migrations/20240101000002_rls_policies.sql');
console.log('     3. supabase/migrations/20240101000003_auth_triggers.sql');
console.log('     4. supabase/seed.sql (for initial data)');
console.log('');

console.log('5. 🧪 Test your setup:');
console.log('   • Run: bun run test:supabase');
console.log('   • This will verify your connection and data');
console.log('');

console.log('📚 Need help? Check supabase/README.md for detailed instructions.');
console.log('');

// Show migration file locations
console.log('📁 Migration files to run:');
const migrationDir = path.join(process.cwd(), 'supabase', 'migrations');
if (fs.existsSync(migrationDir)) {
  const files = fs.readdirSync(migrationDir).sort();
  files.forEach((file, index) => {
    console.log(`   ${index + 1}. supabase/migrations/${file}`);
  });
  
  const seedFile = path.join(process.cwd(), 'supabase', 'seed.sql');
  if (fs.existsSync(seedFile)) {
    console.log(`   ${files.length + 1}. supabase/seed.sql`);
  }
} else {
  console.log('   ❌ Migration files not found. Make sure you\'re in the project root.');
}

console.log('');
console.log('🚀 Once setup is complete, you can start building your Solo Leveling app!');
console.log('   The backend will be fully functional with authentication, quests, gates, and more.');