/**
 * API Key Management Service
 * Handles automatic API key creation and management for hunters
 */

import { supabase } from './supabase';

export interface ApiKeyStatus {
  hasKey: boolean;
  budgetCents: number;
  usageTokens: number;
  subscriptionTier: 'free' | 's_rank';
  dailyCredits: number;
}

export interface CreateKeyResult {
  success: boolean;
  message: string;
  keyCreated?: boolean;
  budgetCents?: number;
}

/**
 * Creates a managed API key for a hunter
 * This is called automatically during onboarding
 */
export async function createHunterApiKey(
  hunterId: string,
  hunterClass: string,
  hunterName?: string
): Promise<CreateKeyResult> {
  try {
    const { data, error } = await supabase.functions.invoke('createHunterKey', {
      body: {
        hunterId,
        hunterClass,
        hunterName,
      },
    });

    if (error) {
      console.error('Error creating hunter API key:', error);
      return {
        success: false,
        message: 'Failed to create API key. Please try again.',
      };
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating API key:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Gets the current API key status for a hunter
 */
export async function getApiKeyStatus(hunterId: string): Promise<ApiKeyStatus | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('gemini_key_enc, gemini_budget_cents, gemini_usage_tokens, subscription_tier, daily_quest_credits')
      .eq('id', hunterId)
      .single();

    if (error) {
      console.error('Error fetching API key status:', error);
      return null;
    }

    return {
      hasKey: !!data.gemini_key_enc,
      budgetCents: data.gemini_budget_cents || 0,
      usageTokens: data.gemini_usage_tokens || 0,
      subscriptionTier: data.subscription_tier || 'free',
      dailyCredits: data.daily_quest_credits || 5,
    };
  } catch (error) {
    console.error('Unexpected error fetching API key status:', error);
    return null;
  }
}

/**
 * Checks if a hunter has sufficient budget for an API call
 */
export async function checkApiBudget(
  hunterId: string,
  estimatedCostCents: number
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_api_budget', {
      p_hunter_id: hunterId,
      p_estimated_cost_cents: estimatedCostCents,
    });

    if (error) {
      console.error('Error checking API budget:', error);
      return false;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error checking API budget:', error);
    return false;
  }
}

/**
 * Logs API usage after a successful call
 */
export async function logApiUsage(
  hunterId: string,
  tokensUsed: number,
  costCents: number,
  serviceType: string = 'gemini'
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('log_api_usage', {
      p_hunter_id: hunterId,
      p_tokens_used: tokensUsed,
      p_cost_cents: costCents,
      p_service_type: serviceType,
    });

    if (error) {
      console.error('Error logging API usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error logging API usage:', error);
    return false;
  }
}

/**
 * Gets API usage summary for a hunter
 */
export async function getApiUsageSummary(hunterId: string) {
  try {
    const { data, error } = await supabase
      .from('api_usage_summary')
      .select('*')
      .eq('hunter_id', hunterId)
      .single();

    if (error) {
      console.error('Error fetching API usage summary:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching API usage summary:', error);
    return null;
  }
}

/**
 * Estimates the cost of an AI request based on input/output tokens
 * Google Gemini pricing: ~$0.00075 per 1K input tokens, ~$0.003 per 1K output tokens
 */
export function estimateApiCost(inputTokens: number, outputTokens: number = 0): number {
  const inputCostPer1K = 0.075; // cents per 1K input tokens
  const outputCostPer1K = 0.3;  // cents per 1K output tokens
  
  const inputCost = (inputTokens / 1000) * inputCostPer1K;
  const outputCost = (outputTokens / 1000) * outputCostPer1K;
  
  return Math.ceil(inputCost + outputCost); // Round up to nearest cent
}

/**
 * Checks if a hunter needs budget refill (for premium users)
 */
export async function checkBudgetRefillNeeded(hunterId: string): Promise<boolean> {
  const status = await getApiKeyStatus(hunterId);
  
  if (!status || status.subscriptionTier !== 's_rank') {
    return false;
  }
  
  // Refill if budget is below $50 (5000 cents)
  return status.budgetCents < 5000;
}

/**
 * Formats budget amount for display
 */
export function formatBudgetAmount(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Gets user-friendly error messages for API key issues
 */
export function getApiKeyErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'budget_exhausted': 'Your AI quest energy has been depleted. Upgrade to S-Rank Pass for unlimited quests!',
    'key_not_found': 'Your Hunter credentials need to be reforged. Please contact support.',
    'service_unavailable': 'The Shadow Realm is temporarily unreachable. Please try again in a moment.',
    'rate_limited': 'You\'re generating quests too quickly! Please wait a moment before requesting more.',
    'invalid_request': 'The quest request couldn\'t be understood. Please try again.',
  };
  
  return errorMessages[error] || 'An unexpected error occurred. The shadows are investigating...';
}

/**
 * Determines if a hunter should see upgrade prompts based on usage
 */
export async function shouldShowUpgradePrompt(hunterId: string): Promise<boolean> {
  const status = await getApiKeyStatus(hunterId);
  
  if (!status || status.subscriptionTier !== 'free') {
    return false;
  }
  
  // Show upgrade prompt if budget is low or daily credits are exhausted
  return status.budgetCents < 100 || status.dailyCredits <= 0;
}