import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuildHallScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-shadow-900">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-shadow-900 dark:text-shadow-100">
            Guild Hall
          </Text>
          <Text className="text-lg text-shadow-600 dark:text-shadow-400 mt-1">
            Welcome back, Hunter
          </Text>
        </View>

        {/* Hunter Greeting Placeholder */}
        <View className="bg-shadow-50 dark:bg-shadow-800 rounded-xl p-6 mb-6">
          <Text className="text-xl font-semibold text-shadow-900 dark:text-shadow-100 mb-2">
            E-Rank Hunter
          </Text>
          <Text className="text-shadow-600 dark:text-shadow-400">
            Your journey begins here. Complete quests and enter Gates to level up.
          </Text>
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