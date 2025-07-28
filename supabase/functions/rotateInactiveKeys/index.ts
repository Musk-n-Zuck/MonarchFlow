/**
 * rotateInactiveKeys Edge Function
 * Automatically rotates API keys for hunters inactive for 30+ days
 * This function should be called via a cron job or scheduled task
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decryptApiKey, encryptApiKey } from '../_shared/encryption.ts';
import {
    createGeminiApiKey,
    deleteApiKey,
    listApiKeys,
    validateGoogleCloudConfig
} from '../_shared/google-cloud.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RotationResult {
  hunterId: string;
  hunterName: string;
  rotated: boolean;
  error?: string;
}

interface RotateInactiveKeysResponse {
  success: boolean;
  message: string;
  processedCount: number;
  rotatedCount: number;
  results: RotationResult[];
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

    // Validate authorization (this should be called by a cron job with proper auth)
    const authHeader = req.headers.get('authorization');
    const expectedToken = Deno.env.get('CRON_SECRET_TOKEN');
    
    if (!authHeader || !expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Google Cloud configuration
    const googleCloudConfig = validateGoogleCloudConfig({
      projectId: Deno.env.get('GOOGLE_CLOUD_PROJECT_ID'),
      serviceAccountEmail: Deno.env.get('GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL'),
      privateKey: Deno.env.get('GOOGLE_CLOUD_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      privateKeyId: Deno.env.get('GOOGLE_CLOUD_PRIVATE_KEY_ID'),
    });

    const encryptionKey = Deno.env.get('API_KEY_ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    // Find hunters inactive for 30+ days with API keys
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: inactiveHunters, error: queryError } = await supabase
      .from('profiles')
      .select('id, hunter_name, hunter_class, last_active, gemini_key_enc, subscription_tier')
      .not('gemini_key_enc', 'is', null)
      .lt('last_active', thirtyDaysAgo.toISOString())
      .eq('subscription_tier', 'free'); // Only rotate free tier keys

    if (queryError) {
      console.error('Query error:', queryError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to query inactive hunters' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!inactiveHunters || inactiveHunters.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No inactive hunters found for key rotation',
          processedCount: 0,
          rotatedCount: 0,
          results: []
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found ${inactiveHunters.length} inactive hunters for key rotation`);

    const results: RotationResult[] = [];
    let rotatedCount = 0;

    // Process each inactive hunter
    for (const hunter of inactiveHunters) {
      const result: RotationResult = {
        hunterId: hunter.id,
        hunterName: hunter.hunter_name,
        rotated: false,
      };

      try {
        // Decrypt the old API key to get the key name for deletion
        const oldApiKey = await decryptApiKey(hunter.gemini_key_enc, encryptionKey);
        
        // Create a new API key
        const displayName = `${hunter.hunter_name}-${hunter.hunter_class}-rotated`;
        const newApiKeyResponse = await createGeminiApiKey(
          googleCloudConfig,
          displayName,
          hunter.id
        );

        if (!newApiKeyResponse.keyString) {
          throw new Error('New API key creation failed - no key string returned');
        }

        // Encrypt the new API key
        const encryptedNewKey = await encryptApiKey(newApiKeyResponse.keyString, encryptionKey);

        // Update the database with the new encrypted key
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            gemini_key_enc: encryptedNewKey,
            gemini_usage_tokens: 0, // Reset usage counter
            updated_at: new Date().toISOString(),
          })
          .eq('id', hunter.id);

        if (updateError) {
          throw new Error(`Database update failed: ${updateError.message}`);
        }

        // Try to delete the old API key from Google Cloud
        // Note: We don't have the key name stored, so we'll need to list and match
        try {
          const existingKeys = await listApiKeys(googleCloudConfig);
          const oldKeyEntry = existingKeys.find(key => 
            key.keyString === oldApiKey || 
            key.displayName.includes(hunter.id.slice(0, 8))
          );
          
          if (oldKeyEntry) {
            await deleteApiKey(googleCloudConfig, oldKeyEntry.name);
            console.log(`Deleted old API key for hunter ${hunter.id}`);
          }
        } catch (deleteError) {
          console.warn(`Failed to delete old API key for hunter ${hunter.id}:`, deleteError);
          // Don't fail the rotation if we can't delete the old key
        }

        result.rotated = true;
        rotatedCount++;
        console.log(`Successfully rotated API key for hunter ${hunter.id}`);

      } catch (error) {
        console.error(`Failed to rotate key for hunter ${hunter.id}:`, error);
        result.error = error.message;
      }

      results.push(result);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${inactiveHunters.length} hunters, rotated ${rotatedCount} keys`,
        processedCount: inactiveHunters.length,
        rotatedCount,
        results
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('rotateInactiveKeys error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error during key rotation' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});