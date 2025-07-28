import { useAuth } from '@/components/AuthProvider';
import { authService } from '@/services/auth';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function AuthTest() {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const testSignUp = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authService.signUp(
        'test@example.com',
        'testpassword123',
        {
          hunter_name: 'Test Hunter',
          hunter_class: 'Scholar'
        }
      );
      
      if (error) {
        Alert.alert('Test Failed', error.message);
      } else {
        Alert.alert('Test Success', 'User created successfully');
      }
    } catch (error) {
      Alert.alert('Test Error', 'Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authService.signIn(
        'test@example.com',
        'testpassword123'
      );
      
      if (error) {
        Alert.alert('Test Failed', error.message);
      } else {
        Alert.alert('Test Success', 'User signed in successfully');
      }
    } catch (error) {
      Alert.alert('Test Error', 'Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-shadow-900 p-6 justify-center">
      <Text className="text-shadow-100 text-xl font-bold mb-4">Auth Test</Text>
      
      <View className="mb-4">
        <Text className="text-shadow-300 mb-2">Current User:</Text>
        <Text className="text-shadow-100">{user ? user.email : 'Not signed in'}</Text>
      </View>
      
      <View className="mb-6">
        <Text className="text-shadow-300 mb-2">Profile:</Text>
        <Text className="text-shadow-100">
          {profile ? `${profile.hunter_name} (${profile.hunter_class})` : 'No profile'}
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={testSignUp}
        disabled={isLoading}
        className="bg-essence-600 p-4 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-semibold">
          {isLoading ? 'Testing...' : 'Test Sign Up'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={testSignIn}
        disabled={isLoading}
        className="bg-mana-600 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          {isLoading ? 'Testing...' : 'Test Sign In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}