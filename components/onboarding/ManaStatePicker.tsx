import { ManaState } from '@/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ManaStateOption {
  state: ManaState;
  title: string;
  description: string;
  icon: string;
  color: string;
  questTypes: string[];
}

const MANA_STATE_OPTIONS: ManaStateOption[] = [
  {
    state: 'Drained',
    title: 'Drained',
    description: 'Low energy, need gentle restoration',
    icon: '🌙',
    color: 'bg-blue-600',
    questTypes: ['Light tasks', 'Organization', 'Planning']
  },
  {
    state: 'Focused',
    title: 'Focused',
    description: 'Clear mind, ready for deep work',
    icon: '⚡',
    color: 'bg-green-600',
    questTypes: ['Deep work', 'Learning', 'Creating']
  },
  {
    state: 'Overloaded',
    title: 'Overloaded',
    description: 'High energy, need to channel intensity',
    icon: '🔥',
    color: 'bg-red-600',
    questTypes: ['Physical tasks', 'Clearing', 'Movement']
  }
];

interface ManaStatePickerProps {
  selectedManaState: ManaState | null;
  onManaStateSelect: (manaState: ManaState) => void;
}

export default function ManaStatePicker({ selectedManaState, onManaStateSelect }: ManaStatePickerProps) {
  return (
    <View className="flex-1">
      <Text className="text-shadow-300 text-center text-base mb-8 leading-relaxed">
        Your current mana state helps us generate quests that match your energy level. This creates a more harmonious and effective productivity experience.
      </Text>
      
      <View className="space-y-4">
        {MANA_STATE_OPTIONS.map((option) => {
          const isSelected = selectedManaState === option.state;
          
          return (
            <TouchableOpacity
              key={option.state}
              onPress={() => onManaStateSelect(option.state)}
              className={`p-5 rounded-xl border-2 ${
                isSelected 
                  ? 'border-essence-500 bg-essence-500/10' 
                  : 'border-shadow-700 bg-shadow-800'
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-14 h-14 rounded-full ${option.color} items-center justify-center mr-4`}>
                  <Text className="text-3xl">{option.icon}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className={`text-xl font-bold mb-2 ${
                    isSelected ? 'text-essence-400' : 'text-shadow-100'
                  }`}>
                    {option.title}
                  </Text>
                  
                  <Text className="text-shadow-400 text-sm mb-3 leading-relaxed">
                    {option.description}
                  </Text>
                  
                  <Text className={`text-xs font-medium mb-2 ${
                    isSelected ? 'text-essence-300' : 'text-shadow-300'
                  }`}>
                    Quest types you'll receive:
                  </Text>
                  
                  <View className="flex-row flex-wrap">
                    {option.questTypes.map((type) => (
                      <View
                        key={type}
                        className={`px-2 py-1 rounded-md mr-2 mb-1 ${
                          isSelected 
                            ? 'bg-essence-600/20 border border-essence-600/30' 
                            : 'bg-shadow-700 border border-shadow-600'
                        }`}
                      >
                        <Text className={`text-xs ${
                          isSelected ? 'text-essence-300' : 'text-shadow-300'
                        }`}>
                          {type}
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
          🔮 You can change your mana state anytime in the Guild Hall to get different types of quests that match your current energy.
        </Text>
      </View>
    </View>
  );
}