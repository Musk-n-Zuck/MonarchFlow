import { authService } from '@/services/auth';
import { HunterClass, ManaState } from '@/types';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClassSelector from './ClassSelector';
import ManaStatePicker from './ManaStatePicker';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome, Future Hunter",
    subtitle: "Your awakening begins now. Choose your path to power."
  },
  {
    id: 2,
    title: "Select Your Class",
    subtitle: "Each Hunter class has unique strengths. Choose wisely."
  },
  {
    id: 3,
    title: "Current Mana State",
    subtitle: "How are you feeling right now? This helps us tailor your first quests."
  },
  {
    id: 4,
    title: "Hunter Registration",
    subtitle: "Create your account to begin your journey from E-Rank to legend."
  }
];

interface AwakeningOnboardingProps {
  onComplete: () => void;
}

export default function AwakeningOnboarding({ onComplete }: AwakeningOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<HunterClass | null>(null);
  const [selectedManaState, setSelectedManaState] = useState<ManaState | null>(null);
  const [hunterName, setHunterName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);

  const getEffectiveStep = () => {
    // For sign-in mode, skip to step 4 after step 1
    if (isSignInMode && currentStep > 1) {
      return 4;
    }
    return currentStep;
  };

  const effectiveStep = getEffectiveStep();
  const currentStepData = ONBOARDING_STEPS.find(step => step.id === effectiveStep);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClassSelect = (hunterClass: HunterClass) => {
    setSelectedClass(hunterClass);
  };

  const handleManaStateSelect = (manaState: ManaState) => {
    setSelectedManaState(manaState);
  };

  const handleSignUp = async () => {
    if (!hunterName.trim() || !email.trim() || !password.trim() || !selectedClass) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authService.signUp(email.trim(), password, {
        hunter_name: hunterName.trim(),
        hunter_class: selectedClass,
      });

      if (error) {
        let errorMessage = error.message;

        // Provide user-friendly error messages
        if (errorMessage.includes('already registered')) {
          errorMessage = 'A Hunter with this email already exists. Try signing in instead.';
        } else if (errorMessage.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (errorMessage.includes('weak password')) {
          errorMessage = 'Password must be at least 6 characters long.';
        }

        Alert.alert('Awakening Failed', errorMessage);
        return;
      }

      if (data.user) {
        // Profile will be created automatically via database trigger
        // The AuthProvider will handle the state update
        onComplete();
      }
    } catch (error) {
      Alert.alert('Awakening Failed', 'An unexpected error occurred. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authService.signIn(email.trim(), password);

      if (error) {
        let errorMessage = error.message;

        // Provide user-friendly error messages
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account first.';
        }

        Alert.alert('Sign In Failed', errorMessage);
        return;
      }

      if (data.user) {
        // The AuthProvider will handle the state update
        onComplete();
      }
    } catch (error) {
      Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return selectedClass !== null;
      case 3:
        return selectedManaState !== null;
      case 4:
        if (isSignInMode) {
          return email.trim() !== '' && password.trim() !== '';
        } else {
          return hunterName.trim() !== '' && email.trim() !== '' && password.trim() !== '';
        }
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (effectiveStep) {
      case 1:
        return (
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-shadow-800 rounded-full w-32 h-32 mb-8 items-center justify-center">
              <Text className="text-4xl">⚡</Text>
            </View>
            <Text className="text-center text-shadow-400 text-lg leading-relaxed mb-8">
              The System has detected your potential. You are about to awaken as a Hunter and begin your journey from E-Rank to legendary status.
            </Text>

            {/* Toggle for returning users */}
            <View className="flex-row items-center justify-center space-x-4">
              <TouchableOpacity
                onPress={() => setIsSignInMode(false)}
                className={`px-4 py-2 rounded-lg ${!isSignInMode ? 'bg-essence-600' : 'bg-shadow-800'
                  }`}
              >
                <Text className={`font-semibold ${!isSignInMode ? 'text-white' : 'text-shadow-400'
                  }`}>
                  New Hunter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsSignInMode(true)}
                className={`px-4 py-2 rounded-lg ${isSignInMode ? 'bg-essence-600' : 'bg-shadow-800'
                  }`}
              >
                <Text className={`font-semibold ${isSignInMode ? 'text-white' : 'text-shadow-400'
                  }`}>
                  Returning Hunter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View className="flex-1 px-6">
            <ClassSelector
              selectedClass={selectedClass}
              onClassSelect={handleClassSelect}
            />
          </View>
        );

      case 3:
        return (
          <View className="flex-1 px-6">
            <ManaStatePicker
              selectedManaState={selectedManaState}
              onManaStateSelect={handleManaStateSelect}
            />
          </View>
        );

      case 4:
        return (
          <View className="flex-1 px-6">
            {/* Toggle between Sign Up and Sign In */}
            <View className="flex-row mb-6 bg-shadow-800 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => setIsSignInMode(false)}
                className={`flex-1 py-2 px-4 rounded-md ${!isSignInMode ? 'bg-essence-600' : 'bg-transparent'
                  }`}
              >
                <Text className={`text-center font-semibold ${!isSignInMode ? 'text-white' : 'text-shadow-400'
                  }`}>
                  New Hunter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsSignInMode(true)}
                className={`flex-1 py-2 px-4 rounded-md ${isSignInMode ? 'bg-essence-600' : 'bg-transparent'
                  }`}
              >
                <Text className={`text-center font-semibold ${isSignInMode ? 'text-white' : 'text-shadow-400'
                  }`}>
                  Returning Hunter
                </Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              {!isSignInMode && (
                <View>
                  <Text className="text-shadow-300 text-sm mb-2">Hunter Name</Text>
                  <TextInput
                    className="bg-shadow-800 text-shadow-100 px-4 py-3 rounded-lg text-lg"
                    placeholder="Enter your Hunter name"
                    placeholderTextColor="#6B7280"
                    value={hunterName}
                    onChangeText={setHunterName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View>
                <Text className="text-shadow-300 text-sm mb-2">Email</Text>
                <TextInput
                  className="bg-shadow-800 text-shadow-100 px-4 py-3 rounded-lg text-lg"
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-shadow-300 text-sm mb-2">Password</Text>
                <TextInput
                  className="bg-shadow-800 text-shadow-100 px-4 py-3 rounded-lg text-lg"
                  placeholder={isSignInMode ? "Enter your password" : "Create a password"}
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {!isSignInMode && selectedClass && (
                <View className="bg-shadow-800 p-4 rounded-lg mt-4">
                  <Text className="text-shadow-300 text-sm">Selected Class</Text>
                  <Text className="text-shadow-100 text-lg font-semibold">{selectedClass}</Text>
                </View>
              )}

              {isSignInMode && (
                <View className="bg-shadow-800 p-4 rounded-lg mt-4">
                  <Text className="text-shadow-400 text-sm text-center leading-relaxed">
                    Welcome back, Hunter. Your journey continues where you left off.
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-shadow-900">
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-shadow-500 text-sm">
            {isSignInMode
              ? `Step ${currentStep > 1 ? 2 : 1} of 2`
              : `Step ${currentStep} of ${ONBOARDING_STEPS.length}`
            }
          </Text>
          <View className="flex-row">
            {isSignInMode ? (
              // Simplified progress for sign-in mode
              [1, 2].map((step) => (
                <View
                  key={step}
                  className={`w-2 h-2 rounded-full m-1 ${step <= (currentStep > 1 ? 2 : 1) ? 'bg-essence-500' : 'bg-shadow-700'
                    }`}
                />
              ))
            ) : (
              // Full progress for sign-up
              ONBOARDING_STEPS.map((step) => (
                <View
                  key={step.id}
                  className={`w-2 h-2 rounded-full m-1 ${step.id <= currentStep ? 'bg-essence-500' : 'bg-shadow-700'
                    }`}
                />
              ))
            )}
          </View>
        </View>

        {currentStepData && (
          <View>
            <Text className="text-shadow-100 text-2xl font-bold mb-2">
              {isSignInMode && effectiveStep === 4 ? "Welcome Back, Hunter" : currentStepData.title}
            </Text>
            <Text className="text-shadow-400 text-base">
              {isSignInMode && effectiveStep === 4
                ? "Sign in to continue your journey to S-Rank."
                : currentStepData.subtitle
              }
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        {renderStepContent()}
      </View>

      {/* Navigation */}
      <View className="px-6 py-4 flex-row justify-between">
        {currentStep > 1 ? (
          <TouchableOpacity
            onPress={handleBack}
            className="bg-shadow-800 px-6 py-3 rounded-lg"
          >
            <Text className="text-shadow-300 font-semibold">Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {(isSignInMode ? currentStep < 2 : currentStep < ONBOARDING_STEPS.length) ? (
          <TouchableOpacity
            onPress={() => {
              if (isSignInMode && currentStep === 1) {
                setCurrentStep(4); // Skip to authentication step
              } else {
                handleNext();
              }
            }}
            disabled={!canProceedFromStep(currentStep)}
            className={`px-6 py-3 rounded-lg ${canProceedFromStep(currentStep)
              ? 'bg-essence-600'
              : 'bg-shadow-700'
              }`}
          >
            <Text className={`font-semibold ${canProceedFromStep(currentStep)
              ? 'text-white'
              : 'text-shadow-500'
              }`}>
              Continue
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={isSignInMode ? handleSignIn : handleSignUp}
            disabled={!canProceedFromStep(currentStep) || isLoading}
            className={`px-6 py-3 rounded-lg ${canProceedFromStep(currentStep) && !isLoading
              ? 'bg-essence-600'
              : 'bg-shadow-700'
              }`}
          >
            <Text className={`font-semibold ${canProceedFromStep(currentStep) && !isLoading
              ? 'text-white'
              : 'text-shadow-500'
              }`}>
              {isLoading
                ? (isSignInMode ? 'Signing In...' : 'Awakening...')
                : (isSignInMode ? 'Continue Journey' : 'Begin Journey')
              }
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}