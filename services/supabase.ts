import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with proper typing
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const db = {
  // Profile operations
  profiles: {
    get: (id: string) => 
      supabase.from('profiles').select('*').eq('id', id).single(),
    
    create: (profile: any) => 
      supabase.from('profiles').insert(profile),
    
    update: (id: string, updates: any) => 
      supabase.from('profiles').update(updates).eq('id', id),
  },

  // Quest operations
  quests: {
    getByHunter: (hunterId: string) => 
      supabase.from('quests').select('*').eq('hunter_id', hunterId),
    
    create: (quest: any) => 
      supabase.from('quests').insert(quest),
    
    complete: (id: string) => 
      supabase.from('quests').update({ completed_at: new Date().toISOString() }).eq('id', id),
  },

  // Gate operations
  gates: {
    getByHunter: (hunterId: string) => 
      supabase.from('gates').select('*').eq('hunter_id', hunterId),
    
    create: (gate: any) => 
      supabase.from('gates').insert(gate),
    
    complete: (id: string, essenceEarned: number) => 
      supabase.from('gates').update({ 
        completed_at: new Date().toISOString(),
        essence_earned: essenceEarned 
      }).eq('id', id),
  },

  // Legion operations
  legions: {
    getAll: () => 
      supabase.from('legions').select('*'),
    
    getMembers: (legionId: string) => 
      supabase.from('legion_members')
        .select('*, profiles(hunter_name, current_rank)')
        .eq('legion_id', legionId),
    
    join: (legionId: string, hunterId: string) => 
      supabase.from('legion_members').insert({ legion_id: legionId, hunter_id: hunterId }),
    
    leave: (legionId: string, hunterId: string) => 
      supabase.from('legion_members').delete().match({ legion_id: legionId, hunter_id: hunterId }),
  },

  // Real-time subscriptions
  realtime: {
    subscribeToLegionMessages: (legionId: string, callback: (payload: any) => void) => 
      supabase
        .channel(`legion_${legionId}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'legion_messages', filter: `legion_id=eq.${legionId}` },
          callback
        )
        .subscribe(),

    subscribeToGatePresence: (gateId: string, callback: (payload: any) => void) => 
      supabase
        .channel(`gate_${gateId}`)
        .on('broadcast', { event: 'presence' }, callback)
        .subscribe(),
  },
};