import React from 'react';
import { Text, View } from 'react-native';

// Test component to verify NativeWind is working with Solo Leveling theme
export function TestNativeWind() {
  return (
    <View className="p-6 bg-shadow-800 dark:bg-shadow-200 rounded-xl mb-4">
      <Text className="text-shadow-100 dark:text-shadow-900 font-bold text-lg mb-2">
        NativeWind Solo Leveling Test
      </Text>
      <View className="bg-essence-500 p-3 rounded-lg mb-2">
        <Text className="text-white font-semibold">
          Essence Theme - Golden Power
        </Text>
      </View>
      <View className="bg-mana-500 p-3 rounded-lg mb-2">
        <Text className="text-white font-semibold">
          Mana Theme - Blue Energy
        </Text>
      </View>
      <View className="bg-gate-500 p-3 rounded-lg">
        <Text className="text-white font-semibold">
          Gate Theme - Portal Blue
        </Text>
      </View>
    </View>
  );
}

// Fallback component with regular styles
export function TestRegularStyles() {
  return (
    <View style={{ padding: 16, backgroundColor: '#3b82f6', borderRadius: 8 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        Regular Styles Test - This should have blue background and white text
      </Text>
    </View>
  );
}