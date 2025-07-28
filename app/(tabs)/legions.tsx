import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-shadow-900">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-shadow-900 dark:text-shadow-100">
            Legions
          </Text>
          <Text className="text-lg text-shadow-600 dark:text-shadow-400 mt-1">
            Join the community of Hunters
          </Text>
        </View>

        {/* Legion List Placeholder */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-shadow-900 dark:text-shadow-100 mb-4">
            Available Legions
          </Text>
          <View className="bg-shadow-50 dark:bg-shadow-800 rounded-xl p-6">
            <Text className="text-shadow-600 dark:text-shadow-400">
              Legion channels will appear here
            </Text>
          </View>
        </View>

        {/* Legion Chat Placeholder */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-shadow-900 dark:text-shadow-100 mb-4">
            Legion Chat
          </Text>
          <View className="bg-mana-50 dark:bg-mana-900/20 rounded-xl p-6">
            <Text className="text-mana-800 dark:text-mana-200">
              Real-time chat will appear here
            </Text>
          </View>
        </View>

        {/* Legion Leaderboard Placeholder */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-shadow-900 dark:text-shadow-100 mb-4">
            Leaderboard
          </Text>
          <View className="bg-essence-50 dark:bg-essence-900/20 rounded-xl p-6">
            <Text className="text-essence-800 dark:text-essence-200">
              Legion rankings will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}