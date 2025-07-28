import type { Profile } from '../types/supabase';
import { auth, supabase } from './supabase';

// Authentication service for Solo Leveling App
export const authService = {
  // Sign up with Hunter profile creation
  signUp: async (email: string, password: string, hunterData: { hunter_name: string; hunter_class: string }) => {
    const { data, error } = await auth.signUp(email, password, hunterData);
    return { data, error };
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    const { data, error } = await auth.signIn(email, password);
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await auth.getCurrentUser();
    return { data, error };
  },

  // Get current user's profile
  getCurrentProfile: async (): Promise<{ data: Profile | null; error: any }> => {
    const { data: user, error: userError } = await auth.getCurrentUser();
    
    if (userError || !user.user) {
      return { data: null, error: userError };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();

    return { data: profile, error: profileError };
  },

  // Update profile
  updateProfile: async (updates: Partial<Profile>) => {
    const { data: user, error: userError } = await auth.getCurrentUser();
    
    if (userError || !user.user) {
      return { data: null, error: userError };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.user.id)
      .select()
      .single();

    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return auth.onAuthStateChange(callback);
  },
};