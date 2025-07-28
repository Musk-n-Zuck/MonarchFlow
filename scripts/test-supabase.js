#!/usr/bin/env node

/**
 * Test script to verify Supabase connection and basic functionality
 * Run with: node scripts/test-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not set!');
  console.log('');
  console.log('Please set up your Supabase credentials:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Update .env with your Supabase project URL and anon key');
  console.log('3. Get credentials from: https://supabase.com > Your Project > Settings > API');
  console.log('');
  console.log('Or run: bun run setup:supabase for detailed setup instructions');
  process.exit(1);
}

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  console.log(`📡 URL: ${supabaseUrl}`);
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('');
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        console.log('💡 This looks like a connection issue. Make sure:');
        console.log('   • Your Supabase project URL is correct in .env');
        console.log('   • You have internet connection');
        console.log('   • Your Supabase project is running (not paused)');
      } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('💡 Database schema not set up. Please:');
        console.log('   • Go to your Supabase dashboard > SQL Editor');
        console.log('   • Run the migration files in order (see supabase/README.md)');
      }
      console.log('');
      console.log('📚 For setup help, run: bun run setup:supabase');
      return;
    }
    console.log('✅ Connection successful');
    
    // Test 2: Check if tables exist
    console.log('\n2️⃣ Checking database tables...');
    const tables = ['profiles', 'quests', 'gates', 'legions', 'artifacts'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Table '${table}' not accessible:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}' error:`, err.message);
      }
    }
    
    // Test 3: Check artifacts seed data
    console.log('\n3️⃣ Checking seed data...');
    const { data: artifacts, error: artifactsError } = await supabase
      .from('artifacts')
      .select('name, type, rarity')
      .limit(5);
      
    if (artifactsError) {
      console.log('❌ Seed data check failed:', artifactsError.message);
    } else {
      console.log(`✅ Found ${artifacts.length} artifacts in database`);
      artifacts.forEach(artifact => {
        console.log(`   - ${artifact.name} (${artifact.type}, ${artifact.rarity})`);
      });
    }
    
    // Test 4: Check legions seed data
    const { data: legions, error: legionsError } = await supabase
      .from('legions')
      .select('name, is_premium')
      .limit(3);
      
    if (legionsError) {
      console.log('❌ Legions check failed:', legionsError.message);
    } else {
      console.log(`✅ Found ${legions.length} legions in database`);
      legions.forEach(legion => {
        console.log(`   - ${legion.name} ${legion.is_premium ? '(Premium)' : '(Free)'}`);
      });
    }
    
    console.log('\n🎉 Supabase backend is ready for Solo Leveling App!');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Run the test
testSupabaseConnection().catch(console.error);