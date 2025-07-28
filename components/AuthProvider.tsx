import { authService } from '@/services/auth';
import { Profile } from '@/types/supabase';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AwakeningOnboarding from './onboarding/AwakeningOnboarding';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: userData, error: userError } = await authService.getCurrentUser();
        
        if (userError || !userData.user) {
          setLoading(false);
          return;
        }

        setUser(userData.user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await authService.getCurrentProfile();
        
        if (!profileError && profileData) {
          setProfile(profileData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get user profile when signed in
        const { data: profileData, error: profileError } = await authService.getCurrentProfile();
        
        if (!profileError && profileData) {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleOnboardingComplete = () => {
    // The auth state change listener will handle updating the user state
    console.log('Onboarding completed');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-shadow-900 items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  // Show onboarding if user is not authenticated
  if (!user) {
    return <AwakeningOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Show main app if user is authenticated
  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}