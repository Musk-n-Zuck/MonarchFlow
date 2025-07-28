import { useAuth } from '@/components/AuthProvider';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuildHallScreen() {
  const { profile, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-shadow-900">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="py-6 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-shadow-900 dark:text-shadow-100">
              Guild Hall
            </Text>
            <Text className="text-lg text-shadow-600 dark:text-shadow-400 mt-1">
              Welcome back, {profile?.hunter_name || 'Hunter'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={signOut}
            className="bg-shadow-200 dark:bg-shadow-700 px-4 py-2 rounded-lg"
          >
            <Text className="text-shadow-700 dark:text-shadow-300 font-medium">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hunter Greeting */}
        <View className="bg-shadow-50 dark:bg-shadow-800 rounded-xl p-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-shadow-900 dark:text-shadow-100 mb-1">
                {profile?.current_rank || 'E-Rank'} Hunter
              </Text>
              <Text className="text-essence-600 dark:text-essence-400 font-semibold">
                {profile?.hunter_class || 'Scholar'} Class
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-shadow-500 dark:text-shadow-400">
                Essence Points
              </Text>
              <Text className="text-2xl font-bold text-essence-600 dark:text-essence-400">
                {profile?.essence_points || 0}
              </Text>
            </View>
          </View>
          
          <Text className="text-shadow-600 dark:text-shadow-400">
            Your awakening is complete. Begin your journey by accepting quests and entering Gates to earn Essence and climb the ranks.
          </Text>
          
          <View className="flex-row mt-4 space-x-4">
            <View className="flex-1 bg-mana-50 dark:bg-mana-900/20 rounded-lg p-3">
              <Text className="text-xs text-mana-600 dark:text-mana-400 font-medium">
                Daily Quests
              </Text>
              <Text className="text-lg font-bold text-mana-700 dark:text-mana-300">
                {profile?.daily_quest_credits || 5}/5
              </Text>
            </View>
            <View className="flex-1 bg-gate-50 dark:bg-gate-900/20 rounded-lg p-3">
              <Text className="text-xs text-gate-600 dark:text-gate-400 font-medium">
                Streak
              </Text>
              <Text className="text-lg font-bold text-gate-700 dark:text-gate-300">
                {profile?.streak_count || 0} days
              </Text>
            </View>
          </View>
        </View>

        {/* Rune Board Placeholder */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-shadow-900 dark:text-shadow-100 mb-4">
            Rune Board
          </Text>
          <View className="bg-essence-50 dark:bg-essence-900/20 rounded-xl p-6">
            <Text className="text-essence-800 dark:text-essence-200">
              AI-generated quests will appear here
            </Text>
          </View>
        </View>

        {/* Gate Portal Placeholder */}
        <View className="mb-6">
          <View className="bg-gate-50 dark:bg-gate-900/20 rounded-xl p-6 items-center">
            <Text className="text-2xl font-bold text-gate-800 dark:text-gate-200 mb-2">
              Enter Gate
            </Text>
            <Text className="text-gate-600 dark:text-gate-400 text-center">
              Begin your focus session and earn Essence
            </Text>
          </View>
        </View>

        {/* Essence Pulse Placeholder */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-shadow-900 dark:text-shadow-100 mb-4">
            Essence Pulse
          </Text>
          <View className="bg-mana-50 dark:bg-mana-900/20 rounded-xl p-6">
            <Text className="text-mana-800 dark:text-mana-200">
              Real-time activity feed will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}