import type { Profile } from '../types/supabase';
import { createHunterApiKey } from './apiKeyManager';
import { auth, supabase } from './supabase';

// Authentication service for Solo Leveling App
export const authService = {
  // Sign up with Hunter profile creation
  signUp: async (email: string, password: string, hunterData: { hunter_name: string; hunter_class: string }) => {
    try {
      const { data, error } = await auth.signUp(email, password, hunterData);

      if (error) {
        return { data: null, error };
      }

      // The profile will be created automatically via database trigger
      // Wait a moment for the trigger to complete
      if (data.user && !data.user.email_confirmed_at) {
        // For development, we might have email confirmation disabled
        // The profile should be created immediately via trigger
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create managed API key for the new hunter
      if (data.user) {
        try {
          console.log('Creating API key for new hunter:', data.user.id);
          const keyResult = await createHunterApiKey(
            data.user.id,
            hunterData.hunter_class,
            hunterData.hunter_name
          );

          if (!keyResult.success) {
            console.warn('API key creation failed during signup:', keyResult.message);
            // Don't fail the signup if API key creation fails
            // The user can still use the app, and we can retry key creation later
          } else {
            console.log('API key created successfully for new hunter');
          }
        } catch (keyError) {
          console.error('Unexpected error creating API key during signup:', keyError);
          // Continue with signup even if API key creation fails
        }
      }

      return { data, error: null };
    } catch (err) {
      console.error('Signup error:', err);
      return {
        data: null,
        error: { message: 'An unexpected error occurred during signup' }
      };
    }
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

  // Ensure user has an API key (for existing users)
  ensureApiKey: async () => {
    try {
      const { data: profile, error } = await authService.getCurrentProfile();

      if (error || !profile) {
        return { success: false, message: 'Could not fetch user profile' };
      }

      // Check if user already has an API key
      if (profile.gemini_key_enc) {
        return { success: true, message: 'User already has an API key' };
      }

      // Create API key for existing user
      const keyResult = await createHunterApiKey(
        profile.id,
        profile.hunter_class,
        profile.hunter_name
      );

      return keyResult;
    } catch (error) {
      console.error('Error ensuring API key:', error);
      return { success: false, message: 'Failed to ensure API key' };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return auth.onAuthStateChange(callback);
  },
};