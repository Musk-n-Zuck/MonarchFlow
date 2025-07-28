import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../AuthProvider';
import AwakeningOnboarding from '../onboarding/AwakeningOnboarding';

export default function OnboardingTest() {
  const { user, profile, signOut } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    Alert.alert('Success', 'Onboarding completed successfully!');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (showOnboarding) {
    return <AwakeningOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-shadow-900 p-6">
      <Text className="text-shadow-100 text-2xl font-bold mb-6">Onboarding Test</Text>
      
      {user ? (
        <View>
          <Text className="text-shadow-300 text-lg mb-4">Authenticated User:</Text>
          <View className="bg-shadow-800 p-4 rounded-lg mb-4">
            <Text className="text-shadow-100 mb-2">Email: {user.email}</Text>
            <Text className="text-shadow-100 mb-2">ID: {user.id}</Text>
            {profile && (
              <>
                <Text className="text-shadow-100 mb-2">Hunter Name: {profile.hunter_name}</Text>
                <Text className="text-shadow-100 mb-2">Class: {profile.hunter_class}</Text>
                <Text className="text-shadow-100 mb-2">Rank: {profile.current_rank}</Text>
                <Text className="text-shadow-100">Essence: {profile.essence_points}</Text>
              </>
            )}
          </View>
          
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-600 p-4 rounded-lg mb-4"
          >
            <Text className="text-white text-center font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text className="text-shadow-300 text-lg mb-4">Not authenticated</Text>
        </View>
      )}
      
      <TouchableOpacity
        onPress={() => setShowOnboarding(true)}
        className="bg-essence-600 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          Test Onboarding Flow
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}