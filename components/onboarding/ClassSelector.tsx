import { HunterClass } from '@/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ClassOption {
  class: HunterClass;
  title: string;
  description: string;
  icon: string;
  color: string;
  traits: string[];
}

const CLASS_OPTIONS: ClassOption[] = [
  {
    class: 'Scholar',
    title: 'Scholar',
    description: 'Masters of knowledge and strategic thinking',
    icon: '📚',
    color: 'bg-blue-600',
    traits: ['Research', 'Analysis', 'Learning']
  },
  {
    class: 'Mercenary',
    title: 'Mercenary',
    description: 'Adaptable fighters who excel at any challenge',
    icon: '⚔️',
    color: 'bg-red-600',
    traits: ['Versatile', 'Determined', 'Resilient']
  },
  {
    class: 'Ranger',
    title: 'Ranger',
    description: 'Swift and precise, masters of efficiency',
    icon: '🏹',
    color: 'bg-green-600',
    traits: ['Speed', 'Precision', 'Focus']
  },
  {
    class: 'Shadow Adept',
    title: 'Shadow Adept',
    description: 'Mysterious wielders of hidden potential',
    icon: '🌙',
    color: 'bg-purple-600',
    traits: ['Intuition', 'Creativity', 'Mystery']
  }
];

interface ClassSelectorProps {
  selectedClass: HunterClass | null;
  onClassSelect: (hunterClass: HunterClass) => void;
}

export default function ClassSelector({ selectedClass, onClassSelect }: ClassSelectorProps) {
  return (
    <View className="flex-1">
      <Text className="text-shadow-300 text-center text-base mb-8 leading-relaxed">
        Each Hunter class has unique strengths that will influence your quest types and progression style. Choose the path that resonates with your inner Hunter.
      </Text>
      
      <View className="space-y-4">
        {CLASS_OPTIONS.map((option) => {
          const isSelected = selectedClass === option.class;
          
          return (
            <TouchableOpacity
              key={option.class}
              onPress={() => onClassSelect(option.class)}
              className={`p-4 rounded-xl border-2 ${
                isSelected 
                  ? 'border-essence-500 bg-essence-500/10' 
                  : 'border-shadow-700 bg-shadow-800'
              }`}
            >
              <View className="flex-row items-start">
                <View className={`w-12 h-12 rounded-lg ${option.color} items-center justify-center mr-4`}>
                  <Text className="text-2xl">{option.icon}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className={`text-lg font-bold mb-1 ${
                    isSelected ? 'text-essence-400' : 'text-shadow-100'
                  }`}>
                    {option.title}
                  </Text>
                  
                  <Text className="text-shadow-400 text-sm mb-3 leading-relaxed">
                    {option.description}
                  </Text>
                  
                  <View className="flex-row flex-wrap">
                    {option.traits.map((trait, index) => (
                      <View
                        key={trait}
                        className={`px-2 py-1 rounded-md mr-2 mb-1 ${
                          isSelected 
                            ? 'bg-essence-600/20 border border-essence-600/30' 
                            : 'bg-shadow-700 border border-shadow-600'
                        }`}
                      >
                        <Text className={`text-xs font-medium ${
                          isSelected ? 'text-essence-300' : 'text-shadow-300'
                        }`}>
                          {trait}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-essence-500 items-center justify-center ml-2">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <View className="mt-8 p-4 bg-shadow-800 rounded-lg border border-shadow-700">
        <Text className="text-shadow-400 text-sm text-center leading-relaxed">
          💡 Don't worry - your class influences your experience but doesn't limit your potential. All Hunters can reach S-Rank through dedication.
        </Text>
      </View>
    </View>
  );
}