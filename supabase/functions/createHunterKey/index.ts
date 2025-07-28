/**
 * createHunterKey Edge Function
 * Automatically generates and encrypts Google Gemini API keys for new hunters
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encryptApiKey } from '../_shared/encryption.ts';
import { createGeminiApiKey, validateGoogleCloudConfig } from '../_shared/google-cloud.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateHunterKeyRequest {
  hunterId: string;
  hunterClass: string;
  hunterName?: string;
}

interface CreateHunterKeyResponse {
  success: boolean;
  message: string;
  keyCreated?: boolean;
  budgetCents?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { hunterId, hunterClass, hunterName }: CreateHunterKeyRequest = await req.json();

    if (!hunterId || !hunterClass) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: hunterId and hunterClass' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if hunter already has an API key
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('gemini_key_enc, subscription_tier')
      .eq('id', hunterId)
      .single();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Hunter profile not found' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If hunter already has an encrypted key, return success
    if (profile.gemini_key_enc) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Hunter already has an API key',
          keyCreated: false,
          budgetCents: profile.subscription_tier === 's_rank' ? 10000 : 500 // $100 for S-Rank, $5 for free
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Google Cloud configuration from environment
    const googleCloudConfig = validateGoogleCloudConfig({
      projectId: Deno.env.get('GOOGLE_CLOUD_PROJECT_ID'),
      serviceAccountEmail: Deno.env.get('GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL'),
      privateKey: Deno.env.get('GOOGLE_CLOUD_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      privateKeyId: Deno.env.get('GOOGLE_CLOUD_PRIVATE_KEY_ID'),
    });

    // Create display name for the API key
    const displayName = hunterName 
      ? `${hunterName}-${hunterClass}` 
      : `Hunter-${hunterClass}`;

    console.log(`Creating API key for hunter ${hunterId} with class ${hunterClass}`);

    // Create the Google Gemini API key
    const apiKeyResponse = await createGeminiApiKey(
      googleCloudConfig,
      displayName,
      hunterId
    );

    if (!apiKeyResponse.keyString) {
      throw new Error('API key creation succeeded but no key string returned');
    }

    // Encrypt the API key
    const encryptionKey = Deno.env.get('API_KEY_ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    const encryptedKey = await encryptApiKey(apiKeyResponse.keyString, encryptionKey);

    // Determine initial budget based on subscription tier
    const initialBudgetCents = profile.subscription_tier === 's_rank' ? 10000 : 500; // $100 for S-Rank, $5 for free

    // Store the encrypted key in the database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        gemini_key_enc: encryptedKey,
        gemini_budget_cents: initialBudgetCents,
        gemini_usage_tokens: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', hunterId);

    if (updateError) {
      console.error('Database update error:', updateError);
      // Try to clean up the created API key
      try {
        const { deleteApiKey } = await import('../_shared/google-cloud.ts');
        await deleteApiKey(googleCloudConfig, apiKeyResponse.name);
      } catch (cleanupError) {
        console.error('Failed to cleanup API key after database error:', cleanupError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to store API key securely' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Successfully created and stored API key for hunter ${hunterId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Hunter API key created successfully',
        keyCreated: true,
        budgetCents: initialBudgetCents
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('createHunterKey error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error during key creation' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});